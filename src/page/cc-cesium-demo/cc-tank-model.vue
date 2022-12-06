<template>
    <div class="cc-tank-model-page">
        <cc-header :headtitle="'TankModel(坦克模型)'" />
        <cc-scroll>
            <div class="map-box">
                <div id="cesiumContainer"></div>
            </div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-tank-model-page'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
        // CesiumViewer
    },
    props: {},
    data() {
        return {}
    },
    mounted() {
        this.initView()
    },
    methods: {
        initView() {
            const vmodels = Cesium.createDefaultImageryProviderViewModels()
            const token = '0b018552994f71a9467d24461a8f8238'
            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjQ0Mjg3Yy05ZDcxLTQyZDAtYTY3Yy03YmI0MDM3MDZhMjgiLCJpZCI6NzI3NjQsImlhdCI6MTYzNjM2MDU3MH0.yEsenwMWNDoP9-4CoT77mLJpJNJKtbiDSaD9jiv5O8s'
            const viewer = new Cesium.Viewer('cesiumContainer', {
                geocoder: true,
                homeButton: true,
                sceneModePicker: true,
                baseLayerPicker: true,
                navigationHelpButton: true,
                animation: true,
                timeline: true,
                fullscreenButton: true,
                vrButton: true,
                shadows: true,
                shouldAnimate: true,
                imageryProviderViewModels: vmodels,
                selectedImageryProviderViewModel: vmodels[1],
            })
            viewer.scene.globe.depthTestAgainstTerrain = true
            viewer.scene.debugShowFramesPerSecond = true // 显示帧速(fps)
            var longitude = -2.1480545852753163
            var latitude = 0.7688240036937101
            // vue中使用glb,gltf格式的图片，需要放在public中的models下，webpack才能打包完成
            var entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromRadians(longitude, latitude),
                model: {
                    uri: '/models/GroundVehicle.glb',
                    scale: 1,
                },
                name: 'tank',
            })
            viewer.trackedEntity = entity
        },
    },
}
</script>
<style lang="scss" scoped>
.map-box {
    width: 100%;
    height: 100%;
}
#cesiumContainer {
    width: 100%;
    height: 100%;
}
</style>
