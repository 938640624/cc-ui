<template>
  <div class="cc-action-sheet-page">
    <cc-header
      :headtitle="'action-sheet(操作列表)'"
    />
    <cc-scroll>
      <cc-button-group>
        <cc-button class="margiTop" @click="showDefault">默认动作</cc-button>
        <cc-button class="margiTop" @click="showActive">动态动作</cc-button>
        <cc-button class="margiTop" @click="showStyle">样式动作</cc-button>
      </cc-button-group>
      <cc-action-sheet
        :visibleContent.sync="visibleContent"
        :actionSheet="actionSheet"
        :toolVisible="toolVisible"
        :popoverText="popoverText"
        @visible-content="handleVisibleContent"
        @button-select="handleButtonSelect"
      >
      </cc-action-sheet>

  </cc-scroll>

  </div>
</template>
<script>
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccButtonGroup from "../../components/cc-button/cc-button-group.vue";
import ccButton from "../../components/cc-button/cc-button.vue";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccActionSheet from '../../components/cc-action-sheet/cc-action-sheet.vue';

const COMPONENT_NAME = "cc-action-toast";
const EVENT_SHOW_ACTION = "show_action"
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccButtonGroup,
    ccButton,
    ccScroll,
    ccActionSheet,
  },
  data() {
    return {
      visibleContent: false,
      toolVisible: false,
      popoverText: null,
      actionSheet: {}
    };
  },
  methods: {
    showDefault() {
      console.log("默认动作");
      this.actionSheet = {
        title: "我是标题~~~",
        data: [
          {
            content: "align - center",
          },
          {
            content: "align - left",
            align: "left",
          },
          {
            content: "align - right",
            align: "right",
          },
        ],
      }
      this.visibleContent = true
      this.$emit(EVENT_SHOW_ACTION, this.actionSheet)
    },
    showActive() {
      console.log("动态动作");
      this.actionSheet = {
        title: "我是动态动作~~~",
        data: [
          {
            content: "舒适型",
            color: "#fc9153"
          },
          {
            content: "七座商务",
            align: "center",
          },
          {
            content: "豪华型",
            color: "#AEDD81",
            align: "center",
          },
        ],
      }
      this.visibleContent = true
      this.$emit(EVENT_SHOW_ACTION, this.actionSheet)
    },
    showStyle() {
      console.log("样式动作");
      this.actionSheet = {
        title: "我是样式动作~~~",
        pickerStyle: true,
        data: [
          {
            content: "舒适型",
          },
          {
            content: "七座商务",
          },
          {
            content: "豪华型",
          },
        ],
      }
      this.visibleContent = true
      this.$emit(EVENT_SHOW_ACTION, this.actionSheet)
    },
    // 遮蔽层关闭
    handleVisibleContent() {
      this.visibleContent = false
    },
    // 按钮点击事件
    handleButtonSelect(item) {
      this.visibleContent = false
      this.toolVisible = true
      this.popoverText = item.content
      setTimeout(() => {
        this.toolVisible = false
      }, 1500)
    },
  },
};
</script>
<style lang="scss" scoped>
    .cc-action-sheet-page {
      position: relative;
      overflow: hidden;
    }
    .margiTop {
      margin: 10px 10px 0px 10px;
    }
    /* .cover-layer-fade-enter, .cover-layer-fade-leave-to {
      opacity: 0;
    }
    .cover-layer-fade-enter-active, .cover-layer-fade-leave-active {
      transition: opacity 4s ease;
    }
    .cover-layer-fade-leave, .cover-layer-fade-enter-to {
      opacity: 0.4;
    } */
</style>
