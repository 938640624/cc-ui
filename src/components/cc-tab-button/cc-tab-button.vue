<template>
  <div class="cc-tab-button">
    <ul class="tab-button_box">
      <li
        v-for="item in options"
        :key="item.value"
        class="tab-button_item"
        :class="{selected: isSelected(item.value)}"
        @click="handleSelect(item)"
      >
        <p class="tab-button_item-main">
          <span>{{item.label}}</span>
        </p>
        <slot
          :item="item"
          :selected="isSelected(item.value)"
        />
      </li>
    </ul>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-tab-button'

export default {
  name: COMPONENT_NAME,
  components: {

  },
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: [Array, String, Number],
      default () {
        return ""
      }
    }
  },
  data() {
    return {
      curVal: this.value
    }
  },
  watch: {
    value (val) {
      this.curVal = val
    }
  },
  mounted() {},
  methods: {
    isSelected (val) {
      return this.curVal === val
    },
    handleSelect (item) {
      const val = item.value
      if (val === this.curVal) return
      this.$emit("select-tab", val)
    }
  },
}
</script>
<style lang='scss' scoped>
.cc-tab-button {
  // display: inline-block;
  padding: 0;
  width: auto;
  border: 1px solid #EDF0F4;
  .tab-button_box {
    display: flex;
    align-items: center;
    .tab-button_item {
      flex: auto;
      position: relative;
      line-height: 17px;
      padding: 4px 16px;
      cursor: pointer;
      text-align: center;
      &::after {
        position: absolute;
        display: block;
        top: -16px;
        right: 0;
        content: "";
        width: 1px;
        height: 90px;
        background: #EDF0F4;
      }
      &:last-child::after {
        display: none;
      }
    }
    .tab-button_item.selected {
      background: #EDF0F4;
    }
  }
}
</style>
