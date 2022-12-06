<template>
    <div class="popup-page">
        <div class="left-popup-wrapper">
            <!-- <h2 @click="drawer = true">
        交通状态监视
      </h2> -->
            <el-tabs v-model="tabValue" type="card" class="full-tabs">
                <el-tab-pane name="paneLine" :label="tab.paneLine.label" class="custom-pane">
                    <table-line
                        :ref="tab.paneLine.ref"
                        @current-change="handleClickLineAtTable"
                        @line-map-init="handleLineInit"
                    />
                </el-tab-pane>
                <el-tab-pane name="paneCross" :label="tab.paneCross.label">
                    <table-cross
                        :ref="tab.paneCross.ref"
                        @current-change="handleClickCrossAtTable"
                        @cross-map-init="handleCrossInit"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="main-content">
            <cross-map ref="cross-map" @load="handleMapLoad" />
        </div>
        <div class="right-popup-wrapper" :class="{ show: rightPopupShow }">
            <component :is="curDetailComponent" :info="detailInfo" />
        </div>
        <button type="button" class="toggle-btn" @click="rightPopupShow = !rightPopupShow">
            <i class="el-icon-d-arrow-left" />
        </button>
        <base-legend :legend="legend" title="等级划分" />
    </div>
</template>

<script>
import CrossMap from '@/components/cross-map/index'
import BaseLegend from '@/components/legend/BaseLegend'
import TableLine from './components/table-line'
import TableCross from './components/table-cross'
import DetailLine from './components/detail-line'
import DetailCross from './components/detail-cross'
import { bd09ToWgs84 } from '@/utils/transform'
import { addClass } from '@/utils/dom'

