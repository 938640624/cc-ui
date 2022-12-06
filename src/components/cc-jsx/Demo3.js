export default {
  data () {
    return {
      content: "查询"
    }
  },
  methods: {
    $_handleInputUser(value) {
      this.formInline.user = value
    },
    $_handleChangeRegion(value) {
      this.formInline.region = value
    },
    $_handleSubmit() {}
  },
  // 将h座位createElement的别名是Vue的惯例与JSX要求，在ES2015语法声明的含有JSX的任何方法和getter中会自动
  // 注入const h = this.$createElement，这样就可去掉h参数
  render (h) {
    <ElForm inline model={this.formInline} class="demo-form-inline">
      <ElFormItem label="审批人">
        <ElInput
          value={this.formInline.user}
          onInput={this.$_handleInputUser}
          placeholder="审批人"
        ></ElInput>
      </ElFormItem>
      <ElFormItem label="活动区域">
        <ElSelect
          value={this.formInline.region}
          onChange={this.$_handleChangeRegion}
          placeholder="活动区域"
        >
          <ElOption label="区域一" value="shanghai"></ElOption>
          <ElOption label="区域二" value="beijing"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primarty" onClick={this.$_handleSubmit} domPropsInnerText={this.content}>
          {/* 查询 */}
        </ElButton>
      </ElFormItem>
    </ElForm>
  }
}
