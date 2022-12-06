<template>
  <div class="echart-type">
    <div class="echart" style="width:800px;height:500px" ref="chart"></div>
  </div>
</template>
<script>
const COMPONENT_NAME = "echart-type";
export default {
  name: COMPONENT_NAME,
  components: {},
  mounted() {
    this.initCharts();
  },
  props: {
    eSeries: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: "我是默认标题",
    },
  },
  data() {
    return {
      eLegend: [],
    };
  },
  methods: {
    // 绘制图表具体样式
    createOption() {
      this.eLegend.splice(0, this.eLegend.length - 1); // 清空this.eLegend数组
      this.eSeries.forEach((item) => {
        if (item.type == "bar" || item.type == "line") {
          this.eLegend.push(item.name);
        } else if (item.type == "pie") {
          item.data.forEach((item) => {
            this.eLegend.push(item.name);
          });
        }
      });
      return {
        title: {
          text: this.title,
          subtext: "",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          data: this.eLegend,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        series: this.eSeries,
      };
    },
    // 绘制图表
    initCharts() {
      this.myChart = this.$echarts.init(this.$refs.chart);
      this.option = this.createOption();
      console.log(this.option, "this.option")
      this.myChart.setOption(this.option, true);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
