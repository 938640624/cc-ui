<template>
	<div class="cc-alipay-page">
		<cc-header :headtitle="'action-sheet(操作列表)'"/>
		<cc-scroll>
			<div class="main">
				<div class="circle"></div>
				<div class="circle"></div>
				<div class="circle"></div>
				<div class="circle"></div>
				<div class="circle"></div>
				<div class="center">
					<img src="../../assets/image/靶标系统.png" alt="">
				</div>
			</div>
		</cc-scroll>
	</div>
</template>
<script>
const COMPONENT_NAME = "cc-alipay-page";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
  },
  mounted() {
    this.getCircle();
  },
  data() {
    return {};
  },
  methods: {
    getCircle() {
      const centerDiv = document.querySelector(".center");
      const circleDiv = document.querySelectorAll(".circle");
      centerDiv.addEventListener("click", () => {
        for (var i = 0; i < circleDiv.length; i++) {
          circleDiv[i].style.animationDelay = i * 0.6 + "s";
          circleDiv[i].classList.add("go");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
	.main {
		width: 200px;
		height: 200px;
		position: relative;
		padding-top: 100px;
		margin: 200px auto;
	}
	.main > div {
		width: 200px;
		height: 200px;
		position: absolute;
		top: 0;
		left: 0;
	}
	.center {
		cursor: pointer;
	}
	.circle {
		border: 1px solid #ccc;
		border-radius: 50%;
		opacity: 0;
	}
	.circle.go {
		/*animation: change 1s linear infinite;*/
		animation-name: change;
		animation-duration: 3s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		/*animation-delay: 1s;*/
	}
	@keyframes change {
		0% {
			transform: scale(1,1);
			opacity: 0.4;
		}
		100% {
			transform: scale(4,4);
			opacity: 0;
		}
	}
</style>
