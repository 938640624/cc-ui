import * as turf from '@turf/turf'
import circle from '@turf/circle'

/**
 * 获取旋转坐标系后点坐标
 * @param {Number} x 原始 x
 * @param {Number} y 原始 y
 * @param {Number} degree 旋转角度
 * @returns {Array} [x, y] 目标坐标
 */
export function getXYAfterRotation(x, y, degree) {
    const radian = transformDegreeToRadian(degree)
    const { sin, cos } = Math
    const x2 = x * cos(radian) + y * sin(radian)
    const y2 = -x * sin(radian) + y * cos(radian)
    const ret = [+x2.toFixed(2), +y2.toFixed(2)]
    return ret
}

export function getRandomInt(minNum, maxNum, decimalNum) {
    // return Math.random() * (max - min + 1) + min | 0
    let max = 0
    let min = 0
    if (minNum <= maxNum) {
        min = minNum
        max = maxNum
    } else {
        min = maxNum
        max = minNum
    }
    switch (arguments.length) {
        case 1:
            return Math.floor(Math.random() * (max + 1))
        case 2:
            return Math.floor(Math.random() * (max - min + 1) + min)
        case 3:
            return (Math.random() * (max - min) + min).toFixed(decimalNum) * 1
        default:
            return Math.random()
    }
}

// 格式化rotate(取值范围0~360)
export function normalizeRotate(rotate) {
    rotate = rotate % 360
    return rotate >= 0 ? rotate : 360 + rotate
}

// 角度转弧度
export function transformDegreeToRadian(degree) {
    degree = degree % 360
    return (degree * Math.PI) / 180
}

// 弧度转角度
export function transformRadianToDegree(radian) {
    radian = radian % (2 * Math.PI)
    return (radian * 180) / Math.PI
}

// bearing是矢量和纬度正方向的夹角,在-180和180之间取值
export function transformBearingToRotate(bearing) {
    return bearing >= 0 ? bearing : 360 - Math.abs(bearing)
}

// 角度(0~360)转bearing(180~-180)
export function transformRotateToBearing(rotate) {
    rotate = normalizeRotate(rotate)
    return rotate <= 180 ? rotate : rotate - 360
}

/**
 * 获取矩形的4个顶点坐标
 * @param {Array} center 矩形的中心点坐标 [longitude, latitude]
 * @param {Number} width 矩形的宽(km)
 * @param {Number} height 矩形的高(km)
 * @returns {Array}
 */
export function getRectCoordinates(center, width, height) {
    const angle = (Math.atan(width / height) * 180) / Math.PI
    const diagonalDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))

    const leftTopPoint = turf.destination(center, diagonalDistance, 360 - angle)
    const rightTopPoint = turf.destination(center, diagonalDistance, angle)
    const rightBottomPoint = turf.destination(center, diagonalDistance, 180 - angle)
    const leftBottomPoint = turf.destination(center, diagonalDistance, 180 + angle)

    return [
        turf.getCoords(leftTopPoint),
        turf.getCoords(rightTopPoint),
        turf.getCoords(rightBottomPoint),
        turf.getCoords(leftBottomPoint),
        turf.getCoords(leftTopPoint).slice(),
    ]
}

/**
 * 生成矩形的geojson
 * @param {Array} center 矩形的中心点坐标 [longitude, latitude]
 * @param {Number} width 矩形的宽(km)
 * @param {Number} height 矩形的高(km)
 * @param {Number} bearing 矩形和y轴的夹角
 * @returns {Object}
 */
export function createRectGeojson(center, width, height, bearing = 0) {
    const rectCoordinates = getRectCoordinates(center, width, height)
    const coordinates = [rectCoordinates]
    const polygon = turf.polygon(coordinates)
    return turf.transformRotate(polygon, bearing, {
        pivot: center,
    })
}

function strip(num) {
    return parseFloat(num.toPrecision(15))
}

