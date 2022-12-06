<template>
  <div class="cc-animation-all-page">
		<cc-header :headtitle="'animation-all(动画效果)'"/>
    <cc-scroll>
			<cc-animation-all
        :options="options"
      >
			</cc-animation-all>
		</cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-animation-all-page'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccAnimationAll from '../../components/cc-index-table/cc-animation-all.vue'
export default {
  name: COMPONENT_NAME,
  components: {
		ccHeader,
    ccScroll,
		ccAnimationAll
  },
  mounted() {

  },
  data() {
    return {
      options: [ 
        {
          type: 'bottom',
          name: '顶部向下滑动',
          text: 'animation-down'
        },
        {
          type: 'top',
          name: '顶部向上滑动',
          text: 'animation-up'
        },
        {
          type: 'left',
          name: '顶部向左滑动',
          text: 'animation-left'
        },
        {
          type: 'right',
          name: '顶部向右滑动',
          text: 'animation-right'
        },
        {
          type: 'scale',
          name: '平滑放大',
          text: 'animation-scall'
        },
        {
          type: 'scalesmall',
          name: '平滑缩小',
          text: 'animation-scalesmall'
        },
        {
          type: 'fadein',
          name: '逐渐消失',
          text: 'animation-fadein'
        },
        {
          type: 'fadeout',
          name: '逐渐出现',
          text: 'animation-fadeout'
        },
        {
          type: 'rotate',
          name: '360度旋转',
          text: 'animation-rotate'
        },
        {
          type: 'loop',
          name: '循环旋转',
          text: 'animation-loop'
        },
      ]
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>