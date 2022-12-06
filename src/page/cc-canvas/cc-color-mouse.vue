<template>
	<div class="cc-color-mouse">
		<cc-header :headtitle="'炫彩鼠标'"/>
		<cc-scroll>
			<canvas class="canvas" width="1150" height="800"></canvas>
		</cc-scroll>
	</div>
</template>
<script>
const COMPONENT_NAME = "cc-color-mouse";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
  },
  mounted() {
    this.getCanvas();
  },
  data() {
    return {};
  },
  methods: {
    getCanvas() {
      var canvas = document.querySelector("canvas");
      var ctx = canvas.getContext("2d");
      // 图形类
      function Circle(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;

        // 颜色取值范围
        this.color =
          "rgb(" +
          (parseInt(Math.random() * 240) + 9) +
          "," +
          (parseInt(Math.random() * 220) + 18) +
          ",203)";
        // 随机方向
        this.dx = Math.random() * 12 - 7;
        this.dy = Math.random() * 12 - 7;
        // 往数组中push自己
        circleArr.push(this);
      }

      // 数据渲染
      Circle.prototype.render = function() {
        //新建一条路径
        ctx.beginPath();
        //创建一个圆
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        //设置样式颜色
        ctx.fillStyle = this.color;
        //通过填充路径的内容区域生成实心的图形
        ctx.fill();
      };

      // 数据更新
      Circle.prototype.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        this.r--;
        if (this.r < 0) {
          for (var i = 0; i < circleArr.length; i++) {
            if (circleArr[i] === this) {
              circleArr.splice(i, 1);
            }
          }
          return false;
        }
        return true;
      };
      var circleArr = [];

      // 鼠标移动事件
      canvas.addEventListener("mousemove", (event) => {
        new Circle(event.clientX - 360, event.clientY - 80, 30, "orange");
      });

      //设置定时器每20毫秒更新和渲染
      setInterval(function() {
        ctx.clearRect(0, 0, 1150, 800);
        for (var i = 0; i < circleArr.length; i++) {
          circleArr[i].update() && circleArr[i].render();
        }
      }, 20);
    },
  },
};
</script>
<style lang="scss" scoped>
ol,
ul,
li {
  list-style: none;
}
</style>