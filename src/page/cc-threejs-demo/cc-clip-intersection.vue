<template>
    <div class="cc-clip-intersection-page">
        <cc-header :headtitle="'Intersection(球体交叉点)'" @arrow-back="handleArrowBack" />
        <cc-scroll>
            <div class="threeDiv"></div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-clip-intersection-page'
import * as THREE from 'three'
import { GUI } from '../../helper/jsm/dat.gui.module.js'
import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
export default {
    name: COMPONENT_NAME,
    components: {
        ccHeader,
        ccScroll,
    },
    props: {},
    data() {
        return {
            guiDiv: null,
        }
    },
    mounted() {
        this.initView()
        this.guiDiv = document.querySelector('.dg.ac')
        this.guiDiv.style.display = 'block'
    },
    methods: {
        initView() {
            // 找到div元素
            let container = document.createElement('div')
            const scrollWidth = document.querySelector('.cc-scroll').offsetWidth
            const scrollHeight = document.querySelector('.cc-scroll').offsetHeight
            let threeDiv = document.querySelector('.threeDiv')
            threeDiv.appendChild(container)

            //相机，场景，渲染器
            let camera, scene, renderer

            //轨道控件
            let controls

            const params = {
                clipIntersection: true,
                planeConstant: 0,
                showHelpers: false,
                wireframe: false,
            }

            // plane:在3d空间无限延伸的二维平面，以Hessian法线形式表示,参数为normal(定义平面法线的单位长度，默认(1,0,0)), constant(从原点到平面的有符号距离,默认0)
            const clipPlanes = [
                new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
                new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
                new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
            ]

            main() // 主函数运行
            render() // 渲染器执行

            function main() {
                initRenderer() //渲染操作
                initScene() //场景
                initCamera() //相机
                initControls() //轨道控制器
                initLights() //光源
                latheModel() // 圆锥
            }

            function initScene() {
                //场景设置
                scene = new THREE.Scene()
            }

            function initCamera() {
                // PerspectiveCamera(透视相机), 用来模拟人眼看到的景象
                // PerspectiveCamera(fov(摄像机视锥体垂直视野角度), aspect(摄像机视锥体长宽比), near(摄像机视锥体近端面), far(摄像机视锥体远端面))
                camera = new THREE.PerspectiveCamera(40, (scrollWidth - 25) / (scrollHeight - 25), 1, 300)
                camera.position.set(-1.5, 2.5, 3.0)
            }

            function initRenderer() {
                //渲染器设置
                renderer = new THREE.WebGLRenderer({ antialias: true })
                // setPixelRatio： 设置设备像素比，避免HiDPI设备上绘图模糊
                renderer.setPixelRatio(window.devicePixelRatio)
                // renderer.setClearColor(0xEDF0F4, 1); //设置窗口背景颜色为天蓝色
                renderer.setSize(scrollWidth - 25, scrollHeight - 25)
                // localClippingEnabled：定义渲染器是否考虑对象级剪切平面
                renderer.localClippingEnabled = true
                threeDiv.appendChild(renderer.domElement)
            }

            function initControls() {
                //轨道控制器设置
                controls = new OrbitControls(camera, renderer.domElement)
                // controls.addEventListener('change', render); // use only if there is no animation loop
                controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
                controls.minDistance = 1
                controls.maxDistance = 10
                controls.enablePan = false
            }

            function initLights() {
                const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
                hemiLight.position.set(-1.25, 1, 1.25)
                scene.add(hemiLight)

                const dirLight = new THREE.DirectionalLight(0xffffff)
                dirLight.position.set(0, 1, 0)
                dirLight.castShadow = true
                dirLight.shadow.camera.top = 280
                dirLight.shadow.camera.bottom = -100
                dirLight.shadow.camera.left = -120
                dirLight.shadow.camera.right = 120
                scene.add(dirLight)

                var point = new THREE.PointLight(0xffffff) //点光源
                point.position.set(400, 200, 300) //点光源位置
                scene.add(point) //点光源添加到场景中
                var ambient = new THREE.AmbientLight(0x444444) //环境光
                scene.add(ambient) //环境光添加到场景中
            }

            function latheModel() {
                const group = new THREE.Group()
                for (let i = 1; i <= 30; i += 2) {
                    const geometry = new THREE.SphereGeometry(i / 30, 48, 24)
                    const material = new THREE.MeshLambertMaterial({
                        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
                        side: THREE.DoubleSide,
                        // 裁剪属性，分为全局裁剪和局部裁剪，全局在renderer中设置renderer.clippingPlanes = planes， 局部在material中设置clippingPlanes
                        clippingPlanes: clipPlanes,
                        clipIntersection: params.clipIntersection,
                        wireframe: params.wireframe,
                        // clipIntersection设置为true, 会只裁剪更改建材平面的行为，剪去其交叉点，而不是并集，设置为false，剪去平面的并集
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.name = 'SphereMesh'
                    group.add(mesh)
                }

                scene.add(group)
                const helpers = new THREE.Group()
                // PlaneHelper用来可视化plane的助手对象，参数为plane(可视化平面),size(平面助手边长),color(平面助手颜色)
                helpers.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000))
                helpers.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00))
                helpers.add(new THREE.PlaneHelper(clipPlanes[2], 2, 0x0000ff))
                helpers.visible = false
                scene.add(helpers)
                // 关联空间数据创建交互界面
                const gui = new GUI()

                gui.add(params, 'clipIntersection')
                    .name('clip intersection')
                    .onChange(function (value) {
                        const children = group.children
                        for (let i = 0; i < children.length; i++) {
                            children[i].material.clipIntersection = value
                        }
                        render()
                    })
                gui.add(params, 'planeConstant', -1, 1)
                    .step(0.01)
                    .name('plane constant')
                    .onChange(function (value) {
                        // gui.add(params, 'planeConstant').min(- 1).max(1).step(0.01).name('plane constant').onChange(function (value) {
                        for (let j = 0; j < clipPlanes.length; j++) {
                            clipPlanes[j].constant = value
                        }
                        render()
                    })

                gui.add(params, 'showHelpers')
                    .name('show helpers')
                    .onChange(function (value) {
                        helpers.visible = value
                        render()
                    })

                // const showWireframe = gui.addFolder('showWireframe')
                gui.add(params, 'wireframe')
                    .name('show wireframe')
                    .onChange(function (value) {
                        const children = group.children
                        for (let i = 0; i < children.length; i++) {
                            children[i].material.wireframe = value
                        }
                        render()
                    })

                window.addEventListener('resize', onWindowResize)
            }

            function onWindowResize() {
                camera.aspect = scrollWidth / scrollHeight
                camera.updateProjectionMatrix()
                renderer.setSize(scrollWidth - 25, scrollHeight - 25)
                render()
            }

            function render() {
                //渲染器执行设置
                var clock = new THREE.Clock() //用于更新轨道控制器
                var delta = clock.getDelta()
                controls.update(delta)
                requestAnimationFrame(render) //再次渲染
                renderer.render(scene, camera) //执行渲染
            }
        },
        handleArrowBack() {
            this.guiDiv.style.display = 'none'
            const guiContent = document.querySelector('.dg.a')
            this.guiDiv.removeChild(guiContent)
        },
    },
}
</script>
<style lang="scss" scoped></style>
