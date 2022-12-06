<template>
    <div class="more-renderer-page">
        <cc-header :headtitle="'MoreRenderer(多场景渲染)'" />
        <cc-scroll>
            <div class="vtkDiv"></div>
        </cc-scroll>
    </div>
</template>
<script>
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'

import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow'
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor'
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera'
// import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow'

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource'
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource'
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource'
import vtkCylinderSource from '@kitware/vtk.js/Filters/Sources/CylinderSource'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract'
import '@kitware/vtk.js/favicon'
// 加载我们想要使用的渲染片段（对于 WebGL 和 WebGPU）
import '@kitware/vtk.js/Rendering/Profiles/Geometry'
import '@kitware/vtk.js/Rendering/Misc/RenderingAPIs'
// 强制 DataAccessHelper 可以访问各种数据源
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper'
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper'
import '@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper'

// 需要在vtk工厂中注册的polydata
import '@kitware/vtk.js/Common/Core/StringArray'
import '@kitware/vtk.js/Common/DataModel/PolyData'

import '@kitware/vtk.js/Rendering/OpenGL/RenderWindow'
import '@kitware/vtk.js/Rendering/WebGPU/RenderWindow'
import { COLOR_PROPERTIES, COLORS } from '@/page/cc-vtk-demo/constant'

