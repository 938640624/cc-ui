<template>
    <div class="cc-element-table-page">
      <cc-header
      :headtitle="'elementTable(UI模板)'"
      />
      <cc-scroll>
        <ccElementTable>
          
        </ccElementTable>
      </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-element-table-page'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccElementTable from '../../components/cc-index-table/cc-element-table'
export default {
    name: COMPONENT_NAME,
    components: {
      ccHeader,
      ccScroll,
      ccElementTable
    },
    data() {
        return {
          cursorDirection: ''
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
  /* .cc-index-table-page {
    position: relative;
  } */
</style>