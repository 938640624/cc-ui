<template>
  <!-- aria-hidden="true"：将该元素与它的所有子元素从可访问树上移除，隐藏(纯修饰的图标图片、重复内容文本、屏幕外或被折叠内容)-->
  <svg
    :class="svgClass"
    aria-hidden="true"
    :styke="style"
    v-on="$listeners"
  >
  <!-- :xlink:href : 定义到资源的链接-->
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true
    },
    width: {
      type: [String],
      default: ""
    },
    height: {
      type: [String],
      default: ""
    },
    className: {
      type: String,
      default: ""
    },
    rotate: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    style () {
      const { rotate, width, height } = this;
      const r = `rotate(${rotate}deg)`;
      let style = { width, height };
      if (rotate) {
        style = {
          ...style,
          transform: r,
          webkitTransform: r,
          msTransform: r,
          webkitTransformOrigin: "center center",
          msTransformOrigin: "center center",
          transformOrigin: "center center",
        }
      }
      return style
    },
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return `svg-icon ${this.className}`
      } else {
        return "svg-icon"
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