// 数字精度
export function toFixed(value, place = 2) {
    const num = Number(value) || 0
    const rate = Math.pow(10, place)
    return Math.round(strip(num * rate)) / rate
}

// value在min和max中校准,如果小于min则等于min,如果大于max则等于max
export function reviseRange(value, min, max) {
    if (value < min) {
        value = min
    } else if (value > max) {
        value = max
    }
    return value
}

// 递归一个多维数值数组,让数值保留8位小数
export function fixedCoordinates(value, precision) {
    let ret
    if (!(value instanceof Array)) {
        ret = toFixed(value, precision)
        return ret
    } else {
        ret = []
    }
    Object.keys(value).forEach((key) => {
        const copy = value[key]
        ret[key] = fixedCoordinates(copy, precision)
    })
    return ret
}

// 角度转弧度
export function convertDegreeToRadian(degree) {
    degree = degree % 360
    return (degree * Math.PI) / 180
}

// 弧度转角度
export function convertRadianToDegree(radian) {
    radian = radian % (2 * Math.PI)
    return (radian * 180) / Math.PI
}

// bearing是矢量和纬度正方向的夹角,在-180和180之间取值,这里转成0-360
export function convertBearingToRotate(bearing) {
    return bearing >= 0 ? bearing : 360 - Math.abs(bearing)
}

// 角度(0~360)转bearing(180~-180)
export function convertRotateToBearing(rotate) {
    rotate = normalizeRotate(rotate)
    return rotate <= 180 ? rotate : rotate - 360
}

// 计算两个地理点的距离(m)
export function getDistanceFromLngLat(point1, point2) {
    const { asin, sin, cos, sqrt } = Math
    const [lng1, lat1] = point1
    const [lng2, lat2] = point2
    const radLng1 = convertDegreeToRadian(lng1)
    const radLat1 = convertDegreeToRadian(lat1)
    const radLng2 = convertDegreeToRadian(lng2)
    const radLat2 = convertDegreeToRadian(lat2)

    const a = radLat1 - radLat2
    const b = radLng1 - radLng2

    return (
        2 *
        asin(sqrt(sin(a / 2) * sin(a / 2) + cos(radLat1) * cos(radLat2) * sin(b / 2) * sin(b / 2))) *
        6378.137 *
        1000
    )
}

export function getCircleCenter(point1, point2, point3) {
    const [x1, y1] = point1
    const [x2, y2] = point2
    const [x3, y3] = point3

    const e = 2 * (x2 - x1)
    const f = 2 * (y2 - y1)
    const g = x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1
    const a = 2 * (x3 - x2)
    const b = 2 * (y3 - y2)
    const c = x3 * x3 - x2 * x2 + y3 * y3 - y2 * y2

    const x = (g * b - c * f) / (e * b - a * f)
    const y = (a * g - c * e) / (a * f - b * e)

    return [x, y]
}

// center是坐标,raidus是半径(km)
export function createCircleCoordinates(center, radius) {
    const circleFeature = circle(center, radius)
    return circleFeature.geometry.coordinates
}

/**
 * 返回矩形的4个点的坐标
 * @param center: 矩形的中心点坐标
 * @param width: 矩形的宽(km)
 * @param height: 矩形的高(km)
 */
export function createRectCoordinates(center, width, height) {
    const angle = (Math.atan(width / height) * 180) / Math.PI
    const diagonalDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))

    const leftTopPoint = turf.destination(center, diagonalDistance, 360 - angle)
    const rightTopPoint = turf.destination(center, diagonalDistance, angle)
    const rightBottomPoint = turf.destination(center, diagonalDistance, 180 - angle)
    const leftBottomPoint = turf.destination(center, diagonalDistance, 180 + angle)

    return [
        turf.getCoords(leftTopPoint),
        turf.getCoords(rightTopPoint),
        turf.getCoords(rightBottomPoint),
        turf.getCoords(leftBottomPoint),
        turf.getCoords(leftTopPoint).slice(),
    ]
}

