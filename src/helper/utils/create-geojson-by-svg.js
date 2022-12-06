import axios from 'axios'
import * as turf from '@turf/turf'
import { transform } from 'pathologist'
import { translateFeature } from '@/helpers/utils/index'

function range(length) {
  return Array.from({ length }).map((v, k) => k)
}

function pathToCoords(path, scale, numPoints, translateX, translateY) {
  const length = path.getTotalLength()
  const getRange = range(numPoints)

  return {
    path,
    coords: getRange.map(function (i) {
      const point = path.getPointAtLength(length * i / numPoints)
      return [point.x * scale + translateX, point.y * scale + translateY]
    })
  }
}

function pathologize(svg) {
  const expression = /<(text|style|metadata|pattern)[\s\S]*?<\/(text|style|metadata|pattern)>/g
  const clean = svg.replace(expression, '')
  const transformed = transform(clean)
  if (transformed) {
    return transformed
  }
}

function calculateCoords(svg, lngLat) {
  const [x, y] = lngLat

  // Attempt a couple methods to get width/height values on the SVG element
  // to return reasonable x/y coordinates on the map.
  let { width, height } = svg.getBBox()

  if (width === 0 && svg.getAttribute('width')) {
    width = parseInt(svg.getAttribute('width'), 10)
  }

  if (height === 0 && svg.getAttribute('height')) {
    height = parseInt(svg.getAttribute('height'), 10)
  }

  return {
    x: x - (width / 2),
    y: y - (height / 2)
  }
}

function buildFeature(map, data) {
  const { path, coords } = data

  const feature = {
    type: 'Feature',
    properties: {},
    geometry: {}
  }

  if (path.id) {
    feature.properties.id = path.id
  }

  if (path.getAttribute('fill')) {
    feature.properties.fill = path.getAttribute('fill')
  }

  // If the first and last coords match it should be drawn as a polygon
  if (coords[0][0] === coords[coords.length - 1][0] &&
    coords[0][1] === coords[coords.length - 1][1]) {
    feature.geometry = {
      type: 'Polygon',
      coordinates: [
        coords.map(d => {
          const c = map.unproject(d)
          return [c.lng, c.lat]
        })
      ]
    }
  }
  else {
    const getSum = (total, num) => {
      return total + num
    }
    try {
      // try to see if it should be a multipolygon
      const distances = []
      const splits = []
      coords.forEach((c, idx) => {
        if (idx > 0) {
          const from = turf.point([map.unproject(coords[idx - 1]).lng, map.unproject(coords[idx - 1]).lat])
          const to = turf.point([map.unproject(c).lng, map.unproject(c).lat])
          const options = { units: 'miles' }

          const distance = turf.distance(from, to, options)
          // get distances between points
          distances.push(distance)
        }
      })

      const distAvg = distances.reduce(getSum) / distances.length
      coords.forEach((c, idx) => {
        if (idx > 0) {
          const from = turf.point([map.unproject(coords[idx - 1]).lng, map.unproject(coords[idx - 1]).lat])
          const to = turf.point([map.unproject(c).lng, map.unproject(c).lat])
          const options = { units: 'miles' }
          const distance = turf.distance(from, to, options)
          // if the following coordinate is ~2.5 farther away than average, it is most likely a new polygon
          if (distance > distAvg * 2.5) {
            splits.push(idx)
          }
        }
      })

      splits.push(coords.length)

      const newShapeArray = []
      splits.forEach((s, idx) => {
        const shape = []
        if (idx === 0) {
          for (let i = 0; i < s; i++) {
            shape.push([map.unproject(coords[i]).lng, map.unproject(coords[i]).lat])
          }
        }
        else {
          for (let i = splits[idx - 1]; i < s; i++) {
            shape.push([map.unproject(coords[i]).lng, map.unproject(coords[i]).lat])
          }
        }
        newShapeArray.push([shape])
      })

      newShapeArray.forEach(shape => {
        shape[0].push(shape[0][0].slice())
      })

      feature.geometry = {
        type: 'MultiPolygon',
        coordinates: newShapeArray
      }
    }
    catch (err) {
      feature.geometry = {
        type: 'LineString',
        coordinates: coords.map(d => {
          const c = map.unproject(d)
          return [c.lng, c.lat]
        })
      }
    }
  }

  return feature
}

function createGeojsonBySvgString(map, svgString, lngLat, width, pointNumber) {
  svgString = pathologize(svgString)

  const empty = document.createElement('div')
  empty.innerHTML = svgString

  const coordinates = calculateCoords(empty.querySelector('svg'), lngLat)
  const paths = empty.querySelectorAll('path')

  const arr = Array
    .from(paths)
    .map(path => pathToCoords(
      path,
      1,
      pointNumber,
      coordinates.x,
      coordinates.y,
    ))

  const geojsonCollection = []

  arr.forEach((data) => {
    const geojson = buildFeature(map, data)
    const properties = geojson.properties

    for (const item of geojson.geometry.coordinates) {
      const polygonCoordinates = []
      for (const coordinates of item) {
        if (coordinates.length < 3) {
          break
        }
        polygonCoordinates.push(coordinates)
      }
      const geojson = turf.polygon(polygonCoordinates)
      geojson.properties = properties
      geojsonCollection.push(geojson)
    }
  })

  const multiPolygonCoordinates = geojsonCollection.map((item) => {
    return item.geometry.coordinates
  })

  let multiPolygon = turf.multiPolygon(multiPolygonCoordinates)
  let bbox = turf.bbox(multiPolygon)
  let bboxGeojson = turf.bboxPolygon(bbox)
  const rate = map.transform.scale / 1000000000
  multiPolygon = turf.transformScale(multiPolygon, width * rate)
  bbox = turf.bbox(multiPolygon)
  bboxGeojson = turf.bboxPolygon(bbox)

  for (let i = 0; i < geojsonCollection.length; i++) {
    const geojson = geojsonCollection[i]
    geojson.geometry.coordinates = multiPolygon.geometry.coordinates[i]
  }

  const centroid = turf.centroid(bboxGeojson).geometry.coordinates

  const deltaX = lngLat[0] - centroid[0]
  const deltaY = lngLat[1] - centroid[1]

  for (let i = 0; i < geojsonCollection.length; i++) {
    const geojson = geojsonCollection[i]
    translateFeature(geojson, deltaX, deltaY)
  }

  return geojsonCollection
}

export async function createGeojsonBySvgSrc(map, src, lngLat, width, pointNumber = 300) {
  const res = await axios.get(src)
  const svgString = res.data.replace(/.*?(<svg.*<\/svg>).*/g, '$1')
  return createGeojsonBySvgString(map, svgString, lngLat, width, pointNumber)
}
