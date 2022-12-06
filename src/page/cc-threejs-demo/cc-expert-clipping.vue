<template>
  <div class="cc-expert-clipping-page">
    <cc-header :headtitle="'裁剪进阶图形'"
               @arrow-back="handleArrowBack" />
    <cc-scroll>
      <div class="threeDiv"></div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-expert-clipping       -page'
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
      let camera, scene, renderer, object, clock
      let planes, planeObjects, planeHelpers

      //轨道控件
      let controls

      const params = {
        animate: true,
        planeX: {
          constant: 0,
          negated: false,
          displayHelper: false
        },
        planeY: {
          constant: 0,
          negated: false,
          displayHelper: false
        },
        planeZ: {
          constant: 0,
          negated: false,
          displayHelper: false
        }
      };

      planes = [
        new THREE.Plane(new THREE.Vector3(- 1, 0, 0), 0),
        new THREE.Plane(new THREE.Vector3(0, - 1, 0), 0),
        new THREE.Plane(new THREE.Vector3(0, 0, - 1), 0)
      ]

      clock = new THREE.Clock()

      main() // 主函数运行
      render() // 渲染器执行

      function main() {
        initRenderer() //渲染操作
        initScene() //场景
        initCamera() //相机
        initControls() //轨道控制器
        initLights() //光源
        exportModel() // 裁剪图形
      }

      function initScene() {
        //场景设置
        scene = new THREE.Scene()
      }

      function initCamera() {
        // PerspectiveCamera(透视相机), 用来模拟人眼看到的景象
        // PerspectiveCamera(fov(摄像机视锥体垂直视野角度,类似于人肉眼所见距离), aspect(摄像机视锥体长宽比), near(摄像机视锥体近端面), far(摄像机视锥体远端面))
        camera = new THREE.PerspectiveCamera(76, (scrollWidth - 25) / (scrollHeight - 25), 1, 100)
        camera.position.set(2, 2, 2)
      }

      function initRenderer() {
        //渲染器设置
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.setSize(scrollWidth - 25, scrollHeight - 25)
        renderer.setClearColor(0x263238);
        renderer.localClippingEnabled = true
        threeDiv.appendChild(renderer.domElement)
        window.addEventListener('resize', onWindowResize)
      }

      function initControls() {
        //轨道控制器设置
        controls = new OrbitControls(camera, renderer.domElement)
        controls.target = new THREE.Vector3(0, 0, 0) //控制焦点
        controls.minDistance = 1
        controls.maxDistance = 10
        controls.enablePan = false
        controls.update();
      }

      function initLights() {
        var ambient = new THREE.AmbientLight(0x444444, 0.5) //环境光
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
        spotLight.shadow.mapSize.width = 218
        spotLight.shadow.mapSize.height = 218
        scene.add(spotLight)

        // DirectionalLight(平行光)：沿着特定方向发射的光，像是从无穷远的地方发出，通常用来模拟太阳光的效果，也可以投射阴影
        const dirLight = new THREE.DirectionalLight(0xffffff, 1)
        dirLight.position.set(5, 10, 7.5)
        dirLight.castShadow = true
        dirLight.shadow.camera.near = 1
        dirLight.shadow.camera.far = 10
        dirLight.shadow.camera.right = 2
        dirLight.shadow.camera.left = - 2
        dirLight.shadow.camera.top = 2
        dirLight.shadow.camera.bottom = - 2
        dirLight.shadow.mapSize.width = 1024
        dirLight.shadow.mapSize.height = 1024
        scene.add(dirLight)

      }

      function exportModel() {
        // 设置裁剪辅助线颜色并且隐藏
        planeHelpers = [
          new THREE.PlaneHelper(planes[0], 2, 0xff0000),
          new THREE.PlaneHelper(planes[1], 2, 0x00ff00),
          new THREE.PlaneHelper(planes[2], 2, 0x0000ff)
        ]
        planeHelpers.forEach(ph => {
          ph.visible = false;
          scene.add(ph);
        });

        // TorusKnotGeometry(圆环缓冲扭结几何体)：创建一个会员扭结
        // TorusKnotGeometry(radius(圆环半径,默认1), tube(管道半径，默认0.4), tubularSegments(管道分段数量，默认64), radialSegments(横截面分段数量，默认8), p(绕旋转对称轴旋转次数，默认2), q(绕内部圆环旋转次数，默认3))
        const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 220, 60);
        object = new THREE.Group();
        scene.add(object);

        planeObjects = []; // 设置剪辑平面渲染
        const planeGeom = new THREE.PlaneGeometry(4, 4);
        for (let i = 0; i < 3; i++) {
          const poGroup = new THREE.Group();
          const plane = planes[i];
          const stencilGroup = createPlaneStencilGroup(geometry, plane, i + 1);

          // 平面被其他裁剪平面裁剪
          const planeMat =
            // MeshStandardMaterial(标准网格材质)：计算着色和MeshPhongMaterial相同，都使用Phong着色模型，会计算每个像素的阴影
            new THREE.MeshStandardMaterial({
              color: 0xE91E63,
              // wireframe: true,
              // metalness(材质与金属的相似度，非金属用0.1, 金属用1.0,是生锈的程度)
              metalness: 0.1,
              // roughness(材质的粗糙成都，0.0表示平滑镜面反射，1.0表示完全漫反射)
              roughness: 0.75,
              clippingPlanes: planes.filter(p => p !== plane),
              stencilWrite: true,
              stencilRef: 0,
              stencilFunc: THREE.NotEqualStencilFunc,
              stencilFail: THREE.ReplaceStencilOp,
              stencilZFail: THREE.ReplaceStencilOp,
              stencilZPass: THREE.ReplaceStencilOp,
            });
          const po = new THREE.Mesh(planeGeom, planeMat);
          // onAfterRender：一个可选的回调函数，在Object3D渲染之后直接执行，可选参数为renderer, scene, camera, geometry, material, group
          po.onAfterRender = function (renderer) {
            renderer.clearStencil(); //clearStencil 清除模板
          };
          // renderOrder(Number): Number使场景图scene gragh中默认的渲染顺序被覆盖，即使不透明对象和透明对象保持独立顺序，渲染顺序从低到高
          po.renderOrder = i + 1.1;

          object.add(stencilGroup);
          poGroup.add(po);
          planeObjects.push(po);
          scene.add(poGroup);
        }

        const material = new THREE.MeshStandardMaterial({
          color: 0xFFC107,
          metalness: 0.1,
          roughness: 0.75,
          clippingPlanes: planes,
          clipShadows: true,
          shadowSide: THREE.DoubleSide,
          // wireframe: true,
          // opacity: 0.5,
          // transparent: true
        });

        // 添加颜色
        const clippedColorFront = new THREE.Mesh(geometry, material);
        clippedColorFront.castShadow = true;
        clippedColorFront.renderOrder = 6;
        object.add(clippedColorFront);

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(9, 9, 1, 1),
          new THREE.MeshPhongMaterial({ color: 0xa0adaf, opacity: 0.25, side: THREE.DoubleSide })
        );
        ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        ground.position.y = - 1;
        ground.receiveShadow = true;
        scene.add(ground);

        const gui = new GUI();
        gui.add(params, 'animate');

        const planeX = gui.addFolder('planeX');
        planeX.add(params.planeX, 'displayHelper').onChange(v => planeHelpers[0].visible = v);
        planeX.add(params.planeX, 'constant').min(- 1).max(1).onChange(d => planes[0].constant = d);
        planeX.add(params.planeX, 'negated').onChange(() => {
          planes[0].negate();
          params.planeX.constant = planes[0].constant;
        });
        // planeX.open();

        const planeY = gui.addFolder('planeY');
        planeY.add(params.planeY, 'displayHelper').onChange(v => planeHelpers[1].visible = v);
        planeY.add(params.planeY, 'constant').min(- 1).max(1).onChange(d => planes[1].constant = d);
        planeY.add(params.planeY, 'negated').onChange(() => {
          planes[1].negate();
          params.planeY.constant = planes[1].constant;
        });
        // planeY.open();

        const planeZ = gui.addFolder('planeZ');
        planeZ.add(params.planeZ, 'displayHelper').onChange(v => planeHelpers[2].visible = v);
        planeZ.add(params.planeZ, 'constant').min(- 1).max(1).onChange(d => planes[2].constant = d);
        planeZ.add(params.planeZ, 'negated').onChange(() => {
          planes[2].negate();
          params.planeZ.constant = planes[2].constant;
        });
        // planeZ.open();
      }

      function onWindowResize() {
        camera.aspect = scrollWidth / scrollHeight
        camera.updateProjectionMatrix()
        renderer.setSize(scrollWidth - 25, scrollHeight - 25)
      }

      function render() {//渲染器执行设置
        var delta = clock.getDelta()
        requestAnimationFrame(render)//再次渲染
        if (params.animate) {
          object.rotation.x += delta * 0.5;
          object.rotation.y += delta * 0.2;
        }
        for (let i = 0; i < planeObjects.length; i++) {
          const plane = planes[i];
          const po = planeObjects[i];
          plane.coplanarPoint(po.position);
          po.lookAt(
            po.position.x - plane.normal.x,
            po.position.y - plane.normal.y,
            po.position.z - plane.normal.z,
          );
        }
        renderer.render(scene, camera)
      }

      function createPlaneStencilGroup(geometry, plane, renderOrder) {
        const group = new THREE.Group();
        const baseMat = new THREE.MeshBasicMaterial();
        baseMat.depthWrite = false;
        baseMat.depthTest = false;
        baseMat.colorWrite = false;
        baseMat.stencilWrite = true;
        baseMat.stencilFunc = THREE.AlwaysStencilFunc;

        // back faces
        const mat0 = baseMat.clone();
        mat0.side = THREE.BackSide;
        mat0.clippingPlanes = [plane];
        mat0.stencilFail = THREE.IncrementWrapStencilOp;
        mat0.stencilZFail = THREE.IncrementWrapStencilOp;
        mat0.stencilZPass = THREE.IncrementWrapStencilOp;

        const mesh0 = new THREE.Mesh(geometry, mat0);
        mesh0.renderOrder = renderOrder;
        group.add(mesh0);

        // front faces
        const mat1 = baseMat.clone();
        mat1.side = THREE.FrontSide;
        mat1.clippingPlanes = [plane];
        mat1.stencilFail = THREE.DecrementWrapStencilOp;
        mat1.stencilZFail = THREE.DecrementWrapStencilOp;
        mat1.stencilZPass = THREE.DecrementWrapStencilOp;

        const mesh1 = new THREE.Mesh(geometry, mat1);
        mesh1.renderOrder = renderOrder;

        group.add(mesh1);
        return group;
      }
    },

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
