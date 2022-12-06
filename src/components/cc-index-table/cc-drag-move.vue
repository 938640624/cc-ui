<template>
    <div class="cc-drag-move">
      <slot name="dragmove-content">
        <div class="dragmove-content"></div>
      </slot>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-drag-move'
import { addClass, removeClass } from "../../helper/utils/class.js"
export default {
    name: COMPONENT_NAME,
    components: {
        
    },
    mounted() {
    this.slotDiv = this.$slots.default || this.$el.firstChild
    console.log(this.slotDiv, 'slotDiv')
    // console.log(this.slotDiv.offsetParent.offsetWidth, this.slotDiv.offsetParent.offsetHeight, 'parent')
    this.slotDiv.addEventListener('mousedown', this.handleMouseDown, true)
    document.addEventListener('mousemove', this.handleParentMouseMove, false)
    document.addEventListener('mouseup', this.handleParentMouseUp, false)
  },
    data() {
        return {
          slotDiv: null,  // 插槽标签
          isSlotMove: false,  // 是否可以移动
          slotX: null,
          slotY: null,
          slotBlankLeft: null,
          slotBlankTop: null,
          slotLeft: null,
          slotTop: null,
          slotWidth: null,
          slotHeight: null,
        }
    },
    methods: {
      handleMouseDown() {
        console.log(event, 'event')
        this.isSlotMove = true
        this.slotBlankLeft = this.slotDiv.getBoundingClientRect().left - this.slotDiv.offsetLeft
        this.slotBlankTop = this.slotDiv.getBoundingClientRect().top - this.slotDiv.offsetTop
        this.slotX = event.clientX - this.slotBlankLeft
        this.slotY = event.clientY - this.slotBlankTop
        this.slotLeft = this.slotDiv.offsetLeft
        this.slotTop = this.slotDiv.offsetTop
        this.slotWidth = this.slotDiv.offsetWidth
        this.slotHeight = this.slotDiv.offsetHeight
      },

      handleParentMouseMove() {
        const cursorLeft = this.slotDiv.offsetLeft
        const cursorTop = this.slotDiv.offsetTop
        const cursorWidth = this.slotDiv.offsetWidth
        const cursorHeight = this.slotDiv.offsetHeight
        const cursorBlankLeft = this.slotDiv.getBoundingClientRect().left - this.slotDiv.offsetLeft
        const cursorBlankTop = this.slotDiv.getBoundingClientRect().top - this.slotDiv.offsetTop
        const maxOffsetLeft = this.slotDiv.offsetParent.offsetWidth - this.slotDiv.offsetWidth
        const maxOffsetTop = this.slotDiv.offsetParent.offsetHeight - this.slotDiv.offsetHeight
        this.slotParentX = event.clientX - cursorBlankLeft
        this.slotParentY = event.clientY - cursorBlankTop
        if (this.slotParentX >= cursorLeft && this.slotParentX <= cursorLeft + cursorWidth && this.slotParentY >= cursorTop && this.slotParentY <= cursorTop + cursorHeight) {
          addClass(this.slotDiv, "dragIcon")
        } else {
          removeClass(this.slotDiv, "dragIcon")
        }
        
        if (this.isSlotMove) {
          const slotNumberX = this.slotX - this.slotParentX
          const slotNumberY = this.slotY - this.slotParentY
          if ((this.slotLeft - slotNumberX > 0 && this.slotLeft - slotNumberX < maxOffsetLeft) && (this.slotTop - slotNumberY > 0 && this.slotTop - slotNumberY < maxOffsetTop)) {
            this.slotDiv.style.left = this.slotLeft - slotNumberX + 'px'
            this.slotDiv.style.top = this.slotTop - slotNumberY + 'px'
          }
        }
      },

      handleParentMouseUp() {
        this.isSlotMove = false
        removeClass(this.slotDiv, "dragIcon")
      }
    }
}
</script>
<style lang="scss" scoped>
  .cc-drag-move {
      padding: 100px 200px;
  }
  .dragmove-content {
    width: 600px;
    height: 400px;
    background-color: #FFE4C4;
    text-align: center;
    position: absolute;
    border: 10px solid lightcoral;
  }
  .dragIcon {
  cursor: move;
}
</style>