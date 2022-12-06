<template>
  <div class="cc-button">
    <button
      class="cc-btn"
      :type="type"
      :style="btnClass"
      :class="cancelItem1"
      @click="handleClick($event)"
    >
      <i class="icon"></i>
      <slot></slot>
    </button>
  </div>
</template>
<script>
const COMPONENT_NAME = "cc-button";
const BUTTON_CLICK = 'click'
export default {
  name: COMPONENT_NAME,
  props: {
    type: {
      type: String,
      default: "button",
    },
    textColor: {
      type: String,
      default: "#fff"
    },
    textAlign: {
      type: String,
      default: "center"
    },
    fontSize: {
      type: String,
      default: "16px"
    },
    backgroundColor: {
      type: String,
      default: "#4A4C5B"
    },
    fontWeight: {
      type: String,
      default: "normal"
    },
    border: {
      type: String,
      default: "none"
    },
    marginTop: {
      type: String,
      default: ""
    },
    cancelItem1: {
      type: String,
      default: ""
    }
  },
  computed: {

    },
  data() {
    return {
      btnClass: {
        'color': this.textColor,
        'text-align': this.textAlign,
        'font-size': this.fontSize,
        'background-color': this.backgroundColor,
        'font-weight': this.fontWeight,
        'border': this.border,
        'margin-top': this.marginTop
      }
    };
  },
  methods: {
    handleClick(event) {
      this.$emit(BUTTON_CLICK, event);
    },
  },
};
</script>
<style lang="scss" scoped >
$btnColor: btnColor;
  .cc-btn {
    display: block;
    padding: 17px 16px;
    width: 100%;
    white-space: nowrap;
    cursor: pointer;
    line-height: 1;
    outline: none;
    border-radius: 2px;
    box-sizing: border-box;
  }
  
</style>
