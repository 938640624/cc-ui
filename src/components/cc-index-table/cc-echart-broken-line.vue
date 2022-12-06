<template>
  <div class="cc-echart-broken-line">
    <div class="table-echart">
      <div class="table-left">
        <span>行数</span>
        <input
          @blur="rowChange"
          @focus="rowFocus"
          v-model="rows"
        />
      </div>
      <div class="table-right">
        <cc-edit-table
          :echartData="echartData"
          @input-blur="handleInputBlur">
        </cc-edit-table>
      </div>
    </div>
    <div class="echart"
      style="width:800px;height:500px"
      ref="chart">
    </div>
  </div>
</template>
<script>
const COMPONENT_NAME = "cc-echart-broken-line";
import ccEditTable from "../cc-table/cc-edit-table.vue";
export default {
  name: COMPONENT_NAME,
  components: {
    ccEditTable,
  },
  mounted() {
    this.initCharts();
    this.rows = this.echartData$?.length;
  },
  props: {
    echartData: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: "我是折线图",
    },
  },
  data() {
    return {
      rows: 5,
      oldVal: null,
      newVal: null,
      myChart: null,
      option: [],
    };
  },
  methods: {
    handleInputBlur() {
      //表格input失去焦点时echarts重绘
      this.initCharts();
    },
    rowFocus() {
      // 行数input聚焦事件
      this.oldVal = this.rows;
    },
    rowChange() {
      // 行数input失焦事件，
      this.newVal = this.rows;
      const rowNumber = Number(this.newVal) - this.oldVal;
      const rowArr = this.echartData;
      if (rowNumber > 0) {
        for (let i = 0; i < rowNumber; i++) {
          const defaultRow = [0, 0];
          rowArr.push(defaultRow);
        }
      } else if (rowNumber < 0) {
        for (let i = 0; i < -rowNumber; i++) {
          rowArr.pop();
        }
      }
      this.$emit("update: echartData", rowArr);
      this.initCharts();
    },
    // 绘制图表具体样式
    createOption() {
      return {
        title: {
          text: this.title,
          left: "center",
          textStyle: {
            color: "#586872",
            fontSize: 12,
            fontWeight: "normal", // 主标题文字颜色
          },
        },
        tooltip: {
          // 提示框组件
          trigger: "axis", // 提示框组件的触发类型
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "6%",
          containLabel: true,
        },
        // legend: { // 上方提示栏
        //   itemWidth:40,
        //   itemHeight:20,
        //   textStyle:{
        //   fontSize:15,
        //   color:'#fff'
        //   }
        // },
        xAxis: {
          type: "value",
          axisLine: {
            // 坐标轴线设置
            lineStyle: {
              color: "#CCCCCC",
            },
          },
          axisLabel: {
            // 坐标文字设置
            color: "#333333",
            margin: 23,
          },
          axisTick: {
            // 坐标刻度线设置
            length: 15,
            lineStyle: {
              color: "#CCCCCC",
            },
          },
          // interval: 50 // 刻度间隔
        },
        yAxis: {
          type: "value",
          axisLine: {
            // 坐标轴线设置
            lineStyle: {
              color: "#CCCCCC",
            },
          },
          axisLabel: {
            // 坐标文字设置
            color: "#333333",
            margin: 23,
          },
          axisTick: {
            // 坐标刻度线设置
            length: 15,
            lineStyle: {
              color: "#CCCCCC",
            },
          },
          // interval: 50 // 刻度间隔
        },
        series: [
          {
            // name: "销量",
            type: "line",
            symbolSize: 5, // 坐标点大小
            symbol: "circle", // 坐标点样式
            itemStyle: {
              // 设置线条颜色
              normal: {
                color: "#4A90E2", // 线条圆圈颜色
                lineStyle: {
                  // 线条样式
                  color: "#4A90E2",
                },
              },
            },
            data: this.echartData,
          },
        ],
      };
    },
    // 绘制图表
    initCharts() {
      this.myChart = this.$echarts.init(this.$refs.chart);
      this.myChart.clear(); // 清除当前实例
      this.option = this.createOption();
      this.myChart.setOption(this.option, true);
    },
  },
};
</script>
<style lang="scss" scoped>
.cc-echart-broken-line {
  display: flex;
}
.table-echart {
  padding: 0 10px;
}
.table-left {
  width: 205px;
  padding-bottom: 10px;
}
.table-left span {
  color: #5c7582;
  overflow: hidden;
  font-size: 13px;
  max-width: 80px;
  min-width: 8px;
  word-break: break-all;
  white-space: nowrap;
  margin-right: 8px;
  text-overflow: ellipsis;
}
.table-left input {
  color: #5c7582;
  width: 50px;
  padding: 6px 0 6px 6px;
  font-size: 13px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: content-box;
}
</style>
