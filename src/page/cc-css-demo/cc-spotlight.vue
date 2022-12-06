<template>
  <div class="cc-spotlight">
    <cc-header :headtitle="'聚光灯效果'"/>
    <cc-scroll class="scroll">
      <div class="cc-text-h1">
        <h1 dot-light="如果那两个字没说出口">如果那两个字没说出口</h1>
      </div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-spotlight'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
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
  mounted() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
/* .cc-text-h1 {
  text-align: center;
} */
.scroll {
  background: #1E1E1E;
}
h1 {
    font-size: 70px;
    font-family: Helvetica;
    letter-spacing: -.3rem;
    color: #333;
    position: relative;
}
h1::after {
    content: attr(dot-light);
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    clip-path: ellipse(100px 100px at 0% 50%);
    animation: SpotLight 3s infinite;
    background-size: 150%;
    background-position: center center;
    -webkit-background-clip: text;
    background-clip: text;
}
@keyframes SpotLight{
  0% {
    clip-path: ellipse(100px 100px at 0% 50%);
    }

  50% {
    clip-path: ellipse(100px 100px at 100% 50%);
  }

  100% {
    clip-path: ellipse(100px 100px at 0% 50%);
  }
}
</style>
