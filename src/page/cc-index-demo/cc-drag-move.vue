<template>
    <div class="cc-drag-move-page">
      <cc-header :headtitle="'drag-move(拖拽盒子)'" />
      <cc-scroll>
        <cc-drag-move>
          <template v-slot:dragmove-content>
            <div class="dragmoveDiv">我是可以拖拽的DIV</div>
          </template>
        </cc-drag-move>    
      </cc-scroll>
      
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-drag-move-page'
import ccHeader from "../../components/cc-header/cc-header.vue"
import ccScroll from "../../components/cc-scroll/cc-scroll.vue"
import ccDragMove from '../../components/cc-index-table/cc-drag-move'
export default {
    name: COMPONENT_NAME,
    components: {
      ccHeader,
      ccScroll,
      ccDragMove
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
  .cc-drag-move-page {
    position: relative;
  }
  .dragmoveDiv {
    width: 600px;
    height: 400px;
    background-color: #FFE4C4;
    text-align: center;
    position: absolute;
    border: 10px solid lightcoral;
  }
</style>