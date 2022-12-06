<template>
  <div class="lathe-model-page">
    <cc-header :headtitle="'车削缓冲几何体(视锥)'" />
    <cc-scroll>
      <div class="threeDiv"></div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'lathe-model-page'
import * as THREE from 'three'
import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import ccHeader from '../../components/cc-header/cc-header.vue'
import ccScroll from '../../components/cc-scroll/cc-scroll.vue'
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
  },
  props: {

  },
  data() {
    return {}
  },
  mounted() {
    this.initView()
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
      let orbitControls

      // 设置层级
      // let layers = new THREE.Layers()

      let coneMesh

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
        //相机设置
        var k = scrollWidth / scrollHeight
        var s = 300 //三维场景缩放系数
        //创建相机对象
        camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
        camera.position.set(-100, 30, -260) // 设置相机位置
        camera.lookAt(scene.position) //设置相机方向(指向的场景对象)
      }

      function initRenderer() {
        //渲染器设置
        renderer = new THREE.WebGLRenderer() //antialias:true增加抗锯齿效果
        renderer.shadowMap.enabled = true
        renderer.setClearColor(0xEDF0F4, 1) //设置窗口背景颜色为天蓝色
        // renderer.setSize(window.innerWidth, window.innerHeight); //设置窗口尺寸
        renderer.setSize(scrollWidth - 25, scrollHeight - 25)
        threeDiv.appendChild(renderer.domElement) //将renderer关联到container，这个过程类似于获取canvas元素
      }

      function initControls() {
        //轨道控制器设置
        orbitControls = new OrbitControls(camera, renderer.domElement)
        orbitControls.target = new THREE.Vector3(0, 0, 0) //控制焦点
        orbitControls.autoRotate = false //将自动旋转关闭
      }

      function initLights() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
        hemiLight.position.set(0, 1, 0)
        scene.add(hemiLight)

        const dirLight = new THREE.DirectionalLight(0xffffff)
        dirLight.position.set(0, 1, 0)
        dirLight.castShadow = true
        dirLight.shadow.camera.top = 180
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
        // 295.5428184393865是中心点(0,0)到视锥最远的直线距离，也是三角形的顶点x坐标
        // 150是中心点到顶点的高度，总高度是300，上顶点是150，下顶点是-150
        // angle是视锥围绕着三角形旋转的角度，起始角度是angle的一半，所以是angle / 2
        const points = [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(295.5428184393865, 150),
          new THREE.Vector2(295.5428184393865, -150),
          new THREE.Vector2(0, 0),
        ]
        const angle = 1.5707963267948966
        const geometry = new THREE.LatheGeometry(points, 300, angle / 2, angle)
        const material = new THREE.MeshBasicMaterial({
          color: 0x00FF00, side: THREE.DoubleSide, transparent: true, opacity: 0.2
        })
        coneMesh = new THREE.Mesh(geometry, material)
        scene.add(coneMesh)
        // coneMesh.rotateX(Math.PI)
      }

      function render() {//渲染器执行设置
        var clock = new THREE.Clock()//用于更新轨道控制器
        var delta = clock.getDelta()
        orbitControls.update(delta)
        requestAnimationFrame(render)//再次渲染
        renderer.render(scene, camera)//执行渲染
      }
    }
  },
}
</script>
<style lang="scss" scoped>
</style>
