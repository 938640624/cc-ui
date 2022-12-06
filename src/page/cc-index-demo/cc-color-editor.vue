<template>
  <div class="color-editor-page">
    <cc-header
      :headtitle="'ColorEditor(颜色选择器)'"
      @arrow-back="handleArrowBack"
    />
    <cc-scroll>
			<cc-color-editor />
		</cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "color-editor-page";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccColorEditor from "../../components/cc-index-table/cc-color-editor"
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
		ccColorEditor
  },
  mounted() {},
  data() {
    return {};
  },
  methods: {
    handleArrowBack() {
      document.getElementsByTagName('body')[0].style.setProperty('--testColor', '#EDF0F4')
    }
  },
};
</script>
<style lang="scss" scoped>

</style>