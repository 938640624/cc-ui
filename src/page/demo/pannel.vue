<template>
  <div class="pannel">
    <div class="pannel-header">
      <img
        v-if="titleImg"
        :src="titleImg"
        class="pannel-header-icon"
      >
      <svg-icon
        v-if="titleIconClass"
        :icon-class="titleIconClass"
        class="pannel-header-icon"
      />
      <div class="pannel-header-title">
        {{ title }}
      </div>
      <i
        class="pannel-header-close el-icon-close"
        @click="handleClose"
      />
    </div>

    <div
      class="pannel-content"
      :class="$slots.footer ? 'pannel-content-shrink' : ''"
    >
      <slot />
    </div>

    <template v-if="$slots.footer">
      <div class="pannel-footer">
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>

<script>
const EVENT_CLOSE = "close"

export default {
  mixins: [],
  props: {
    title: {
      type: String,
      default: "",
    },
    titleImg: {
      type: String,
      default: ""
    },
    titleIconClass: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleClose () {
      this.$emit(EVENT_CLOSE)
    }
  }
}
</script>

<style lang="scss">
.pannel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 12px;
  color: var(--color-text-normal);
  background: var(--color-background-pannel);
  border-radius: 4px;
  border: 1px solid var(--color-background-pannel-content-border);

  .pannel-header {
    display: flex;
    height: 21px;
    line-height: 21px;
    margin-bottom: 12px;
    align-items: center;
    padding: 10px 10px;

    .pannel-header-icon {
      flex: 0 0 20px;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      font-size: 16px;
    }

    .pannel-header-title {
      flex: 1;
      font-size: 16px;
      color: var(--color-text-pannel-title);
      font-weight: 600;
      position: relative;
      &::after {
        position: absolute;
        display: block;
        content: "";
        width: 98%;
        height: 1px;
        bottom: -15px;
        left: 6px;
        background-color: var(--color-background-crossform-after);
      }
    }

    .pannel-header-close {
      flex: 0 0 20px;
      width: 20px;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .pannel-content {
    width: 100%;
    flex: 1;
    overflow: hidden auto;
    border-radius: 6px;
    background: var(--color-background-pannel-content);
    // border: 1px solid var(--color-background-pannel-content-border);

    &.pannel-content-shrink {
      height: calc(100% - 83px);
    }
  }

  .pannel-footer {
    flex: 0 0 50px;
    height: 50px;
  }
}
</style>
