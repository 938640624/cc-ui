<template>
    <div class="cc-cbct-view">
        <div class="view-left">
            <div v-for="(view, key) in viewDataArray" :key="key" class="view-box">
                <cc-cbct-viewbox
                    :volumes="volumes"
                    :sliceIntersection.sync="sliceIntersection"
                    :views="viewDataArray"
                    :onCreated="saveComponentRefGenerator(key)"
                    :index="key"
                    @rotate="onRotate"
                    @thickness="onThickness"
                />
            </div>
            <view-3d :volumes="volumes"></view-3d>
        </div>
        <div class="view-right">
            <el-tabs v-model="selectedTab" stretch>
                <el-tab-pane label="TOOL" name="tool">
                    <div>{{ sliceIntersection }}</div>
                    <el-button :class="activeTool === 'SELECT' ? 'active-btn' : ''" @click="selectTool('SELECT')">
                        SELECT
                    </el-button>
                    <el-button :class="activeTool === 'LEVEL' ? 'active-btn' : ''" @click="selectTool('LEVEL')">
                        LEVEL
                    </el-button>
                    <el-button :class="activeTool === 'DISTANCE' ? 'active-btn' : ''" @click="selectTool('DISTANCE')">
                        DISTANCE
                    </el-button>
                </el-tab-pane>
                <el-tab-pane label="DATA" name="data">
                    <PiecewiseGaussian></PiecewiseGaussian>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import view3d from './components/view-3d.vue'
import ccCbctViewbox from './cc-cbct-viewbox.vue'
// import ccSliderScroll from '@/components/cc-slider-scroll/cc-slider-scroll.vue'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
// import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice'
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane'
import PiecewiseGaussian from '@/components/cc-cbct-renderer/components/PiecewiseGaussian'
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder'
import vtkCoordinate from '@kitware/vtk.js/Rendering/Core/Coordinate'
// vtkImageReslice：图像旋转、缩放和平移；图像中提取切片
import vtkImageReslice from '@kitware/vtk.js/Imaging/Core/ImageReslice'
import { mat4 } from 'gl-matrix'

