<template>
  <div class="echart-type-page">
    <cc-header :headtitle="'EchartType(echart表类型)'"/>
    <cc-scroll>
      <!-- <echart-type
          :eType="eType"
          :eData="eData"
      >-->
      <echart-type :eSeries="eSeries" :title="title"></echart-type>
      <echart-type :eSeries="eSeries1" :title="title1"></echart-type>
      <echart-type :eSeries="eSeries2" :title="title2"></echart-type>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "echart-type-page";
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import EchartType from "../../components//cc-index-table/cc-echart-type";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
    EchartType,
  },
  mounted() {},
  data() {
    return {
      title: '标准折线图',
      title1: '标准柱状图',
      title2: '标准扇形图',
      eSeries: [
        {
          name: "邮件营销",
          type: "line",
          stack: "总量",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "联盟广告",
          type: "line",
          stack: "总量",
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "视频广告",
          type: "line",
          stack: "总量",
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "直接访问",
          type: "line",
          stack: "总量",
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "搜索引擎",
          type: "line",
          stack: "总量",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
      eSeries1: [
        {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        },
        {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
        }
      ],
      eSeries2: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50', '200'], // 内半径，外半径
          avoidLabelOverLap: false, // 是否启用防止标签重叠策略
          roseType: 'radius', // 是否展示为兰丁格尔图
          itemStyle: {
            borderRadius: 10, // 圆角尺寸
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {  // 饼图图形上的文本标签
            show: false,
            position: 'center'
          },
          emphasis: { // itemStyle高亮状态下
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: { // 标签的视觉引导线样式
            show: false
          },
          data: [
            {value: 40, name: '搜索引擎'},
            {value: 38, name: '直接访问'},
            {value: 32, name: '邮件营销'},
            {value: 42, name: '联盟广告'},
            {value: 24, name: '视频广告'}
          ]
        }
      ]
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>