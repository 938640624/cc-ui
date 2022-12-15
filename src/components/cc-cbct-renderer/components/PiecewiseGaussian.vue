<template>
    <div class="pwg">
        <el-select v-model="seletedColor" placeholder="请选择">
            <el-option v-for="item in colorMaps" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
        <div class="container" ref="container"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps'
import vtkPiecewiseGaussianWidget from '@kitware/vtk.js/Interaction/Widgets/PiecewiseGaussianWidget'

export default {
    data() {
        return {
            seletedColor: 'Warm to Cool',
            colorMaps: [],
            style: {
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                histogramColor: 'rgba(100, 100, 100, 0.5)',
                strokeColor: 'rgb(0, 0, 0)',
                activeColor: 'rgb(255, 255, 255)',
                handleColor: 'rgb(50, 150, 50)',
                buttonDisableFillColor: 'rgba(255, 255, 255, 0.5)',
                buttonDisableStrokeColor: 'rgba(0, 0, 0, 0.5)',
                buttonStrokeColor: 'rgba(0, 0, 0, 1)',
                buttonFillColor: 'rgba(255, 255, 255, 1)',
                strokeWidth: 2,
                activeStrokeWidth: 3,
                buttonStrokeWidth: 1.5,
                handleWidth: 3,
                iconSize: 0, // Can be 0 if you want to remove buttons (dblClick for (+) / rightClick for (-))
                padding: 10,
            },
        }
    },
    computed: {
        ...mapState({
            lookupTable: (state) => state.three.threeInfo.lookupTable,
            piecewiseFun: (state) => state.three.threeInfo.piecewiseFun,
            renderWindow: (state) => state.three.threeInfo.renderWindow,
        }),
    },
    watch: {
        seletedColor(n) {
            console.log(n, 'seletedColor')
            this.changePreset(n)
        },
        lookupTable(n) {
            console.log(n, 'lookupTable')
            if (n) {
                this.init()
            }
        },
    },

    methods: {
        init() {
            // vtkPiecewiseGaussianWidget（高斯小部件）：与鼠标或触摸设备一起使用
            this.widget = vtkPiecewiseGaussianWidget.newInstance({
                numberOfBins: 256,
                size: [400, 150],
            })
            this.widget.applyOpacity(this.piecewiseFun)
            this.widget.updateStyle(this.style)
            this.widget.setColorTransferFunction(this.lookupTable)
            // vtkColorMaps：表示预设颜色映射的全局注册表
            this.colorMaps = [].concat(vtkColorMaps.rgbPresetNames)
            this.widget.addGaussian(0.75, 1, 0.3, 0, 0)

            this.widget.setContainer(this.$refs.container)
            this.widget.bindMouseListeners()
            this.lookupTable.onModified(() => {
                this.widget.render()
                this.renderWindow.render()
            })

            this.widget.onAnimation((start) => {
                if (start) {
                    this.renderWindow.getInteractor().requestAnimation(this.widget)
                } else {
                    this.renderWindow.getInteractor().cancelAnimation(this.widget)
                }
            })

            this.widget.onOpacityChange(() => {
                this.widget.applyOpacity(this.piecewiseFun)
                if (!this.renderWindow.getInteractor().isAnimating()) {
                    this.renderWindow.render()
                }
            })
        },
        changePreset(name) {
            this.lookupTable.applyColorMap(vtkColorMaps.getPresetByName(name))
            this.lookupTable.updateRange()
        },
    },
}
</script>

<style scoped lang="scss">
.container {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 5px;
}
</style>
