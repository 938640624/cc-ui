<template>
  <div class="dialog-form">
    <template v-for="item in data">
      <div :key="item.type">
        <template v-if="item.type === 'start-end-time'"> 我是time </template>
      </div>
    </template>
    <p>{{ trueMessage }}</p>
    <Demo1 name="我是陈"></Demo1>
  </div>
</template>
<script>
const COMPONENT_NAME = "dialog-form-page";
export default {
  name: COMPONENT_NAME,
  components: {},
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    trueMessage: {
      // validator为props验证，如果有一个需求没用被满足，Vue会在浏览器控制台中警告你，开发中别人如果用到你的组件时很有帮助，为了定制prop的验证方式，你可以为props中的值提供一个带有验证需求的对象，而不是一个字符串数组
      // required声明这个参数是否必须传入
      // default指定当父组件未传入参数时props变量的默认值
      required: true,
      validator(val) {
        if (!val) return true;
        // 如果val为空则返回true,不为空则返回下面三个字符串中的一种，否则控制台会报错，这些prop会在一个组件实例创建之前进行验证，所以实例的property(如data,computed等)在default或validator函数中是不可用的，props类型String、Number、Boolean、Array、Object、Date、Function、Symbol
        return ["suceess", "warning", "validator"].indexOf(val) !== -1;
      },
    }
  },
  mounted() {
    console.log(this.data, "data");
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped></style>
