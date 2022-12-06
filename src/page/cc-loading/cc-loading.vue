<template>
  <div class="cc-loading">
    <cc-header :headtitle="'Toast'" />
    <cc-scroll>
      <circle-tool class="marginSet" height="6px"></circle-tool>
      <circle-tool class="marginSet" height="8px"></circle-tool>
      <circle-tool class="marginSet" height="10px"></circle-tool>
      <p>{{ msg | newFilter1("!!!") }}</p>
      <p>{{ msg | status("我是") }}</p>
      <p>{{ msg | status("我是") | newFilter2("你是") }}</p>
      <p>日期: {{ data | dataFormat }}</p>
      <p>性别: {{ 1 | genderMenu }}</p>
      <p>我{{ 0 | commenMenu }}过滤器</p>
      <div :id="id | newFilter1"></div>
      <Demo1></Demo1>
    </cc-scroll>
  </div>
</template>
<script>
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import circleTool from "../../components/tools/circle-tool.vue";
import {
  dataFormat,
  genderMenu,
  commenMenu,
} from "../../helper/utils/filter.js";
const COMPONENT_NAME = "cc-loading";
export default {
  name: COMPONENT_NAME,
  components: {
    circleTool,
    ccHeader,
    ccScroll,
  },
  data() {
    return {
      msg: "hello world",
      id: "name",
      data: "",
    };
  },
  // filters过滤器:可用于常见的文本格式化,用于双花括号插值和v-binf表达式,过滤器应该加在js的尾部,过滤器是用来格式化数据的一个函数。过滤器不会修改原始数据，它的作用是过滤数据，就是对数据进行加工处理并返回处理后的数据，比如做一些数据格式上的修改，状态转换
  // 组件内过滤器:第一个参数是过滤器的名字,第二个参数是过滤器的功能函数function(data,argv1,argv2...){},第一个参数是传入的要过滤的数据，即调用时管道符左边的内容,第二个参数开始往后就是调用过滤器的时候传入的参数,必须有返回值
  // 注意事项:
  //   全局注册时是 filter 没有 s ， 而组件过滤器是 filters，是有 s 的，虽然写的时候没有 s 也不报错，但是过滤器是没有效果的。
  // 当全局过滤器和局部过滤器名字重复的时候，会以就近原则进行调用，即：局部过滤器优先于全局过滤器被调用
  // 一个表达式可以使用多个过滤器，其执行顺序从左往右，前一个过滤器的结果作为后一个过滤器的被处理数据，所以要注意使用顺序
  filters: {
    newFilter1: (msg, a) => {
      return msg + a;
    },
    newFilter2: (msg, a) => {
      return msg + a + "我是过滤器";
    },
    dataFormat: dataFormat,
    genderMenu: genderMenu,
    commenMenu: commenMenu,
  },
  mounted() {
    this.initView();
  },
  methods: {
    initView() {
      console.log("我是loading");
      const pMonitor = {};
      pMonitor.getLoadTime = () => {
        const { domComplete } = performance.getEntriesByType("navigation");
        return domComplete;
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.marginSet {
  display: block;
  padding: 10px 0px 10px 40px;
}
</style>
