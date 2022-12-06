<template>
    <div class="dialog-from">
        <cc-header :headtitle="'mars3d-circlewave(圆圈波浪)'" />
        <cc-scroll>
            <div class="map-box">
                <div id="mars3dContainer">
                    <MarsEntity
                        v-for="item in entityList"
                        :key="item.name"
                        :name="item.name"
                        :position="item.position"
                    />
                    <HtmlOverlay v-for="item in entityList" :key="item.id" :position="item.position" :name="item.name">
                        <MarsPopup :title="item.title || ''" ref="popup">
                            <div>{{ item.label }}</div>
                        </MarsPopup>
                    </HtmlOverlay>
                </div>
            </div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'dialog-from'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
    },
    provide() {
        const self = this
        return {
            get mapPromise() {
                return self.mapPromise
            },
            get graphicLayer() {
                return self.graphicLayer
            },
        }
    },
    props: {},
    data() {
        return {
            entityList: [
                {
                    name: '圆圈一',
                    // position: [116.234399, 30.810459],
                    position: [116.244399, 30.910459],
                    label: '准点巴士',
                    title: '巴士',
                },
                {
                    name: '圆圈二',
                    // position: [116.244399, 30.910459],
                    position: [116.234399, 30.810459],
                    label: '准点公交',
                    title: '公交',
                },
            ],
        }
    },
    beforeCreate() {
        this.graphicLayer = new mars3d.layer.GraphicLayer()
        this.mapPromise = new Promise((resolve, reject) => {
            this.mapPromiseResolve = resolve
            this.mapPromiseReject = reject
        })
    },
    mounted() {
        this.initView()
    },
    beforeUnmount() {
        this.map.destroy()
        this.map = null
    },
    methods: {
        initView() {
            const map = new mars3d.Map('mars3dContainer', {
                scene: {
                    // 默认视角参数
                    center: { lat: 30.740724, lng: 116.363055, alt: 23499, heading: 351, pitch: -54 },
                    // 是否启用日照阴影
                    shadows: false,
                    // 是否移除Cesium默认的双击事件
                    removeDblClick: false,

                    //以下是Cesium.Viewer所支持的options【控件相关的写在另外的control属性中】
                    sceneMode: 3, //3等价于Cesium.SceneMode.SCENE3D,

                    //以下是Cesium.Scene对象相关参数
                    showSun: true, //是否显示太阳
                    showMoon: true, //是否显示月亮
                    showSkyBox: true, //是否显示天空盒
                    showSkyAtmosphere: true, //是否显示地球大气层外光圈
                    fog: true, //是否启用雾化效果
                    fxaa: true, //是否启用抗锯齿

                    //以下是Cesium.Globe对象相关参数
                    globe: {
                        depthTestAgainstTerrain: false, //是否启用深度监测
                        baseColor: '#546a53', //地球默认背景色
                        showGroundAtmosphere: true, //是否在地球上绘制的地面大气
                        enableLighting: false, //是否显示昼夜区域
                    },
                    //以下是Cesium.ScreenSpaceCameraController对象相关参数
                    cameraController: {
                        zoomFactor: 3.0, //鼠标滚轮放大的步长参数
                        minimumZoomDistance: 1, //地球放大的最小值（以米为单位）
                        maximumZoomDistance: 50000000, //地球缩小的最大值（以米为单位）
                        enableRotate: true, //2D和3D视图下，是否允许用户旋转相机
                        enableTranslate: true, //2D和哥伦布视图下，是否允许用户平移地图
                        enableTilt: true, // 3D和哥伦布视图下，是否允许用户倾斜相机
                        enableZoom: true, // 是否允许 用户放大和缩小视图
                        enableCollisionDetection: true, //是否允许 地形相机的碰撞检测
                    },
                },
                control: {
                    baseLayerPicker: true, //basemaps底图切换按钮
                    homeButton: true, //视角复位按钮
                    sceneModePicker: true, //二三维切换按钮
                    navigationHelpButton: true, //帮助按钮
                    fullscreenButton: true, //全屏按钮
                },
            })
            map.addLayer(this.graphicLayer)
            // this.map = map
            // this.graphicLayer = graphicLayer
            this.mapPromiseResolve(map)
        },

        // addPopup(graphicLayer) {
        //   const html = this.$refs.popup.$el.innerHTML
        //   const graphic = new mars3d.graphic.DivBillboardEntity({
        //     position: new mars3d.LngLatPoint(116.224399, 30.960459),
        //     style: {
        //       html,
        //       horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //       clampToGround: true,
        //       drawShow: false,
        //       scale: 2.0,
        //       width: 200,
        //       height: 200
        //     },
        //     attrt: {remark: "弹框"}
        //   })
        //   graphicLayer.addGraphic(graphic)
        //   console.log(this.map, graphicLayer)
        // },
        // initGraohicManager(graphic) {
        //   console.log(this.$refs.popup.$el, "ref")
        //   const html = this.$refs.popup.$el.innerHTML
        //   // console.log(html, 'html')
        //   graphic.bindPopup(html).openPopup()
        // }
    },
}
</script>
<style lang="scss" scoped>
.map-box {
    width: 100%;
    height: 100%;
}
#mars3dContainer {
    position: relative;
    width: 100%;
    height: 100%;
    .marsImgPanel2 {
        position: absolute;
        width: 300px;
        height: 300px;
    }
}
</style>