import vtkInteractorStyleMPRWindowLevel from '@/components/cc-cbct-renderer/model/vtkInteractorStyleMPRWindowLevel'
import vtkInteractorStyleMPRCrosshairs from '@/components/cc-cbct-renderer/model/vtkInteractorStyleMPRCrosshairs.js'
export default {
    components: {
        ccCbctViewbox,
        // ccSliderScroll,
        view3d,
        PiecewiseGaussian,
    },
    data() {
        return {
            showDistance: false,
            selectedTab: 'tool',
            volumes: [],
            components: [],
            focusedWidgetId: null,
            activeTool: 'LEVEL',
            loading: true,
            sliceIntersection: [0, 0, 0],
            // TODO: refactor into prop.
            syncWindowLevels: true,
            top: {
                color: '#f00',
                slicePlaneNormal: [0, 0, -1],
                sliceViewUp: [0, -1, 0],
                slicePlaneXRotation: 0,
                slicePlaneYRotation: 0,
                viewRotation: 0,
                sliceThickness: 0.1,
                blendMode: 'none',
                window: {
                    width: 0,
                    center: 0,
                },
            },
            left: {
                color: '#0f0',
                slicePlaneNormal: [1, 0, 0],
                sliceViewUp: [0, 0, -1],
                slicePlaneXRotation: 0,
                slicePlaneYRotation: 0,
                viewRotation: 0,
                sliceThickness: 0.1,
                blendMode: 'none',
                window: {
                    width: 0,
                    center: 0,
                },
            },
            front: {
                color: '#00f',
                slicePlaneNormal: [0, -1, 0],
                sliceViewUp: [0, 0, -1],
                slicePlaneXRotation: 0,
                slicePlaneYRotation: 0,
                viewRotation: 0,
                sliceThickness: 0.1,
                blendMode: 'none',
                window: {
                    width: 0,
                    center: 0,
                },
            },
            three: {},
        }
    },
    computed: {
        newImageData() {
            return this.imageData()
        },
        viewDataArray() {
            return { top: this.top, left: this.left, front: this.front }
        },
    },
    provide() {
        return {
            getSliceIntersection: this.getSliceIntersection,
            onScrolled: this.onScrolled,
            getRenderWindow: this.getRenderWindow,
        }
    },
    inject: ['imageData'],
    methods: {
        initView() {
            const volumeActor = vtkVolume.newInstance()
            // vtkVolumeMapper继承自mapper，使用片段程序在GPU上执行光线投射的体积映射器
            const volumeMapper = vtkVolumeMapper.newInstance()

            // 设置用于渲染的样本之间的距离
            volumeMapper.setSampleDistance(1)
            volumeActor.setMapper(volumeMapper)
            volumeMapper.setInputData(this.newImageData)

            const imageReslice = vtkImageReslice.newInstance()
            imageReslice.setSlabMode(2)
            imageReslice.setAutoCropOutput(true)
            imageReslice.setInputData(this.newImageData)
            imageReslice.setSlabNumberOfSlices(2)
            // imageReslice.setOutputDimensionality(2)
            const axes = mat4.identity(new Float64Array(16))
            mat4.rotateX(axes, axes, (45 * Math.PI) / 180)
            imageReslice.setResliceAxes(axes)
            imageReslice.setBackgroundColor([0, 0, 0])
            imageReslice.setOutputScalarType('Uint16A/rray')
            // imageReslice.setScalarScale(65535 / 255)
            // console.log(imageReslice, 'getState')
            // console.log('getResliceAxes', imageReslice.getSlabMode())
            volumeMapper.setInputConnection(imageReslice.getOutputPort())

            const rgbTransferFunction = volumeActor
                // getProperty 获取actors表面属性的属性对象，是vtkProperty对象的实例
                .getProperty()
                .getRGBTransferFunction(0)
            rgbTransferFunction.setMappingRange(500, 3000)
            // 设置view-box的中心点和宽度
            Object.values(this.viewDataArray).forEach((view) => {
                view.window.center = 500
                view.window.width = 3000
            })
            this.sliceIntersection = this.getVolumeCenter(volumeMapper)
            this.volumes = [volumeActor]
        },

        onScrolled() {
            // console.log('scroll')
            const planes = []
            Object.values(this.components).forEach((component) => {
                const camera = component.genericRenderWindow.getRenderer().getActiveCamera()
                planes.push({
                    // getFocalPoint：获取相机在世界坐标中的焦点
                    position: camera.getFocalPoint(),
                    // getDirectionOfProjection：获取从相机位置到焦点方向的矢量
                    normal: camera.getDirectionOfProjection(),
                })
            })
            const newPoint = this.getPlaneIntersection(...planes)
            // console.log(planes, 'planes', newPoint, 'newPoint')
            // console.log(this.newImageData, 'newImageData')
            if (!Number.isNaN(newPoint)) {
                this.sliceIntersection = newPoint
            }
            return newPoint
        },

        saveComponentRefGenerator(viewportIndex) {
            return (component) => {
                this.setWindowCenter([viewportIndex, component])
                this.setLevelTool([viewportIndex, component])
            }
        },

        onRotate(index, axis, angle) {
            switch (index) {
                case 'top':
                    if (axis === 'x') this.front.slicePlaneYRotation = angle
                    else if (axis === 'y') this.left.slicePlaneYRotation = angle
                    break
                case 'left':
                    if (axis === 'x') this.top.slicePlaneXRotation = angle
                    else if (axis === 'y') this.front.slicePlaneXRotation = angle
                    break
                case 'front':
                    if (axis === 'x') this.top.slicePlaneYRotation = angle
                    else if (axis === 'y') this.left.slicePlaneXRotation = angle
                    break
            }
        },

        onThickness(index, axis, thickness) {
            const shouldBeMIP = thickness > 1
            let view
            switch (index) {
                case 'top':
                    if (axis === 'x') view = this.front
                    else if (axis === 'y') view = this.left
                    break
                case 'left':
                    if (axis === 'x') view = this.top
                    else if (axis === 'y') view = this.front
                    break
                case 'front':
                    if (axis === 'x') view = this.top
                    else if (axis === 'y') view = this.left
                    break
            }
            view.sliceThickness = thickness
            if (shouldBeMIP && view.blendMode === 'none') view.blendMode = 'MIP'
        },

        onCrosshairPointSelected({ index, worldPos }) {
            Object.entries(this.components).forEach(([viewportIndex, component]) => {
                if (viewportIndex !== index) {
                    const renderWindow = component.genericRenderWindow.getRenderWindow()
                    const istyle = renderWindow.getInteractor().getInteractorStyle()
                    const sliceNormal = istyle.getSliceNormal()
                    // vtkMatrixBuilder：提供创建mat4转换矩阵的系统，返回matrixBuilder Object实例
                    const transform = vtkMatrixBuilder
                        .buildFromDegree()
                        // identity：将matrixBuilder重置为单位矩阵
                        .identity()
                        // 将当前矩阵与转换矩阵相乘，该转换矩阵归一化
                        .rotateFromDirections(sliceNormal, [1, 0, 0])

                    const mutatedWorldPos = worldPos.slice()
                    transform.apply(mutatedWorldPos)
                    const slice = mutatedWorldPos[0]
                    istyle.setSlice(slice)
                    renderWindow.render()
                }

                // TODO: 未添加到视图中，暂时发现未生效
                const wPos = vtkCoordinate.newInstance()
                wPos.setCoordinateSystemToWorld()
                if (!Array.isArray(worldPos)) {
                    //hack by lyx ，vtkjs版本问题，要求必须是一个Array
                    worldPos = [...worldPos]
                }
                wPos.setValue(worldPos)
                console.log(wPos.getValue(), 'wPos')
            })
        },

        // 设置初始窗口调平
        setWindowCenter([viewportIndex, component]) {
            // console.log(viewportIndex, component, 'component')
            this.components[viewportIndex] = component
            const { windowWidth, windowCenter } = this.getVOI(component.volumes[0])
            this[viewportIndex].windowWidth = windowWidth
            this[viewportIndex].windowCenter = windowCenter
            const renderWindow = component.genericRenderWindow.getRenderWindow()
            renderWindow.getInteractor().getInteractorStyle().setVolumeMapper(null)
            renderWindow.render()
        },

        setLevelTool([viewportIndex, component]) {
            const istyle = vtkInteractorStyleMPRWindowLevel.newInstance()
            istyle.setOnScroll(this.onScrolled)
            istyle.setOnLevelsChanged((levels) => {
                this.updateLevels({ ...levels, index: viewportIndex })
            })
            this.setInteractor(component, istyle)
        },

        setCrosshairTool([viewportIndex, component]) {
            const istyle = vtkInteractorStyleMPRCrosshairs.newInstance()
            istyle.setOnScroll(this.onScrolled)
            istyle.setOnClickCallback(({ worldPos }) =>
                this.onCrosshairPointSelected({ worldPos, index: viewportIndex })
            )
            this.setInteractor(component, istyle)
        },

        // 设置新的交互器
        setInteractor(component, istyle) {
            const renderWindow = component.genericRenderWindow.getRenderWindow()
            //我们假设旧的样式总是从MPRSlice样式扩展而来
            const oldStyle = renderWindow.getInteractor().getInteractorStyle()
            renderWindow.getInteractor().setInteractorStyle(istyle)
            istyle.setInteractor(renderWindow.getInteractor())
            const inter = renderWindow.getInteractor()
            inter.setInteractorStyle(istyle)
            // 将以前的交互器样式复制到新的交互器中
            if (istyle.setSliceNormal && oldStyle.getSliceNormal()) {
                istyle.setSliceNormal(oldStyle.getSliceNormal(), oldStyle.getViewUp(), [0, 0, 0])
            }
            if (istyle.setSlabThickness && oldStyle.getSlabThickness()) {
                istyle.setSlabThickness(oldStyle.getSlabThickness())
            }
            istyle.setVolumeMapper(component.volumes[0])
        },

        selectTool(tool) {
            this.activeTool = tool
            switch (tool) {
                case 'LEVEL':
                    Object.entries(this.components).forEach(([key, value]) => {
                        this.setWindowCenter([key, value])
                        this.setLevelTool([key, value])
                    })
                    this.$store.commit('setDrawRuler', false)
                    break
                case 'SELECT':
                    Object.entries(this.components).forEach(this.setCrosshairTool)
                    this.$store.commit('setDrawRuler', false)
                    break
                case 'DISTANCE':
                    this.$store.commit('setDrawRuler', !this.$store.state.distance)
                    break
            }
        },

        updateLevels({ windowCenter, windowWidth, index }) {
            this[index].window.center = windowCenter
            this[index].window.width = windowWidth
            if (this.syncWindowLevels) {
                Object.entries(this.components)
                    .filter(([key]) => key !== index)
                    .forEach(([key, component]) => {
                        this[key].window.center = windowCenter
                        this[key].window.width = windowWidth
                        component.genericRenderWindow
                            .getInteractor()
                            .getInteractorStyle()
                            .setWindowLevel(windowWidth, windowCenter)
                        component.genericRenderWindow.getRenderWindow().render()
                    })
            }
        },

        getRenderWindow(index) {
            return this.components[index].genericRenderWindow
        },

        getSliceIntersection() {
            return this.sliceIntersection
        },

        getPlaneIntersection(plane1, plane2, plane3) {
            try {
                // intersectWithPlane：给定由法线n0和n1以及原点p0和p1定义的平面，计算平面交点的线，返回一个对象
                let line = vtkPlane.intersectWithPlane(plane1.position, plane1.normal, plane2.position, plane2.normal)
                if (line.intersection) {
                    const { l0, l1 } = line
                    // intersectWithLine：给定一条由两点定义的直线，和法线n和点p0定义的平面，计算交点，返回对象
                    const intersectionLocation = vtkPlane.intersectWithLine(l0, l1, plane3.position, plane3.normal)
                    if (intersectionLocation.intersection) {
                        return intersectionLocation.x
                    }
                }
            } catch (err) {
                // console.log('some issue calculating the plane intersection')
            }
            return NaN
        },

        getVolumeCenter(volumeMapper) {
            // 获取此映射器的边界作为 [xmin, xmax, ymin, ymax,zmin, zmax]
            const bounds = volumeMapper.getBounds()
            return [(bounds[0] + bounds[1]) / 2.0, (bounds[2] + bounds[3]) / 2.0, (bounds[4] + bounds[5]) / 2.0]
        },

        getVOI(volume) {
            const rgbTransferFunction = volume.getProperty().getRGBTransferFunction(0)
            const range = rgbTransferFunction.getMappingRange()
            const windowWidth = range[0] + range[1]
            const windowCenter = range[0] + windowWidth / 2
            return {
                windowCenter,
                windowWidth,
            }
        },
    },
    mounted() {
        this.resizeFunction = () => {
            window.setTimeout(() => {
                this.onScrolled()
            }, 10)
        }
        window.addEventListener('resize', this.resizeFunction)
        this.initView()
    },
}
</script>
<style lang="scss" scoped>
.cc-cbct-view {
    width: 100%;
    height: 100%;
    display: flex;
    margin: 0;
    .view-left {
        width: calc(100% - 410px);
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        .view-box {
            position: relative;
            width: 50%;
            height: 50%;
        }
    }
    .view-right {
        width: 410px;
        height: 100%;
        .active-btn {
            color: #409eff;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
        }
    }
}
</style>
