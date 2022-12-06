export default {
  name: "Demo1",
  props: {
    name: {
      type: String,
      default: "jsx的ccc"
    }
  },
  methods: {
    init() {
      console.log(this.name, "这是jsx语法")
    }
  },
  mounted () {
    this.init()
  },
  render(createElement) {
    // render函数为jsx中的语法，createElement中跟标签名称与子节点数组
    return createElement ("div", this.$slots.default)
  }
}
