<template>
  <div class="progress-bar-page">
    <cc-header :headtitle="'progress-bar(进度条)'"/>
    <cc-scroll>
      <progress-bar></progress-bar>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'progress-bar-page'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import progressBar from "../../components/cc-progress-bar/cc-progress-bar.vue"
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
    progressBar
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
<style  lang='scss' scoped>
</style>