export default {
    components: {
        CrossMap,
        BaseLegend,
        TableLine,
        TableCross,
        DetailLine,
        DetailCross,
    },
    data() {
        return {
            tab: {
                paneLine: {
                    label: '子区状态监视',
                    ref: 'tableLine',
                    rightComponent: DetailLine,
                },
                paneCross: {
                    label: '路口状态监视',
                    ref: 'tableCross',
                    rightComponent: DetailCross,
                },
            },
            tabValue: 'paneLine',
            rightPopupShow: false,
            legend: [
                { label: '非常好', color: '#67C23A' },
                { label: '较好', color: '#51962f' },
                { label: '适当', color: '#E6A23C' },
                { label: '有限', color: '#F56C6C' },
                { label: '非常有限', color: '#be2a2a' },
            ],
            detailInfo: {},
        }
    },
    computed: {
        curDetailComponent() {
            return this.tab[this.tabValue].rightComponent
        },
    },
    watch: {
        tabValue(targetKey) {
            const tab = this.tab
            const currentKey = Object.keys(tab).find((item) => item !== targetKey)
            const currentRef = tab[currentKey].ref
            const targetRef = tab[targetKey].ref
            this.$refs[currentRef].handleDeactivated()
            this.$refs[targetRef].handleActivated()
        },
    },
    beforeCreate() {
        // 地图图层加载完成标志
        this.mapLoadedPromise = new Promise((resolve) => {
            this.mapLoadedPromiseResolve = resolve
        })
    },
    mounted() {
        const ref = this.tab.paneLine.ref
        this.$refs[ref].handleActivated()
    },
    methods: {
        async handleLineInit(lines) {
            if (!this.isMapLoaded) {
                await this.mapLoadedPromise
            }
            this.rightPopupShow = false
            this.addMapLines(lines)
            this.addMapFlowlines(lines)
        },
        handleCrossInit(crosses) {
            this.rightPopupShow = false
        },
        handleMapLoad(map) {
            this.map = map
            this.mapLoadedPromiseResolve()
            this.isMapLoaded = true
            this.featureMaps = new Map()
            this.initFlowlineLayer()
            this.initLineLayer()
        },
        handleClickLineAtTable(val) {
            if (!val) {
                return console.log('没有选中项')
            }
            this.rightPopupShow = true
            this.detailInfo = val
        },
        handleClickLineAtMap(line) {
            this.$refs.tableLine.setCurrentRow(line[0].subareaLineId)
        },
        handleClickCrossAtTable(val) {
            if (!val) {
                return console.log('没有选中项')
            }
            this.rightPopupShow = true
            this.detailInfo = val
        },
        handleClickCrossAtMap(cross) {
            this.$refs.tableCross.setCurrentRow(cross.id)
        },
        initLineLayer() {
            this.lineLayerId = 'careland-line-layer'
            this.lineLayer = new this.map.Careland.Layer('polyline', this.lineLayerId)
            this.map.addLayer(this.lineLayer)
        },
        initFlowlineLayer() {
            this.flowlineLayerId = 'careland-flowline-layer'
            this.flowlineLayer = new this.map.Careland.Layer('polyline', this.flowlineLayerId)
            this.map.addLayer(this.flowlineLayer)
        },
        // 添加line数据
        addMapLines(lineList) {
            if (!lineList || !lineList.length) {
                return console.log('没有线路数据')
            }
            const FLOW_SIZE = 0.0006
            this.map.getLayerById(this.lineLayerId).clear()
            this.lineData = this._getLinesAtMap(lineList)
            this.lineCrosses = this._getCrossesByLineList(lineList)
            Object.keys(this.lineData).forEach((key) => {
                const item = this.lineData[key]
                const polyline = new this.map.Careland.Polyline()
                const { points, color, subareaLineId } = item
                const polyStyle = new this.map.Careland.LineStyle({
                    color,
                    size: 6,
                })
                const startPoint = new this.map.Careland.GbPoint(...points[0])
                const endPoint = new this.map.Careland.GbPoint(...points[1])
                const flowDefaultEndPoint = new this.map.Careland.GbPoint(startPoint.lat + FLOW_SIZE, startPoint.lng)
                const fromStartPoint = turf.point([startPoint.lng, startPoint.lat])
                const toEndPoint = turf.point([endPoint.lng, endPoint.lat])
                const toDefaultPoint = turf.point([flowDefaultEndPoint.lng, flowDefaultEndPoint.lat])
                // 红线的路程距离长度
                const lineDistance = turf.distance(fromStartPoint, toEndPoint, { units: 'kilometers' })
                // 绿线的路程距离长度
                this.flowLineDistance = turf.distance(fromStartPoint, toDefaultPoint, { units: 'kilometers' })
                const bearing = turf.bearing(fromStartPoint, toEndPoint)
                // 绿线在完全成型后的坐标
                const flowLineStartPoint = turf.destination(fromStartPoint, this.flowLineDistance, bearing, {
                    units: 'kilometers',
                })
                // 绿线在移动到末尾前隐藏时的坐标
                const flowLineMiddlePoint = turf.destination(
                    fromStartPoint,
                    lineDistance - this.flowLineDistance,
                    bearing,
                    { units: 'kilometers' }
                )
                // 绿线在移动到末尾后的坐标
                const flowLineEndPoint = turf.destination(fromStartPoint, lineDistance, bearing, {
                    units: 'kilometers',
                })
                this.featureMaps.set(subareaLineId, {
                    lineDistance,
                    flowLineStartPoint,
                    flowLineMiddlePoint,
                    flowLineEndPoint,
                    bearing,
                })
                polyline.setPoints([startPoint, endPoint])
                polyline.setStyle(polyStyle)
                this.lineLayer.add(polyline)
            })
        },

        addMapFlowlines(lineList) {
            if (!lineList || !lineList.length) {
                return console.log('没有线路数据')
            }
            const FLOW_SIZE = 0.0006
            this.map.getLayerById(this.flowlineLayerId).clear()
            this.cancelFlowAnimationFrame()
            Object.keys(this.lineData).forEach((key) => {
                const item = this.lineData[key]
                const polyFlowline = new this.map.Careland.Polyline()
                const { points, subareaLineId } = item
                const polyStyle = new this.map.Careland.LineStyle({
                    color: '#009D7A',
                    size: 6,
                    opacity: 100,
                })
                const startPoint = new this.map.Careland.GbPoint(...points[0])

                const flowLineData = this.featureMaps.get(subareaLineId)
                const { lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing } =
                    flowLineData
                polyFlowline.setStyle(polyStyle)
                const flowDirectionUp = item.lines.some((line) => {
                    const { crosses } = line
                    return crosses.some((cross) => {
                        const { direction } = cross
                        return direction === '2'
                    })
                })
                this.startFlowlineAnimationFrame(
                    startPoint,
                    polyFlowline,
                    lineDistance,
                    flowLineStartPoint,
                    flowLineMiddlePoint,
                    flowLineEndPoint,
                    bearing,
                    flowDirectionUp
                )
            })
        },
        // 流动线条绘制动画
        startFlowlineAnimationFrame(
            startPoint,
            polyFlowline,
            lineDistance,
            flowLineStartPoint,
            flowLineMiddlePoint,
            flowLineEndPoint,
            bearing,
            flowDirectionUp
        ) {
            this.flowStartTime = performance.now()
            this.loop(
                startPoint,
                polyFlowline,
                lineDistance,
                flowLineStartPoint,
                flowLineMiddlePoint,
                flowLineEndPoint,
                bearing,
                flowDirectionUp
            )
        },
        loop(
            startPoint,
            polyFlowline,
            lineDistance,
            flowLineStartPoint,
            flowLineMiddlePoint,
            flowLineEndPoint,
            bearing,
            flowDirectionUp
        ) {
            const SPEED = 1000
            const k = this.flowLineDistance / SPEED
            const FLOW_DURATION = lineDistance / k
            const startTime = SPEED
            const middleTime = (lineDistance - this.flowLineDistance * 2) / k
            // const FLOW_DURATION = 2000
            this.requestAnimationFrameId = requestAnimationFrame(() => {
                const now = performance.now()
                const time = now - this.flowStartTime
                // 周期反转函数
                const rest = time % FLOW_DURATION
                if (rest <= startTime) {
                    const y = flowDirectionUp ? -k * rest : k * rest
                    // console.log(y, "y1")
                    const loopStartPoint = [startPoint.lat, startPoint.lng]
                    const startTurfPoint = turf.point([startPoint.lng, startPoint.lat])
                    const endDestinationPoint = turf.destination(startTurfPoint, y, bearing, { units: 'kilometers' })
                    const loopEndCoordinates = endDestinationPoint.geometry.coordinates
                    const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
                    const flowStartPoint = new this.map.Careland.GbPoint(...loopStartPoint)
                    const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
                    polyFlowline.setPoints([flowStartPoint, flowEndPoint])
                    this.flowlineLayer.add(polyFlowline)
                    this.loop(
                        startPoint,
                        polyFlowline,
                        lineDistance,
                        flowLineStartPoint,
                        flowLineMiddlePoint,
                        flowLineEndPoint,
                        bearing,
                        flowDirectionUp
                    )
                } else if (rest > startTime && rest <= middleTime + startTime) {
                    const y = flowDirectionUp ? -k * (rest - startTime) : k * (rest - startTime)
                    console.log(y, 'y2')
                    const flowLineStartCoordinates = flowLineStartPoint.geometry.coordinates
                    const loopStartPoint = [flowLineStartCoordinates[1], flowLineStartCoordinates[0]]
                    const startTurfPoint = turf.point([flowLineStartCoordinates[0], flowLineStartCoordinates[1]])
                    const endDestinationPoint = turf.destination(startTurfPoint, y, bearing, { units: 'kilometers' })
                    const loopEndCoordinates = endDestinationPoint.geometry.coordinates
                    const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
                    const endTurfPoint = turf.point([loopEndCoordinates[0], loopEndCoordinates[1]])
                    const flowLoopStartPoint = turf.destination(endTurfPoint, this.flowLineDistance, bearing, {
                        units: 'kilometers',
                    })
                    const flowLoopStartCoordinates = flowLoopStartPoint.geometry.coordinates
                    const loopTurfStartPoint = [flowLoopStartCoordinates[1], flowLoopStartCoordinates[0]]
                    const flowStartPoint = new this.map.Careland.GbPoint(...loopTurfStartPoint)
                    const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
                    polyFlowline.setPoints([flowStartPoint, flowEndPoint])
                    this.flowlineLayer.add(polyFlowline)
                    this.loop(
                        startPoint,
                        polyFlowline,
                        lineDistance,
                        flowLineStartPoint,
                        flowLineMiddlePoint,
                        flowLineEndPoint,
                        bearing,
                        flowDirectionUp
                    )
                } else {
                    const y = flowDirectionUp
                        ? k * (rest - middleTime - startTime)
                        : -k * (rest - middleTime - startTime)
                    // console.log(y, "y3", bearing)
                    const flowLineStartCoordinates = flowLineMiddlePoint.geometry.coordinates
                    const loopStartPoint = [flowLineStartCoordinates[1], flowLineStartCoordinates[0]]
                    const startTurfPoint = turf.point([flowLineStartCoordinates[0], flowLineStartCoordinates[1]])
                    const startDestinationPoint = turf.destination(startTurfPoint, -y, bearing, { units: 'kilometers' })
                    const flowDestinationStartCoordinates = startDestinationPoint.geometry.coordinates
                    const loopTurfStartPoint = [flowDestinationStartCoordinates[1], flowDestinationStartCoordinates[0]]
                    const loopEndCoordinates = flowLineEndPoint.geometry.coordinates
                    const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
                    const flowStartPoint = new this.map.Careland.GbPoint(...loopTurfStartPoint)
                    const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
                    polyFlowline.setPoints([flowStartPoint, flowEndPoint])
                    this.flowlineLayer.add(polyFlowline)
                    this.loop(
                        startPoint,
                        polyFlowline,
                        lineDistance,
                        flowLineStartPoint,
                        flowLineMiddlePoint,
                        flowLineEndPoint,
                        bearing,
                        flowDirectionUp
                    )
                }
            })
        },
        // loop (startPoint, polyFlowline, lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing, flowDirectionUp) {
        //   const FLOW_DURATION = 2000
        //   this.requestAnimationFrameId = requestAnimationFrame(() => {
        //     const now = performance.now()
        //     const time = now - this.flowStartTime
        //     // 周期反转函数
        //     const rest = time % FLOW_DURATION
        //     // console.log(lineDistance, "lineDistance", lineDistance / (this.flowLineDistance / 600))
        //     if (rest <= 600) {
        //       const k = this.flowLineDistance / 600
        //       const y = flowDirectionUp ? -k * rest : k * rest
        //       // console.log(y, "y1")
        //       const loopStartPoint = [startPoint.lat, startPoint.lng]
        //       const startTurfPoint = turf.point([startPoint.lng, startPoint.lat])
        //       const endDestinationPoint = turf.destination(startTurfPoint, y, bearing, { units: "kilometers" })
        //       const loopEndCoordinates = endDestinationPoint.geometry.coordinates
        //       const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
        //       const flowStartPoint = new this.map.Careland.GbPoint(...loopStartPoint)
        //       const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
        //       polyFlowline.setPoints([flowStartPoint, flowEndPoint])
        //       this.flowlineLayer.add(polyFlowline)
        //       this.loop(startPoint, polyFlowline, lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing, flowDirectionUp)
        //     } else if (rest > 600 && rest <= 1400) {
        //       const k = (lineDistance - this.flowLineDistance * 2) / 800
        //       const y = flowDirectionUp ? -k * (rest - 600) : k * (rest - 600)
        //       // console.log(y, "y2")
        //       const flowLineStartCoordinates = flowLineStartPoint.geometry.coordinates
        //       const loopStartPoint = [flowLineStartCoordinates[1], flowLineStartCoordinates[0]]
        //       const startTurfPoint = turf.point([flowLineStartCoordinates[0], flowLineStartCoordinates[1]])
        //       const endDestinationPoint = turf.destination(startTurfPoint, y, bearing, { units: "kilometers" })
        //       const loopEndCoordinates = endDestinationPoint.geometry.coordinates
        //       const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
        //       const endTurfPoint = turf.point([loopEndCoordinates[0], loopEndCoordinates[1]])
        //       const flowLoopStartPoint = turf.destination(endTurfPoint, this.flowLineDistance, bearing, { units: "kilometers" })
        //       const flowLoopStartCoordinates = flowLoopStartPoint.geometry.coordinates
        //       const loopTurfStartPoint = [flowLoopStartCoordinates[1], flowLoopStartCoordinates[0]]
        //       const flowStartPoint = new this.map.Careland.GbPoint(...loopTurfStartPoint)
        //       const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
        //       polyFlowline.setPoints([flowStartPoint, flowEndPoint])
        //       this.flowlineLayer.add(polyFlowline)
        //       this.loop(startPoint, polyFlowline, lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing, flowDirectionUp)
        //     } else {
        //       const k = this.flowLineDistance / 600
        //       const y = flowDirectionUp ? k * (rest - 1400) : -k * (rest - 1400)
        //       // console.log(y, "y3", bearing)
        //       const flowLineStartCoordinates = flowLineMiddlePoint.geometry.coordinates
        //       const loopStartPoint = [flowLineStartCoordinates[1], flowLineStartCoordinates[0]]
        //       const startTurfPoint = turf.point([flowLineStartCoordinates[0], flowLineStartCoordinates[1]])
        //       const startDestinationPoint = turf.destination(startTurfPoint, -y, bearing, { units: "kilometers" })
        //       const flowDestinationStartCoordinates = startDestinationPoint.geometry.coordinates
        //       const loopTurfStartPoint = [flowDestinationStartCoordinates[1], flowDestinationStartCoordinates[0]]
        //       const loopEndCoordinates = flowLineEndPoint.geometry.coordinates
        //       const loopEndPoint = [loopEndCoordinates[1], loopEndCoordinates[0]]
        //       const flowStartPoint = new this.map.Careland.GbPoint(...loopTurfStartPoint)
        //       const flowEndPoint = new this.map.Careland.GbPoint(...loopEndPoint)
        //       polyFlowline.setPoints([flowStartPoint, flowEndPoint])
        //       this.flowlineLayer.add(polyFlowline)
        //       this.loop(startPoint, polyFlowline, lineDistance, flowLineStartPoint, flowLineMiddlePoint, flowLineEndPoint, bearing, flowDirectionUp)
        //     }
        //   })
        // },

        cancelFlowAnimationFrame() {
            if (this.requestAnimationFrameId) {
                cancelAnimationFrame(this.requestAnimationFrameId)
            }
            this.requestAnimationFrameId = null
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
        _getLinesAtMap(lineList) {
            const reverseDistance = 0.005 // 相同两个路口反向的线段与正向的线段距离，单位 km
            const ret = {}
            lineList.forEach((item) => {
                item.crosses.slice(1).reduce((pre, cur) => {
                    if (pre.code === cur.code) return cur
                    const retKey = `c-${pre.code}-${cur.code}`
                    const { subareaLineId } = item
                    if (ret[retKey]) {
                        ret[retKey].lines.push(item)
                        return cur
                    }
                    const retKeyReverse = `c-${cur.code}-${pre.code}`
                    const lngLats = [bd09ToWgs84(pre.longitude, pre.latitude), bd09ToWgs84(cur.longitude, cur.latitude)]
                    const latLngs = lngLats.map((ll) => [ll[1], ll[0]])
                    const bearing = turf.bearing(latLngs[0], latLngs[1]) // 两点正北算起的角度
                    const curDistance = ret[retKeyReverse] ? reverseDistance : -reverseDistance
                    const curBearing = ret[retKeyReverse] ? -bearing : bearing
                    const points = lngLats.map((ll) =>
                        turf.getCoord(turf.flip(turf.destination(ll, curDistance, curBearing)))
                    ) // 获取偏移后的坐标
                    ret[retKey] = { points, color: item.color, lines: [item], subareaLineId }
                    return cur
                }, item.crosses[0])
            })
            return ret
        },
        /**
         * 根据干线数据（包含路口的）获取所有的路口数据
         */
        _getCrossesByLineList(lineList) {
            const obj = {}
            const ret = lineList.flatMap((item) => {
                return item.crosses.map((c) => {
                    if (obj[c.code]) return undefined
                    obj[c.code] = true
                    const [longitude, latitude] = bd09ToWgs84(c.longitude, c.latitude)
                    return {
                        ...c,
                        longitude,
                        latitude,
                    }
                })
            })
            return ret.filter((item) => item)
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../common.scss';
.popup-page {
    position: relative;
    display: flex;
    height: 100%;
    overflow: hidden;
}
.left-popup-wrapper {
    width: 580px;
    height: 100%;
    padding-top: 8px;
    h2 {
        width: 100%;
        text-align: center;
        font-size: 18px;
        line-height: 1.5;
    }
}
.main-content {
    flex: 1;
}
.right-popup-wrapper {
    position: absolute;
    top: 80px;
    z-index: 1000;
    background: var(--color-background-popup-wrapper-02162D);
    top: 0;
    right: 0;
    height: 100%;
    width: 360px;
    transform: translateX(100%);
    padding: 10px;
    box-sizing: border-box;
    box-shadow: -1px 0 4px 1px var(--color-shadow-evaluating-mointor);
    transition: transform 0.2s;
    overflow-y: auto;
    overflow-x: hidden;
    &.show {
        transform: translateX(0);
    }
}
.toggle-btn {
    position: absolute;
    top: 20%;
    right: 0;
    transform: translateX(0);
    transition: transform 0.2s;
    height: 80px;
    width: 34px;
    box-sizing: border-box;
    padding: 0;
    border: none;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    color: var(--color-toggle-icon-evaluating-mointor) !important;
    background: var(--color-button-popup-wrapper);
    cursor: pointer;
    color: $--sutpc--color-white;
    z-index: 1000;
    &:focus {
        outline: 0;
    }
}
.right-popup-wrapper.show + .toggle-btn {
    transform: translateX(-360px);
    i {
        transform: rotate(180deg);
    }
    + .legend-wrapper {
        transform: translateX(-360px);
    }
}
.legend-wrapper {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1000;
    transform: translateX(0);
    transition: transform 0.2s;
    background-color: var(--color-background-legend-wrapper);
    border-radius: $--sutpc--border-radius-base;
}
</style>
