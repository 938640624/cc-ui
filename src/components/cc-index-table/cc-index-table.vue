<template>
  <div class="cc-index-table">
    <slot name="table-content">
      <div class="index-table-content"></div>
    </slot>
  </div>
</template>
<script>
import { addClass, removeClass } from "../../helper/utils/class.js";

const COMPONENT_NAME = "cc-index-table";
export default {
  name: COMPONENT_NAME,
  components: {},
  props: {

  },
  data() {
    return {
      slotDiv: null,
      isMouseMove: false,
    };
  },
  mounted() {
    this.slotDiv = this.$slots.default || this.$el.firstChild;
    // console.log(this.slotDiv, 'slotDiv')
    this.slotDiv.parentNode.addEventListener('mouseup', this.handleMouseUp, false)
    this.slotDiv.parentNode.addEventListener('mousemove', this.handleMouseMove, false)
    this.slotDiv.addEventListener('mousedown', this.handleMouseDown, false)
  },
  methods: {
    handleMouseDown() {
      this.isMouseMove = true;
    },
    handleMouseUp() {
      this.isMouseMove = false;
    },
    handleMouseMove(event) {
      const slotWidth = this.slotDiv.clientWidth;
      const slotHeight = this.slotDiv.clientHeight;
      // console.log(event.offsetX, 'offsetX')
      // if ((event.offsetX >= slotWidth - 10 && event.offsetX <= slotWidth + 10) || (event.offsetX >= -10 && event.offsetX <= 10))  // 左边CSS滑动
      // if ((event.offsetY >= slotHeight - 10 && event.offsetY <= slotHeight + 10) ||(event.offsetY >= -10 && event.offsetY <= 10))  // 上边CSS滑动
      if (event.offsetX >= slotWidth - 10 && event.offsetX <= slotWidth + 10 ) {
            removeClass(this.slotDiv.parentNode, "tableTop");
            addClass(this.slotDiv.parentNode, "tableLeft");
          } else if (event.offsetY >= slotHeight - 10 && event.offsetY <= slotHeight + 10) {
              removeClass(this.slotDiv.parentNode, "tableLeft");
              addClass(this.slotDiv.parentNode, "tableTop");
        } else {
            removeClass(this.slotDiv.parentNode, "tableTop");
            removeClass(this.slotDiv.parentNode, "tableLeft");
        }
      if(this.isMouseMove) {
        if(this.slotDiv.parentNode.className.indexOf('tableLeft') > 0) {
          this.slotDiv.style.width = event.offsetX + 'px'
        } else if(this.slotDiv.parentNode.className.indexOf('tableTop') > 0) {
          this.slotDiv.style.height = event.offsetY + "px"
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.cc-index-table {
  position: relative;
  /* height: 700px; */
  height: calc(100%)
}

.index-table-content {
  background-color: bisque;
  width: 600px;
  height: 400px;
  text-align: center
  /* margin: 0 auto; */
}
.tableLeft {
  cursor: col-resize;
}
.tableTop {
  cursor: row-resize;
}
</style>
