<template>
  <div class="plane-model-page">
    <cc-header :headtitle="'平面缓冲几何体(透明)+光泽地板'" />
    <cc-scroll>
      <div class="threeDiv"></div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "plane-model-page";
import * as THREE from "three";
import { AsciiEffect } from "../../../node_modules/three/examples/jsm/effects/AsciiEffect.js";
import { TrackballControls } from "../../../node_modules/three/examples/jsm/controls/TrackballControls.js";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
  },
  props: {},
  data() {
    return {};
  },
  mounted() {
    this.initView();
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
      let camera, scene, renderer, effect, sphere, plane;

      let trackballControls; //轨道控件

      const start = Date.now();

      // 设置层级
      // let layers = new THREE.Layers()

      main(); // 主函数运行
      render(); // 渲染器执行
      function main() {
        initRenderer(); //渲染操作
        initScene(); //场景
        initCamera(); //相机
        initLights(); //光源
        initSphere(); // 球
        initPlane(); // 平面
        initEffect();
        initControls(); //轨道控制器
      }

      function initScene() {
        //场景设置
        scene = new THREE.Scene();
        // scene.background = new THREE.Color(0, 0, 0);
      }

      function initCamera() {
        // camera = new THREE.PerspectiveCamera(
        //   70,
        //   (scrollWidth - 25) / (scrollHeight - 25),
        //   0.25,
        //   16
        // );
        // camera.position.set(0, 1.5, 3);
        // PerspectiveCamera(透视相机), 用来模拟人眼看到的景象
        // PerspectiveCamera(fov(摄像机视锥体垂直视野角度,类似于人肉眼所见距离), aspect(摄像机视锥体长宽比), near(摄像机视锥体近端面), far(摄像机视锥体远端面))
        camera = new THREE.PerspectiveCamera(
          90,
          (scrollWidth - 25) / (scrollHeight - 25),
          1,
          1000
        );
        camera.position.y = 150;
        camera.position.z = 500;
      }

      function initRenderer() {
        //渲染器设置
        renderer = new THREE.WebGLRenderer(); //antialias:true增加抗锯齿效果
        renderer.shadowMap.enabled = true;
        // renderer.setClearColor(0xEDF0F4, 1) //设置窗口背景颜色为天蓝色
        renderer.setSize(scrollWidth - 25, scrollHeight - 25);
      }

      function initEffect() {
        // AsciiEffect创建一个自定义的domElement(一个div容器)，用于放置ASCII元素
        // effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
        effect = new AsciiEffect(renderer, " c", { invert: true });
        effect.setSize(scrollWidth - 25, scrollHeight - 25);
        effect.domElement.style.color = "#FC9D99";
        effect.domElement.style.backgroundColor = "black";
        threeDiv.appendChild(effect.domElement);
      }

      function initControls() {
        //trackballControls 轨道球控件： 类似于OrbitControls，但是不保持恒定的相机向上矢量，在过程中不会翻转以保持正面朝上
        trackballControls = new TrackballControls(camera, effect.domElement);
        trackballControls.target = new THREE.Vector3(0, 0, 0); //控制焦点
      }

      function initLights() {
        // 光线的参数一般为颜色，颜色强度
        // AmbientLight (环境光)： 环境光会均匀的照亮场景中的所有物体，不能用来投射阴影，因为它没有方向
        // const ambient = new THREE.AmbientLight(0xffffff, 0.3); //环境光
        // scene.add(ambient); //环境光添加到场景中

        const pointLight1 = new THREE.PointLight(0xffffff);
        pointLight1.position.set(500, 500, 500);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.25);
        pointLight2.position.set(-500, -500, -500);
        scene.add(pointLight2);
      }

      function initSphere() {
        const geometry = new THREE.SphereGeometry(200, 20, 10);
        // MeshPhongMaterial具有镜面高光的光泽表面材质
        const material = new THREE.MeshPhongMaterial({ flatShading: true }); // 是否使用平面着色渲染材质
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
      }

      function initPlane() {
        const geometry = new THREE.PlaneGeometry(400, 400);
        const material = new THREE.MeshBasicMaterial({ color: 0xe0e0e0 });
        plane = new THREE.Mesh(geometry, material);
        plane.position.y = -200;
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);
      }

      function render() {
        //渲染器执行设置
        requestAnimationFrame(render); //再次渲染
        const timer = Date.now() - start;
        sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
        sphere.rotation.x = timer * 0.0003;
        sphere.rotation.z = timer * 0.0002;
        var clock = new THREE.Clock(); //用于更新轨道控制器
        var delta = clock.getDelta();
        trackballControls.update(delta);
        effect.render(scene, camera);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
