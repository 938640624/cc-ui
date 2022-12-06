<template>
    <div class="Content">
        <cc-header :headtitle="'cc-ui'" :arrowLeftVisible="false" />
        <div class="cc-content">
            <ccScroll>
                <cc-index-list v-for="(group, index1) in scrollOptions" :key="index1" :group="group">
                    <cc-index-list-item
                        v-for="(itemgroup, index2) in group.items"
                        :key="index2"
                        :item="itemgroup"
                        @event-select-item="handleSelectItem"
                    >
                        <span>
                            <i class="el-icon-arrow-right"></i>
                        </span>
                    </cc-index-list-item>
                </cc-index-list>
            </ccScroll>
        </div>
    </div>
</template>

<script>
import ccHeader from '../components/cc-header/cc-header.vue'
import ccIndexListItem from '../components/cc-index-list/cc-index-list-item.vue'
import CcIndexList from '../components/cc-index-list/cc-index-list.vue'
import ccScroll from '../components/cc-scroll/cc-scroll.vue'
export default {
    name: 'content-demo',
    components: {
        ccScroll,
        ccIndexListItem,
        CcIndexList,
        ccHeader,
    },
    data() {
        return {
            scrollOptions: [
                {
                    name: 'Basic 基础组件',
                    shortcut: 'Basic',
                    items: [
                        {
                            path: '/loading',
                            name: '等待光圈',
                        },
                        {
                            path: '/start-end-time',
                            name: '起止时间表单',
                        },
                    ],
                },
                {
                    name: 'Popup 弹窗组件',
                    shortcut: 'Popup',
                    items: [
                        {
                            path: '/toast',
                            name: 'Toast',
                        },
                        {
                            path: '/action-sheet',
                            name: 'ActionSheet',
                        },
                    ],
                },
                {
                    name: 'Scroll 滚动组件',
                    shortcut: 'Scroll',
                    items: [
                        {
                            path: '/index-list',
                            name: '滚动列表',
                        },
                    ],
                },
                {
                    name: 'indexdemo组件',
                    shortcut: 'IndexDemo',
                    items: [
                        {
                            path: '/index-table',
                            name: '右下拉伸',
                        },
                        {
                            path: '/full-table',
                            name: '全方位拉伸',
                        },
                        {
                            path: '/element-table',
                            name: 'ElementUI拉伸',
                        },
                        {
                            path: '/drag-move',
                            name: '盒子拖拽',
                        },
                        {
                            path: '/echart-broken-line',
                            name: 'echart折线图可设置行数与数据',
                        },
                        {
                            path: '/echart-switch',
                            name: 'echart图表切换',
                        },
                        {
                            path: '/echart-type',
                            name: 'Echart多种表单',
                        },
                        {
                            path: '/animation-all',
                            name: '基础动画大全',
                        },
                        {
                            path: '/color-editor',
                            name: '颜色编辑器',
                        },
                        {
                            path: '/code-mirror',
                            name: '代码编辑器',
                        },
                        {
                            path: '/complex-effect',
                            name: '蛮吊的动画',
                        },
                        {
                            path: '/index-utils',
                            name: '封装工具集合',
                        },
                        {
                            path: '/progress-bar',
                            name: '进度条',
                        },
                    ],
                },
                {
                    name: 'css效果',
                    shortcut: 'css',
                    items: [
                        {
                            path: '/text-ktv',
                            name: '文字ktv',
                        },
                        {
                            path: '/spotlight',
                            name: '聚光灯效果',
                        },
                    ],
                },
                {
                    name: 'canvas动画效果',
                    shortcut: 'canvas',
                    items: [
                        {
                            path: '/canvas-alipay',
                            name: '标靶效果',
                        },
                        {
                            path: '/canvas-color-mouse',
                            name: '鼠标炫彩',
                        },
                    ],
                },
                {
                    name: 'three.js的3D效果',
                    shortcut: 'ThreeJs',
                    items: [
                        {
                            path: '/highlight',
                            name: '呼吸灯高亮',
                        },
                        {
                            path: '/marker',
                            name: '3D标记图标',
                        },
                        {
                            path: '/lathe-model',
                            name: '车削缓冲几何体(视锥)',
                        },
                        {
                            path: '/plane-model',
                            name: '平面缓冲几何体(透明)+光泽地板',
                        },
                        {
                            path: '/local-clipping',
                            name: '裁剪基础图形',
                        },
                        {
                            path: '/expert-clipping',
                            name: '裁剪进阶图形',
                        },
                        {
                            path: '/clip-intersection',
                            name: '裁剪3D交叉球体',
                        },
                        {
                            path: '/clip-advanced',
                            name: '裁剪3D进阶立方体',
                        },
                    ],
                },
                {
                    name: 'cesium的3D效果',
                    shortcut: 'cesium',
                    items: [
                        {
                            path: '/model-move',
                            name: '车辆模型移动',
                        },
                        {
                            path: '/tank-model',
                            name: '坦克模型',
                        },
                        {
                            path: '/mars3d-circlewave',
                            name: '圆圈波浪',
                        },
                    ],
                },
                {
                    name: 'vtk的3D效果',
                    shortcut: 'vtk',
                    items: [
                        {
                            path: '/basic-model',
                            name: 'vtk基础模型',
                        },
                        {
                            path: '/itk-model',
                            name: 'itk模型',
                        },
                        {
                            path: '/more-renderer',
                            name: '多场景渲染',
                        },
                        {
                            path: '/xyz-renderer-views',
                            name: 'xyz轴多场景渲染',
                        },
                        {
                            path: 'axis-rotate-model',
                            name: '小视角旋转模型',
                        },
                    ],
                },
                {
                    name: '高德地图',
                    shortcut: 'Amap',
                    items: [
                        {
                            path: '/basic-Amap',
                            name: '基础地图',
                        },
                    ],
                },
            ],
        }
    },
    mounted() {},
    methods: {
        handleSelectItem(item) {
            this.$router.push({ path: item.path })
        },
    },
}
</script>
<style>
.cc-content {
    background-color: #fff;
}
.el-icon-arrow-right {
    font-weight: 800 !important;
}
</style>
