<template>
  <div class="cc-highlight-page">
    <cc-header :headtitle="'HighLight(高亮呼吸灯)'" />
    <cc-scroll>
      <div class="threeDiv"></div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "cc-highlight-page";
import * as THREE from "three";
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "../../../node_modules/three/examples/jsm/postprocessing/OutlinePass.js";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
  },
  mounted() {
    this.initView();
  },
  data() {
    return {};
  },
  methods: {
    initView() {
      // 找到div元素
      let container = document.createElement("div");
      const scrollWidth = document.querySelector(".cc-scroll").offsetWidth;
      const scrollHeight = document.querySelector(".cc-scroll").offsetHeight;
      let threeDiv = document.querySelector(".threeDiv");
      threeDiv.appendChild(container);

      //相机，场景，渲染器
      let camera, scene, renderer;

      let boxMesh, cyMesh, sphereMesh;
      let composer, outlinePass;
      // let selectedObjects = [];

      //射线
      let raycaster = new THREE.Raycaster();
      let mouse = new THREE.Vector2();

      //轨道控件
      let orbitControls;

      main(); // 主函数运行
      render(); // 渲染器执行
      function main() {
        initRenderer(); //渲染操作
        initScene(); //场景
        initCamera(); //相机
        initControls(); //轨道控制器
        initLights(); //光源
        box1(); //立方体
        box2(); //圆柱体
        sphere(); //球体
        // animate()
        addEventListeners(); //监听事件
      }

      function initScene() {
        //场景设置
        scene = new THREE.Scene();
      }

      function initCamera() {
        //相机设置
        // var width = window.innerWidth; //窗口宽度
        // var height = window.innerHeight; //窗口高度
        // var k = width / height; //窗口宽高比
        var k = scrollWidth / scrollHeight;
        var s = 100; //三维场景缩放系数
        //创建相机对象
        // camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000)
        // camera.position.set(200, 30, 50); // 设置相机位置
        camera.position.set(250, 250, 150); // 设置相机位置
        // camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
        camera.lookAt(new THREE.Vector3(10, 40, 0))
        scene.add(camera)
      }

      function initRenderer() {
        //渲染器设置
        renderer = new THREE.WebGLRenderer({antialias:true}); //antialias:true增加抗锯齿效果
        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0xb9d3ff, 1); //设置窗口背景颜色为天蓝色
        // renderer.setSize(window.innerWidth, window.innerHeight); //设置窗口尺寸
        renderer.setSize(scrollWidth - 25, scrollHeight - 25);
        threeDiv.appendChild(renderer.domElement); //将renderer关联到container，这个过程类似于获取canvas元素
      }

      function initControls() {
        //轨道控制器设置
        orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.target = new THREE.Vector3(0, 0, 0); //控制焦点
        orbitControls.autoRotate = false; //将自动旋转关闭
      }

      function initLights() {
        var point = new THREE.PointLight(0xffffff); //点光源
        point.position.set(400, 200, 300); //点光源位置
        scene.add(point); //点光源添加到场景中
        var ambient = new THREE.AmbientLight(0x444444); //环境光
        scene.add(ambient); //环境光添加到场景中
      }

      function box1() {
        let box = new THREE.BoxGeometry(40, 40, 40);
        let boxMaterial = new THREE.MeshLambertMaterial({
          color: 0x008080,
        });
        boxMesh = new THREE.Mesh(box, boxMaterial);
        boxMesh.name = "boxMesh";
        scene.add(boxMesh);
        boxMesh.translateX(40);
        boxMesh.translateY(70);
        boxMesh.translateZ(90);
      }

      function box2() {
        let cylindrical = new THREE.CylinderGeometry(20, 30, 50, 40);
        let cyMaterial = new THREE.MeshLambertMaterial({
          color: 0xaedd81,
        });
        cyMesh = new THREE.Mesh(cylindrical, cyMaterial);
        cyMesh.name = "cyMesh";
        scene.add(cyMesh);
        cyMesh.translateX(180);
        cyMesh.translateY(85);
        cyMesh.translateZ(-20);
      }

      function sphere() {
        let sphereGeo = new THREE.SphereGeometry(10, 40, 40);
        let sphereMaterial = new THREE.MeshLambertMaterial({
          color: 0x808080,
        });
        sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
        sphereMesh.position.set(0, -20, 0);
        sphereMesh.name = "sphereMesh";
        scene.add(sphereMesh);
      }

      function addEventListeners() {
        renderer.render(scene, camera);
        //监听事件设置
        window.addEventListener("click", outlineObj, false);
      }

      function outlineObj(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects,
          selectedObjects = [];
        intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          console.log(intersects[0].object, "intersects");
          selectedObjects.push(intersects[0].object);
          composer = new EffectComposer(renderer);
          var renderPass = new RenderPass(scene, camera); // 添加RenderPass通道，会渲染场景，但不会将渲染结果输出到屏幕上
          composer.addPass(renderPass); // 特效渲染， 添加通道
          outlinePass = new OutlinePass(
            new THREE.Vector2(scrollWidth, scrollHeight),
            scene,
            camera
          );
          composer.addPass(outlinePass); // 加入高光特效

          outlinePass.visibleEdgeColor.set(0xfc9d99); // 高光颜色
          outlinePass.hiddenEdgeColor.set(0xeb7347); // 阴影颜色
          outlinePass.pulsePeriod = 2; //数值越大，律动越慢
          outlinePass.usePatternTexture = false; // 使用纹理覆盖？
          outlinePass.edgeStrength = 15; // 高光边缘强度
          outlinePass.edgeGlow = 1; // 边缘微光强度
          outlinePass.edgeThickness = 3; // 高光厚度
          outlinePass.selectedObjects = selectedObjects; // 需要高光的obj

          orbitControls.update();
          renderer.render(scene, camera);
          if (composer !== null) {
            composer.render();
          }
        }
      }

      function render() {
        //渲染器执行设置
        // var clock = new THREE.Clock(); //用于更新轨道控制器
        // var delta = clock.getDelta();
        // orbitControls.update(delta);
        orbitControls.update()
        requestAnimationFrame(render); //再次渲染
        composer && composer.render();
        // renderer.render(scene, camera); //执行渲染
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
