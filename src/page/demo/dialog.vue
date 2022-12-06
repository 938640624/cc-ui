<template>
  <div>
    <sutpc-dialog
      :title="title"
      :visible.sync="visibleVal"
      :append-to-body="true"
      center
      fullscreen
    >
      <el-row
        type="flex"
        justify="center"
        align="center"
        class="el-row-content"
        :gutter="5"
      >
        <el-col>
          <el-card
            style="height: 100%;"
            body-style="overflow: auto"
          >
            <div
              slot="header"
              class="card-header"
            >
              <p
                class="card-header--title"
              >
                方案对比
              </p>
              <el-radio-group
                v-model="schemeShowVal"
                size="small"
                class="toggle-type"
                @change="handleChange"
              >
                <el-radio-button label="schedule">
                  日计划
                </el-radio-button>
                <el-radio-button label="timing">
                  配时方案
                </el-radio-button>
              </el-radio-group>
            </div>
            <el-row
              v-show="schemeShowVal === 'schedule'"
              :gutter="20"
            >
              <el-col
                :span="12"
              >
                <p class="scheme-title">
                  当前日计划：{{ currentSchedule.name }}
                </p>
                <dialog-schedule :data="currentMoments" />
              </el-col>
              <el-col
                :span="12"
              >
                <p class="scheme-title">
                  推荐日计划：{{ recommendedSchedule.name }}
                  <span
                    v-if="optimizationType"
                    class="color-warning"
                  >（{{ optimizationType }}）</span>
                </p>
                <dialog-schedule :data="recommendedMoments" />
              </el-col>
            </el-row>

            <el-row v-show="schemeShowVal === 'timing' && this.data.decisionType === 1">
              <el-col :span="11">
                <p class="scheme-title">
                  当前方案
                </p>
                <dialog-timing :data="currentMoments" />
              </el-col>
              <el-col
                :span="11"
                :offset="2"
              >
                <p class="scheme-title">
                  推荐方案
                </p>
                <dialog-timing :data="recommendedMoments" />
              </el-col>
            </el-row>

            <el-row v-show="schemeShowVal === 'timing' && this.data.decisionType === 2">
              <!-- <el-col :span="11">
                <p class="scheme-title">
                  当前方案
                </p>
                <dialog-timing :data="currentMoments" />
              </el-col>
              <el-col
                :span="11"
                :offset="2"
              >
                <p class="scheme-title">
                  推荐方案
                </p>
                <dialog-timing :data="recommendedMoments" />
              </el-col> -->
              <div
                ref="timing-content"
                class="timing-content"
              >
                <!-- <plans
                  ref="plans"
                  :data="data"
                  :flow-list="flowList"
                  :is-check="isLgnorePhaseSetting"
                  :is-lgnore-phase-setting="isLgnorePhaseSetting"
                /> -->
                123
              </div>
            </el-row>
          </el-card>
        </el-col>

        <div class="effect-content">
          <el-col
            style="min-width:510px;"
            v-if="effectVisible"
          >
            <el-card>
              <p
                slot="header"
                class="card-header--title"
              >
                效果评估
              </p>

              <effect
                :data="effectData"
                :options="effectOptions"
                @change="handleChangeEffect"
              />
            </el-card>
          </el-col>

          <svg-icon
            icon-class="effect-arrows"
            class="effect-arrows-svg"
            :class="effectVisible ? 'effect-arrows-left' : 'effect-arrows-right'"
            @click="handleEffectVisible"
          />
        </div>
      </el-row>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <p
          class="color-warning warning"
        >
          <!--操作说明：完全接受日计划和方案时，会将相同的日计划号或方案号进行替换，新的日计划号或方案号进行新增，日计划和方案均不会下发信号机；部分采纳操作会链接至信号设计模块；放弃操作不会对原方案产生任何操作。-->
          操作说明：采纳操作会链接至信号设计模块。
        </p>
        <el-button
          :type="showAdoptBtn ? '' : 'primary'"
          @click="visibleVal = false"
        >
          {{
            showAdoptBtn ? '取 消' : '关 闭'
          }}
        </el-button>
        <el-button
          v-if="showAdoptBtn"
          type="primary"
          @click="handleAdopt"
        >
          采纳
        </el-button>
      </div>
    </sutpc-dialog>
  </div>
</template>

