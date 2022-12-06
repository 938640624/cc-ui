<template>
  <div class="cc-marker-page">
    <cc-header :headtitle="'Marker(3D标记)'" />
    <cc-scroll>
      <div class="threeDiv"></div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-marker-page'
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

      let coneMesh, circleMesh, centerCIrcleMesh
      let coneMesh1, circleMesh1, centerCIrcleMesh1

      main() // 主函数运行
      render() // 渲染器执行
      function main() {
        initRenderer() //渲染操作
        initScene() //场景
        initCamera() //相机
        initControls() //轨道控制器
        initLights() //光源
        cone() // 圆锥
        circle() // 球体
        centerCircle() // 中心球体

        cone1()
        circle1()
        centerCircle1()
      }

      function initScene() {
        //场景设置
        scene = new THREE.Scene()
      }

      function initCamera() {
        //相机设置
        var k = scrollWidth / scrollHeight
        var s = 100 //三维场景缩放系数
        //创建相机对象
        camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
        camera.position.set(200, 30, 50) // 设置相机位置
        camera.lookAt(scene.position) //设置相机方向(指向的场景对象)
      }

      function initRenderer() {
        //渲染器设置
        renderer = new THREE.WebGLRenderer() //antialias:true增加抗锯齿效果
        renderer.shadowMap.enabled = true
        renderer.setClearColor(0xb9d3ff, 1) //设置窗口背景颜色为天蓝色
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
        var point = new THREE.PointLight(0xffffff) //点光源
        point.position.set(400, 200, 300) //点光源位置
        scene.add(point) //点光源添加到场景中
        var ambient = new THREE.AmbientLight(0x444444) //环境光
        scene.add(ambient) //环境光添加到场景中
      }

      function cone() {
        const geometry = new THREE.ConeGeometry(19.1, 30, 128)
        const material = new THREE.MeshLambertMaterial({
          // color: 0x008080, wireframe: true
          color: 0x333303
        })
        coneMesh = new THREE.Mesh(geometry, material)
        scene.add(coneMesh)
        coneMesh.rotateX(Math.PI)
      }

      function circle() {
        const geometry = new THREE.SphereGeometry(22, 40, 40, 0, Math.PI * 2, 0, Math.PI / 1.5)//半球几何
        const material = new THREE.MeshLambertMaterial({
          // color: 0x333303, wireframe: true
          color: 0x333303
        })
        circleMesh = new THREE.Mesh(geometry, material)
        scene.add(circleMesh)
        circleMesh.translateY(26)
      }

      function centerCircle() {
        const geometry = new THREE.SphereGeometry(15, 40, 40, 0, Math.PI * 2, 0, Math.PI)//半球几何
        // renderOrder: 修改场景中的渲染顺序，即使不透明对象和透明对象保持独立顺序，渲染顺序也是从低到高排序的
        const material = new THREE.MeshLambertMaterial({
          color: 0x7DC5EB, depthTest: false, renderOrder: 2
        })
        centerCIrcleMesh = new THREE.Mesh(geometry, material)
        scene.add(centerCIrcleMesh)
        centerCIrcleMesh.translateY(25)
      }

      function cone1() {
        const geometry = new THREE.ConeGeometry(19.1, 30, 128)
        const material = new THREE.MeshLambertMaterial({
          // color: 0x008080, wireframe: true
          color: 0xFF6E6E
        })
        coneMesh1 = new THREE.Mesh(geometry, material)
        scene.add(coneMesh1)
        coneMesh1.rotateX(Math.PI)
        coneMesh1.translateZ(-70)
      }

      function circle1() {
        const geometry = new THREE.SphereGeometry(22, 100, 100, 0, Math.PI * 2, 0, Math.PI / 1.5)//半球几何
        const material = new THREE.MeshLambertMaterial({
          // color: 0x333303, wireframe: true
          color: 0xFF6E6E
        })
        circleMesh1 = new THREE.Mesh(geometry, material)
        scene.add(circleMesh1)
        circleMesh1.translateY(26)
        circleMesh1.translateZ(70)
      }

      function centerCircle1() {
        const geometry = new THREE.SphereGeometry(15, 40, 40, 0, Math.PI * 2, 0, Math.PI)//半球几何
        // renderOrder: 修改场景中的渲染顺序，即使不透明对象和透明对象保持独立顺序，渲染顺序也是从低到高排序的
        const material = new THREE.MeshLambertMaterial({
          color: 0x0C0058, depthTest: false, renderOrder: 2
        })
        centerCIrcleMesh1 = new THREE.Mesh(geometry, material)
        scene.add(centerCIrcleMesh1)
        centerCIrcleMesh1.translateY(25)
        centerCIrcleMesh1.translateZ(70)
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
