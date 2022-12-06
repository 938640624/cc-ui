<template>
    <div class="cc-toast">
      <div :class="coverLayerVisible ? 'cover-layer' : ''"></div>
      <div class="popover-content" v-show="toolVisible">
        <template v-if="circleTool ">
          <circle-tool />
        </template>
        <template v-else>
          <div class="popover-content-text1"><i :class="elIconSelect"></i></div>
        </template>
        <div class="popover-content-text2">{{popoverText}}</div>
      </div>
    </div>
</template>
<script>
import CircleTool from '../tools/circle-tool.vue'
const COMPONENT_NAME = 'cc-toast'
export default {
    name: COMPONENT_NAME,
    components: {
        CircleTool
    },
    props: {
      popoverText: {  // 文字提示内容
        type: String,
        default: ''
      },
      toolVisible: {  // 是否出现文字提示
        type: Boolean,
        default: false
      },
      coverLayerVisible: {  // 是否出现遮蔽层
        type: Boolean,
        default: false
      },
      elIconSelect: {
        type: String,
        default: 'el-icon-success'
      },
      circleTool: {
        type: Boolean,
        default: false
      }
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
  .popover-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #303139;
    padding: 13px 16px;
    color: #ccc;
    border-radius: 2px ;
    display: flex;
  }
  .popover-content-text1>i {
    font-size: 24px;
  }
  .popover-content-text2 {
    letter-spacing: 2px;
    padding-left: 6px;
    font-size: 14px;
    line-height: 24px;
  }
</style>