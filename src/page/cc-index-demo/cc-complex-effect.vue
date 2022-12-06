<template>
  <div class="cc-complex-effect-page">
    <cc-header :headtitle="'ComplexEffect(蛮吊的特效)'"/>
    <cc-scroll>
      <cc-complex-effect />
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-complex-effect-page'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccComplexEffect from "../../components/cc-index-table/cc-complex-effect.vue"
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
    ccComplexEffect
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
</style>
