<template>
    <div class="basic-model-page">
        <cc-header :headtitle="'BasicModel(基础模型)'" />
        <cc-scroll>
            <div class="vtkDiv"></div>
        </cc-scroll>
    </div>
</template>
<script>
import ccHeader from '@/components/cc-header/cc-header.vue'
import ccScroll from '@/components/cc-scroll/cc-scroll.vue'

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow'
import vtkCalculator from '@kitware/vtk.js/Filters/General/Calculator'
import vtkCubeAxesActor from '@kitware/vtk.js/Rendering/Core/CubeAxesActor'
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera'

import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer'
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow'
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor'

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper'
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource'
import vtkCubeSource from '@kitware/vtk.js/Filters/Sources/CubeSource'
import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract'
// DataSetAttributes用于表示和操作属性数据（例如，标量、向量、法线、纹理坐标、张量、全局 id、谱系 id 和字段数据）
import { AttributeTypes } from '@kitware/vtk.js/Common/DataModel/DataSetAttributes/Constants'
// DataSet为数据集对象指定一个接口,提供有关数据的信息，例如中心、边界框和代表长度,常放于过滤器中
import { FieldDataTypes } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants'
// 加载我们想要使用的渲染片段（对于 WebGL 和 WebGPU）
import '@kitware/vtk.js/favicon'
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
    name: 'basic-model-page',
    components: {
        ccScroll,
        ccHeader,
    },
    data() {
        return {}
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

            // 渲染器，过滤器，数据图元，场景实体
            let renderer, calculatorFilter
            let coneMapper, coneActor, cubeMapper, cubeActor
            // 圆锥体，辅助线
            let coneSource, cubeSource, cubeAxes
            // 鼠标事件，渲染窗口
            let interactor, renderWindow, apiSpecificRenderWindow

            main() // 主函数允许
            render() // 渲染器执行

            function main() {
                // initFullScreenRender() // 全屏视图渲染，除initRenderer的另一种渲染方式(不建议使用)
                initRenderer() // 渲染窗口操作
                initInteractor() // 设置鼠标交互事件
                initConeSource() // 绘制圆锥
                initCubeSource() // 绘制立方体
                initCalculatorFilter() // 绘制过滤器
                initMapper() // 绘制数据图元接口
                initActor() // 渲染场景实体
                initCubeAxes() // 绘制cube辅助线
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
            // renderer vtkRenderer 是一个用于保存 3D 属性的视口。它包含一个 vtkCamera 实例、一个 vtkLights 集合和 vtkActors。它存在
            // 于 RenderWindow 中。一个 RenderWindow 可能有多个 Renderer代表窗口的不同视口，Renderer 也可以相互叠加
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

            function initConeSource() {
                // vtkConeSource 创建一个以指定点为中心并指向指定方向的圆锥体, 参数是高度、半径、分辨率（0:一条线，1:三角形，2:交叉三角形,>2:3D锥体）
                coneSource = vtkConeSource.newInstance({ height: 1.0, radius: 1, resolution: 80 })
            }

            function initCubeSource() {
                cubeSource = vtkCubeSource.newInstance()
            }

            // 创建一个内联过滤器
            function initCalculatorFilter() {
                calculatorFilter = vtkCalculator.newInstance()
                calculatorFilter.setInputConnection(coneSource.getOutputPort())
                calculatorFilter.setFormula({
                    getArrays: () => ({
                        input: [],
                        output: [
                            {
                                location: FieldDataTypes.CELL, // FieldDataTypes.CELL:3
                                name: 'Random',
                                dataType: 'Float32Array',
                                attribute: AttributeTypes.SCALARS, // AttributeTypes.SCALARS:0
                            },
                        ],
                    }),
                    evaluate: (arraysIn, arraysOut) => {
                        const [scalars] = arraysOut.map((d) => d.getData())
                        for (let i = 0; i < scalars.length; i++) {
                            scalars[i] = Math.random()
                        }
                    },
                })
            }

            // vtkMapper 用于指定数据和图形基元间的接口
            function initMapper() {
                coneMapper = vtkMapper.newInstance()
                coneMapper.setInputConnection(calculatorFilter.getOutputPort())
                // coneMapper.setInputConnection(coneSource.getOutputPort())
                cubeMapper = vtkMapper.newInstance()
                cubeMapper.setInputConnection(cubeSource.getOutputPort())
            }

            // actor 用于表示渲染场景中的实体，具有缩放功能，并维护对定义几何体（即映射器）、渲染属性以及可能的纹理贴图的引用
            function initActor() {
                // actor.setMapper 设置映射器，将参与者连接到可视化管道末端的方法
                coneActor = vtkActor.newInstance()
                coneActor.setMapper(coneMapper)
                coneActor.setPosition(0.0, 0.0, -20.0)

                cubeActor = vtkActor.newInstance()
                // actor.getProperty()：获取控制此actor表面
                // cubeActor.getProperty().setRepresentation(1) // setRepresentation：控制显示线条
                cubeActor.getProperty().setColor(0, 1, 0) // setColor：设置颜色（r,g,b）
                // cubeActor.getProperty().setAmbientColor(255, 182, 193)
                // cubeActor.getProperty().setSpecularColor(255, 182, 193)
                cubeActor.setMapper(cubeMapper)
                cubeActor.setPosition(0.0, 0.0, -20.0)
            }

            // 添加cube辅助线
            function initCubeAxes() {
                cubeAxes = vtkCubeAxesActor.newInstance()
                cubeAxes.setCamera(renderer.getActiveCamera())
                cubeAxes.setDataBounds(coneActor.getBounds())
                renderer.addActor(cubeAxes)
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
                renderer.addActor(coneActor)
                renderer.addActor(cubeActor)
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