<script>
import DialogSchedule from "./dialog-schedule";
import DialogTiming from "./dialog-timing";
import Effect from "../../components/effect";
// import plans from "@/views/ring/timing-plan-config2/components/Plans"
import * as isolatedAPI from "@/api/modules/aided-decision-isolated";
import * as scheduleAPI from "@/api/modules/schedule";
import * as ringtimingAPI from "@/api/modules/ring-timing-config";
import { getOptionsMap } from "@/api/utils";
import { openWidow } from "@/utils/url";
export default {
  components: {
    DialogSchedule,
    DialogTiming,
    Effect,
    // plans
  },
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      recommendSchedule: "",
      visibleVal: this.visible,
      effectVisible: false,
      currentMoments: [],
      currentSchedule: {},
      recommendedMoments: [],
      recommendedSchedule: {},
      schemeShowMenus: [
        { label: "日计划", value: "schedule" },
        { label: "信号配时", value: "timing" }
      ],
      schemeShowVal: "schedule",
      effectData: {},
      effectOptions: [
        {
          name: "方向",
          key: "direction",
          options: [
            { label: "东进口", value: "E" },
            { label: "南进口", value: "S" },
            { label: "西进口", value: "W" },
            { label: "北进口", value: "N" }
          ]
        },
        // {
        //   name: "流向",
        //   key: "flow",
        //   options: [
        //     { label: "左转", value: "L" },
        //     { label: "直行", value: "T" },
        //     { label: "右转", value: "R" },
        //     { label: "掉头", value: "U" },
        //   ]
        // }
      ]
    };
  },
  computed: {
    title () {
      const { crossName } = this.data;
      return `辅助决策分析结果${crossName ? `（${crossName}）` : ""}`
    },
    adoptMap () {
      return getOptionsMap(isolatedAPI.OPTIONS.adopt);
    },
    showAdoptBtn () {
      return this.data.adopt === this.adoptMap.adoptNone;
    },
    optimizationType () {
      const { optimizationType } = this.data;
      const optimizationTypeMap = getOptionsMap(
        isolatedAPI.OPTIONS.optimizationType
      );
      const condition = ~optimizationType.indexOf(
        optimizationTypeMap.timeInterval
      );
      return condition ? "时段划分优化" : "时段划分不变";
    },
  },
  watch: {
    data (nVal, oVal) {
      console.log(nVal, "nVal")
      // if (nVal.currentScheduleId !== oVal.currentScheduleId) {
      this.currentSchedule = {};
      this.currentMoments = [];
      this.recommendedSchedule = {};
      this.recommendedMoments = [];

      this.getAidedDecisionDetail();

      // const  { decisionType } = nVal
      // decisionType === 2 && this.getPhaseList()
      // this.getPhaseList()
      // this.getCurrentSchedule();
      // this.getEvaluation();
      // }
    },
    visibleVal (val) {
      this.$emit("update:visible", val);
    },
    visible (val) {
      this.visibleVal = val;
    }
  },
  methods: {
    handleChange () {
      console.log(this.data, "Data")
    },
    async getPhaseList () {
      const searchKey = ""
      // console.log(this.data, "data2")
      // const { crossId } = this.data
      // const res = await ringtimingAPI.API.getPhaseList({
      //   crossId,
      //   searchKey
      // })
      // console.log(res, "res")
    },
    handleChangeEffect (targetVal) {
      const { target: index, direction: approachOrientation, flow: turnType } = targetVal;
      this.getEvaluation({ index, turnType, approachOrientation })
    },
    // 采纳
    async handleAdopt () {
      await this.$confirm("确定要采纳吗？", { type: "warning" });

      await isolatedAPI.API.update({
        recommendScheduleId: this.recommendSchedule,
        adopt: this.adoptMap.adoptFully
      });
      this.visibleVal = false;
      this.redirect();
    },
    redirect () {
      const { crossId } = this.data;
      this.$router.push(``, "_blank");
      const routeUrl = this.$router.resolve({
        path: `/stage/stage-plan`,
        query: { crossId, fromAdopt: true }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 查询效果评估
    async getEvaluation (evaluationReq) {
      const { scheduleId, crossId } = this.data;
      // console.log(this.data, "this.data");
      // console.log(scheduleId, "scheduleId");
      const recommendScheduleId = this.data.recommendScheduleId
      const req = {
        crossId: crossId, scheduleId, evaluationReq: evaluationReq
      }
      const { body = {} } = await isolatedAPI.API.getEvaluation(req);
      this.effectData = body;
    },
    // async getCurrentSchedule () {
    //   const { sourceScheduleId = "" } = this.data;
    //   const { body = {} } = await scheduleAPI.API.getDetailToSignalGroupsById({ id: sourceScheduleId });
    //   this.currentMoments = body.moments || [];
    //   this.currentSchedule = body.schedule || {};
    // },
    // 查询推荐日计划和当前日计划
    async getAidedDecisionDetail () {
      const { recommendScheduleId, decisionType } = this.data;
      // 当前是阶段结构查看
      if (decisionType === 1) {
        const { body = {} } = await scheduleAPI.API.getAidedDecisionDetail({
          aidedDecisionId: recommendScheduleId
        });
        const { recommendSchedule, schedule: resSchedule } = body;
        if (!recommendSchedule) {
          return console.warn("没有推荐数据");
        }
        const { id } = recommendSchedule
        this.recommendSchedule = id
        const { moments, schedule } = this.recommendDataAdaptor({ recommendSchedule })
        this.recommendedMoments = moments;
        this.recommendedSchedule = schedule;
        this.currentMoments = resSchedule?.moments || [];
        this.currentSchedule = resSchedule || {};
      // 当前是环结构查看
      } else if (decisionType === 2) {
        const body = await scheduleAPI.API.getRingAidedDecisionDetail(recommendScheduleId);
        const { recommendSchedule, schedule: resSchedule } = body;
        if (!recommendSchedule) {
          return console.warn("没有推荐数据");
        }
        // const { moments, schedule } = this.recommendRingDataAdaptor({ recommendSchedule })
        // this.recommendedMoments = moments;
        // this.recommendedSchedule = schedule;
        this.recommendedMoments = recommendSchedule.recommendMomentList;
        this.recommendedSchedule = resSchedule;
        this.currentMoments = resSchedule?.momentList || [];
        this.currentSchedule = resSchedule || {};
      }

      // const { body = {} } = await scheduleAPI.API.getAidedDecisionDetail({
      //   aidedDecisionId: recommendScheduleId
      // });
      // const { recommendSchedule, schedule: resSchedule } = body;
      // if (!recommendSchedule) {
      //   return console.warn("没有推荐数据");
      // }
      // const { id } = recommendSchedule
      // this.recommendSchedule = id
      // const { moments, schedule } = this.recommendDataAdaptor({ recommendSchedule });
      // console.log(moments, schedule, "moments, schedule")
      // this.recommendedMoments = moments;
      // this.recommendedSchedule = schedule;
      // this.currentMoments = resSchedule?.moments || [];
      // this.currentSchedule = resSchedule || {};
    },
    // 为了通用组件，将推荐日计划格式化到与当前日计划的一样的格式
    recommendDataAdaptor (recommendBody) {
      const schedule = recommendBody.recommendSchedule;
      const moments = schedule.recommendMoments;
      for (const mm of moments) {
        this.changeKey(mm, "recommendPlan", "plan");
        this.changeKey(mm.plan, "recommendPlanStageList", "planStages");
        for (const ps of mm.plan.planStages) {
          this.changeKey(ps, "recommendStage", "stage");
          this.changeKey(ps.stage, "recommendSignalGroups", "signalGroups");
        }
      }
      delete schedule.recommendMoments;
      return { moments, schedule }
    },
    // 为了通用组件，将推荐环结构日计划格式化到与当前日计划的一样的格式
    // recommendRingDataAdaptor (recommendBody) {
    //   const schedule = recommendBody.recommendSchedule;
    //   const moments = schedule.recommendMomentList;
    //   for (const mm of moments) {
    //     this.changeKey(mm, "recommendRingPlan", "plan");
    //     this.changeKey(mm.plan, "recommendPlanPhaseTimingList", "planRings");
    //     for (const ps of mm.plan.planRings) {
    //       this.changeKey(ps, "recommendPhase", "ring");
    //       this.changeKey(ps.ring, "recommendPhaseLightGroupList", "phaseGroups");
    //     }
    //   }
    //   delete schedule.recommendMoments;
    //   return { moments, schedule }
    // },
    // 修改对象的key
    changeKey (obj, oldKey, newKey) {
      Object.keys(obj).map(key => {
        if (key === oldKey) {
          obj[newKey] = obj[key];
          delete obj[key]
        }
      })
    },

    handleEffectVisible () {
      this.effectVisible = !this.effectVisible
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row-content {
  padding: 0 10px;

  .scheme-title {
    margin-bottom: 10px;
    font-size: 15px;
    font-weight: bold;
    span {
      font-size: 14px;
    }
  }
  .card-header {
    display: flex;
    align-items: center;
    .card-header--title {
      flex: 1;
    }
  }
  .warning {
    margin-bottom: 10px;
    text-align: left;
    font-size: 13px;
  }

  .effect-content {
    position: relative;
    .effect-arrows-svg {
      position: absolute;
    }
    .effect-arrows-left {
      transform: rotate(0);
      top: 255px;
    }
    .effect-arrows-right {
      top: 50%;
      transform: translateY(-50%) rotate(-180deg);
    }
  }
}

</style>
