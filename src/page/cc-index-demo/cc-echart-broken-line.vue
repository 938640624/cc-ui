<template>
  <div class="echart-broken-line-page">
    <cc-header :headtitle="'echarts(折线图可设置行数与数据)'" />
    <cc-scroll>
      <div class="echart-demo1">
        <cc-echart-broken-line
          ref="chartParent"
          :echartData.sync="echartData"
          :title="title">
        </cc-echart-broken-line>
      </div>
      <div class="echart-demo2">
        <cc-echart-broken-line
          ref='chartParent1'
          :echartData.sync="echartData1"
          :title="title1"
        >
        </cc-echart-broken-line>
      </div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "echart-broken-line-page";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccEchartBrokenLine from "../../components/cc-index-table/cc-echart-broken-line";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
    ccEchartBrokenLine,
  },
  data() {
    return {
      title: "X:车辆转矩曲线速度(rpm)  Y:车辆转矩曲线扭矩(nm)",
      title1: "X:曲线速度(rpm)  Y:曲线扭矩(nm)",
      echartData: [[0.0, 400.0], [1890.0, 500.0], [5000.0, 500.0]],
      echartData1: [[0, 540], [60, 540], [100, 360], [240, 100], [300, 100]],
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>
