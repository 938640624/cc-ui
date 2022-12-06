<template>
  <div class="bar-group-chart">
    <div
      ref="chart"
      class="chart"
      style="width:800px;height:500px;"
    />

    <p
      v-if="sum"
      class="sum"
    >
      累计：
      <strong>{{ sum }}</strong>
      {{ unit }}
    </p>

    <div class="legend-list">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="legend-item"
      >
        <div v-if="item.name">
          <i
            class="color"
            :style="{background: colorList[index]}"
          />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 普通面板
 *
 * @prop {Array} [data] 渲染数据
 * @prop {Number} [sum] 页面上的累计值
 * @prop {String} [unit] 数值单位
 * @prop {Boolean} [xyExchange] 交互xy轴位置
 * @prop {String, Number} [barWidth] 柱形宽度，可用数字和百分比
 * @prop {Boolean} [sameColor] 同一种类柱形颜色是否为同色
 *
 */
// import * as echarts from "@/components/chart/echarts";

const COLOR_LIST = ["#599DF5", "#51C295", "#D4D428", "#CF7542"]

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    sum: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: ""
    },
    xyExchange: {
      type: Boolean,
      default: false
    },
    barWidth: {
      type: [Number, String],
      default () {
        return ""
      }
    },
    startAngle: {
      type: [String, Number],
      default: 90
    },
    indicator: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      colorList: COLOR_LIST,
      dimensionIndex: undefined
    }
  },
  watch: {
    data () {
      this.update()
    }
  },
  mounted () {
    this.initChart()
    this.update()
  },
  beforeDestroy () {
    this.echarts && this.echarts.dispose()
  },
  methods: {
    initChart () {
      this.echarts = this.$echarts.init(this.$refs.chart)
    },
    update () {
      if (!this.data.length) {
        return
      }
      const series = [
        {
          name: "",
          type: "radar",
          data: this.data.map((category, index) => {
            return {
              ...category,
              lineStyle: {
                color: this.colorList[index]
              },
              itemStyle: {
                // color: this.colorList[index],
                opacity: 0
              },
              // 区域填充样式
              areaStyle: {
                opacity: 0.2,
                color: this.colorList[index]
              },
              // 高亮状态的配置
              emphasis: {
                areaStyle: {
                  opacity: 0.4
                },
              },
            }
          })
        }
      ]
      // 获取拐点相关数据
      this.echarts.on("mouseover", (params) => {
        const index = params.event.target.__dimIdx
        this.dimensionIndex = index
      })
      const option = {
        textStyle: {
          color: "#1E1E1E"
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(31,76,117,0.9)",
          borderColor: "#1F9CB4",
          borderRadius: 0,
          padding: [8, 12],
          textStyle: {
            color: "#FFF",
            fontSize: 14
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(31,76,117, 0.3)",
              shadowColor: "#1F4C75",
            }
          },
          formatter: (params) => {
            const index = this.dimensionIndex
            const dimensionValue = params.value[index]
            const name = params.name
            const dimensionName = indicator[index]?.name
            if (typeof index !== "number" || typeof dimensionValue !== "number") {
              return ""
            }
            // 显示单维度的tooltip
            return `${dimensionName}${name}：${dimensionValue}${this.unit}`
          }
        },
        grid: {
          top: 58,
          bottom: 0,
          left: 0,
          right: 5,
          containLabel: true,
          borderWidth: 0,
        },
        radar: {
          indicator: this.indicator,
          // 坐标系起始角度
          startAngle: this.startAngle,
          // 坐标轴标签响应触发鼠标事件
          triggerEvent: true,
          // 指示器轴的分割段数
          splitNumber: 4,
          // 雷达图每个指示器名称的配置项
          axisName: {
            color: "#1E1E1E"
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.05)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.05)"
            }
          }
        },
        series: series,
      }
      this.echarts.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.bar-group-chart {
  position: relative;
  height: 100%;

  .chart {
    margin: 0 auto;
  }

  .sum {
    position: absolute;
    top: -40px;
    right: 10px;
    font-size: 13px;
    color: #FFF;
  }

  .legend-list {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: -32px;
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    .legend-item {
      margin-right: 16px;
      .color {
        display: inline-block;
        width: 10px;
        height: 10px;
        vertical-align: baseline;
        margin-right: 8px;
      }
    }
  }
}
</style>
