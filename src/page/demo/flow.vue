<template>
  <cross-map
    ref="cross-map"
    class="map-flowline"
    @load="handleMapLoad"
  />
</template>
<script type='text/javascript'>
import config from "@/config"
import CrossMap from "@/components/cross-map/index";
import { bd09ToWgs84 } from "@/utils/transform";
import hat from "hat"

const EVENT_LOAD = "load"

// 默认线条宽度
const LINE_SIZE = 6
// 选中后线条宽度
const SET_LINE_SIZE = 10
// 流动线条长度
const FLOW_LENGTH = 0.0006
// 流动线条速度
const SPEED = 200
// 默认路口半径
const CIRCLE_RADIUS = 500
// 选中后路口半径
const SET_CIRCLE_RADIUS = 800

export default {
  name: "MapFlowline",
  components: {
    CrossMap
  },
  data () {
    return {
    }
  },
  beforeDestroy () {
    this.cancelFlowAnimationFrame()
    this.cancelFlowTimer()
  },
  methods: {
    handleMapLoad (map) {
      this.map = map
      this.map.setZoom(11)
      this.$emit(EVENT_LOAD, this.map)
      this.featureLineMaps = new Map()
      this.initFlowlineLayer()
      this.initLineLayer()
      this.initCrossLayer()
    },

    initLineLayer () {
      this.lineLayerId = "careland-line-layer"
      this.lineLayer = new this.map.Careland.Layer("polyline", this.lineLayerId)
      this.map.addLayer(this.lineLayer)
    },

    initFlowlineLayer () {
      this.flowlineLayerId = "careland-flowline-layer"
      this.flowlineLayer = new this.map.Careland.Layer("polyline", this.flowlineLayerId)
      this.map.addLayer(this.flowlineLayer)
    },

    initCrossLayer () {
      this.crossLayerId = "careland-cross-layer"
      this.crossLayer = new this.map.Careland.Layer("polygon", this.crossLayerId)
      this.map.addLayer(this.crossLayer)
    },

    // 添加line数据
    addMapLines (lineList) {
      if (!lineList || !lineList.length) {
        return console.log("没有线路数据")
      }
      this.map.getLayerById(this.lineLayerId).clear()
      this.lineData = this._getLinesAtMap(lineList);
      // console.log(this.lineData, "lineData")
      this.lineCrosses = this._getCrossesByLineList(lineList);
      Object.keys(this.lineData).forEach(key => {
        const item = this.lineData[key]
        const name = item.lines.map(line => {
          const { subareaLineName, crosses } = line;
          const startCross = crosses[0].name;
          const endCross = crosses[crosses.length - 1].name;
          return `${subareaLineName}（${startCross}<i class="el-icon-right"></i>${endCross}）`
        })
        const flowDirectionUp = item.lines.some(line => {
          const { crosses } = line
          return crosses.some(cross => {
            const { direction } = cross
            return direction === "2"
          })
        })
        // 一条线的绘制其路口的lineId一致
        const lineId = item.lines[0].crosses[0].lineId
        const polyline = new this.map.Careland.Polyline()
        polyline.setId(lineId)
        const { points, color, mapLineId } = item
        const polyStyle = new this.map.Careland.LineStyle({
          color,
          size: LINE_SIZE,
        })
        const startPoint = new this.map.Careland.GbPoint(...points[0])
        const endPoint = new this.map.Careland.GbPoint(...points[1])
        const flowDefaultEndPoint = new this.map.Careland.GbPoint(startPoint.lat + FLOW_LENGTH, startPoint.lng)
        const fromStartPoint = turf.point([startPoint.lng, startPoint.lat])
        const toEndPoint = turf.point([endPoint.lng, endPoint.lat])
        const toDefaultPoint = turf.point([flowDefaultEndPoint.lng, flowDefaultEndPoint.lat])
        // 红线的路程距离长度
        const lineDistance = turf.distance(fromStartPoint, toEndPoint, { units: "kilometers" })
        // 绿线的路程距离长度
        this.flowLineDistance = turf.distance(fromStartPoint, toDefaultPoint, { units: "kilometers" })
        const bearing = turf.bearing(fromStartPoint, toEndPoint)
        // 绿线在完全成型后的坐标
        const flowLineStartPoint = turf.destination(fromStartPoint, this.flowLineDistance, bearing, { units: "kilometers" })
        // 绿线在移动到末尾前隐藏时的坐标
        const flowLineMiddlePoint = turf.destination(fromStartPoint, lineDistance - this.flowLineDistance, bearing, { units: "kilometers" })
        // 绿线在移动到末尾后的坐标
        const flowLineEndPoint = turf.destination(fromStartPoint, lineDistance, bearing, { units: "kilometers" })
        this.featureLineMaps.set(mapLineId, { startPoint, polyline, lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing, flowDirectionUp })
        polyline.setPoints([startPoint, endPoint])
        polyline.setStyle(polyStyle)
        polyline.lnglatPoint = [startPoint, endPoint]
        this.lineLayer.add(polyline)
        this.addMapOpenInfo(polyline, name)
      })
    },

    addMapFlowlines (lineList) {
      if (!lineList || !lineList.length) {
        return console.log("没有线路数据")
      }
      this.cancelFlowTimer()
      this.cancelFlowAnimationFrame()
      this.map.getLayerById(this.flowlineLayerId).clear()
      this.flowlineAnimation()
      this.flowTimer = setInterval(() => {
        this.flowlineAnimation()
      }, 4000)
    },

    // 抽离的流动线条方法
    flowlineAnimation () {
      // this.requestAnimationFrameId = requestAnimationFrame(() => {
        Object.keys(this.lineData).forEach(key => {
        const item = this.lineData[key]
        const polyFlowline = new this.map.Careland.Polyline()
        const { mapLineId } = item
        // 一条线的绘制其所有路口的lineId一致
        const lineId = item.lines[0].crosses[0].lineId
        const flowLineData = this.featureLineMaps.get(mapLineId)
        const { polyline } = flowLineData
        const { size } = polyline.style
        const polyStyle = new this.map.Careland.LineStyle({
          color: "#009D7A",
          size,
        })
        polyFlowline.setStyle(polyStyle)
        polyFlowline.setFlowId = lineId
        this.startFlowlineAnimationFrame(mapLineId, polyFlowline)
      })
      // })
    },

    addCrosses (crossesList) {
      if (!crossesList || !crossesList.length) {
        return console.log("没有线路数据")
      }
      this.map.getLayerById(this.crossLayerId).clear()
      // console.log(crossesList, "crossesList")
      crossesList.forEach(item => {
        const { id, name, code, latitude, longitude } = item
        const content = `${name}-${code}`
        const point = new this.map.Careland.GbPoint(latitude, longitude)
        const rect = new this.map.Careland.Circle()
        rect.setId(id)
        const styleRect = new this.map.Careland.PolyStyle({
          fillColor: "#409EFF",
          opacity: 40,
          outlineColor: "transparent"
        })
        rect.setRect({
          center: point,
          radius: CIRCLE_RADIUS
        })
        rect.setStyle(styleRect)
        this.addMapOpenInfo(rect, content)
        this.crossLayer.add(rect)
      })
    },

    // 选中表格数据高亮线条
    setCurrentLine (val) {
      const lineItems = this.lineLayer.items
      const flowLineItems = this.flowlineLayer.items
      const { color, subareaLineId } = val
      lineItems.forEach(item => {
        if (item.id === subareaLineId) {
          const { lnglatPoint } = item
          const centerPoint = this.getLineCenterPoint(lnglatPoint)
          const lineCenterPoint = new this.map.Careland.GbPoint(centerPoint[1], centerPoint[0])
          this.map.centerAndZoom(lineCenterPoint, 14)
          item.setStyle({ color, size: SET_LINE_SIZE })
        } else {
          item.setStyle({ color, size: LINE_SIZE })
        }
      })
      flowLineItems.forEach(item => {
        if (item.setFlowId === subareaLineId) {
          item.setStyle({ color: "#009D7A", size: SET_LINE_SIZE })
        } else {
          item.setStyle({ color: "#009D7A", size: LINE_SIZE })
        }
      })
    },

    setCurrentCross (val) {
      console.log(this.requestAnimationFrameId, "路口的requestAnimationFrameId")
      const crossItems = this.crossLayer.items
      const { id, longitude, latitude } = val
      const crossCenterPoint = new this.map.Careland.GbPoint(latitude, longitude)
      crossItems.forEach(item => {
        if (item.id === id) {
          const styleRect = new this.map.Careland.PolyStyle({
            fillColor: "#F56C6C",
            // opacity: 40,
            outlineColor: "transparent"
          })
          this.map.setCenter(crossCenterPoint)
          item.setRect({ center: crossCenterPoint, radius: SET_CIRCLE_RADIUS })
          item.setStyle(styleRect)
        } else {
          const styleRect = new this.map.Careland.PolyStyle({
            fillColor: "#409EFF",
            opacity: 40,
            outlineColor: "transparent"
          })
          const { centrePoint } = item
          item.setRect({ center: centrePoint, radius: CIRCLE_RADIUS })
          item.setStyle(styleRect)
        }
      })
    },

    // TODO: 待优化，将部分共用步骤抽离，变量起名统一，loop参数存进map结构中
    // 流动线条绘制动画
    startFlowlineAnimationFrame (mapLineId, polyFlowline) {
      const flowStartTime = performance.now()
      this.loop(mapLineId, polyFlowline, flowStartTime)
    },

    loop (mapLineId, polyFlowline, flowStartTime, restLoop = false) {
      const flowLineData = this.featureLineMaps.get(mapLineId)
      const { startPoint, lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing, flowDirectionUp } = flowLineData
      const k = this.flowLineDistance / SPEED
      const FLOW_DURATION = lineDistance / k
      const startTime = SPEED
      const middleTime = (lineDistance - this.flowLineDistance * 2) / k
      const endTime = startTime + middleTime
      this.requestAnimationFrameId = requestAnimationFrame(() => {
        const now = performance.now()
        // console.log(now, "now")
        const time = now - flowStartTime
        // 每4s推送一个绿色小方块
        // if (time >= this.startNum * INTERVAL && time <= (this.startNum + 1) * INTERVAL) {
        //   this.flowlineAnimation()
        //   this.startNum++
        // }
        // 周期反转函数
        const rest = time % FLOW_DURATION
        const restDistance = rest * k
        // 每当进入第三阶段并且rest处于第一阶段的距离时，移除方块
        if (restLoop && restDistance < this.flowLineDistance) {
          const id = polyFlowline.getId()
          if (id) this.flowlineLayer.remove(id)
          return
        }
        // 绿块从0到完整出来阶段
        if (rest <= startTime) {
          const y = flowDirectionUp ? -k * rest : k * rest
          const loopStartPoint = [startPoint.lat, startPoint.lng]
          const startTurfPoint = turf.point([startPoint.lng, startPoint.lat])
          const endDestinationPoint = turf.destination(startTurfPoint, y, bearing, { units: "kilometers" })
          const loopEndCoordinates = endDestinationPoint.geometry.coordinates
          const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
          this.addFlowLoopLayer(polyFlowline, loopStartPoint, loopEndPoint, mapLineId, flowStartTime)
        // 绿块从红线起端到终端即将消失阶段
        } else if (rest > startTime && rest <= endTime) {
          const y = flowDirectionUp ? -k * (rest - startTime) : k * (rest - startTime)
          const flowLineStartCoordinates = flowLineStartPoint.geometry.coordinates
          const loopStartPoint = [flowLineStartCoordinates[1], flowLineStartCoordinates[0]]
          const startTurfPoint = turf.point([flowLineStartCoordinates[0], flowLineStartCoordinates[1]])
          const endDestinationPoint = turf.destination(startTurfPoint, y, bearing, { units: "kilometers" })
          const loopEndCoordinates = endDestinationPoint.geometry.coordinates
          const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
          const endTurfPoint = turf.point([loopEndCoordinates[0], loopEndCoordinates[1]])
          const flowLoopStartPoint = turf.destination(endTurfPoint, this.flowLineDistance, bearing, { units: "kilometers" })
          const flowLoopStartCoordinates = flowLoopStartPoint.geometry.coordinates
          const loopTurfStartPoint = [flowLoopStartCoordinates[1], flowLoopStartCoordinates[0]]
          this.addFlowLoopLayer(polyFlowline, loopTurfStartPoint, loopEndPoint, mapLineId, flowStartTime)
          // 绿块从终端开始消失到完全消失阶段
        } else {
          const y = flowDirectionUp ? k * (rest - endTime) : -k * (rest - endTime)
          const flowLineStartCoordinates = flowLineMiddlePoint.geometry.coordinates
          const loopStartPoint = [flowLineStartCoordinates[1], flowLineStartCoordinates[0]]
          const startTurfPoint = turf.point([flowLineStartCoordinates[0], flowLineStartCoordinates[1]])
          const startDestinationPoint = turf.destination(startTurfPoint, -y, bearing, { units: "kilometers" })
          const flowDestinationStartCoordinates = startDestinationPoint.geometry.coordinates
          const loopTurfStartPoint = [flowDestinationStartCoordinates[1], flowDestinationStartCoordinates[0]]
          const loopEndCoordinates = flowLineEndPoint.geometry.coordinates
          const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
          const restLoop = true
          this.addFlowLoopLayer(polyFlowline, loopTurfStartPoint, loopEndPoint, mapLineId, flowStartTime, restLoop)
        }
      })
      // console.log(this.requestAnimationFrameId, "this.requestAnimationFrameId")
    },
    // 提取周期函数的绘制绿线部分
    addFlowLoopLayer (polyFlowline, loopStartPoint, loopEndPoint, mapLineId, flowStartTime, restLoop = false) {
      const flowStartPoint = new this.map.Careland.GbPoint(...loopStartPoint)
      const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
      polyFlowline.setPoints([flowStartPoint, flowEndPoint])
      this.flowlineLayer.add(polyFlowline)
      this.loop(mapLineId, polyFlowline, flowStartTime, restLoop)
    },
    // 显示layer图层的弹框
    addMapOpenInfo (layer, value) {
      const handleClick = (event) => {
        this.map.closeInfoWindow()
        const { point } = event
        const openInfo = {
          width: 300,
          height: 50,
          offset: new this.map.Careland.Size(0, 0),
          point,
          enableAutoPan: true,
          poi: { name: value }
        }
        const mapOpenInfo = new this.map.Careland.InfoWindow(openInfo)
        this.map.openInfoWindow(mapOpenInfo, point)
      }
      layer.addEventListener("click", handleClick.bind(this))
    },

    cancelFlowAnimationFrame () {
      if (this.requestAnimationFrameId) {
        cancelAnimationFrame(this.requestAnimationFrameId)
      }
      this.requestAnimationFrameId = null
    },

    cancelFlowTimer () {
      if (this.flowTimer) {
        clearInterval(this.flowTimer)
      }
      this.flowTimer = null
    },

    clearLayers () {
      this.cancelFlowTimer()
      this.cancelFlowAnimationFrame()
      this.map.getLayerById(this.flowlineLayerId).clear()
      this.map.getLayerById(this.lineLayerId).clear()
      this.map.getLayerById(this.crossLayerId).clear()
    },
    /**
     * 格式化干线数据:
     * 1. 把所有的数据分为两个相邻路口的数据
     * 2. 如果有重复的两个路口则合并为一条
     * 3. 计算绘图需要的坐标
     *
     * 关于干线数据：
     *  1. 给干线添加路口不会乱序添加，例如 A、C、B。
     *  2. 给干线路口不会跨路口添加，例如 A、C。
     * @param {Object[]} 接口获取的干线数据，且包含 crosses字段
     * @returns {Object} 两个相邻路口的code为key的对象
     */
    _getLinesAtMap (lineList) {
      const reverseDistance = 0.005; // 相同两个路口反向的线段与正向的线段距离，单位 km
      const ret = {};
      lineList.forEach(item => {
        item.crosses.slice(1).reduce((pre, cur) => {
          // TODO: 后端数据中多处路口无经纬度数据，后续修复后移除此判断
          if (!("longitude" in pre) || !("longitude" in cur)) return {}
          if (pre.code === cur.code) return cur;
          const retKey = `c-${pre.code}-${cur.code}`;
          if (ret[retKey]) {
            ret[retKey].lines.push(item);
            return cur;
          }
          const retKeyReverse = `c-${cur.code}-${pre.code}`;
          const lngLats = [bd09ToWgs84(pre.longitude, pre.latitude), bd09ToWgs84(cur.longitude, cur.latitude)];
          const latLngs = lngLats.map(ll => [ll[1], ll[0]]);
          const bearing = turf.bearing(latLngs[0], latLngs[1]); // 两点正北算起的角度
          const curDistance = ret[retKeyReverse] ? reverseDistance : -reverseDistance;
          const curBearing = ret[retKeyReverse] ? -bearing : bearing;
          const points = lngLats.map(ll => turf.getCoord(turf.flip(turf.destination(ll, curDistance, curBearing)))); // 获取偏移后的坐标
          const mapLineId = hat()
          ret[retKey] = { points, color: item.color, lines: [item], mapLineId }
          return cur;
        }, item.crosses[0])
      })
      return ret;
    },
    getLineCenterPoint (points) {
      const startPoint = turf.point([points[0].lng, points[0].lat])
      const endPoint = turf.point([points[1].lng, points[1].lat])
      const middlePoint = turf.midpoint(startPoint, endPoint)
      const { geometry } = middlePoint
      const { coordinates } = geometry
      return coordinates
    },
    // 将相近的路口连接起来 TODO：后续添加此方法，需优化算法
    // _mergeLinesAtMap (lineData) {
    //   console.log(lineData, "lineData")
    //   const lineArr = []
    //   Object.keys(lineData).forEach((key, index) => {
    //     const crossDivision = key.split("c-")[1]
    //     const preCrossName = crossDivision.split("-")[0]
    //     const afterCrossName = crossDivision.split("-")[1]
    //     const crossName = [preCrossName, afterCrossName]
    //     lineArr.push(crossName)
    //   })
    //   // console.log(lineArr, "lineArr")
    //   const sameArr = []
    //   for (let i = 0; i < lineArr.length; i++) {
    //     for (let j = i + 1; j < lineArr.length - 1; j++) {
    //       const preNumber = lineArr[i][0]
    //       const afterNumber = lineArr[i][1]
    //       if (lineArr[j][0] === afterNumber || lineArr[j][1] === preNumber) {
    //         const sameCross = [`c-${lineArr[j][0]}-${lineArr[j][1]}`, `c-${preNumber}-${afterNumber}`]
    //         sameArr.push(sameCross)
    //       }
    //     }
    //   }
    //   console.log(sameArr, "sameArr")
    //   sameArr.forEach(item => {
    //     const preCrossData = lineData[item[0]]
    //     const afterCrossData = lineData[item[1]]
    //     const preCrossPoints = preCrossData.points
    //     const afterCrossPoints = afterCrossData.points
    //   })
    // },
    /**
     * 根据干线数据（包含路口的）获取所有的路口数据
     */
    _getCrossesByLineList (lineList) {
      const obj = {};
      const ret = lineList.flatMap(item => {
        return item.crosses.map(c => {
          if (obj[c.code]) return undefined
          obj[c.code] = true;
          const [longitude, latitude] = bd09ToWgs84(c.longitude, c.latitude);
          return {
            ...c,
            longitude,
            latitude
          }
        })
      })
      return ret.filter(item => item);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../index.scss";
</style>
