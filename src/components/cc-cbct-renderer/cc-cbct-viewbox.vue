<template>
    <div class="viewbox" v-if="volumes && volumes.length">
        <div class="container" ref="container"></div>
        <MPRInteractor
            :width="width"
            :height="height"
            :xAxis="xAxis"
            :yAxis="yAxis"
            :viewRotation="viewRotation"
            :point="screenCoordSliceIntersection"
            @rotate="onRotate"
            @thickness="onThickness"
            :volumes="volumes"
            :view="views"
            :index="index"
        />
        <ViewportOverlay :voi="voi" :active="isActive" :color="viewColor" />
    </div>
</template>
<script>
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow'
import '@kitware/vtk.js/Rendering/Profiles/Volume'
import vtkCoordinate from '@kitware/vtk.js/Rendering/Core/Coordinate'

import ViewportOverlay from './components/ViewportOverlay.vue'
import MPRInteractor from './components/MPRInteractor.vue'
// vtkImageSlice(图片切片)：为vtk提供2D图像显示支持，与vtkImageSlice道具相关联放置在渲染器中
// import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice'

// vtkImageReslice：图像旋转、缩放和平移；图像中提取切片
// import vtkImageReslice from '@kitware/vtk.js/Imaging/Core/ImageReslice'

import { quat, vec3, mat4 } from 'gl-matrix'
import vtkInteractorStyleMPRSlice from '@/components/cc-cbct-renderer/model/vtkInteractorStyleMPRSlice'
import { degrees2radians } from '@/helper/utils/math'
import { BLEND_MIP, BLEND_MINIP, BLEND_AVG, BLEND_NONE } from '@/components/cc-cbct-renderer/model/consts'
import { createSub } from '@/components/cc-cbct-renderer/model/createSub'
export default {
    components: {
        MPRInteractor,
        ViewportOverlay,
    },
    props: {
        volumes: { type: Array, required: true },
        views: { type: Object, required: true },
        // Front, Side, Top, etc, for which view data to use
        index: String,
        sliceIntersection: {
            type: Array,
            default() {
                return [0, 0, 0]
            },
        },
        onCreated: Function,
    },
    data() {
        return {
            width: 0,
            height: 0,
            renderer: null,
            subs: {
                interactor: createSub(),
                data: createSub(),
            },
        }
    },
    created() {
        this.genericRenderWindow = null
        this.cachedSlicePlane = []
        this.cachedSliceViewUp = []
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize)
        // Delete the render context
        this.genericRenderWindow.delete()

        delete this.genericRenderWindow

        Object.keys(this.subs).forEach((k) => {
            this.subs[k].unsubscribe()
        })
    },
    inject: ['imageData', 'onScrolled', 'getSliceIntersection'],
    computed: {
        newImageData() {
            return this.imageData()
        },
        //     // Cribbed from the index and views
        slicePlaneNormal() {
            return this.views[this.index].slicePlaneNormal
        },
        slicePlaneXRotation() {
            return this.views[this.index].slicePlaneXRotation
        },
        slicePlaneYRotation() {
            return this.views[this.index].slicePlaneYRotation
        },
        sliceViewUp() {
            return this.views[this.index].sliceViewUp
        },
        viewRotation() {
            return this.views[this.index].viewRotation
        },
        sliceThickness() {
            return this.views[this.index].sliceThickness
        },
        window() {
            return this.views[this.index].window
        },
        blendMode() {
            return this.views[this.index].blendMode
        },
        viewColor() {
            return this.views[this.index].color
        },
        isActive() {
            return this.views[this.index].active
        },

        xAxis() {
            switch (this.index) {
                case 'top':
                default:
                    return {
                        color: this.views.front.color,
                        rotation: this.views.front.slicePlaneYRotation,
                        thickness: this.views.front.sliceThickness,
                    }
                case 'left':
                    return {
                        color: this.views.top.color,
                        rotation: this.views.top.slicePlaneXRotation,
                        thickness: this.views.top.sliceThickness,
                    }
                case 'front':
                    return {
                        color: this.views.top.color,
                        rotation: this.views.top.slicePlaneYRotation,
                        thickness: this.views.top.sliceThickness,
                    }
            }
        },
        yAxis() {
            switch (this.index) {
                case 'top':
                default:
                    return {
                        color: this.views.left.color,
                        rotation: this.views.left.slicePlaneYRotation,
                        thickness: this.views.left.sliceThickness,
                    }
                case 'left':
                    return {
                        color: this.views.front.color,
                        rotation: this.views.front.slicePlaneXRotation,
                        thickness: this.views.front.sliceThickness,
                    }
                case 'front':
                    return {
                        color: this.views.left.color,
                        rotation: this.views.left.slicePlaneXRotation,
                        thickness: this.views.left.sliceThickness,
                    }
            }
        },

        screenCoordSliceIntersection() {
            const point3d = this.sliceIntersection
            if (this.renderer) {
                // vtkCoordinate：表示各种坐标系中的位置，并将位置转换到其它坐标系
                const wPos = vtkCoordinate.newInstance()
                // setCoordinateSystemToWorld：设置坐标系到世界
                wPos.setCoordinateSystemToWorld()
                wPos.setValue(point3d)
                // getComputedDisplayValue：获取计算的显示值
                const canvasCoords = wPos.getComputedDisplayValue(this.renderer)
                return canvasCoords
            } else {
                return false
            }
        },
        voi() {
            return {
                windowWidth: this.window.width,
                windowCenter: this.window.center,
            }
        },
    },
    watch: {
        volumes(newVolumes) {
            this.updateVolumesForRendering(newVolumes)
        },
        slicePlaneNormal() {
            this.updateSlicePlane()
        },
        slicePlaneXRotation() {
            this.updateSlicePlane()
        },
        slicePlaneYRotation() {
            this.updateSlicePlane()
        },
        sliceViewUp() {
            this.updateSlicePlane()
        },
        viewRotation() {
            this.updateSlicePlane()
        },
        sliceThickness(thickness) {
            const istyle = this.renderWindow.getInteractor().getInteractorStyle()
            istyle.setSlabThickness && istyle.setSlabThickness(thickness)
            this.updateBlendMode(thickness)
        },

        blendMode() {
            this.updateBlendMode(this.sliceThickness)
        },
        parallel(p) {
            this.renderer.getActiveCamera().setParallelProjection(p)
        },
    },
    methods: {
        initView() {
            this.cachedSlicePlane = [...this.slicePlaneNormal]
            this.cachedSliceViewUp = [...this.sliceViewUp]
            // vtkGenericRenderWindow(通用渲染窗口)：提供了使用自己的openGL上下文和可绘制对象实现渲染窗口的框架
            this.genericRenderWindow = vtkGenericRenderWindow.newInstance({
                background: [0, 0, 0],
            })
            this.genericRenderWindow.setContainer(this.$refs.container)
            this.renderWindow = this.genericRenderWindow.getRenderWindow()
            this.renderer = this.genericRenderWindow.getRenderer()
            if (this.parallel) {
                this.renderer.getActiveCamera().setParallelProjection(true)
            }
            // 更新视图节点树，以便vtkOpenGLHardwareSelector可以访问vtkOpenGLRenderer实例
            const oglrw = this.genericRenderWindow.getOpenGLRenderWindow()
            // buildPass：自我构建
            oglrw.buildPass(true)
            // InteractorStyleMPRSlice：交互机样式通过相机、目标图像的体积和相机裁剪屏幕执行MPR,不会手动计算图像重新切片
            const istyle = vtkInteractorStyleMPRSlice.newInstance()
            const inter = this.renderWindow.getInteractor()
            inter.setInteractorStyle(istyle)
            const istyleVolumeMapper = this.volumes[0].getMapper()

            // const imageReslice = vtkImageReslice.newInstance()
            // imageReslice.setInputData(this.newImageData)
            // // imageReslice.setSlabNumberOfSlices(2)
            // imageReslice.setOutputDimensionality(2)
            // const axes = mat4.identity(new Float64Array(16))
            // mat4.rotateX(axes, axes, (45 * Math.PI) / 180)
            // imageReslice.setResliceAxes(axes)
            // imageReslice.setOutputScalarType('Uint16Array')
            // imageReslice.setScalarScale(65535 / 255)
            // istyleVolumeMapper.setInputConnection(imageReslice.getOutputPort())

            istyle.setVolumeMapper(istyleVolumeMapper)
            // getSliceRange：检索切片的最小和最大可能值
            const range = istyle.getSliceRange()
            // console.log(range, 'range')
            istyle.setSlice((range[0] + range[1]) / 2)

            // 将当前volume添加到VTK渲染器
            this.updateVolumesForRendering(this.volumes)
            this.updateSlicePlane()

            // 强制初始绘制将画布设置为父边界
            this.onResize()
            if (this.onCreated) {
                this.onCreated({
                    genericRenderWindow: this.genericRenderWindow,
                    widgetManager: this.widgetManager,
                    container: this.$refs.container,
                    widgets: [],
                    volumes: [...this.volumes],
                    _component: this,
                })
            }
        },
        // 将事件传递给父节点，包括它们来自的视图
        onRotate(axis, angle) {
            this.$emit('rotate', this.index, axis, angle)
            // console.log(axis, angle, this.index, 'angle')
        },
        onThickness(axis, thickness) {
            this.$emit('thickness', this.index, axis, thickness)
        },

        onResize() {
            this.genericRenderWindow.resize()
            const [width, height] = [this.$refs.container.offsetWidth, this.$refs.container.offsetHeight]
            this.width = width
            this.height = height
        },

        updateVolumesForRendering(volumes) {
            if (!this.renderer) return
            this.renderer.removeAllVolumes()
            if (volumes && volumes.length) {
                volumes.forEach((volume) => {
                    if (!volume.isA('vtkVolume')) {
                        console.warn('Data to <Vtk2D> is not vtkVolume data')
                    } else {
                        this.renderer.addVolume(volume)
                    }
                })
            }
            this.renderWindow.render()
        },
        updateSlicePlane() {
            // 旋转平面外积的向量，视其为X分量
            let sliceXRotVector = []
            vec3.cross(sliceXRotVector, this.sliceViewUp, this.slicePlaneNormal)
            vec3.normalize(sliceXRotVector, sliceXRotVector)
            // 旋转viewUp向量作为Y分量
            let sliceYRotVector = this.sliceViewUp
            const planeMat = mat4.create()
            mat4.rotate(planeMat, planeMat, degrees2radians(this.slicePlaneYRotation), sliceYRotVector)
            mat4.rotate(planeMat, planeMat, degrees2radians(this.slicePlaneXRotation), sliceXRotVector)
            vec3.transformMat4(this.cachedSlicePlane, this.slicePlaneNormal, planeMat)
            // 旋转viewUp 90度增量
            const viewRotQuat = quat.create()
            // 使用角度，因为旋转轴实际上应该是投影的方向，这是平面norma的负数
            // setAxisAngle：从给定的角度和旋转轴设置一个 quat，然后返回它
            quat.setAxisAngle(viewRotQuat, this.cachedSlicePlane, degrees2radians(-this.viewRotation))
            // normalize：归一化，返回单位向量
            quat.normalize(viewRotQuat, viewRotQuat)
            // 用x和z旋转ViewUp
            const xQuat = quat.create()
            quat.setAxisAngle(xQuat, sliceXRotVector, degrees2radians(this.slicePlaneXRotation))
            quat.normalize(xQuat, xQuat)
            const viewUpQuat = quat.create()
            quat.add(viewUpQuat, xQuat, viewRotQuat)
            vec3.transformQuat(this.cachedSliceViewUp, this.sliceViewUp, viewRotQuat)
            // 更新视图的切片
            const renderWindow = this.genericRenderWindow.getRenderWindow()
            const istyle = renderWindow.getInteractor().getInteractorStyle()
            if (istyle && istyle.setSliceNormal) {
                istyle.setSliceNormal(this.cachedSlicePlane, this.cachedSliceViewUp, this.onScrolled())
            }
            renderWindow.render()
        },

        updateBlendMode(thickness) {
            if (thickness >= 1) {
                switch (this.blendMode) {
                    // 设置mapper模式
                    case BLEND_MIP:
                        this.volumes[0].getMapper().setBlendModeToMaximumIntensity()
                        break
                    case BLEND_MINIP:
                        this.volumes[0].getMapper().setBlendModeToMinimumIntensity()
                        break
                    case BLEND_AVG:
                        this.volumes[0].getMapper().setBlendModeToAverageIntensity()
                        break
                    case BLEND_NONE:
                    default:
                        this.volumes[0].getMapper().setBlendModeToComposite()
                        break
                }
            } else {
                this.volumes[0].getMapper().setBlendModeToComposite()
            }
            this.renderWindow.render()
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        setTimeout(() => {
            this.initView()
        }, 300)
    },
}
</script>
<style scoped lang="scss">
.viewbox,
.container {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
