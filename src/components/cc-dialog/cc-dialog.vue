<template>
  <div class="cc-dialog">
    <!-- $attrs: 当组件在调用时传入的属性没有在props里面定义时，传入的属性将被绑定到$attrs属性内（class与style除外，他们会挂载到组件最外层元素上）。并可通过v-bind="$attrs"传入到内部组件中 -->
    <!-- $listeners: 当组件被调用时，外部监听的这个组件的所有事件都可以通过$listeners获取到。并可通过v-on="$listeners"传入到内部组件中。 -->
    <el-dialog :visible.sync="visibleDialog" v-bind="$attrs" v-on="$listeners">
      <!-- 内容区域的默认插槽 -->
      <slot></slot>
      <!-- 使用弹框的footer插槽添加按钮 -->
      <template #footer>
        <!-- 对外继续暴露footer插槽，有个别弹框按钮需要自定义 -->
        <slot name="footer">
          <!-- 将取消与确定按钮集成到内部 -->
          <span>
            <el-button @click="$_handleCancel">取 消</el-button>
          <el-button type="primary" @click="$_handleConfirm">
            确 定
          </el-button>
          </span>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-dialog'
export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    // 对外暴露visible属性，用于显示隐藏弹框
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    // 通过计算属性，对.sync进行转换，外部也可以直接使用visible.sync
    visibleDialog: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit("update: visible", val)
      }
    }
  },
  methods: {
    // 对外抛出cancel事件
    $_handleCancel() {
      this.$emit("cancel");
    },
    // 对外抛出 confirm事件
    $_handleConfirm() {
      this.$emit("confirm");
    }
  },
}
</script>
<style  lang='scss' scoped>
</style>
