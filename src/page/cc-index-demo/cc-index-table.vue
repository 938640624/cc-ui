<template>
    <div class="cc-index-table-page">
      <cc-header
        :headtitle="'indexTable(调整右下宽高)'"
      />
      <cc-scroll>
        <cc-index-table>
          <template v-slot:table-content>
            <div class="index-content">
              我是只能右上的div
            </div>
          </template>
        </cc-index-table>
      </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-index-table-page'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccIndexTable from '../../components/cc-index-table/cc-index-table'
export default {
    name: COMPONENT_NAME,
    components: {
      ccHeader,
      ccScroll,
      ccIndexTable
    },
    data() {
        return {

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
  .index-content {
    width: 600px;
    height: 400px;
    background-color: #FFE4C4;
  }
</style>
