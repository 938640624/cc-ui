<template>
    <div class="cc-full-table-page">
      <cc-header
        :headtitle="'FullTable(调整全部宽高)'"
      />
      <cc-scroll>
        <cc-full-table>
          <template v-slot:table-content>
            <div class="index-content">
              我是全部调整的div
            </div>
          </template>
        </cc-full-table>
      </cc-scroll>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-full-table-page'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccFullTable from '../../components/cc-index-table/cc-full-table'
export default {
    name: COMPONENT_NAME,
    components: {
      ccHeader,
      ccScroll,
      ccFullTable
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
  .cc-full-table-page {
    position: relative;
  }
  .index-content {
    width: 600px;
    height: 400px;
    background-color: #FFE4C4;
    text-align: center;
    position: absolute;
    border: 10px solid lightcoral;
  }
</style>