<template>
  <pannel
    class="cross-info-pannel"
    :title="title"
    title-icon-class="icon-new-intersection"
    @close="handleClose"
  >
    <div class="cross-info-pannel_detail">
      <div class="cross-info-pannel_content">
        <div class="pannel-content-top">
          <div class="pannel-content-top_title">
            路口详情
          </div>
          <div>
            <!-- <el-button
              class="info-btn"
              icon="icon-style el-icon-edit-btn"
              @click="handleEdit"
            >
              <span class="info-btn-text">编辑</span>
            </el-button> -->
            <span
              class="icon-info-btn"
              @click="handleEdit"
            >
              <svg-icon
                class="icon-style"
                icon-class="icon-edit"
              />
              <el-button class="info-btn">
                <span class="info-btn-text">编辑</span>
              </el-button>
            </span>
            <!-- <el-button
              class="info-btn"
              icon="icon-style el-icon-delete-btn"
              @click="handleDelete($event)"
            >
              <span class="info-btn-text">删除</span>
            </el-button> -->
            <span
              class="icon-info-btn"
              @click="handleDelete($event)"
            >
              <svg-icon
                class="icon-style"
                icon-class="icon-delete"
              />
              <el-button class="info-btn">
                <span class="info-btn-text">删除</span>
              </el-button>
            </span>
          </div>
        </div>
        <div class="pannel-content-info">
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">路口编号</span>
            <span class="pannel-content-info_label-content">{{ data.crossNumber || "--" }}</span>
          </div>
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">路口名称</span>
            <span class="pannel-content-info_label-content">{{ data.crossName || "--" }}</span>
          </div>
          <div
            v-if="data.precinct"
            class="pannel-content-info_item"
          >
            <span class="pannel-content-info_label">管辖区域</span>
            <span class="pannel-content-info_label-content">{{ data.precinct.name || "--" }}</span>
          </div>
          <div
            v-if="data.department"
            class="pannel-content-info_item"
          >
            <span class="pannel-content-info_label">部门机构</span>
            <span class="pannel-content-info_label-content">{{ data.department.name || "--" }}</span>
          </div>
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">路口经度</span>
            <span class="pannel-content-info_label-content">{{ toFixed(data.longitude, 7) || "--" }}</span>
          </div>
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">路口纬度</span>
            <span class="pannel-content-info_label-content">{{ toFixed(data.latitude, 7) || "--" }}</span>
          </div>
        </div>
      </div>
      <div class="cross-info-pannel_content">
        <div class="pannel-content-top">
          <div class="pannel-content-top_title">
            路口形状
          </div>
          <div>
            <!-- <el-button
              class="info-btn"
              icon="icon-style el-icon-setting-btn"
              @click="handleSetting"
            >
              <span class="info-btn-text">设置</span>
            </el-button> -->
            <span
              class="icon-info-btn"
              @click="handleSetting"
            >
              <svg-icon
                class="icon-style"
                icon-class="icon-setting"
              />
              <el-button class="info-btn">
                <span class="info-btn-text">设置</span>
              </el-button>
            </span>
            <!-- <el-button
              class="info-btn disable-btn"
              icon="icon-style el-icon-copy-btn"
            >
              <span class="info-disable-btn-text">复制</span>
            </el-button> -->
            <span
              class="icon-info-disable-btn"
            >
              <svg-icon
                class="icon-style"
                icon-class="icon-copy"
              />
              <el-button class="info-btn">
                <span class="info-disabled-btn-text">复制</span>
              </el-button>
            </span>
          </div>
        </div>
        <div
          v-if="data.shape"
          class="pannel-content-info"
        >
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">路口形状：</span>
            <span class="pannel-content-info_label-content">{{ data.shape | shapeOptionsNumber }}</span>
          </div>
          <div class="pannel-content-info_img">
            <svg-icon
              :icon-class="shapeIconClass"
              class="pannel-content-info_shape"
            />
          </div>
        </div>
        <div
          v-else
          class="pannel-content-info info-flex"
        >
          <div class="pannel-content-info_tip">
            路口形状未设置!
          </div>
        </div>
      </div>
      <div class="cross-info-pannel_content">
        <div class="pannel-content-top">
          <div class="pannel-content-top_title">
            信号机管理
          </div>
          <div>
            <template v-if="data.signalDTO">
              <!-- <el-button
                class="info-btn"
                icon="icon-style el-icon-edit-btn"
                @click="handleCrossSignalEdit()"
              >
                <span class="info-btn-text">编辑</span>
              </el-button> -->
              <span
                class="icon-info-btn"
                @click="handleCrossSignalEdit"
              >
                <svg-icon
                  class="icon-style"
                  icon-class="icon-edit"
                />
                <el-button class="info-btn">
                  <span class="info-btn-text">设置</span>
                </el-button>
              </span>
              <!-- <el-button
                class="info-btn"
                icon="icon-style el-icon-timing-btn"
                @click="handleSignalMatch"
              >
                <span class="info-btn-text">配时</span>
              </el-button> -->
              <span
                class="icon-info-btn"
                @click="handleSignalMatch"
              >
                <svg-icon
                  class="icon-style"
                  icon-class="icon-timing"
                />
                <el-button class="info-btn">
                  <span class="info-btn-text">配时</span>
                </el-button>
              </span>
              <!-- <el-button
                class="info-btn"
                icon="icon-style el-icon-delete-btn"
                @click="handleCrossSignalDelete($event)"
              >
                <span class="info-btn-text">删除</span>
              </el-button> -->
              <span
                class="icon-info-btn"
                @click="handleCrossSignalDelete($event)"
              >
                <svg-icon
                  class="icon-style"
                  icon-class="icon-delete"
                />
                <el-button class="info-btn">
                  <span class="info-btn-text">删除</span>
                </el-button>
              </span>
            </template>
            <template v-else>
              <!-- <el-button
                class="info-btn"
                type="primary"
                @click="handleCrossSignalRegister(data)"
              >
                注册
              </el-button> -->
              <span
                class="icon-info-btn"
                @click="handleCrossSignalRegister(data)"
              >
                <svg-icon
                  class="icon-style"
                  icon-class="icon-edit"
                />
                <el-button class="info-btn">
                  <span class="info-btn-text">注册</span>
                </el-button>
              </span>
              <!-- <el-button
                class="info-btn disable-btn"
                type="primary"
                @click="handleSignalMatch"
              >
                配时
              </el-button> -->
              <span
                class="icon-info-btn"
                @click="handleSignalMatch"
              >
                <svg-icon icon-class="icon-edit" />
                <el-button class="info-timing">
                  <span class="info-btn-text">配时</span>
                </el-button>
              </span>
            </template>
          </div>
        </div>
        <div
          v-if="data.signalDTO"
          class="pannel-content-info"
        >
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">信号机厂商</span>
            <span>
              {{ data.signalDTO.manufacturer || "--" }}
            </span>
          </div>
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">信号机类型</span>
            <span>
              {{ data.signalDTO.signalPlanStructureType |signalPlanStructureTypeOptions }}
            </span>
          </div>
          <div class="pannel-content-info_item">
            <span class="pannel-content-info_label">信号机状态</span>
            <span>
              {{ data.signalDTO.online ? "在线" : "离线" }}
            </span>
          </div>
          <div class="pannel-cotent-more">
            <div
              class="pannel-content-btn"
              @click="handleMoreArrowClick"
            >
              <span class="pannel-content-span">更多</span>
              <i
                class="el-icon-arrow-up"
                :class="isMoreArrowDown ? 'el-icon-transition-down' : 'el-icon-transition-up'"
              />
            </div>
            <el-collapse-transition>
              <div
                v-show="isMoreArrowDown"
                class="pannel-content-detail"
              >
                <div class="detail-box">
                  <span class="detail-box-label">设备编号</span>
                  <span class="detail-box-text">{{ data.signalDTO.suffix }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">信号机IP</span>
                  <span class="detail-box-text">{{ data.signalDTO.ip }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">信号机类型</span>
                  <span class="detail-box-text">{{ data.signalDTO.signalPlanStructureType|signalTypeOptions }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">平台托管</span>
                  <span class="detail-box-text">{{ data.signalDTO.hostingPlatform|hostingPlatformOptions }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">上位机IP</span>
                  <span class="detail-box-text">{{ data.signalDTO.upperIp }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">设备型号</span>
                  <span class="detail-box-text">{{ data.signalDTO.model }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">设备厂家</span>
                  <span class="detail-box-text">{{ data.signalDTO.manufacturer }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">协议版本</span>
                  <span class="detail-box-text">{{ data.signalDTO.version }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">子网掩码</span>
                  <span class="detail-box-text">{{ data.signalDTO.mask }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">端口号</span>
                  <span class="detail-box-text">{{ data.signalDTO.upperPort }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">网关</span>
                  <span class="detail-box-text">{{ data.signalDTO.gateway }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">通讯类型</span>
                  <span class="detail-box-text">{{ data.signalDTO.upperCommunicationType|upperCommunicationTypeOptions }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">出厂编号</span>
                  <span class="detail-box-text">{{ data.signalDTO.manufactureNumber }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">出厂时间</span>
                  <span class="detail-box-text">{{ data.signalDTO.manufactureDate |date }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">接入方式</span>
                  <span class="detail-box-text">{{ data.signalDTO.connectionType|connectionTypeOptions }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">安装单位</span>
                  <span class="detail-box-text">{{ data.signalDTO.installer }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">安装时间</span>
                  <span class="detail-box-text">{{ data.signalDTO.installTime|date }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">维护单位</span>
                  <span class="detail-box-text">{{ data.signalDTO.maintainUnit }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-box-label">维护电话</span>
                  <span class="detail-box-text">{{ data.signalDTO.maintainPhone }}</span>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <div
          v-else
          class="pannel-content-info info-flex"
        >
          <div class="pannel-content-info_img">
            <img
              src="../images/icon-cross-intersection-unset.png"
              alt=""
            >
          </div>
          <div class="pannel-content-info_tip">
            未注册信号机!
          </div>
        </div>
      </div>
    </div>
  </pannel>
</template>

<script>
import Pannel from "./pannel"

import { API, FILTERS, OPTIONS } from "@/api/modules/cross"
import toFixed from "@/utils/toFixed"

const EVENT_CLOSE = "close"
const EVENT_CROSS_EDIT = "cross-edit"
const EVENT_CROSS_DELETE = "cross-delete"
const EVENT_CROSS_SETTING = "cross-setting"
const EVENT_CROSS_SIGNAL_REGISTER = "cross-signal-register"
const EVENT_CROSS_SIGNAL_EDIT = "cross-signal-edit"
const EVENT_CROSS_SIGNAL_DELETE = "cross-signal-delete"

export default {
  components: {
    Pannel,
  },
  filters: {
    ...FILTERS
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      signalPlanStructureTypeOptions: [
        { label: "阶段型", value: 0, key: 0 },
        { label: "环型", value: 1, key: 1 },
      ],
      shapeOptionsNumber: OPTIONS.shapeOptionsNumber,
      shapeList: [
        { fliterKey: [1, 2], iconClass: "lShape" },
        { fliterKey: [3], iconClass: "xShape" },
        { fliterKey: [4, 5, 6, 7], iconClass: "tShape" },
        { fliterKey: [8, 9, 10, 11], iconClass: "yShape" },
        { fliterKey: [12], iconClass: "mShape" },
        { fliterKey: [13], iconClass: "cShape" },
      ],
      shapeClass: "",
      isMoreArrowDown: false
    }
  },
  computed: {
    title () {
      if (this.data.crossNumber) {
        return `【${this.data.crossNumber}】${this.data.crossName}`
      }
      return ""
    },
    shapeIconClass () {
      this.shapeList.forEach(item => {
        const shape = item.fliterKey.filter(key => this.data.shape === key)
        if (shape.length > 0) {
          this.shapeClass = item.iconClass
          return true
        }
      })
      return this.shapeClass
    }
  },
  methods: {
    // 获取单个路口的数据
    async getCrossData (id) {
      const res = await API.getCrossById(id)
      return res
    },

    handleClose () {
      this.$emit(EVENT_CLOSE)
    },

    handleDelete (event) {
      const { crossId } = this.data
      const h = this.$createElement
      this.$msgbox({
        title: "提示",
        message: h("p", null, [
          h("span", null, "此操作将删除该路口数据，是否继续？ ")
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        backButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await API.deleteCross(crossId)
        this.$message({
          type: "success",
          message: "删除成功！"
        })
        this.$emit(EVENT_CROSS_DELETE)
      }).catch(() => {
        this.buttonUnFocus(event)
      })
    },

    handleEdit () {
      this.$emit(EVENT_CROSS_EDIT)
    },

    handleSetting () {
      this.$emit(EVENT_CROSS_SETTING)
    },

    handleCrossSignalRegister () {
      this.$emit(EVENT_CROSS_SIGNAL_REGISTER)
    },

    handleCrossSignalEdit () {
      this.$emit(EVENT_CROSS_SIGNAL_EDIT)
    },

    handleCrossSignalDelete (event) {
      const { signalDTO } = this.data
      const { id } = signalDTO
      const h = this.$createElement
      this.$msgbox({
        title: "提示",
        message: h("p", null, [
          h("span", null, "此操作将删除该路口的信号机数据，是否继续？ ")
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        backButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await API.deleteSignal(id)
        this.$message({
          type: "success",
          message: "删除成功！"
        })
        this.$emit(EVENT_CROSS_SIGNAL_DELETE, id)
      }).catch(() => {
        this.buttonUnFocus(event)
      })
    },

    async handleSignalMatch () {
      if (!this.data.signalDTO || !this.data.shape) {
        return
      }
      const { currentCrossId, crossId, signalDTO } = this.data
      const { signalPlanStructureType } = signalDTO
      const id = currentCrossId || crossId
      // Todo：获取最新路口数据，数据都为外部传入应该都为最新，后续考虑删除
      const data = await API.getCrossById(id)
      localStorage.setItem("FROM_JQ_CURRENT_CROSS", JSON.stringify(data))
      sessionStorage.setItem("FROM_JQ_CURRENT_CROSS", JSON.stringify(data))
      signalPlanStructureType === 0 ? window.open("/stage/signal-config") : window.open("/ring/signal-config")
    },

    toFixed,

    handleMoreArrowClick () {
      this.isMoreArrowDown = !this.isMoreArrowDown
    },
    // button按钮失焦事件
    buttonUnFocus (event) {
      let target = event.target
      while (target.nodeName !== "BUTTON") {
        target = target.parentNode
      }
      target.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
.cross-info-pannel {
  width: 90%;
  .cross-info-pannel_detail {
    padding: 20px 30px 10px 30px;
    .pannel-content-top {
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      .pannel-content-top_title {
        color: var(--color-text-pannel-title);
        position: relative;
      }
      &::before {
        content: "";
        width: 4px;
        height: 20px;
        position: absolute;
        left: -12px;
        background-color: var(--color-background-crossform-before);
        border-radius: 2px;
      }
      &::after {
        position: absolute;
        display: block;
        content: "";
        width: 100%;
        height: 1px;
        bottom: 0;
        background-color: var(--color-background-crossform-after);
      }
      .info-btn {
        height: 32px;
        line-height: 32px;
        // padding: 0 7px;
        padding: 0 7px 0 3px;
        font-size: 14px;
        border: none;
        background-color: transparent;
        position: relative
      }
      .disable-btn {
        cursor: not-allowed;
        // background-color: var(--color-background-crossform-disabled);
        // color: var(--color-background-crossform-text-disabled);
      }
      .icon-info-btn {
        color: #1989fa;
      }
      .icon-info-disable-btn {
        color: #C8C9CC;
      }
      .info-btn-text {
        color: #1989fa;
      }
      .info-disabled-btn-text {
        color: #C8C9CC;
      }
      // .icon-style {
      //   position: relative;
      //   top: 1.5px;
      // }
      // ::v-deep .el-icon-edit-btn {
      //   background: url("../../../../assets/images/icon-edit.svg") no-repeat;
      // }
      // ::v-deep .el-icon-delete-btn {
      //   background: url("../../../../assets/images/icon-delete.svg") no-repeat;
      // }
      // ::v-deep .el-icon-setting-btn {
      //   background: url("../../../../assets/images/icon-setting.svg") no-repeat;
      // }
      // ::v-deep .el-icon-copy-btn {
      //   background: url("../../../../assets/images/icon-copy.svg") no-repeat;
      // }
      // ::v-deep .el-icon-timing-btn {
      //   background: url("../../../../assets/images/icon-timing.svg") no-repeat;
      // }
      // ::v-deep .icon-style {
      //   position: absolute;
      //   font-size: 16px;
      //   background-size: cover;
      //   // background-blend-mode: lighten;
      //   // background-size: cover;
      //   color: #1989fa;
      //   height: 15px;
      //   width: 15px;
      //   top: 50%;
      //   left: -6px;
      //   transform: translateY(-50%);
      // }
      // ::v-deep .icon-style::before {
      //   content: "";
      //   font-size: 16px;
      //   visibility: hidden;
      // }
    }
    .pannel-content-info {
      padding: 8px 0;
      .pannel-content-info_item {
        padding: 4px 0;
        .pannel-content-info_label {
          width: 78px;
          color: var(--color-text-crossform);
          margin-right: 40px;
          display: inline-block;
        }
        .pannel-content-info_label-content {
          color: var(--color-text-crossform-active);
        }
      }
      .pannel-content-info_img {
        text-align: center;
        margin-top: 12px;
        color: var(--color-background-crossform-shape-icon);
        .pannel-content-info_shape {
          width: 162px;
          height: 130px;
        }
      }
      .pannel-content-info_text {
        .content-info-text {
          font-size: 12px;
          color: var(--color-text-crossform);
          margin-bottom: 5px;
        }
      }
      .pannel-content-info_tip {
        color: #FF475d;
      }
      .pannel-cotent-more {
        .pannel-content-btn {
          padding: 10px 0;
          color: var(--color-text-signal-register-more);
          .pannel-content-span {
            margin-right: 6px;
          }
          .el-icon-transition-up {
            transition: transform 0.5s;
            transform: rotate(0deg);
          }
          .el-icon-transition-down {
            transition: transform 0.5s;
            transform: rotate(-180deg);
          }
        }
        .pannel-content-detail {
          .detail-box {
            padding: 4px 0;
            .detail-box-label {
              width: 78px;
              color: var(--color-text-crossform);
              margin-right: 40px;
              display: inline-block
            }
            .detail-box-text {
              color: var(--color-text-crossform-active);
            }
          }
        }
      }
    }
    .info-flex {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0 30px 0;
    }
  }
}
</style>