export default {
    name: 'more-renderer-page',
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
            const ccScrollDiv = document.querySelector('.cc-scroll')
            // 来自url的参数
            const userParams = vtkURLExtract.extractURLParameters()
            const meshes = []
            const RENDERERS = []
            let meshIndex = 0
            let propertyIndex = 0
            let bgIndex = 0
            let rendererId = 0
            let captureCurrentRenderer = false

            // 渲染器，过滤器，数据图元，场景实体
            let renderer

            // 鼠标事件，渲染窗口
            let interactor, renderWindow, apiSpecificRenderWindow

            main() // 主函数允许
            // render() // 渲染器执行

            async function main() {
                // initFullScreenRender() // 全屏视图渲染，除initRenderer的另一种渲染方式(不建议使用)
                initRenderer() // 渲染窗口操作
                initMapper() // 绘制数据图元接口
                initInteractor() // 设置鼠标交互事件
                initHandleSrcoll()
                for (let i = 0; i < 8; i++) {
                    addRenderer()
                }
                window.requestAnimationFrame(animate)
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
                renderer = vtkRenderer.newInstance({ background: [255, 255, 255] })
                // renderer = vtkRenderer.newInstance({ background: [0, 0, 0] })
                renderWindow.addRenderer(renderer)
                // // 获取此数据的 API 特定视图,绑定dom标签
                apiSpecificRenderWindow = renderWindow.newAPISpecificView(userParams.viewAPI)
                renderWindow.addView(apiSpecificRenderWindow)
                apiSpecificRenderWindow.setContainer(vtkContainer)

                // 捕获容器的大小并将其设置为 renderWindow
                // const { width, height } = vtkContainer.getBoundingClientRect()
                const { width, height } = ccScrollDiv.getBoundingClientRect()
                apiSpecificRenderWindow.setSize(width, height)
            }

            // vtkMapper 用于指定数据和图形基元间的接口
            async function initMapper() {
                addModelMesh('Cone', vtkConeSource.newInstance())
                addModelMesh('Sphere', vtkSphereSource.newInstance())
                addModelMesh('Cube', vtkCubeSource.newInstance())
                addModelMesh('Cylinder', vtkCylinderSource.newInstance())
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

            function initHandleSrcoll() {
                ccScrollDiv.addEventListener('scroll', recomputeViewPort)
            }

            // // 将actor添加到渲染器并根据它设置相机
            // function render() {
            //     renderer.addActor()
            //     renderer.resetCamera()
            //     renderer.resetCameraClippingRange()
            //     renderWindow.render()
            // }

            // 添加mesh网格通过名字和资源
            function addModelMesh(name, source) {
                const mapper = vtkMapper.newInstance()
                mapper.setInputData(source.getOutputData())
                meshes.push({ name, mapper })
            }

            function updateViewPort(element, renderer) {
                // const { innerHeight, innerWidth } = window
                const innerWidth = ccScrollDiv.getBoundingClientRect().width
                const innerHeight = ccScrollDiv.getBoundingClientRect().height
                const { x, y, width, height } = element.getBoundingClientRect()
                const viewport = [
                    x / innerWidth,
                    1 - (y + height) / innerHeight,
                    (x + width) / innerWidth,
                    1 - y / innerHeight,
                ]
                renderer.setViewport(...viewport)
            }

            function recomputeViewports() {
                const rendererElems = document.querySelectorAll('.renderer')
                for (let i = 0; i < rendererElems.length; i++) {
                    const elem = rendererElems[i]
                    const { id } = elem
                    const renderer = RENDERERS[id]
                    updateViewPort(elem, renderer)
                }
                renderWindow.render()
            }

            function resize() {
                // vtkContainer.style.width = `${ccScrollDiv.innerWidth}px`
                const { width, height } = ccScrollDiv.getBoundingClientRect()
                apiSpecificRenderWindow.setSize(width, height)
                recomputeViewports()
            }

            new ResizeObserver(resize).observe(document.body)
            ccScrollDiv.addEventListener('scroll', recomputeViewports)

            function recomputeViewPort() {
                const rendererElems = document.querySelectorAll('.renderer')
                for (let i = 0; i < rendererElems.length; i++) {
                    const elem = rendererElems[i]
                    const { id } = elem
                    const renderer = RENDERERS[id]
                    updateViewPort(elem, renderer)
                }
                renderWindow.render()
            }

            function applyStyle(element) {
                element.classList.add('renderer')
                element.style.width = '200px'
                element.style.height = '200px'
                element.style.margin = '20px'
                element.style.border = 'solid 1px #333'
                element.style.display = 'inline-block'
                element.style.boxSizing = 'border-box'
                element.style.textAlign = 'center'
                element.style.color = 'white'
                return element
            }

            function bindInteractor(renderer, el) {
                // 只在需要时更改交互器的容器
                if (interactor.getContainer() !== el) {
                    if (interactor.getContainer()) {
                        interactor.unbindEvents()
                    }
                    if (captureCurrentRenderer) {
                        interactor.setCurrentRenderer(renderer)
                    }
                    if (el) {
                        interactor.bindEvents(el)
                    }
                }
            }

            function addRenderer() {
                const mesh = meshes[meshIndex]
                const prop = COLOR_PROPERTIES[propertyIndex]
                const background = COLORS[bgIndex]
                meshIndex = (meshIndex + 1) % meshes.length
                propertyIndex = (propertyIndex + 1) % COLOR_PROPERTIES.length
                bgIndex = (bgIndex + 1) % COLORS.length

                const container = applyStyle(document.createElement('div'))
                container.id = rendererId++
                ccScrollDiv.appendChild(container)

                const actor = vtkActor.newInstance()
                actor.setMapper(mesh.mapper)
                actor.getProperty().set(prop.properties)
                actor.getProperty().setDiffuse(0.9) // setDiffuse 设置漫射光照系数
                actor.getProperty().setSpecular(0.2) // setSpecular 设置镜面光照系数
                actor.getProperty().setSpecularPower(30) // setSpecularPower 设置镜面反射功率
                actor.getProperty().setSpecularColor(1.0, 1.0, 1.0) // setSpecularColor 从 RGB 数组设置镜面反射颜色
                const renderer = vtkRenderer.newInstance({ background })
                container.innerHTML = `${mesh.name} ${prop.name}`

                container.addEventListener('pointerenter', () => bindInteractor(renderer, container))
                container.addEventListener('pointerleave', () => bindInteractor(null, null))

                renderer.addActor(actor)
                renderWindow.addRenderer(renderer)
                updateViewPort(container, renderer)
                renderer.resetCamera()
                RENDERERS[container.id] = renderer
            }

            function updateCamera(renderer) {
                // camera vtkCamera 是一个用于 3D 渲染的虚拟相机。它提供了定位和定向视点和焦点的方法。还提供了在焦点周围移动的便捷方法。更
                // 复杂的方法允许操纵计算机图形模型，包括查看矢量、剪裁平面和相机透视图
                const camera = renderer.getActiveCamera()
                // azimuth 围绕以焦点为中心的视图向上矢量旋转相机
                camera.azimuth(0.5)
                // resetCameraClippingRange 基于边界框重置相机剪裁范围
                renderer.resetCameraClippingRange()
            }

            function animate() {
                Object.values(RENDERERS).forEach(updateCamera)
                renderWindow.render()
                window.requestAnimationFrame(animate)
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
    // position: relative;
    // width: 100%;
    // height: 100%;
    // position: fixed;
    position: absolute;
    z-index: -1;
    pointer-events: none;
    cursor: pointer;
    top: -100px;
    left: -115px;
}
</style>
