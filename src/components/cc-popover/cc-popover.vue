<template>
    <div class="cc-popover">
      <transition name="cover-layer-fade">
        <div
          class="cover-layer"
          v-show="visibleContent"
          @click="handleVisible"
        >
        </div>
      </transition>
      <transition name="action-sheet-fade">
        <div 
          class="cc-visible-content"
          v-show="visibleContent"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
</template>
<script>
const COMPONENT_NAME = 'cc-popover'
const EVENT_VISIBLE_CONTENT = 'visible_content'
export default {
    name: COMPONENT_NAME,
    props: {
        visibleContent: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {

        }
    },
    methods: {
      handleVisible() {
        this.$emit(EVENT_VISIBLE_CONTENT, '')
      }
    }
}
</script>
<style>
  .cover-layer {
    position: absolute;
    width: 100%;
    overflow: hidden;
    background-color: #25262d;
    pointer-events: auto;
    top: 0;
    bottom: 0;
    opacity: 0.4;
  }
  .cc-visible-content {
    position: absolute;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    bottom: 0px;
  }
  
  .cover-layer-fade-enter, .cover-layer-fade-leave-to {
    opacity: 0;
  }
  .cover-layer-fade-enter-active, .cover-layer-fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .cover-layer-fade-leave, .cover-layer-fade-enter-to {
    opacity: 0.4;
  }

  .action-sheet-fade-enter, .action-sheet-fade-leave-to {
    bottom: -300px;
  }
  .action-sheet-fade-enter-active, .action-sheet-fade-leave-active {
    transition: bottom 0.4s ease;
  }
  .action-sheet-fade-enter-to, .action-sheet-fade-leave {
    bottom: 0px;
  }

 
</style>