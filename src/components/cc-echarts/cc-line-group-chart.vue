<template>
    <div class="line-group-chart">
        <div ref="chart" class="chart" style="width: 800px; height: 500px" />

        <p v-if="sum" class="sum">
            累计：
            <strong>{{ sum }}</strong>
            {{ unit }}
        </p>

        <div class="legend-list">
            <div v-for="(item, index) in data" :key="index" class="legend-item">
                <div v-if="item.name">
                    <i class="color" :style="{ background: colorList[index] }" />
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

const COLOR_LIST = ['#599DF5', '#51C295', '#D4D428', '#CF7542']

export default {
    props: {
        data: {
            type: Array,
            default() {
                return []
            },
        },
        sum: {
            type: Number,
            default: 0,
        },
        unit: {
            type: String,
            default: '',
        },
        xyExchange: {
            type: Boolean,
            default: false,
        },
        barWidth: {
            type: [Number, String],
            default() {
                return ''
            },
        },
        // sameColor: {
        //   type: Boolean,
        //   default: true
        // }
    },
    data() {
        return {
            colorList: COLOR_LIST,
        }
    },
    watch: {
        data() {
            this.update()
        },
    },
    mounted() {
        this.initChart()
        this.update()
    },
    beforeUnmount() {
        this.echarts && this.echarts.dispose()
    },
    methods: {
        initChart() {
            this.echarts = this.$echarts.init(this.$refs.chart)
        },
        update() {
            if (!this.data.length) {
                return
            }

            const categoryList = this.data[0].data.map((item) => {
                return item.name
            })
            // 默认为y轴
            const valAxis = [
                {
                    type: 'value',
                    nameTextStyle: {
                        fontSize: 12,
                    },
                    minInterval: 1,
                    axisLine: { show: true },
                    axisTick: { show: false },
                    axisLabel: {
                        align: 'right',
                        fontSize: 10,
                    },
                    splitLine: {
                        lineStyle: {
                            opacity: 1,
                        },
                    },
                },
            ]
            // 默认为x轴
            const cateAxis = {
                type: 'category',
                boundaryGap: true,
                axisTick: { show: false },
                axisLine: { show: true },
                axisLabel: {
                    interval: 0,
                },
                data: categoryList,
            }
            const series = this.data.map((category, index) => {
                const { name, data } = category
                const valueList = data.map((item) => {
                    return item.value
                })
                // const color = (params) => {
                //   console.log(this.sameColor, params)
                //   if (this.sameColor) {
                //     return this.colorList[index]
                //   } else {
                //     return this.colorList[params.dataIndex]
                //   }
                // }
                const series = {
                    name: name,
                    type: 'line',
                    barWidth: this.barWidth || null,
                    barGap: 0,
                    labelOption: {
                        show: true,
                    },
                    smooth: true,
                    lineStyle: {
                        color: this.colorList[index],
                    },
                    itemStyle: {
                        color: this.colorList[index],
                        borderWidth: 1,
                    },
                    // lineStyle: {
                    //   color
                    // },
                    // itemStyle: {
                    //   color
                    // },
                    data: valueList,
                    symbolSize: 7,
                }
                return series
            })
            const option = {
                textStyle: {
                    color: '#1E1E1E',
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(31,76,117,0.9)',
                    borderColor: '#1F9CB4',
                    borderRadius: 0,
                    padding: [8, 12],
                    textStyle: {
                        color: '#FFF',
                        fontSize: 14,
                    },
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(31,76,117, 0.3)',
                            shadowColor: '#1F4C75',
                        },
                    },
                    formatter: (params) => {
                        let toolTip = `${params[0].name}${params.length > 1 ? '<br>' : ''}`
                        params.forEach((item, index) => {
                            toolTip += `${item.seriesName}：${item.value}${this.unit}<br>`
                        })
                        return toolTip
                    },
                },
                grid: {
                    top: 58,
                    bottom: 0,
                    left: 0,
                    right: 5,
                    containLabel: true,
                    borderWidth: 0,
                },
                xAxis: this.xyExchange ? valAxis : cateAxis,
                yAxis: this.xyExchange ? cateAxis : valAxis,
                series: series,
            }
            this.echarts.setOption(option)
        },
    },
}
</script>

<style lang="scss" scoped>
.line-group-chart {
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
        color: #fff;
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
