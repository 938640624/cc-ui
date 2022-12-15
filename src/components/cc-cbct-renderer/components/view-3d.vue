<template>
    <div class="view_3d">
        <div class="container" ref="container"></div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager'
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction'
import vtkColorMaps from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps'

import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction'
export default {
    props: {
        volumes: Array,
    },
    data() {
        return {
            background: [0, 0, 0],
        }
    },
    created() {
        this.genericRenderWindow = null
        // vtkWidgetManager：小部件管理器，调用方法前将小部件链接到视图
        this.widgetManager = vtkWidgetManager.newInstance()
    },
    computed: {
        newImageData() {
            return this.imageData()
        },
    },
    inject: ['imageData'],
    methods: {
        ...mapMutations('three', ['set3DInfo']),
        updateVolumesForRendering(volumes) {
            if (volumes) {
                volumes.forEach((volume) => {
                    if (volume.isA('vtkVolume')) {
                        this.renderer.addVolume(volume)
                    } else {
                        console.warn('DATA is not vtkVolume data')
                    }
                })
            }
        },
    },
    mounted() {
        this.genericRenderWindow = vtkGenericRenderWindow.newInstance({
            background: this.background,
        })
        this.genericRenderWindow.setContainer(this.$refs.container)
        this.renderer = this.genericRenderWindow.getRenderer()
        this.renderWindow = this.genericRenderWindow.getRenderWindow()
        this.widgetManager.setRenderer(this.renderer)
        // this.updateVolumesForRendering(this.volumes)
        this.renderer.resetCamera()
        // updateLightsGeometryToFollowCamera：要求场景中不在世界空间中的灯光（例如，附加到相机的头灯或相机灯）更新它们的几何形状以匹配活动相机
        this.renderer.updateLightsGeometryToFollowCamera()

        window.gen = this.genericRenderWindow
        window.vol = this.volumes[0]
        this.actor = vtkVolume.newInstance()
        this.mapper = vtkVolumeMapper.newInstance()
        // console.log(this.mapper.setInputConnection);
        // this.mapper.setInputConnection()
        this.actor.setMapper(this.mapper)

        this.mapper.setInputData(this.newImageData)

        this.renderer.addVolume(this.actor)
        this.genericRenderWindow.resize()

        // vtkPiecewiseFunction（分段函数）：定义函数分段映射，允许添加控制点，允许用户控制控制点之间的功能
        this.piecewiseFun = vtkPiecewiseFunction.newInstance()
        // ColorTransferFunction（颜色传递函数）：是RGB或HSV空间中的颜色映射，使用分段函数插值修改颜色
        this.lookupTable = vtkColorTransferFunction.newInstance()
        this.lookupTable.applyColorMap(vtkColorMaps.getPresetByName('Cool to Warm'))
        const range = this.newImageData.getPointData().getScalars().getRange()
        // console.log(range);
        // setMappingRange：设置映射范围
        this.lookupTable.setMappingRange(...range)
        this.lookupTable.updateRange()
        for (let i = 0; i <= 4; i++) {
            // addPoint：添加点（x，y坐标）到函数中
            this.piecewiseFun.addPoint(i * 320, i / 4)
        }

        this.actor.getProperty().setRGBTransferFunction(0, this.lookupTable)
        this.actor.getProperty().setScalarOpacity(0, this.piecewiseFun)

        /*  this.setPiecewiseFun(this.piecewiseFun)
      this.setLookupTable(this.lookupTable) */
        this.set3DInfo({
            actor: this.actor,
            renderer: this.renderer,
            renderWindow: this.renderWindow,
            piecewiseFun: this.piecewiseFun,
            lookupTable: this.lookupTable,
            mapper: this.mapper,
            widgetManager: this.widgetManager,
            range: range,
            volumes: this.volumes,
            genericRenderWindow: this.genericRenderWindow,
        })

        // this.mapper.setInputConnection(this.volumes[0]);
        window.imageData = this.newImageData
        this.renderer.resetCamera()
        this.renderWindow.render()
    },
}
</script>

<style scoped lang="scss">
.view_3d {
    width: 50%;
    height: 50%;
    .container {
        width: 100%;
        height: 100%;
    }
}
</style>
