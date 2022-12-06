<template>
    <div class="cc-action-sheet">
       <cc-popover
        :visibleContent="visibleContent"
        @visible_content="handleVisibleContent"
      >
      <cc-button-group>
          <template v-if="actionSheet.title">
            <cc-button
              textColor="#333"
              fontSize="20px"
              :backgroundColor="backgroundColor"
              :border="border"
            >
              {{actionSheet.title}}
            </cc-button>
          </template>

          <template v-if="actionSheet.data">
            <template v-for="(item,index) in actionSheet.data">
              <cc-button
                :key="index"
                :textColor="item.color ? item.color : '#666'"
                :backgroundColor="backgroundColor"
                :border="border"
                :textAlign="item.align"
                @click="handleButtonSelect(item)"
              >
                {{item.content}}
              </cc-button>
            </template>
          </template>

          <template v-if="!actionSheet.pickerStyle && actionSheet.title">
            <cc-button
              textColor="#666"
              marginTop="10px"
              :backgroundColor="backgroundColor"
              :border="border"
              @click="handleButtonCancel"
            >
              取消
            </cc-button>
          </template>
          <template v-else-if="actionSheet.pickerStyle">
            <div
              class="pickerStyle"
              @click="handleButtonCancel"
            >
              取消
            </div>
          </template>
      </cc-button-group>
    </cc-popover>
    <cc-toast
      :toolVisible="toolVisible"
      :popoverText="popoverText"
    />
    </div>
</template>
<script>
import ccButtonGroup from '../cc-button/cc-button-group.vue';
import ccButton from '../cc-button/cc-button.vue';
const COMPONENT_NAME = 'cc-action-sheet'
const EVENT_VISIBLE_CONTENT = 'visible-content'
const EVENT_BUTTON_SELECT = 'button-select'
import ccPopover from '../cc-popover/cc-popover.vue';
import ccToast from '../cc-toast/cc-toast.vue';
export default {
    name: COMPONENT_NAME,
    components: {
        ccPopover,
        ccButtonGroup,
        ccButton,
        ccToast,
    },
    props: {
      border: {
        type: String,
        default: '1px solid #E6E6E6'
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      },
      visibleContent: {
        type: Boolean,
        default: false
      },
      actionSheet: {
        type: Object,
        default() {
          return {}
        }
      },
      toolVisible: {
        type: Boolean,
        default: false
      },
      popoverText: {
        type: String,
        default: ''
      }
    },
    data() {
        return {
          
        }
    },
    methods: {
    // 遮蔽层关闭
      handleVisibleContent() {
        this.$emit(EVENT_VISIBLE_CONTENT,'')
      },
    // 按钮点击事件
      handleButtonSelect(item) {
        this.$emit(EVENT_BUTTON_SELECT, item)
      },
    // 按钮取消
      handleButtonCancel() {
        this.$emit("update:visibleContent", false)
      },
    }
}
</script>
<style lang="scss" scoped>
  .pickerStyle {
    position: absolute;
    left: 20px;
    top: 20px;
    color: #999;
    font-size: 14px;
    background-color: transparent;
    cursor: pointer;
  }
</style>