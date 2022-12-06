import axios from "axios"

/**
 * 往地图上添加单个图片
 * 包含loadImage和addImage
 * https://docs.mapbox.com/mapbox-gl-js/api/map/#map#loadimage
 * https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addimage
 *
 * @param {Map} map https://docs.mapbox.com/mapbox-gl-js/api/map/
 * @param {String} imageId 图片id
 * @param {String} imagePath 图片路径
 * @param {Object} options map.addImage的options
 * @returns {Promise}
 */
export const addImage = async (map, imageId, imagePath, options) => {
  return new Promise((resolve, reject) => {
    if (!map.hasImage(imageId)) {
      map.loadImage(imagePath, (error, image) => {
        if (error) console.error(error)
        const ret = map.addImage(imageId, image, options || {})
        resolve(ret)
      })
    } else {
      resolve(`已经存在${imageId}`)
    }
  })
}

/**
 * 往地图上添加一组图片 上面 addImage 的组合版
 *
 * @param {Map} map https://docs.mapbox.com/mapbox-gl-js/api/map/
 * @param {Object} imageMapping 格式为：{ imageId: "image/path/name.png" } 或者 { imageId: { url: "image/path/name.png", options: { ... } } }
 * @returns {Promise}
 */
export const addImages = async (map, imageMapping) => {
  const promiseArr = Object.keys(imageMapping).map(key => {
    const item = imageMapping[key]
    const url = item.url || item
    return addImage(map, key, url, item.options || {})
  })
  return Promise.add(promiseArr)
}

/**
 * 添加svg
 *
 * @param {Map} map https://docs.mapbox.com/mapbox-gl-js/api/map/
 * @param {object} options
 * @param {string} options.id 图片id
 * @param {string} options.src 图片路径
 * @param {number} options.width 图片宽度
 * @param {number} options.height 图片高度
*/
export const addSvgImage = (map, {id, src, width, height}) => {
  const image = new Image()
  image.onload = async () => {
    const imageBitmap = await createImageBitmap(image, {
      resizeWidth: width,
      resizeHeight: height
    })
    if (map.hasImage(id)) {
      map.updateImage(id, imageBitmap)
    } else {
      map.addImage(id, imageBitmap)
    }
  }
  image.src = src
}

export const getCoordinateByIdTGISServer = async (serverUrl, id = "") => {
  const { data } = await axios.get(`${serverUrl}?input_id=${id.replace(/\+/g, "%2B")}`)
  return { lng: data.lon, lat: data.lat }
}

export const getIdByCoordinateTGISServer = async (serverUrl, coordinate = {}) => {
  const { data } = await axios.get(`${serverUrl}?lon=${coordinate.lng}&lat=${coordinate.lat}`)
  return data
}
