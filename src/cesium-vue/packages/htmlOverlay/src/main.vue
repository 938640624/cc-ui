<template>
  <div
    v-show="show"
    :style="style"
    class="html-overlay"
    @click="handleClick"
  >
    <div
      class="html-overlay-content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>
<script type = 'text/javascript'>
// import { positionMixin, offsetMixin } from '@/cesium-vue/src/mixins/position'
// import { useCalcTools } from "@/cesium-vue/src/utils/calc"
export default {
  name: "HtmlOverlay",
  inject: ["mapPromise", 'graphicLayer'],
  // inject: ["mapPromise"],
  // mixins: [positionMixin, offsetMixin],
  props: {
    origin: {
      type: String,
      default: "center bottom"
    },
    clickToFly: {
      type: Boolean,
      default: false
    },
    position: {
      type: [Object, Array],
      default () {
        return []
      }
    },
    offset: {
      type: Array,
      default () {
        return []
      }
    },
    name: String
  },
  data () {
    return {
      canvasCoordinates: { x: 0, y: 0},
      show: true
    }
  },
  computed: {
    style () {
      return ""
    //   const { x: offsetX, y: offsetY } = this.cartesian2 // offset
    //   const { x, y } = this.canvasCoordinates
    //   return `transform: matrix(1, 0, 0, 1, ${x + offsetX}, ${y + offsetY});`
    },
    contentStyle () {
      const [x, y] = this.origin.split(" ")
      const transformXMap = {
        left: "0",
        center: "-50%",
        right: "-100%"
      }
      const transformYMap = {
        top: "0",
        center: "-50%",
        bottom: "-100%"
      }
      const transformX = transformXMap[x] || 0;
      const transformY = transformYMap[y] || 0;
      const left = transformXMap[x] ? 0 : x;
      const top = transformYMap[y] ? 0 : x;
      return `left: ${left}; top: ${top}; transform: translate3d(${transformX}, ${transformY}, 0)`
    }
  },
  watch: {

  },
  mounted () {
    this.mapPromise.then((map) => {
      this.map = map
      this.init()
    })
  },
  beforeCreate() {
    this.viewerPromise = new Promise((resolve, reject) => {
      this.viewerPromiseResolve = resolve
      this.viewerPromiseReject = reject
    })
  },
  beforeDestroy () {
    // if (!this.viewer.isDestroyed()) {
    //   this.destroyTimeDynamicCanvasCoordinates();
    // }
  },
  methods: {
    init() {
      // this.createDivGraphicHtml()
    },
    createDivGraphicHtml() {
      // const { graphics } = this.graphicLayer
      // const graphic = graphics.filter(item => item.name === `直线${this.name}`)[0]
      // console.log(graphic)
      // const html = this.$slots.default[0].elm.innerHTML
      // // graphic.bindPopup(html).openPopup()
      // const graphic = new mars3d.graphic.DivBillboardEntity({
      //   name: "公交",
      //   position: new mars3d.LngLatPoint(...this.position),
      //   // position: this.position,
      //   style: {
      //     html,
      //     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //     clampToGround: true
      //   },
      //   attrt: {remark: "弹框"}
      // })
      // this.graphicLayer.addGraphic(graphic)
      // graphic.bindPopup(html).openPopup()
      // const graphic = new mars3d.graphic.DivBillboardEntity({
      //   position: this.position,
      //   style: {
      //     html: '<div class="marsImgPanel1"><div class="title">火 星 科 技</div></div>',
      //     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //     clampToGround: true
      //   },
      //   attr: { remark: "示例3" }
      // })
      // this.graphicLayer.addGraphic(graphic)
    },
    handleClick () {
      console.log(this.$slots.default[0])
    },
  }
}
</script>
<style lang='scss' scoped>
.html-overlay {
  position: absolute;
  display: block;
  transform-origin: left bottom 0px;
  z-index: 9999553;
  user-select: none;
  &.dot::after {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    content: "";
    width: 6px;
    height: 6px;
    background: red;
  }
  &-content {
    position: relative;
    // left: 50%;
    // transform: translate3d(-50%, -100%, 0);
  }
}
</style>
