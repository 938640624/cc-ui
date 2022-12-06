<template>
    <div class="cc-clip-advanced-page">
        <cc-header :headtitle="'Clip-Advanced(裁剪3D进阶立方体)'" @arrow-back="handleArrowBack" />
        <cc-scroll>
            <div class="threeDiv"></div>
        </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-clip-advanced-page'
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

            //   //相机，场景，渲染器
            let camera, scene, renderer, startTime, object
            let clipMaterial, volumeVisualization, globalClippingPlanes

            //轨道控件
            let controls

            const transform = new THREE.Matrix4()
            const tmpMatrix = new THREE.Matrix4()

            const planeToMatrix = (function () {
                // 创建一个将X/Y对准给定平面的矩阵
                const xAxis = new THREE.Vector3()
                const yAxis = new THREE.Vector3()
                const trans = new THREE.Vector3()
                return function planeToMatrix(plane) {
                    const zAxis = plane.normal
                    const matrix = new THREE.Matrix4()
                    // 从单位向量建立标准正交基
                    if (Math.abs(zAxis.x) > Math.abs(zAxis.z)) {
                        yAxis.set(-zAxis.y, zAxis.x, 0)
                    } else {
                        yAxis.set(0, -zAxis.z, zAxis.y)
                    }
                    xAxis.crossVectors(yAxis.normalize(), zAxis)
                    plane.coplanarPoint(trans)
                    return matrix.set(
                        xAxis.x,
                        yAxis.x,
                        zAxis.x,
                        trans.x,
                        xAxis.y,
                        yAxis.y,
                        zAxis.y,
                        trans.y,
                        xAxis.z,
                        yAxis.z,
                        zAxis.z,
                        trans.z,
                        0,
                        0,
                        0,
                        1
                    )
                }
            })()

            const Vertices = [
                new THREE.Vector3(+1, 0, +Math.SQRT1_2),
                new THREE.Vector3(-1, 0, +Math.SQRT1_2),
                new THREE.Vector3(0, +1, -Math.SQRT1_2),
                new THREE.Vector3(0, -1, -Math.SQRT1_2),
            ]

            const Indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2]

            const Planes = planesFromMesh(Vertices, Indices) // 4个切割的二维平面
            const PlaneMatrices = Planes.map(planeToMatrix) // 4个转换的四维矩阵
            const GlobalClippingPlanes = cylindricalPlanes(5, 2.5) // 5个切割的二维平面
            // console.log(GlobalClippingPlanes, 'GlobalClippingPlanes')
            const Empty = Object.freeze([])

            main() // 主函数运行
            render() // 渲染器执行

            function main() {
                initRenderer() //渲染操作
                initScene() //场景
                initCamera() //相机
                initControls() //轨道控制器
                initLights() //光源
                latheModel() // 裁剪图形
            }

            function initScene() {
                //场景设置
                scene = new THREE.Scene()
            }

            function initCamera() {
                // PerspectiveCamera(透视相机), 用来模拟人眼看到的景象
                // PerspectiveCamera(fov(摄像机视锥体垂直视野角度,类似于人肉眼所见距离), aspect(摄像机视锥体长宽比), near(摄像机视锥体近端面), far(摄像机视锥体远端面))
                camera = new THREE.PerspectiveCamera(70, (scrollWidth - 25) / (scrollHeight - 25), 0.25, 16)
                camera.position.set(0, 1.5, 3)
            }

            function initRenderer() {
                //渲染器设置
                renderer = new THREE.WebGLRenderer({ antialias: true })
                // setPixelRatio： 设置设备像素比，避免HiDPI设备上绘图模糊
                renderer.setPixelRatio(window.devicePixelRatio)
                renderer.shadowMap.enabled = true
                renderer.setSize(scrollWidth - 25, scrollHeight - 25)
                // localClippingEnabled：定义渲染器是否考虑对象级剪切平面
                renderer.localClippingEnabled = true
                threeDiv.appendChild(renderer.domElement)
                window.addEventListener('resize', onWindowResize)
                globalClippingPlanes = createPlanes(GlobalClippingPlanes.length)
                renderer.clippingPlanes = Empty
            }

            function initControls() {
                //轨道控制器设置
                controls = new OrbitControls(camera, renderer.domElement)
                controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
                // minDistance(能够将相机向内移动多少)，maxDistance(能够将相机向外移动多少)
                controls.minDistance = 1
                controls.maxDistance = 8
                controls.target.set(0, 1, 0)
                controls.enablePan = false // 启用或禁用摄像机平移,默认为true
                controls.update()
            }

            function initLights() {
                // 光线的参数一般为颜色，颜色强度
                // AmbientLight (环境光)： 环境光会均匀的照亮场景中的所有物体，不能用来投射阴影，因为它没有方向
                var ambient = new THREE.AmbientLight(0xffffff, 0.3) //环境光
                scene.add(ambient) //环境光添加到场景中

                // SpotLight(聚光灯):光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大，该光源也可投射阴影
                // color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff(白色)
                // intensity - (可选参数) 光照强度。 缺省值 1
                // distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减
                // angle - 光线散射角度，最大为Math.PI / 2
                // penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0
                // decay - 沿着光照距离的衰减量
                const spotLight = new THREE.SpotLight(0xffffff, 0.5)
                // angle：从聚光灯位置以弧度表示聚光灯的最大范围
                spotLight.angle = Math.PI / 5
                //penumbra: 聚光锥的半影衰减百分比
                spotLight.penumbra = 0.2
                spotLight.position.set(2, 3, 3)
                // castShadow: 此属性设置为 true 聚光灯将投射阴影
                spotLight.castShadow = true
                spotLight.shadow.camera.near = 3
                spotLight.shadow.camera.far = 10
                spotLight.shadow.mapSize.width = 1024
                spotLight.shadow.mapSize.height = 1024
                scene.add(spotLight)

                // DirectionalLight(平行光)：沿着特定方向发射的光，像是从无穷远的地方发出，通常用来模拟太阳光的效果，也可以投射阴影
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
                dirLight.position.set(0, 2, 0)
                dirLight.castShadow = true
                dirLight.shadow.camera.near = 1
                dirLight.shadow.camera.far = 10

                dirLight.shadow.camera.right = 1
                dirLight.shadow.camera.left = -1
                dirLight.shadow.camera.top = 1
                dirLight.shadow.camera.bottom = -1

                dirLight.shadow.mapSize.width = 1024
                dirLight.shadow.mapSize.height = 1024
                scene.add(dirLight)
            }

            function latheModel() {
                object = new THREE.Group()
                const geometry = new THREE.BoxGeometry(0.18, 0.18, 0.18)
                clipMaterial = new THREE.MeshPhongMaterial({
                    color: 0xee0a10,
                    shininess: 100,
                    side: THREE.DoubleSide,
                    clippingPlanes: createPlanes(Planes.length),
                    clipShadows: true,
                })

                for (let z = -2; z <= 2; ++z)
                    for (let y = -2; y <= 2; ++y)
                        for (let x = -2; x <= 2; ++x) {
                            const mesh = new THREE.Mesh(geometry, clipMaterial)
                            mesh.position.set(x / 5, y / 5, z / 5)
                            mesh.castShadow = true
                            object.add(mesh)
                        }

                scene.add(object)

                // PlaneGeometry(平面缓冲几何体): 用于生成平面几何体的类
                // 参数(width平面沿着X轴的宽度, height平面沿着Y轴的高度, widthSegments(可选)平面的宽度分段数, heightSegments(可选)平面的高度分段数)
                const planeGeometry = new THREE.PlaneGeometry(3, 3, 1, 1)
                const color = new THREE.Color()
                volumeVisualization = new THREE.Group()
                volumeVisualization.visible = false

                for (let i = 0, n = Planes.length; i !== n; ++i) {
                    const material = new THREE.MeshBasicMaterial({
                        color: color.setHSL(i / n, 0.5, 0.5).getHex(),
                        side: THREE.DoubleSide,
                        opacity: 0.2,
                        transparent: true,

                        // 剪辑到其他的，以显示体积(大面积相交的透明平面看起来很糟糕)
                        clippingPlanes: clipMaterial.clippingPlanes.filter(function (_, j) {
                            return j !== i
                        }),
                        // 不需要启用阴影剪辑-平面可视化不投射阴影
                    })
                    const mesh = new THREE.Mesh(planeGeometry, material)
                    mesh.matrixAutoUpdate = false // 为true:它将计算每一帧的位移、旋转（四元变换）和缩放矩阵，并重新计算

                    volumeVisualization.add(mesh)
                }

                scene.add(volumeVisualization)
                // console.log(scene, 'scene')

                const ground = new THREE.Mesh(
                    planeGeometry,
                    // MeshPhongMaterial具有镜面高光的光泽表面材质
                    new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 10 })
                )
                ground.rotation.x = -Math.PI / 2
                // multiplyScalar(float): 将该向量与传入标量进行相乘
                ground.scale.multiplyScalar(3)
                ground.receiveShadow = true
                scene.add(ground)

                // stats = new Stats()
                // threeDiv.appendChild(stats.dom)

                const gui = new GUI()
                const folder = gui.addFolder('Local Clipping')
                const props = {
                    get Enabled() {
                        return renderer.localClippingEnabled
                    },
                    set Enabled(v) {
                        renderer.localClippingEnabled = v
                        if (!v) volumeVisualization.visible = false
                    },
                    get Shadows() {
                        return clipMaterial.clipShadows
                    },
                    set Shadows(v) {
                        clipMaterial.clipShadows = v
                    },
                    get Visualize() {
                        return volumeVisualization.visible
                    },
                    set Visualize(v) {
                        if (renderer.localClippingEnabled) volumeVisualization.visible = v
                    },
                }

                folder.add(props, 'Enabled')
                folder.add(props, 'Shadows')
                folder.add(props, 'Visualize').listen()

                gui.addFolder('Global Clipping').add(
                    {
                        get Enabled() {
                            return renderer.clippingPlanes !== Empty
                        },
                        set Enabled(v) {
                            renderer.clippingPlanes = v ? globalClippingPlanes : Empty
                        },
                    },
                    'Enabled'
                )

                // Start
                startTime = Date.now()
            }

            function onWindowResize() {
                camera.aspect = scrollWidth / scrollHeight
                camera.updateProjectionMatrix()
                renderer.setSize(scrollWidth - 25, scrollHeight - 25)
            }

            function render() {
                //渲染器执行设置
                // 计时器生效，3D模型转动
                const currentTime = Date.now()
                const time = (currentTime - startTime) / 1000
                requestAnimationFrame(render) //再次渲染
                object.position.y = 1
                object.rotation.x = time * 0.5
                object.rotation.y = time * 0.2
                object.updateMatrix()

                transform.copy(object.matrix)
                const bouncy = Math.cos(time * 0.5) * 0.5 + 0.7
                transform.multiply(tmpMatrix.makeScale(bouncy, bouncy, bouncy))
                assignTransformedPlanes(clipMaterial.clippingPlanes, Planes, transform)
                const planeMeshes = volumeVisualization.children
                for (let i = 0, n = planeMeshes.length; i !== n; ++i) {
                    tmpMatrix.multiplyMatrices(transform, PlaneMatrices[i])
                    setObjectWorldMatrix(planeMeshes[i], tmpMatrix)
                }
                transform.makeRotationY(time * 0.1)
                assignTransformedPlanes(globalClippingPlanes, GlobalClippingPlanes, transform)

                renderer.render(scene, camera)
            }

            function planesFromMesh(vertices, indices) {
                // 从一个凸三角形网格创建一个剪切体, 由数组'顶点'和'索引'指定
                const n = indices.length / 3
                const result = new Array(n)

                for (let i = 0, j = 0; i < n; ++i, j += 3) {
                    const a = vertices[indices[j]]
                    const b = vertices[indices[j + 1]]
                    const c = vertices[indices[j + 2]]
                    result[i] = new THREE.Plane().setFromCoplanarPoints(a, b, c)
                }

                return result
            }

            function createPlanes(n) {
                // 创建一个包含n个未初始化平面对象的数组
                const result = new Array(n)
                for (let i = 0; i !== n; ++i) result[i] = new THREE.Plane()

                return result
            }

            function assignTransformedPlanes(planesOut, planesIn, matrix) {
                // 设置一个现有平面数组来转换'planesIn'
                for (let i = 0, n = planesIn.length; i !== n; ++i) planesOut[i].copy(planesIn[i]).applyMatrix4(matrix)
            }

            function cylindricalPlanes(n, innerRadius) {
                const result = createPlanes(n)
                for (let i = 0; i !== n; ++i) {
                    const plane = result[i]
                    const angle = (i * Math.PI * 2) / n
                    plane.normal.set(Math.cos(angle), 0, Math.sin(angle))
                    plane.constant = innerRadius
                }

                return result
            }

            function setObjectWorldMatrix(object, matrix) {
                // 根据世界矩阵设置对象的方向
                const parent = object.parent
                scene.updateMatrixWorld()
                object.matrix.copy(parent.matrixWorld).invert()
                object.applyMatrix4(matrix)
            }
        },

        handleArrowBack() {
            // console.log(this.guiDiv, 'guiDiv')
            this.guiDiv.style.display = 'none'
            const guiContent = document.querySelector('.dg.a')
            this.guiDiv.removeChild(guiContent)
        },
    },
}
</script>
<style lang="scss" scoped></style>
