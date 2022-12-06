<template>
  <div class="cc-animation-all">
    <div class="animation-content">
      <div class="animation-box" v-for="(item, index) in options" :key="index">
        <div
          class="animation-circle"
          :class="`before${item.type}`"
          @click="animationChange(item)"
        >
          {{ item.name }}
        </div>
        <div class="animation-text">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// css两大动画：transition和animation
// transition: 指定状态变化所需要的时间
// 参数：
// transition-delay： 1s(变化所需时间)
// transition-timing-function: ease(状态变化速度) ease(匀速)|ease-in(加速)|ease-out(减速)|cubic-bezier函数(自定义速度模式,制作网站https://cubic-bezier.com/#.28,.69,.57,.34)
// transition-property：height(应用过渡属性的名称)
// transition-duration: 0(0s表示不出现过渡动画)为单位指定过渡动画所需的时间
// transition: 1s 1s height ease; :高度匀速变化，变化时间和动画持续时间都是1s

// transition使用注意点和局限：
// 各大浏览器（包括IE 10）都已经支持无前缀的transition，不是所有css属性都支持，需要明确知道开始状态和结束状态的具体数值才能计算出中间状态，auto等属性无法使用
// 优点是简单好用，局限性是需要事件触发，不能网页加载时自动发生，比如hover事件;
// 是一次性的，不能设置重复，只能重新触发；
// 只能定义开始和结束状态，不能定义中间状态；
// 一条transition只能定义一个属性的变化，不能涉及多个属性

// animation: 指定动画一个周期持续的时间，以及动画效果的名称
// animation-name：指定要绑定到选择器的关键帧的名称
// animation-duration：定义动画完成一个周期需要多少秒或毫秒
// animation-timing-function：指定动画将如何完成一个周期
// 参数:
// linear	动画从头到尾的速度是相同的。
// ease	默认。动画以低速开始，然后加快，在结束前变慢。
// ease-in	动画以低速开始。
// ease-out	动画以低速结束。
// ease-in-out	动画以低速开始和结束。
// cubic-bezier(n,n,n,n)	在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。
// step-start	在变化过程中，都是以下一帧的显示效果来填充间隔动画
// step-end	在变化过程中，都是以上一帧的显示效果来填充间隔动画
// steps()	可传入两个参数，第一个是大于0的整数，将动画等分成指定数目的小间隔动画，根据第二个参数来决定显示效果。第二个参数设置后和step-start，step-end同义，在分成的小间隔动画中判断显示效果。

// animation-delay：定义动画什么时候开始
// animation-iteration-count ：定义动画应该播放多少次
// animation-direction：定义是否循环交替反向播放动画
// animation-fill-mode：规定当动画不播放时（当动画完成时，或当动画有一个延迟未开始播放时），要应用到元素的样式
// animation-play-state：指定动画是否正在运行或已暂停

const COMPONENT_NAME = "cc-animation-all";
import { addClass, removeClass } from "../../helper/utils/class.js"
export default {
  name: COMPONENT_NAME,
  components: {},
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {},
  data() {
    return {
			animationTimeControl: false
		};
  },
  methods: {
    animationChange(item) {
      const animationCircle = event.target;
      if (item.type === "bottom") {
        animationCircle.style.bottom = "-60px";
        setTimeout(() => {
          animationCircle.style.bottom = "0";
        }, 1000);
      } else if (item.type === "top") {
        animationCircle.style.top = "-60px";
        setTimeout(() => {
          animationCircle.style.top = "0";
        }, 1000);
      } else if (item.type === "left") {
        animationCircle.style.left = "-60px";
        setTimeout(() => {
          animationCircle.style.left = "0";
        }, 1000);
      } else if (item.type === "right") {
        animationCircle.style.right = "-60px";
        setTimeout(() => {
          animationCircle.style.right = "0";
        }, 1000);
      } else if (item.type === "scale") {
        animationCircle.style.transform = "scale(2)";
        setTimeout(() => {
          animationCircle.style.transform = "scale(1)";
        }, 1000);
      } else if (item.type === "scalesmall") {
        animationCircle.style.transform = "scale(0.2)";
        setTimeout(() => {
          animationCircle.style.transform = "scale(1)";
        }, 1000);
      } else if (item.type === "fadein") {
        animationCircle.style.opacity = "0";
        setTimeout(() => {
          animationCircle.style.opacity = "1";
        }, 1000);
      } else if (item.type === "fadeout") {
        animationCircle.style.opacity = 1;
        setTimeout(() => {
          animationCircle.style.opacity = 0;
        }, 1000);
      } else if (item.type === "rotate") {
        animationCircle.style.transform = "rotate(360deg)";
        setTimeout(() => {
          animationCircle.style.transform = "rotate(0)";
        }, 1000);
      } else if (item.type === "loop") {
				this.animationTimeControl = !this.animationTimeControl
				if (this.animationTimeControl) {
					addClass(animationCircle, 'animation-time')
				} else {
					removeClass(animationCircle, 'animation-time')
				}
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.animation-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.animation-box {
  width: 260px;
  height: 260px;
  border: 1px solid #edf0f4;
  padding: 40px 0px;
  margin: 10px 10px;
  box-sizing: border-box;
}

.animation-circle {
  width: 150px;
  height: 150px;
  line-height: 150px;
  margin: 0 auto 10px;
  text-align: center;
  background-color: #009688;
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  position: relative;
  transition: 0.2s all ease-in;
}

.beforebottom {
  bottom: 0;
}
.beforetop {
  top: 0;
}
.beforeleft {
  left: 0;
}
.beforeright {
  right: 0;
}
.beforescale {
  transform: scale(1);
}
.beforescalesmall {
  transform: scale(1);
}
.beforefadein {
  opacity: 1;
}
.beforefadeout {
  opacity: 0;
}
.beforerotate {
  transform: rotate(0);
}
.beforeloop {
  animation-name: layui-rotate;
  animation-duration: 1s;
  animation-timing-function: linear;
}
.animation-time {
  animation-iteration-count: infinite;
}
/* 循环旋转 */
@keyframes layui-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animation-text {
  text-align: center;
  font-size: 14px;
  text-align: center;
  color: #666;
  line-height: 22px;
}
</style>
