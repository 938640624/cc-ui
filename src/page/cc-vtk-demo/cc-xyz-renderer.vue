<template>
    <div class="xyz-renderer-page">
        <cc-header :headtitle="'xyzRenderer(xyz轴多场景渲染)'" />
        <cc-scroll>
            <div class="vtkDiv"></div>
            <el-button type="primary" class="reset-btn">重置页面</el-button>
        </cc-scroll>
    </div>
</template>
<script>
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'

import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader'
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper'
import vtkImageReslice from '@kitware/vtk.js/Imaging/Core/ImageReslice'
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice'

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow'
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera'
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage'

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkAnnotatedCubeActor from '@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkOutlineFilter from '@kitware/vtk.js/Filters/General/OutlineFilter'
import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget'
import vtkResliceCursorWidget from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget'
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager'

import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource'
import { CaptureOn } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants'
import { SlabMode } from '@kitware/vtk.js/Imaging/Core/ImageReslice/Constants'
import { xyzToViewType } from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget/Constants'
// 强制加载HttpDataAccessHelper以支持gzip解压缩
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper'

// 加载我们想要使用的渲染片段（对于 WebGL 和 WebGPU）
import '@kitware/vtk.js/favicon'
import '@kitware/vtk.js/Rendering/Profiles/All'
import { VIEW_COLORS } from '@/page/cc-vtk-demo/constant'
export default {
    name: 'xyz-renderer-page',
    components: {
        ccScroll,
        ccHeader,
    },
    data() {
        return {
            // itkLoadedPromise: 3,
        }
    },
    methods: {
        // DataArray：vtkDataArray 是包含数值数据的数据数组对象的抽象超类
        // PolyData：vtkPolyData是一个数据集，它表示由顶点、直线、多边形和/或条带组成的几何结构
        // Glyph3DMapper：使用 vtkGlyph3DMapper 特性来装饰给定对象（publicAPI+model）的方法
        initView() {
            // 找到div标签
            const vtkContainer = document.querySelector('.vtkDiv')
            const __BASE_PATH__ = 'https://kitware.github.io/vtk-js'

            const viewAttributes = []
            let widget, widgetState, initialPlanesState, view3D

            main() // 主函数允许

            function main() {
                initCursorWidget() // 设置切片游标
                initGenericRenderer() // 渲染窗口操作
                initHttpReader() // 获取http上下文资源
                initSetCursor() // 设置小部件
                initResetBtn() // 设置重置按钮
            }

            function initCursorWidget() {
                // ResliceCursorWidget 用于图像视图上沿着横截面对数据进行重新切片
                widget = vtkResliceCursorWidget.newInstance()
                // getWidgetState 获取所有用于更新表示和进行重新切片计算的属性对象
                widgetState = widget.getWidgetState()
                // keepOrthogonality ture：一个轴旋转，关联的轴旋转同一轴保持正交性 false：xuanz
                widgetState.setKeepOrthogonality(true)
                widgetState.setOpacity(0.6)
                // sphereRadius：管理旋转点的半径
                widgetState.setSphereRadius(10)
                widgetState.setLineThickness(5)
                initialPlanesState = { ...widgetState.getPlanes() }
            }

            function initGenericRenderer() {
                for (let i = 0; i < 4; i++) {
                    const element = document.createElement('div')
                    element.setAttribute('class', 'view')
                    element.style.width = '50%'
                    element.style.height = '300px'
                    element.style.display = 'inline-block'
                    vtkContainer.appendChild(element)

                    // vtkGenericRenderWindow：设置OpenGL上下文和可绘制对象渲染窗口
                    const grw = vtkGenericRenderWindow.newInstance()
                    grw.setContainer(element)
                    grw.resize()
                    const obj = {
                        renderWindow: grw.getRenderWindow(),
                        renderer: grw.getRenderer(),
                        GLWindow: grw.getOpenGLRenderWindow(),
                        interactor: grw.getInteractor(),
                        // vtkWidgetManager：小部件管理器，调用方法前将小部件链接到视图
                        widgetManager: vtkWidgetManager.newInstance(),
                        orientationWidget: null,
                    }
                    // setParallelProjection：设置平行投影的值
                    obj.renderer.getActiveCamera().setParallelProjection(true)
                    obj.renderer.setBackground(...VIEW_COLORS[i])
                    obj.renderWindow.addRenderer(obj.renderer)
                    obj.renderWindow.addView(obj.GLWindow)
                    obj.renderWindow.setInteractor(obj.interactor)
                    obj.interactor.setView(obj.GLWindow)
                    obj.interactor.initialize() // initialize: 视图初始化
                    obj.interactor.bindEvents(element)
                    obj.widgetManager.setRenderer(obj.renderer)
                    if (i < 3) {
                        // setInteractorStyle：操纵杆 / 轨迹球 / 新之间的外部切换
                        obj.interactor.setInteractorStyle(vtkInteractorStyleImage.newInstance())
                        // xyzToViewType：xyz轴的小部件
                        obj.widgetInstance = obj.widgetManager.addWidget(widget, xyzToViewType[i])
                        obj.widgetInstance.setScaleInPixels(true)
                        obj.widgetInstance.setRotationHandlePosition(0.75)
                        obj.widgetManager.enablePicking()
                        // 用于在移动角色时更新所有渲染器缓冲区
                        obj.widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE)
                    } else {
                        obj.interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
                    }
                    // imageReslice：图像旋转、缩放和平移；图像中提取切片；
                    obj.reslice = vtkImageReslice.newInstance()
                    obj.reslice.setSlabMode(SlabMode.MEAN)
                    obj.reslice.setSlabNumberOfSlices(1)
                    // TransformInputSampling：默认输入间距原点范围是否根据方向余弦等原点转换而来
                    obj.reslice.setTransformInputSampling(false)
                    // AutoCropOutput：true：确保输出范围足够大，不会裁剪任何数据
                    obj.reslice.setAutoCropOutput(true)
                    // OutputDimensionality：强制输入的维度，0123，默认为3
                    obj.reslice.setOutputDimensionality(2)
                    // vtkImageMapper：提供二维图像显示支持,类似于mapper
                    obj.resliceMapper = vtkImageMapper.newInstance()
                    obj.resliceMapper.setInputConnection(obj.reslice.getOutputPort())
                    // vtkImageSlice：提供二维图像显示支持，类似于actor
                    obj.resliceActor = vtkImageSlice.newInstance()
                    obj.resliceActor.setMapper(obj.resliceMapper)
                    obj.sphereActors = []
                    obj.sphereSources = []

                    // 为每个2D视图创建球体，将在3D中显示
                    // 定义用于重新剪切卷的平面的原点、点1和点2,视图的左上下和右下原点
                    for (let j = 0; j < 3; j++) {
                        const sphere = vtkSphereSource.newInstance()
                        sphere.setRadius(10)
                        const mapper = vtkMapper.newInstance()
                        mapper.setInputConnection(sphere.getOutputPort())
                        const actor = vtkActor.newInstance()
                        actor.setMapper(mapper)
                        actor.getProperty().setColor(...VIEW_COLORS[i])
                        actor.setVisibility(true)
                        obj.sphereActors.push(actor)
                        obj.sphereSources.push(sphere)
                    }

                    if (i < 3) {
                        viewAttributes.push(obj)
                    } else {
                        view3D = obj
                    }

                    // vtkAnnotatedCubeActor：特性装饰，
                    const axes = vtkAnnotatedCubeActor.newInstance()
                    axes.setDefaultStyle({
                        text: '+X',
                        fontStyle: 'bold',
                        fontFamily: 'Arial',
                        fontColor: 'black',
                        fontSizeScale: (res) => res / 2,
                        faceColor: createRGBStringFromRGBValues(VIEW_COLORS[0]),
                        faceRotation: 0,
                        edgeThickness: 0.1,
                        edgeColor: 'black',
                        resolution: 400,
                    })
                    axes.setXMinusFaceProperty({
                        text: '-X',
                        faceColor: createRGBStringFromRGBValues(VIEW_COLORS[0]),
                        faceRotation: 90,
                        fontStyle: 'italic',
                    })
                    axes.setYPlusFaceProperty({
                        text: '+Y',
                        faceColor: createRGBStringFromRGBValues(VIEW_COLORS[1]),
                        fontSizeScale: (res) => res / 4,
                    })
                    axes.setYMinusFaceProperty({
                        text: '-Y',
                        faceColor: createRGBStringFromRGBValues(VIEW_COLORS[1]),
                        fontColor: 'white',
                    })
                    axes.setZPlusFaceProperty({
                        text: '+Z',
                        faceColor: createRGBStringFromRGBValues(VIEW_COLORS[2]),
                    })
                    axes.setZMinusFaceProperty({
                        text: '-Z',
                        faceColor: createRGBStringFromRGBValues(VIEW_COLORS[2]),
                        faceRotation: 45,
                    })

                    // vtkOrientationMarkerWidget：创建操作标记的2D朝向小部件
                    obj.orientationWidget = vtkOrientationMarkerWidget.newInstance({
                        actor: axes,
                        interactor: obj.renderWindow.getInteractor(),
                    })
                    obj.orientationWidget.setEnabled(true)
                    obj.orientationWidget.setViewportCorner(vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT)
                    obj.orientationWidget.setViewportSize(0.15)
                    obj.orientationWidget.setMinPixelSize(100)
                    obj.orientationWidget.setMaxPixelSize(300)
                }
            }

            function initHttpReader() {
                // vtkHttpDataSetReader：HTTP上下文中的数据获取，获取json元数据文件
                const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true })
                reader.setUrl(`${__BASE_PATH__}/data/volume/LIDC2.vti`).then(() => {
                    reader.loadData().then(() => {
                        const image = reader.getOutputData()
                        widget.setImage(image)

                        // 在3D视图中创建图像轮廓
                        const outline = vtkOutlineFilter.newInstance()
                        outline.setInputData(image)
                        const outlineMapper = vtkMapper.newInstance()
                        outlineMapper.setInputData(outline.getOutputData())
                        const outlineActor = vtkActor.newInstance()
                        outlineActor.setMapper(outlineMapper)
                        view3D.renderer.addActor(outlineActor)
                        viewAttributes.forEach((obj, i) => {
                            obj.reslice.setInputData(image)
                            obj.renderer.addActor(obj.resliceActor)
                            view3D.renderer.addActor(obj.resliceActor)
                            obj.sphereActors.forEach((actor) => {
                                obj.renderer.addActor(actor)
                                view3D.renderer.addActor(actor)
                            })
                            const reslice = obj.reslice
                            const viewType = xyzToViewType[i]

                            // 交互时不需要更新平面也不需要刷新,在当前视图中。平面不能因电流的相互作用而改变
                            // 由于添加了鼠标滚轮，也需要刷新当前视图
                            viewAttributes.forEach((v) => {
                                // 其他视图中的交互可能会改变当前平面
                                v.widgetInstance.onInteractionEvent(
                                    // computeFocalPointOffset:布尔值，用于定义焦点与eslice光标显示中心必须重新计算,canUpdateFocalPoint:布尔值，定义焦点是否可以更新
                                    ({ computeFocalPointOffset, canUpdateFocalPoint }) => {
                                        // computeFocalPointOffset: 旋转切面轴 canUpdateFocalPoint：移动中心点和滚轮事件
                                        const activeViewType = widget.getWidgetState().getActiveViewType()
                                        const keepFocalPointPosition =
                                            activeViewType !== viewType && canUpdateFocalPoint
                                        updateReslice({
                                            viewType,
                                            reslice,
                                            actor: obj.resliceActor,
                                            renderer: obj.renderer,
                                            resetFocalPoint: false,
                                            keepFocalPointPosition,
                                            computeFocalPointOffset,
                                            sphereSources: obj.sphereSources,
                                        })
                                    }
                                )
                            })
                            updateReslice({
                                viewType,
                                reslice,
                                actor: obj.resliceActor,
                                renderer: obj.renderer,
                                resetFocalPoint: true, // 在第一次初始化时，将焦点集中到图像中心
                                keepFocalPointPosition: false, // 不要更新焦点，因为我们已经将它设置为图像的中心
                                computeFocalPointOffset: true, // 允许计算显示微调中心与显示焦点之间的电流偏移量
                                sphereSources: obj.sphereSources,
                            })
                            obj.interactor.render()
                        })

                        view3D.renderer.resetCamera()
                        view3D.renderer.resetCameraClippingRange()
                    })
                })
            }

            // 设置默认小部件
            function initSetCursor() {
                widgetState.setKeepOrthogonality(true)
                widgetState.setEnableTranslation(true)
                viewAttributes.forEach((obj) => {
                    obj.widgetInstance.setScaleInPixels(true)
                    obj.reslice.setSlabMode(SlabMode.MEAN)
                    obj.reslice.setSlabNumberOfSlices(1)
                    obj.interactor.render()
                })
            }

            function initResetBtn() {
                const buttonReset = document.querySelector('.reset-btn')
                buttonReset.addEventListener('click', () => {
                    widgetState.setPlanes({ ...initialPlanesState })
                    widget.setCenter(widget.getWidgetState().getImage().getCenter())
                    updateViews()
                })
            }

            // 设置reslice的平面属性和相机属性
            function updateReslice(
                interactionContext = {
                    viewType: '',
                    reslice: null,
                    actor: null,
                    renderer: null,
                    resetFocalPoint: false, // 将焦点重置为显示图像的中心
                    keepFocalPointPosition: false, // 定义是否保留焦点位置(与reslice游标中心的显示距离相同)
                    computeFocalPointOffset: false, // 定义reslice中心和焦点之间的显示偏移量是否必须为
                    spheres: null,
                }
            ) {
                const obj = widget.updateReslicePlane(interactionContext.reslice, interactionContext.viewType)
                if (obj.modified) {
                    // 从setter中获取修改后的返回值来知道我们是否需要渲染
                    interactionContext.actor.setUserMatrix(interactionContext.reslice.getResliceAxes())
                    interactionContext.sphereSources[0].setCenter(...obj.origin)
                    interactionContext.sphereSources[1].setCenter(...obj.point1)
                    interactionContext.sphereSources[2].setCenter(...obj.point2)
                }
                widget.updateCameraPoints(
                    interactionContext.renderer,
                    interactionContext.viewType,
                    interactionContext.resetFocalPoint,
                    interactionContext.keepFocalPointPosition,
                    interactionContext.computeFocalPointOffset
                )
                view3D.renderWindow.render()
                return obj.modified
            }

            // 定义面板交互
            function updateViews() {
                viewAttributes.forEach((obj, i) => {
                    updateReslice({
                        viewType: xyzToViewType[i],
                        reslice: obj.reslice,
                        actor: obj.resliceActor,
                        renderer: obj.renderer,
                        resetFocalPoint: true,
                        keepFocalPointPosition: false,
                        computeFocalPointOffset: true,
                        sphereSources: obj.sphereSources,
                        resetViewUp: true,
                    })
                    obj.renderWindow.render()
                })
                view3D.renderer.resetCamera()
                view3D.renderer.resetCameraClippingRange()
            }

            function createRGBStringFromRGBValues(rgb) {
                if (rgb.length !== 3) {
                    return 'rgb(0, 0, 0)'
                }
                return `rgb(${(rgb[0] * 255).toString()}, ${(rgb[1] * 255).toString()}, ${(rgb[2] * 255).toString()})`
            }
        },
    },
    mounted() {
        this.initView()
    },
}
</script>
<style lang="scss" scoped>
.vtkDiv {
    position: relative;
    width: 100%;
    height: 100%;
}
.reset-btn {
    position: absolute;
    left: 0;
    top: 0;
}
</style>
