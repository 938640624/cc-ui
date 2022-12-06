<template>
  <div class="cc-local-clipping-page">
    <cc-header :headtitle="'裁剪基础图形'"
      @arrow-back="handleArrowBack" />
    <cc-scroll>
      <div class="threeDiv"></div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-local-clipping-page'
import * as THREE from 'three'
import { GUI } from '../../helper/jsm/dat.gui.module.js'
import Stats from '../../helper/jsm/stats.module.js'
// import { deepClone } from '../../helper/utils/deepClone.js'
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
    return {
      guiDiv: null
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
      let camera, scene, renderer, startTime, object, stats

      //轨道控件
      let controls

      const params = {
        showHelpers: false
      };

      main() // 主函数运行
      render() // 渲染器执行

      function main() {
        initRenderer() //渲染操作
        initScene() //场景
        initCamera() //相机
        initControls() //轨道控制器
        initLights() //光源
        latheModel() // 裁剪图形
        // initGui() // GUI交互
      }

      function initScene() {
        //场景设置
        scene = new THREE.Scene()
      }

      function initCamera() {
        // PerspectiveCamera(透视相机), 用来模拟人眼看到的景象
        // PerspectiveCamera(fov(摄像机视锥体垂直视野角度,类似于人肉眼所见距离), aspect(摄像机视锥体长宽比), near(摄像机视锥体近端面), far(摄像机视锥体远端面))
        camera = new THREE.PerspectiveCamera(76, (scrollWidth - 25) / (scrollHeight - 25), 0.25, 16)
        camera.position.set(0, 1.3, 3)
      }

      function initRenderer() {
        //渲染器设置
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.setSize(scrollWidth - 25, scrollHeight - 25)
        renderer.localClippingEnabled = true
        threeDiv.appendChild(renderer.domElement)
        window.addEventListener('resize', onWindowResize)
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
        // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
        // hemiLight.position.set(- 1.25, 1, 1.25)
        // scene.add(hemiLight)

        // var point = new THREE.PointLight(0xffffff) //点光源
        // point.position.set(400, 200, 300) //点光源位置
        // scene.add(point) //点光源添加到场景中
        // AmbientLight (环境光)： 环境光会均匀的照亮场景中的所有物体，不能用来投射阴影，因为它没有方向
        var ambient = new THREE.AmbientLight(0x444444) //环境光
        scene.add(ambient) //环境光添加到场景中

        // SpotLight(聚光灯):光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大，该光源也可投射阴影
        // color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff(白色)
        // intensity - (可选参数) 光照强度。 缺省值 1
        // distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减
        // angle - 光线散射角度，最大为Math.PI / 2
        // penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0
        // decay - 沿着光照距离的衰减量
        const spotLight = new THREE.SpotLight(0xffffff)
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
        const dirLight = new THREE.DirectionalLight(0x55505a, 1)
        dirLight.position.set(0, 3, 0)
        dirLight.castShadow = true
        dirLight.shadow.camera.near = 1
        dirLight.shadow.camera.far = 10

        dirLight.shadow.camera.right = 1
        dirLight.shadow.camera.left = - 1
        dirLight.shadow.camera.top = 1
        dirLight.shadow.camera.bottom = - 1

        dirLight.shadow.mapSize.width = 1024
        dirLight.shadow.mapSize.height = 1024
        scene.add(dirLight)

      }

      function latheModel() {
        const localPlane = new THREE.Plane(new THREE.Vector3(0, - 1, 0), 0.8)
        const globalPlane = new THREE.Plane(new THREE.Vector3(- 1, 0, 0), 0.1)
        // TorusKnotGeometry(圆环缓冲扭结几何体)：创建一个会员扭结
        // TorusKnotGeometry(radius(圆环半径,默认1), tube(管道半径，默认0.4), tubularSegments(管道分段数量，默认64), radialSegments(横截面分段数量，默认8), p(绕旋转对称轴旋转次数，默认2), q(绕内部圆环旋转次数，默认3))
        const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20)
        // MeshPhongMaterial具有镜面高光的光泽表面材质
        const material = new THREE.MeshPhongMaterial({
          color: 0x80ee10,
          shininess: 100,
          side: THREE.DoubleSide,
          clippingPlanes: [localPlane], // 只横着裁剪，不竖着裁剪
          // clipShadows：设置裁剪阴影
          clipShadows: true,
        })

        object = new THREE.Mesh(geometry, material)
        // 对mesh对象来说，有两个参数控制它们与灯光和阴影的交互方式，.castShadow如果对象遮挡光线，则设置为true,以便投射阴影；.receiveShadow如果对象接受阴影，则设置为true,两者默认都会false
        object.castShadow = true
        scene.add(object)

        // PlaneGeometry为平面缓冲集合体，PlaneGeometry(width(平面沿x轴宽度，默认1), height(平面沿y轴高度，默认1), widthSegments(可选，平面宽度分段数，默认1), heightSegments(可选，平面高度分段数，默认1))
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(9, 9, 1, 1),
          new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
        )
        ground.rotation.x = - Math.PI / 2 // rotates X/Y to X/Z
        ground.receiveShadow = true
        scene.add(ground)

        const helpers = new THREE.Group();
        helpers.add(new THREE.PlaneHelper(localPlane, 2, 0xff0000));
        helpers.add(new THREE.PlaneHelper(globalPlane, 2, 0x00ff00));
        helpers.visible = false;
        scene.add(helpers);

        stats = new Stats()
        threeDiv.appendChild(stats.dom)

        const globalPlanes = [globalPlane]
        // Object.freeze()：可以冻结一个对象，一个被冻结的对象不能被修改，不能向其添加新的属性，不能删除已有属性，对其原型上也不能修改，否则会直接报错
        const Empty = Object.freeze([])
        renderer.clippingPlanes = Empty // GUI sets it to globalPlanes
        renderer.localClippingEnabled = true
        // 关联空间数据创建交互界面， GUI是款苏搭建three.js的交互ui
        const gui = new GUI()
        const folderLocal = gui.addFolder('Local Clipping') // 添加菜单文件夹
        // 声明对象设置获取一个交互UI的get和set的方法回调,get设定值，set查询值
        const propsLocal = {
          get 'Enabled'() {
            return renderer.localClippingEnabled
          },
          set 'Enabled'(v) {
            renderer.localClippingEnabled = v
          },
          get 'Shadows'() {
            return material.clipShadows
          },
          set 'Shadows'(v) {
            material.clipShadows = v
          },
          get 'Plane'() {
            return localPlane.constant
          },
          set 'Plane'(v) {
            localPlane.constant = v
          }
        }

        const folderGlobal = gui.addFolder('Global Clipping')
        const propsGlobal = {
          get 'Enabled'() {
            return renderer.clippingPlanes !== Empty
          },
          set 'Enabled'(v) {
            renderer.clippingPlanes = v ? globalPlanes : Empty
          },
          get 'Plane'() {
            return globalPlane.constant
          },
          set 'Plane'(v) {
            globalPlane.constant = v
          }
        }

        // 设置辅助线
        gui.add(params, 'showHelpers').name('show helpers').onChange(function (value) {
          helpers.visible = value;
          render();
        });
        // 添加下拉菜单选项
        folderLocal.add(propsLocal, 'Enabled')
        folderLocal.add(propsLocal, 'Shadows')
        folderLocal.add(propsLocal, 'Plane', 0.3, 1.25) // 后面0.3和1.25是拉动条的最大值和最小值

        folderGlobal.add(propsGlobal, 'Enabled')
        folderGlobal.add(propsGlobal, 'Plane', - 0.4, 3)
        startTime = Date.now()

        folderLocal.open()
        folderGlobal.open()
        // gui.removeFolder(folderLocal)
        // gui.removeFolder(folderGlobal)
        // gui.hide() 隐藏 gui.show() 显示 gui.close() 收起 gui.open() 展开
      }

      // function initGui() {

      // }

      function onWindowResize() {
        camera.aspect = scrollWidth / scrollHeight
        camera.updateProjectionMatrix()
        renderer.setSize(scrollWidth - 25, scrollHeight - 25)
      }

      function render() {//渲染器执行设置
        const currentTime = Date.now()
        const time = (currentTime - startTime) / 1000
        requestAnimationFrame(render)//再次渲染
        object.position.y = 0.8
        object.rotation.x = time * 0.5
        object.rotation.y = time * 0.2
        object.scale.setScalar(Math.cos(time) * 0.125 + 0.875)

        stats.begin()
        renderer.render(scene, camera)
        stats.end()
      }
    },

    // Options () {
    //   this.isGui = true
    // },

    handleArrowBack() {
      // console.log(this.guiDiv, 'guiDiv')
      this.guiDiv.style.display = 'none'
      const guiContent = document.querySelector('.dg.a')
      this.guiDiv.removeChild(guiContent)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
