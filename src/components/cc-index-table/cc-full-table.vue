<template>
  <div class="cc-index-table">
    <slot name="table-content">
      <div class="index-table-content"></div>
    </slot>
  </div>
</template>
<script>
import { addClass, removeClass } from "../../helper/utils/class.js"

const COMPONENT_NAME = "cc-index-table"
export default {
  name: COMPONENT_NAME,
  components: {},
  props: {

  },
  data() {
    return {
      slotDiv: null,  // 插槽标签
      isSlotMove: false,  // 是否可以移动
      slotX: null,
      slotY: null,
      slotBlankLeft: null,
      slotBlankTop: null,
      slotClientX: null,
      slotClientY: null,
      slotParentX: null,
      slotParentY: null,
      slotLeft: null,
      slotTop: null,
      slotWidth: null,
      slotHeight: null,
    }
  },
  mounted() {
    this.slotDiv = this.$slots.default || this.$el.firstChild
    // console.log(this.slotDiv.getBoundingClientRect(), 'getBoundingClientRect')
    this.slotDiv.addEventListener('mousedown', this.handleMouseDown, true)
    document.addEventListener('mousemove', this.handleMouseMove, false)
    document.addEventListener('mouseup', this.handleParentMouseUp, false)
  },
  methods: {
    handleMouseDown() {
      this.isSlotMove = true
      this.slotBlankLeft = this.slotDiv.getBoundingClientRect().left - this.slotDiv.offsetLeft
      this.slotBlankTop = this.slotDiv.getBoundingClientRect().top - this.slotDiv.offsetTop
      this.slotX = event.clientX - this.slotBlankLeft
      this.slotY = event.clientY - this.slotBlankTop
      this.slotLeft = this.slotDiv.offsetLeft
      this.slotTop = this.slotDiv.offsetTop
      this.slotWidth = this.slotDiv.offsetWidth
      this.slotHeight = this.slotDiv.offsetHeight

      this.direction = ''
      if(this.slotX < this.slotLeft + 10) {
        this.direction = 'left'
      } else if (this.slotX > this.slotLeft + this.slotWidth - 10) {
        this.direction = 'right'
      } else if (this.slotY < this.slotTop + 10) {
        this.direction = 'top'
      } else if (this.slotY > this.slotTop + this.slotHeight - 10) {
        this.direction = 'bottom'
      }
      if (this.slotX < this.slotLeft + 10 && this.slotY < this.slotTop + 10) {
        // console.log('这是斜上方拉伸')
        this.direction = 'pullLeftTop'
      } else if (this.slotX > this.slotLeft + this.slotWidth - 10 && this.slotY > this.slotTop + this.slotHeight - 10) {
        this.direction = 'pullRightBottom'
      } else if (this.slotX < this.slotLeft + 10 && this.slotY > this.slotTop + this.slotHeight - 10) {
        this.direction = 'pullLeftBottom'
      } else if (this.slotX > this.slotLeft + this.slotWidth - 10 && this.slotY < this.slotTop + 10) {
        this.direction = 'pullRightTop'
      }
      console.log(this.direction, 'direction')

      if (event.preventDefault) {
          event.preventDefault()
      }
    },
    handleParentMouseUp() {
      this.isSlotMove = false
    },
    handleMouseMove() {
      const cursorLeft = this.slotDiv.offsetLeft
      const cursorTop = this.slotDiv.offsetTop
      const cursorWidth = this.slotDiv.offsetWidth
      const cursorHeight = this.slotDiv.offsetHeight
      const cursorBlankLeft = this.slotDiv.getBoundingClientRect().left - this.slotDiv.offsetLeft
      const cursorBlankTop = this.slotDiv.getBoundingClientRect().top - this.slotDiv.offsetTop
      this.slotParentX = event.clientX - cursorBlankLeft
      this.slotParentY = event.clientY - cursorBlankTop
      // console.log(this.slotParentX, 'slotParentX', this.slotLeft, 'slotLeft', this.slotWidth, 'slotWidth')
      if ((this.slotParentX < cursorLeft + 10 && this.slotParentX > cursorLeft - 10) || (this.slotParentX < cursorLeft + cursorWidth + 10 && this.slotParentX > cursorLeft + cursorWidth - 10)) {
        // console.log('我在左右侧')
        removeClass(this.slotDiv, "tableTop")
        removeClass(this.slotDiv, "tableLeftTop")
        removeClass(this.slotDiv, "tableRightTop")
        addClass(this.slotDiv, "tableLeft")
      } else if ((this.slotParentY < cursorTop + 10 && this.slotParentY > cursorTop - 10) || (this.slotParentY > cursorTop + cursorHeight - 10 && this.slotParentY < cursorTop + cursorHeight + 10)) {
          // console.log('我在上下测')
          removeClass(this.slotDiv, "tableLeft")
          removeClass(this.slotDiv, "tableLeftTop")
          removeClass(this.slotDiv, "tableRightTop")
          addClass(this.slotDiv, "tableTop")
      } else {
          removeClass(this.slotDiv, "tableTop")
          removeClass(this.slotDiv, "tableLeft")
          removeClass(this.slotDiv, "tableRightTop")
          removeClass(this.slotDiv, "tableLeftTop")
      }

      if (((this.slotParentX < cursorLeft + 10 && this.slotParentX > cursorLeft - 10) && (this.slotParentY < cursorTop + 10 && this.slotParentY > cursorTop - 10)) ||
      ((this.slotParentX < cursorLeft + cursorWidth + 10 && this.slotParentX > cursorLeft + cursorWidth - 10) && (this.slotParentY > cursorTop + cursorHeight - 10 && this.slotParentY < cursorTop + cursorHeight + 10))) {
          removeClass(this.slotDiv, "tableTop")
          removeClass(this.slotDiv, "tableLeft")
          removeClass(this.slotDiv, "tableRightTop")
          addClass(this.slotDiv, "tableLeftTop")
      }

      if (((this.slotParentX < cursorLeft + 10 && this.slotParentX > cursorLeft - 10) && (this.slotParentY > cursorTop + cursorHeight - 10 && this.slotParentY < cursorTop + cursorHeight + 10)) || 
      ((this.slotParentX < cursorLeft + cursorWidth + 10 && this.slotParentX > cursorLeft + cursorWidth - 10) && (this.slotParentY < cursorTop + 10 && this.slotParentY > cursorTop - 10))) {
          removeClass(this.slotDiv, "tableTop")
          removeClass(this.slotDiv, "tableLeft")
          removeClass(this.slotDiv, "tableLeftTop")
          addClass(this.slotDiv, "tableRightTop")
      }
      
      if (this.isSlotMove) {
        if (this.direction == 'left') {
          // console.log('向左移动')
          this.slotDiv.style.width = this.slotWidth + this.slotX - this.slotParentX + 'px'
          this.slotDiv.style.left = this.slotParentX + 'px'
        } else if (this.direction == 'right') {
          // console.log('向右移动')
          this.slotDiv.style.width = this.slotWidth + this.slotParentX - this.slotX + 'px'
        }
        if (this.direction == 'top') {
          // console.log('向上移动')
          this.slotDiv.style.height = this.slotHeight + this.slotY - this.slotParentY + 'px'
          this.slotDiv.style.top = this.slotParentY + 'px'
        } else if (this.direction == 'bottom') {
          // console.log('向下移动')
          this.slotDiv.style.height = this.slotHeight + this.slotParentY - this.slotY + 'px'
        }
        if (this.direction == 'pullLeftTop') {
          // console.log('斜上角拉')
          this.slotDiv.style.width = this.slotWidth + this.slotX - this.slotParentX + 'px'
          this.slotDiv.style.left = this.slotParentX + 'px'
          this.slotDiv.style.height = this.slotHeight + this.slotY - this.slotParentY + 'px'
          this.slotDiv.style.top = this.slotParentY + 'px'
        } else if (this.direction == 'pullRightBottom') {
          this.slotDiv.style.width = this.slotWidth + this.slotParentX - this.slotX + 'px'
          this.slotDiv.style.height = this.slotHeight + this.slotParentY - this.slotY + 'px'
        }
        if (this.direction == 'pullLeftBottom') {
          // console.log('斜下角拉')
          this.slotDiv.style.width = this.slotWidth + this.slotX - this.slotParentX + 'px'
          this.slotDiv.style.left = this.slotParentX + 'px'
          this.slotDiv.style.height = this.slotHeight + this.slotParentY - this.slotY + 'px'
        } else if (this.direction == 'pullRightTop') {
          this.slotDiv.style.height = this.slotHeight + this.slotY - this.slotParentY + 'px'
          this.slotDiv.style.top = this.slotParentY + 'px'
          this.slotDiv.style.width = this.slotWidth + this.slotParentX - this.slotX + 'px'
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.cc-index-table {
  position: relative;
  padding: 100px 200px;
  /* height: 700px */
}

.index-table-content {
  background-color: bisque;
  width: 600px;
  height: 400px;
  text-align: center;
  
  /* margin: 0 auto */
}
.tableLeft {
  cursor: col-resize;
}
.tableTop {
  cursor: row-resize;
}
.tableLeftTop {
  cursor: nw-resize;
}
.tableRightTop {
  cursor: ne-resize;
}
</style>
