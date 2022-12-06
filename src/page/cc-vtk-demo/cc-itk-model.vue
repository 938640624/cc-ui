<template>
    <div class="basic-model-page">
        <cc-header :headtitle="'ItkModel(itk模型)'" />
        <cc-scroll>
            <div class="vtkDiv"></div>
        </cc-scroll>
    </div>
</template>
<script>
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'

import vtkCubeAxesActor from '@kitware/vtk.js/Rendering/Core/CubeAxesActor'
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera'
import vtkResourceLoader from '@kitware/vtk.js/IO/Core/ResourceLoader'
import vtkLiteHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/LiteHttpDataAccessHelper'
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper'

import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow'
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor'
// import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow'

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract'
import '@kitware/vtk.js/favicon'
// 加载我们想要使用的渲染片段（对于 WebGL 和 WebGPU）
import '@kitware/vtk.js/Rendering/Profiles/Geometry'
// 强制 DataAccessHelper 可以访问各种数据源
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper'
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper'
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper'

// 需要在vtk工厂中注册的polydata
import '@kitware/vtk.js/Common/Core/StringArray'
import '@kitware/vtk.js/Common/DataModel/PolyData'

import '@kitware/vtk.js/Rendering/OpenGL/RenderWindow'
import '@kitware/vtk.js/Rendering/WebGPU/RenderWindow'

export default {
    name: 'itk-model-page',
    components: {
        ccScroll,
        ccHeader,
    },
    data() {
        return {
            // itkLoadedPromise: 3,
        }
    },
    beforeCreate() {
        // 某些资源加载完成标志
        this.itkLoadedPromise = new Promise((resolve) => {
            this.itkLoadedPromiseResolve = resolve
        })
    },
    methods: {
        // DataArray：vtkDataArray 是包含数值数据的数据数组对象的抽象超类
        // PolyData：vtkPolyData是一个数据集，它表示由顶点、直线、多边形和/或条带组成的几何结构
        // Glyph3DMapper：使用 vtkGlyph3DMapper 特性来装饰给定对象（publicAPI+model）的方法
        initView() {
            // 找到div标签
            const vtkContainer = document.querySelector('.vtkDiv')
            // 来自url的参数
            const userParams = vtkURLExtract.extractURLParameters()
            const itkLoadedPromise = this.itkLoadedPromise
            const itkLoadedPromiseResolve = this.itkLoadedPromiseResolve

            // 渲染器，过滤器，数据图元，场景实体
            let renderer
            let itkMapper, itkActor
            // 圆锥体，辅助线
            let itkSource, itkAxes, itkPolySource
            // 鼠标事件，渲染窗口
            let interactor, renderWindow, apiSpecificRenderWindow

            main() // 主函数允许
            render() // 渲染器执行

            async function main() {
                // initFullScreenRender() // 全屏视图渲染，除initRenderer的另一种渲染方式(不建议使用)
                initRenderer() // 渲染窗口操作
                initResourceLoader() // 资源加载器
                await itkLoadedPromise
                initTextSource() // 绘制圆锥
                initMapper() // 绘制数据图元接口
                initActor() // 渲染场景实体
                initTextAxes() // 绘制cube辅助线
                initInteractor() // 设置鼠标交互事件
            }

            // vtkFullScreenRenderWindow 提供了实现全屏, newInstance用于创建 vtkFullScreenRenderWindow 新实例的方法
            // function initFullScreenRender() {
            //     const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
            //         rootContainer: vtkContainer,
            //         // background: [0, 0, 0, 255],  // 黑色
            //         background: [0, 0, 0, 0], // 透明色
            //     })
            //     renderer = fullScreenRenderer.getRenderer()
            //     renderWindow = fullScreenRenderer.getRenderWindow()
            //     renderWindow.addRenderer(renderer)
            // }

            // 标染窗口, 图形用户界面中渲染器绘制图像的窗口,提供了同步渲染过程、设置窗口大小和控制双缓冲的方法
            function initRenderer() {
                renderWindow = vtkRenderWindow.newInstance()
                // renderer = vtkRenderer.newInstance({ background: [255, 255, 255] })
                renderer = vtkRenderer.newInstance({ background: [0, 0, 0] })
                renderWindow.addRenderer(renderer)
                // 获取此数据的 API 特定视图,绑定dom标签
                apiSpecificRenderWindow = renderWindow.newAPISpecificView(userParams.viewAPI)
                renderWindow.addView(apiSpecificRenderWindow)
                apiSpecificRenderWindow.setContainer(vtkContainer)
                // 捕获容器的大小并将其设置为 renderWindow
                const { width, height } = vtkContainer.getBoundingClientRect()
                apiSpecificRenderWindow.setSize(width, height)
            }

            // 通过resourceLoader引入资源加载器
            async function initResourceLoader() {
                await vtkResourceLoader.loadScript(
                    'https://cdn.jsdelivr.net/npm/itk-wasm@1.0.0-b.8/dist/umd/itk-wasm.min.js'
                )
                // 解析itk对应的模型面数组
                const meshArrayBuffer = await vtkLiteHttpDataAccessHelper.fetchBinary(
                    'https://data.kitware.com/api/v1/file/5ce070b28d777f072bb5f8dd/download'
                )
                const { mesh, webWorker } = await window.itk.readMeshArrayBuffer(null, meshArrayBuffer, 'bunny.obj')
                const { polyData } = await window.itk.meshToPolyData(webWorker, mesh)
                itkPolySource = polyData
                webWorker.terminate()
                itkLoadedPromiseResolve()
            }

            async function initTextSource() {
                // itkHelper：vtkITKHelper 是一个帮助器，它提供了一组与itk-wasm 模块一起使用的函数
                // convertItkToVtkPolyData：将 itk-wasm PolyData 转换为 vtk.js vtkPolyData。需要一个 itk-wasm PolyData 作为输入
                itkSource = vtkITKHelper.convertItkToVtkPolyData(itkPolySource)
            }

            // vtkMapper 用于指定数据和图形基元间的接口
            async function initMapper() {
                itkMapper = vtkMapper.newInstance({ scalarVisibility: false })
                itkMapper.setInputData(itkSource)
            }

            // actor 用于表示渲染场景中的实体，具有缩放功能，并维护对定义几何体（即映射器）、渲染属性以及可能的纹理贴图的引用
            function initActor() {
                // actor.setMapper 设置映射器，将参与者连接到可视化管道末端的方法
                itkActor = vtkActor.newInstance()
                itkActor.setMapper(itkMapper)
                render()
            }

            // 添加cube辅助线
            function initTextAxes() {
                itkAxes = vtkCubeAxesActor.newInstance()
                itkAxes.setCamera(renderer.getActiveCamera())
                itkAxes.setDataBounds(itkActor.getBounds())
                renderer.addActor(itkAxes)
            }

            // vtkRenderWindowInteractor提供了鼠标/按键/时间事件的交互机制,还提供了用于拾取、渲染帧速率的控件
            function initInteractor() {
                interactor = vtkRenderWindowInteractor.newInstance()
                // setView: 设置视图
                interactor.setView(apiSpecificRenderWindow)
                // initialize: 视图初始化
                interactor.initialize()
                // bindEvents: 绑定事件
                interactor.bindEvents(vtkContainer)
                // 设置要使用的交互器样式
                interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance())
            }

            // 将actor添加到渲染器并根据它设置相机
            function render() {
                renderer.addActor(itkActor)
                renderer.resetCamera()
                renderer.resetCameraClippingRange()
                renderWindow.render()
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
</style>
