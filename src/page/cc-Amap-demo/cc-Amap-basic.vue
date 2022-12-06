<template>
    <div class="cc-Amap-basic">
        <cc-header :headtitle="'basic(基础地图)'" />
        <cc-scroll>
            <div class="map-box">
                <div id="AmapContainer"></div>
                <div class="map-tip">
                    <div>当前级别：{{ mapZoom }}</div>
                    <div>当前中心点：{{ mapCenter }}</div>
                </div>
            </div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-Amap-basic'
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: '160c098829d44f84448b2f16b5ea48d7',
}
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
    },
    props: {},
    data() {
        return {
            AMap: null,
            map: null,
            mapZoom: null,
            mapCenter: null,
        }
    },
    mounted() {
        this.initMap()
    },
    methods: {
        async initMap() {
            this.AMap = await AMapLoader.load({
                key: '4c8f2e8ddb619a86bb3e4e5631c80ec6',
                version: '2.0',
                plugin: ['AMap.Scale'],
            })
            this.mapCenter = [106.491236, 29.626339]
            this.mapZoom = 17.5
            this.map = new this.AMap.Map('AmapContainer', {
                viewMode: '2D',
                zoom: this.mapZoom,
                center: this.mapCenter,
                resizeEnable: true,
            })
            this.map.on('zoomend', this.handleMapChange)
            this.map.on('moveend', this.handleMapChange)
            this.initMapMarker()
        },

        handleMapChange() {
            this.mapZoom = this.map.getZoom()
            this.mapCenter = this.map.getCenter()
        },

        initMapMarker() {
            const marker = new this.AMap.Marker({
                position: [106.490824, 29.626509],
            })
            this.map.add(marker)
        },
    },
}
</script>
<style lang="scss" scoped>
.map-box {
    position: relative;
    width: 100%;
    height: 100%;
    #AmapContainer {
        width: 100%;
        height: 100%;
    }
    .map-tip {
        position: absolute;
        top: 30px;
        right: 30px;
        background-color: #ffffff;
        padding: 20px;
    }
}
</style>
