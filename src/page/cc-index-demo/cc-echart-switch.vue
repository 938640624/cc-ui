<template>
  <div class="cc-echart-switch">
    <cc-header :headtitle="'echart-switch(echart图表切换)'"/>
    <cc-scroll>
      <ccTabButton
        v-model="activeNav"
        class="cc-tab-button"
        :options="options"
        @select-tab="selectTab"
      />
      <div class="cc-echart">
        <div v-if="activeNav === 1">
          <cc-radar-group-chart
            :data="radarChartData"
            :indicator="radarIndicator"
            unit="s"
            start-angle="150"
          />
        </div>
        <div v-else-if="activeNav === 2">
          <cc-line-group-chart
            :data="barChartData"
            unit="s"
          />
        </div>
        <div v-else-if="activeNav === 3">
        <cc-bar-group-chart
          :data="barChartData"
          unit="s"
          bar-width="20"
        />
        </div>
    </div>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = 'cc-echart-switch'
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
import ccTabButton from "../../components/cc-tab-button/cc-tab-button.vue"
import ccBarGroupChart from "../../components/cc-echarts/cc-bar-group-chart.vue"
import ccLineGroupChart from "../../components/cc-echarts/cc-line-group-chart.vue"
import ccRadarGroupChart from "../../components/cc-echarts/cc-radar-group-chart.vue"
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
    ccTabButton,
    ccBarGroupChart,
    ccLineGroupChart,
    ccRadarGroupChart
  },
  props: {

  },
  data() {
    return {
      activeNav: 1,
      options: [
        {label: "雷达图", value: 1},
        {label: "折线图", value: 2},
        {label: "柱形图", value: 3}
      ],
      barChartData: [
        {
          data: [
            {name: "周一", value: 32},
            {name: "周二", value: 44},
            {name: "周三", value: 54},
            {name: "周四", value: 36},
            {name: "周五", value: 46},
          ],
          name: "雷达图"
        },
        {
          data: [
            {name: "周一", value: 55},
            {name: "周二", value: 32},
            {name: "周三", value: 54},
            {name: "周四", value: 38},
            {name: "周五", value: 23},
          ],
          name: "折线图"
        },
        {
          data: [
            {name: "周一", value: 19},
            {name: "周二", value: 25},
            {name: "周三", value: 34},
            {name: "周四", value: 33},
            {name: "周五", value: 25},
          ],
          name: "柱形图"
        }
      ],
      radarChartData: [
        {name: "雷达图", value: [4, 2, 3, 3, 5, 1]},
        {name: "折线图", value: [0, 4, 3, 2, 2, 5]},
        {name: "柱形图", value: [2, 3, 2, 5, 3, 3]}
      ],
      radarIndicator: [
        { name: "A级", max: 5 },
        { name: "B级", max: 5 },
        { name: "C级", max: 5 },
        { name: "D级", max: 5 },
        { name: "E级", max: 5 },
        { name: "F级", max: 5 }
      ]
    }
  },
  mounted() {},
  methods: {
    selectTab(val) {
      this.activeNav = val
      console.log(val, "val")
    }
  },
}
</script>
<style lang="scss" scoped>
  .cc-echart {
    width: 100%;
    height: 340px;
    padding-top: 20px;
  }
</style>