// 正北方向为零度
export function createSectorCoordinates(center, radius, startAngle, endAngle, split = 30) {
    const sectorCoordinates = [center]

    startAngle = startAngle % 360
    endAngle = endAngle % 360

    const angle = Math.abs(endAngle - startAngle)
    const splitAngle = angle / split

    for (let i = 0; i <= split; i++) {
        const bearing = startAngle + splitAngle * i
        const point = turf.destination(center, radius, bearing)
        sectorCoordinates.push(turf.getCoords(point))
    }
    sectorCoordinates.push(center.slice())

    return sectorCoordinates
}

export function createSectorGeojson(center, radius, startAngle, endAngle) {
    const sectorCoordinates = createSectorCoordinates(center, radius, startAngle, endAngle)
    const coordinates = [sectorCoordinates]
    const polygon = turf.polygon(coordinates)
    return polygon
}

export function createHandlerGeojson(center, width, length, radius) {
    const rectCenter = turf.destination(center, length / 2, 0).geometry.coordinates
    const rectFeature = createRectGeojson(rectCenter, width, length, 0)
    const circleCenter = turf.destination(center, length + radius / 2, 0).geometry.coordinates
    const circleFeature = circle(circleCenter, radius)
    return turf.union(rectFeature, circleFeature)
}

export function translateFeature(feature, deltaX, deltaY) {
    const { type, coordinates } = feature.geometry

    switch (type) {
        case 'Point': {
            coordinates[0] += deltaX
            coordinates[1] += deltaY
            break
        }

        case 'LineString': {
            for (const point of coordinates) {
                point[0] += deltaX
                point[1] += deltaY
            }
            break
        }

        case 'Polygon': {
            for (const line of coordinates) {
                let length = line.length
                if (line[0] === line[length - 1]) {
                    length -= 1
                }
                for (let i = 0; i < length; i++) {
                    const point = line[i]
                    point[0] += deltaX
                    point[1] += deltaY
                }
            }
            break
        }

        case 'MultiPolygon': {
            for (const polygon of coordinates) {
                for (const line of polygon) {
                    let length = line.length
                    if (line[0] === line[length - 1]) {
                        length -= 1
                    }
                    for (let i = 0; i < length; i++) {
                        const point = line[i]
                        point[0] += deltaX
                        point[1] += deltaY
                    }
                }
            }
            break
        }
    }
}

// 创建一个贝塞尔曲线路径
export function createBezierCoordinates(originCoordinates) {
    const line = turf.lineString(originCoordinates)
    const curved = turf.bezierSpline(line, {
        resolution: originCoordinates.length * 150,
    })
    return turf.getCoords(curved)
}

export function createBezierCoordinates3d(originCoordinates) {
    const bezierCoordinates2d = createBezierCoordinates(originCoordinates)
    return coordinates3dCreate(bezierCoordinates2d)
}

// 2d坐标生成3d坐标(补零3d的参数,不能用于转换,只能用于初始化3d坐标时)
export function coordinates3dCreate(coordinates2d) {
    const ret = []
    // 叶子节点
    const isLeaf = !(coordinates2d[0] instanceof Array)
    if (isLeaf) {
        return [coordinates2d[0], coordinates2d[1], 0, 0, 0, 0]
    }
    Object.keys(coordinates2d).forEach((key) => {
        const item = coordinates2d[key]
        ret[key] = coordinates3dCreate(item)
    })
    return ret
}

// 从一个数组切割n等份
export function getDivideList(list, n) {
    if (!list.length || !n) {
        return list
    }
    const length = list.length
    const equalDiff = (length / n) | 0
    let time = n
    let currentIndex = 0
    const ret = []
    while (time) {
        ret.push(list[currentIndex])
        currentIndex += equalDiff
        time--
    }
    return ret
}

export function degrees2radians(degrees) {
    return (degrees * Math.PI) / 180
}

export function radians2degrees(rads) {
    return (rads * 180) / Math.PI
}
