<template>
  <pannel
    class="signal-edit-pannel"
    :title="title"
    title-icon-class="icon-new-intersection"
    @close="handleClose"
  >
    <div>
      <div class="cross-info-content">
        <div class="cross-info-content_info">
          <span
            v-if="signalForm1"
            class="cross-info-content_info_title"
          >基本信息</span>
          <span
            v-if="signalForm2"
            class="cross-info-content_info_title"
          >管理信息</span>
          <span
            v-if="signalForm3"
            class="cross-info-content_info_title"
          >维护信息</span>
        </div>
        <div style="width:90%;margin:20px 0 16px 0;display: -webkit-flex; display: flex;-webkit-justify-content: center;justify-content: center;">
          <div
            v-if="signalForm1"
          >
            <img
              src="../images/re-signal-2-1-on.svg"
              style="cursor:pointer"
              alt=""
              @click="signalFirst"
            >
            <img
              style="margin:10px 20px"
              src="../images/re-signal-line-regual.svg"
              alt=""
            >
            <img
              src="../images/re-signal-2-2-off.svg"
              alt=""
              style="cursor:pointer"
              @click="signalSecond"
            >
            <img
              style="margin:10px 20px"
              src="../images/re-signal-line-regual.svg"
              alt=""
            >
            <img
              src="../images/re-signal-3-off.svg"
              alt=""
              style="cursor:pointer"
              @click="signalThird"
            >
          </div>
          <div
            v-if="signalForm2"
          >
            <img
              src="../images/re-signal-2-1-off.svg"
              alt=""
              style="cursor:pointer"
              @click="signalFirst"
            >
            <img
              style="margin:10px 20px"
              src="../images/re-signal-line-regual.svg"
              alt=""
            >
            <img
              src="../images/re-signal-2-2-on.svg"
              alt=""
              style="cursor:pointer"
              @click="signalSecond"
            >
            <img
              style="margin:10px 20px"
              src="../images/re-signal-line-regual.svg"
              alt=""
            >
            <img
              src="../images/re-signal-2-3-off.svg"
              alt=""
              style="cursor:pointer"
              @click="signalThird"
            >
          </div>
          <div
            v-if="signalForm3"
          >
            <img
              src="../images/re-signal-2-1-off.svg"
              alt=""
              style="cursor:pointer"
              @click="signalFirst"
            >
            <img
              style="margin:10px 20px"
              src="../images/re-signal-line-regual.svg"
              alt=""
            >
            <img
              src="../images/re-signal-2-2-off.svg"
              alt=""
              style="cursor:pointer"
              @click="signalSecond"
            >
            <img
              style="margin:10px 20px"
              src="../images/re-signal-line-regual.svg"
              alt=""
            >
            <img
              src="../images/re-signal-2-3-on.svg"
              alt=""
              style="cursor:pointer"
              @click="signalThird"
            >
          </div>
        </div>
        <el-form
          v-show="signalForm1"
          ref="signalform"
          :rules="rules"
          class="signalform"
          :model="signalformData$"
        >
          <el-form-item
            label="设备编号"
            label-width="100px"
            prop="suffix"
          >
            <div>
              <el-input
                v-model="signalformData$.suffix"
                class="input-style"
                placeholder="例如：66666"
              />
            </div>
          </el-form-item>
          <el-form-item
            prop="ip"
            label="信号机IP"
            label-width="100px"
          >
            <div>
              <div style="display:flex;">
                <el-button
                  class="ip-button"
                  placeholder="IPV4"
                  :class="{ 'ipButtonClass': signalformData$.ipType===1, 'ipButtonClass2': signalformData$.ipType===2 }"
                  @click="clickSignalIP(4)"
                >
                  IPV4
                </el-button>

                <el-button
                  class="ip-button2"
                  placeholder="IPV4"
                  :class="{ 'ipButtonClass2': signalformData$.ipType===1, 'ipButtonClass': signalformData$.ipType===2 }"
                  @click="clickSignalIP(6)"
                >
                  IPV6
                </el-button>
              </div>
              <div class="upperIp-message">
                {{ ipMessage }}
              </div>
              <div style="margin-top:4px">
                <el-input
                  v-model="signalformData$.ip"
                  class="input-style"
                  placeholder="192.196.2.210"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="信号机类型"
            label-width="100px"
            prop="signalPlanStructureType"
          >
            <div>
              <el-select
                v-model="signalformData$.signalPlanStructureType"
                class="input-style"
                placeholder="请选择信号机类型"
                disabled
              >
                <el-option
                  v-for="item in signalPlanStructureTypeOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item
            label="平台托管"
            label-width="100px"
            prop="hostingPlatform"
          >
            <div>
              <el-radio-group
                v-model="signalformData$.hostingPlatform"
                @change="hostingPlatformChange"
              >
                <el-radio :label="1">
                  托管
                </el-radio>
                <el-radio :label="2">
                  未托管
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item
            prop="upperIp"
            label="上位机IP"
            label-width="100px"
          >
            <div>
              <div style="display:flex;">
                <el-button
                  class="ip-button"
                  placeholder="IPV4"
                  :class="{ 'ipButtonClass': signalformData$.upperIpType===1, 'ipButtonClass2': signalformData$.upperIpType===2 }"
                  @click="clickIp(4)"
                >
                  IPV4
                </el-button>

                <el-button
                  class="ip-button2"
                  placeholder="IPV6"
                  :class="{ 'ipButtonClass2': signalformData$.upperIpType===1, 'ipButtonClass': (signalformData$.upperIpType===2) }"
                  @click="clickIp(6)"
                >
                  IPV6
                </el-button>
              </div>
              <div class="upperIp-message">
                {{ upperIpMessage }}
              </div>
              <div style="margin-top:4px">
                <el-input
                  v-model="signalformData$.upperIp"
                  class="input-style"
                  placeholder="例如：192.204.20.127"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="设备型号"
            label-width="100px"
            prop="model"
          >
            <div>
              <el-input
                v-model="signalformData$.model"
                class="input-style"
                placeholder="例如：sutpc"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="设备厂家"
            label-width="100px"
            prop="manufacturer"
          >
            <div>
              <el-select
                v-model="signalformData$.manufacturer"
                class="input-style"
                placeholder="请选择设备厂家"
              >
                <el-option
                  v-for="item in manufacturerOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item
            label="协议版本"
            label-width="100px"
            prop="version"
          >
            <div>
              <el-input
                v-model="signalformData$.version"
                class="input-style"
                placeholder="例如：1"
              />
            </div>
          </el-form-item>
        </el-form>

        <el-form
          v-show="signalForm2"
          ref="signalform2"
          :rules="rules2"
          class="signalform"
          :model="signalformData$"
        >
          <el-form-item
            prop="mask"
            label="子网掩码"
            label-width="100px"
          >
            <div>
              <div style="display:flex;">
                <el-button
                  class="ip-button"
                  :class="{ 'ipButtonClass': SubnetButtonClass, 'ipButtonClass2': !SubnetButtonClass }"
                  placeholder="IPV4"
                  @click="clickIp2(4)"
                >
                  IPV4
                </el-button>

                <el-button
                  class="ip-button2"
                  :class="{ 'ipButtonClass2': SubnetButtonClass2, 'ipButtonClass': !SubnetButtonClass2 }"
                  placeholder="IPV6"
                  @click="clickIp2(6)"
                >
                  IPV6
                </el-button>
              </div>
              <div style="margin-top:4px">
                <el-input
                  v-model="signalformData$.mask"
                  class="input-style"
                  placeholder="255.255.0.0"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="端口号"
            label-width="100px"
            prop="upperPort"
          >
            <div>
              <el-input
                v-model.number="signalformData$.upperPort"
                class="input-style"
                placeholder="例如：8000"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="网关"
            label-width="100px"
            prop="gateway"
          >
            <div>
              <el-input
                v-model="signalformData$.gateway"
                class="input-style"
                placeholder="例如：10.10.10.1"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="通讯类型"
            label-width="100px"
            prop="upperCommunicationType"
          >
            <div>
              <el-select
                v-model="signalformData$.upperCommunicationType"
                class="input-style"
                placeholder="TCP"
              >
                <el-option
                  label="TCP"
                  :value="1"
                />
                <el-option
                  label="UDP"
                  :value="2"
                />
                <el-option
                  label="RS232"
                  :value="3"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            label="出厂编号"
            label-width="100px"
            prop="manufactureNumber"
          >
            <div>
              <el-input
                v-model="signalformData$.manufactureNumber"
                class="input-style"
                placeholder="例如：1212"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="出厂日期"
            label-width="100px"
            prop="manufactureDate"
          >
            <div

              class="date-picker-width"
            >
              <el-date-picker
                v-model="signalformData$.manufactureDate"
                class="date-picker-icon input-style"
                type="date"
                align="left"
                value-format="yyyyMMddHHmmss"
                clearable
                placeholder="例如：2020-01-04"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="接入方式"
            label-width="100px"
            prop="connectionType"
          >
            <div>
              <el-radio-group v-model="signalformData$.connectionType">
                <el-radio :label="2">
                  无线
                </el-radio>
                <el-radio :label="1">
                  有线
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>

        <el-form
          v-show="signalForm3"
          ref="signalform3"
          :rules="rules3"
          class="signalform"
          :model="signalformData$"
        >
          <el-form-item
            label="安装单位"
            label-width="100px"
            prop="installer"
          >
            <div>
              <el-input
                v-model="signalformData$.installer"
                class="input-style"
                placeholder="请输入安装单位"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="安装日期"
            label-width="100px"
            prop="installTime"
          >
            <div

              class="date-picker-width"
            >
              <el-date-picker
                v-model="signalformData$.installTime"
                class="date-picker-icon input-style"
                type="date"
                align="left"
                value-format="yyyyMMddHHmmss"
                clearable
                placeholder="选择时间"
              />
            </div>
          </el-form-item>
          <el-form-item
            label="维护单位"
            label-width="100px"
            prop="maintainUnit"
          >
            <div>
              <el-input
                v-model="signalformData$.maintainUnit"
                class="input-style"
                placeholder="请输入维护单位"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="维护电话"
            label-width="100px"
            prop="maintainPhone"
          >
            <div>
              <el-input
                v-model="signalformData$.maintainPhone"
                class="input-style"
                placeholder="请输入维护者联系电话"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div
      slot="footer"
      class="signal-register-pannel_btn"
    >
      <el-button
        class="signal-close_btn"
        @click="handleCancel"
      >
        取消
      </el-button>

      <el-button
        class="signal-save_btn"
        type="primary"
        @click="handleSubmit"
      >
        保存
      </el-button>
    </div>
  </pannel>
</template>

<script>
import Pannel from "./pannel"
import { API } from "@/api/modules/cross"
export default {
  components: {
    Pannel,
  },
  props: {
    signalformData: {
      type: Object,
      default () {
        return {};
      }
    },
    crossData: {
      type: Object,
      default () {
        return {};
      }
    },
  },
  data () {
    this.signalformData$ = this.$deepCopy(this.signalformData)
    var validMask = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      if (this.signalformData$.upperIpType === 1) {
        var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        setTimeout(() => {
          if (reg.test(value)) {
            value.match(reg);
            if (RegExp.$1 <= 255 && RegExp.$1 >= 0 &&
              RegExp.$2 <= 255 && RegExp.$2 >= 0 &&
              RegExp.$3 <= 255 && RegExp.$3 >= 0 &&
              RegExp.$4 <= 255 && RegExp.$4 >= 0) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv4格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv4格式"));
          }
        }, 1000);
      } else if (this.signalformData$.upperIpType === 2) {
        var regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
        setTimeout(() => {
          if (regIpv6.test(value)) {
            var ret = value.match(regIpv6);
            if (ret) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv6格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv6格式"));
          }
        }, 1000);
      }
    };
    var validUpperPort = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      if (value) {
        setTimeout(() => {
          if (Number(value) <= (Math.pow(10, 32) - 1)) {
            return callback();
          } else {
            return callback(new Error("长度限定32位数字字符"));
          }
        }, 1000);
      }
    };
    var validateIp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("ip不能为空"));
      }
      if (this.signalformData$.ipType === 1) {
        var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        setTimeout(() => {
          if (reg.test(value)) {
            value.match(reg);
            if (RegExp.$1 <= 255 && RegExp.$1 >= 0 &&
              RegExp.$2 <= 255 && RegExp.$2 >= 0 &&
              RegExp.$3 <= 255 && RegExp.$3 >= 0 &&
              RegExp.$4 <= 255 && RegExp.$4 >= 0) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv4格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv4格式"));
          }
        }, 1000);
      } else if (this.signalformData$.ipType === 2) {
        var regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
        setTimeout(() => {
          if (regIpv6.test(value)) {
            var ret = value.match(regIpv6);
            if (ret) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv6格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv6格式"));
          }
        }, 1000);
      }
    };
    var validateUpperIp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("ip不能为空"));
      }
      if (this.signalformData$.upperIpType === 1) {
        var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        setTimeout(() => {
          if (reg.test(value)) {
            value.match(reg);
            if (RegExp.$1 <= 255 && RegExp.$1 >= 0 &&
              RegExp.$2 <= 255 && RegExp.$2 >= 0 &&
              RegExp.$3 <= 255 && RegExp.$3 >= 0 &&
              RegExp.$4 <= 255 && RegExp.$4 >= 0) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv4格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv4格式"));
          }
        }, 1000);
      } else if (this.signalformData$.upperIpType === 2) {
        var regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
        setTimeout(() => {
          if (regIpv6.test(value)) {
            var ret = value.match(regIpv6);
            if (ret) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv6格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv6格式"));
          }
        }, 1000);
      }
    };

    var validateUpperIpNO = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      if (this.signalformData$.upperIpType === 1) {
        var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        setTimeout(() => {
          if (reg.test(value)) {
            value.match(reg);
            if (RegExp.$1 <= 255 && RegExp.$1 >= 0 &&
              RegExp.$2 <= 255 && RegExp.$2 >= 0 &&
              RegExp.$3 <= 255 && RegExp.$3 >= 0 &&
              RegExp.$4 <= 255 && RegExp.$4 >= 0) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv4格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv4格式"));
          }
        }, 1000);
      } else if (this.signalformData$.upperIpType === 2) {
        var regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/;
        setTimeout(() => {
          if (regIpv6.test(value)) {
            var ret = value.match(regIpv6);
            if (ret) {
              return callback();
            } else {
              return callback(new Error("请输入合格ipv6格式"));
            }
          } else {
            return callback(new Error("请输入合格ipv6格式"));
          }
        }, 1000);
      } else if (this.signalformData$.upperIpType === 0) {
        return callback()
      }
      return callback(new Error("上位机IP出错"))
    };
    return {
      loadingQuery: false,
      ipButtonClass: true,
      ipButtonClass2: true,
      ipButtonClassIP: true,
      ipButtonClass2IP: true,
      signalForm1: true,
      signalForm2: false,
      signalForm3: false,
      validateUpperIp,
      validateUpperIpNO,
      validMask,
      validateIp,
      signalformData$: this.signalformData$,
      signalPlanStructureTypeOptions: [
        { label: "阶段", value: 0, key: 0 },
        { label: "环结构", value: 1, key: 1 },
      ],
      manufacturerOptions: [
        { label: "榕亨", value: "榕亨", key: 1 },
        { label: "海信", value: "海信", key: 2 },
        { label: "海康", value: "海康", key: 3 },
        { label: "金光道", value: "金光道", key: 4 },
        { label: "深研", value: "深研", key: 5 },
        { label: "东土", value: "东土", key: 6 },
      ],
      rules: {
        upperIp: this.signalformData$.hostingPlatform === 1 ? [{ required: true, validator: validateUpperIp, trigger: "blur" }] : [{ required: false, validator: validateUpperIpNO, trigger: "blur" }],
        upperIpType: this.signalformData$.hostingPlatform === 1 ? [{ required: true, message: "必填项", trigger: "blur" }] : null,
        ip: [{ required: true, validator: validateIp, trigger: "blur" }],
        ipType: [{ required: true, message: "必填项", trigger: "blur" }],
        suffix: [{ required: true, message: "必填项", trigger: "blur" }, { max: 5, min: 5, message: "请输入5位数字", trigger: "blur" }],
        signalPlanStructureType: [{ required: true, message: "必填项", trigger: "blur" }],
        hostingPlatform: [{ required: true, message: "必填项", trigger: "blur" }],
        model: [{ required: true, message: "必填项", trigger: "blur" }, { max: 50, message: "长度限定50字符", trigger: "blur" }],
        manufacturer: [{ required: true, message: "必填项", trigger: "blur" }],
        version: [{ required: true, message: "必填项", trigger: "blur" }, { max: 50, message: "长度限定50字符", trigger: "blur" }],
      },
      rules3: {
        installTime: [{ required: true, message: "必填项", trigger: "blur" }],
        installer: [{ required: true, message: "必填项", trigger: "blur" }, { max: 50, message: "长度限定50字符", trigger: "blur" }],
        maintainUnit: [{ required: true, message: "必填项", trigger: "blur" }, { max: 50, message: "长度限定50字符", trigger: "blur" }],
        maintainPhone: [{ max: 11, required: true, message: "长度限定11字符", trigger: "blur" }],
      },
      SubnetButtonClass: true,
      SubnetButtonClass2: true,
      rules2: {
        upperPort: [{ validator: validUpperPort, trigger: "blur" }],
        mask: [{ validator: validMask, trigger: "blur" }],
        gateway: [{ validator: validMask, trigger: "blur" }],
        manufactureNumber: [{ max: 50, message: "长度限定50字符", trigger: "blur" }],
      },
    };
  },
  computed: {
    title () {
      if (this.crossData.crossNumber) {
        return `【${this.crossData.crossNumber}】${this.crossData.crossName}`
      }
      return ""
    },
    ipMessage () {
      const message = this.signalformData$.ipType === 0 ? "请勾选上位机IP" : ""
      return message
    },
    upperIpMessage () {
      const message = this.signalformData$.hostingPlatform === 1 && this.signalformData$.upperIpType === 0 ? "请勾选上位机IP" : ""
      return message
    }
  },
  watch: {
    signalformData$: {
      handler () {
        this.signalformData$ = deepcopy(this.signalformData)
      },
    }
  },
  created () {
  },
  methods: {
    handleClose () {
      this.$emit("close")
    },
    handleCancel () {
      this.$emit("signalEditCancel")
    },
    async handleSubmit () {
      this.signalFormPromise = new Promise((resolve) => {
        this.signalFormResolve = resolve
      })
      const promiseList = []
      const sessionData = JSON.parse(window.sessionStorage.getItem("state-user_loginResponse")) ? JSON.parse(window.sessionStorage.getItem("state-user_loginResponse")) : JSON.parse(window.localStorage.getItem("state-user_loginResponse"))
      this.signalformData$.number = `${sessionData.company.code}${this.signalformData$.suffix}`
      if (this.upperIpMessage && this.ipMessage) return
      const promise = new Promise((resolve) => {
        this.$refs.signalform.validate(async valid => {
          this.signalformRules = valid
          resolve()
        });
      })
      const promise2 = new Promise((resolve) => {
        this.$refs.signalform2.validate(async valid => {
          this.signalformRules2 = valid
          resolve()
        });
      })
      const promise3 = new Promise((resolve) => {
        this.$refs.signalform3.validate(async valid => {
          this.signalformRules3 = valid
          resolve()
        });
      })
      promiseList.push(promise, promise2, promise3)
      Promise.all(promiseList).then(() => {
        this.signalFormResolve()
      })
      await this.signalFormPromise
      console.log(this.signalformRules, this.signalformRules2, this.signalformRules3)
      if (this.signalformRules && this.signalformRules2 && this.signalformRules3) {
        this.save()
      } else {
        this.$message({ message: "有部分参数不符合要求，请重新编辑", type: "error", showClose: true, center: true })
      }
      // this.$refs.signalform.validate(async valid => {
      //   this.signalformRules = valid
      // });
      // this.$refs.signalform2.validate(async valid => {
      //   this.signalformRules2 = valid
      // });
      // this.$refs.signalform3.validate(async valid => {
      //   this.signalformRules3 = valid
      // });
      // Todo: 后续考虑await优化
      // setTimeout(() => {
      //   if (this.signalformRules && this.signalformRules2 && this.signalformRules3) {
      //     this.save()
      //   } else {
      //     this.$message({ message: "有部分参数不符合要求，请重新编辑", type: "error", showClose: true, center: true })
      //   }
      // }, 1000)
    },
    async save () {
      if (!this.crossData.precinct) {
        this.$message.warning("该路口无管辖区域，注册信号机将报错！");
      }
      const req = {
        crossId: this.crossData.currentCrossId,
        signal: this.signalformData$,
        precinctId: this.crossData.precinct.id,
      }
      await API.saveSignal(req).then(res => {
        if (res.error) {
          const start = res.message.lastIndexOf("/")
          const msg = res.message.slice(start + 1)
          this.$message.error(msg);
        } else {
          this.$message.success("保存成功")
          this.$emit("handleSubmit")
        }
      })
    },
    clickIp (val) {
      if (val === 4) {
        this.ipButtonClass = true
        this.ipButtonClass2 = true
        this.signalformData$.upperIpType = 1
      } else if (val === 6) {
        this.ipButtonClass = false
        this.ipButtonClass2 = false
        this.signalformData$.upperIpType = 2
      }
    },
    clickSignalIP (val) {
      if (val === 4) {
        this.ipButtonClassIP = true
        this.ipButtonClass2IP = true
        this.signalformData$.ipType = 1
      } else if (val === 6) {
        this.ipButtonClassIP = false
        this.ipButtonClass2IP = false
        this.signalformData$.ipType = 2
      }
    },
    clickIp2 (val) {
      if (val === 4) {
        this.SubnetButtonClass = true
        this.SubnetButtonClass2 = true
        this.signalformData$.maskType = 1
      } else if (val === 6) {
        this.SubnetButtonClass = false
        this.SubnetButtonClass2 = false
        this.signalformData$.maskType = 2
      }
    },

    deleteSignal () {
      const id = this.signalformData$.id
      this.$emit("deleteSignal", id)
    },
    hostingPlatformChange (label) {
      if (label === 2) {
        this.rules.upperIp = [{ validator: this.validateUpperIpNO, trigger: "blur" }]
        this.rules.upperIpType = null
      } else {
        this.rules.upperIp = [{ required: true, validator: this.validateUpperIp, trigger: "blur" }]
        this.rules.upperIpType = [{ required: true, message: "必填项", trigger: "blur" }]
      }
    },
    signalFirst () {
      if (this.signalForm2) {
        this.$refs.signalform2.validate(async valid => {
          if (!valid) {
            return false
          } else {
            this.signalForm1 = true
            this.signalForm2 = false
            this.signalForm3 = false
          }
        });
      }
      if (this.signalForm3) {
        this.$refs.signalform3.validate(async valid => {
          if (!valid) {
            return false
          } else {
            this.signalForm1 = true
            this.signalForm2 = false
            this.signalForm3 = false
          }
        });
      }
    },
    signalSecond () {
      if (this.signalForm1) {
        this.$refs.signalform.validate(async valid => {
          if (!valid) {
            return false
          } else {
            this.signalForm1 = false
            this.signalForm2 = true
            this.signalForm3 = false
          }
        });
      }
      if (this.signalForm3) {
        this.$refs.signalform3.validate(async valid => {
          if (!valid) {
            return false
          } else {
            this.signalForm1 = false
            this.signalForm2 = true
            this.signalForm3 = false
          }
        });
      }
    },
    signalThird () {
      if (this.signalForm1) {
        this.$refs.signalform.validate(async valid => {
          if (!valid) {
            return false
          } else {
            this.signalForm1 = false
            this.signalForm2 = false
            this.signalForm3 = true
          }
        });
      }
      if (this.signalForm2) {
        this.$refs.signalform2.validate(async valid => {
          if (!valid) {
            return false
          } else {
            this.signalForm1 = false
            this.signalForm2 = false
            this.signalForm3 = true
          }
        });
      }
    },
  }
}
</script>
<style scoped lang="scss">
.signal-edit-pannel {
  width: 100%;
  .cross-info-content {
    background: var(--color-background-pannel-content);
    width:100%;
    .cross-info-content_info {
      display: flex;
      height:36px;
      line-height: 36px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-text-pannel-title);
      letter-spacing: 0;
      margin: 0 15px;
      padding: 25px 0 10px 0;
      position: relative;
      &::after {
        position: absolute;
        display: block;
        content: "";
        width: 100%;
        height: 1px;
        bottom: 0;
        background-color: var(--color-background-crossform-after);
      }

      .cross-info-content_info_title {
        padding-left: 10px;
        flex: 1;
      }
    }
  }

  .signalform {
    .el-form-item {
      margin: 10px 0 30px 0;
      .el-form-item__label {
        width: 100px;
        height: 20px;
        margin: 10px 0 0 0;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-text-sinal-register);
        text-align: right;
      }
      .form-radio-group {
        margin-left: 10px;
      }
      .upperIp-message {
        position: relative;
        color: #f56c6c;
        font-size: 12px;
      }
    }

    .el-input__inner {
      &::placeholder {
        color: var(--color-text-crossform);
      }
      color: var(--color-text-crossform-active);
      background-color: var(--color-background-crossform-input);
    }
    ::v-deep .el-form-item__error {
      position: relative;
    }
    ::v-deep .el-form-item__label {
      text-align: left;
      margin-left: 30px;
    }
    ::v-deep .el-form-item__content {
      margin-left: 130px!important;
    }
  }
  ::v-deep .el-form-item__label::before {
    position: absolute;
    left: 20px;
  }

  .signal-register-pannel_btn {
    padding-top: 12px;
    text-align: center;

    .signal-close_btn {
      width: 160px;
      height: 32px;
      border-radius: 2px;
    }

    .signal-save_btn {
      width: 160px;
      height: 32px;
      border-radius: 2px;
    }
  }
}
.ip-button {
  margin: 0 0 0 8px;
  width: 60px;
  height: 32px;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  text-align: right;
}
.ipButtonClass {
  background: var(--color-background-signal-edit-select);
  color: var(--color-text-signal-edit-select);
}
.ip-button2 {
  margin: 0 20px 0 4px;
  width: 60px;
  height: 32px;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  text-align: right;
}
.ipButtonClass2 {
  background-color: var(--color-background-signal-edit-unselect);
  color: var(--color-text-signal-edit-unselect);
}
.add-btn {
  height: 32px;
  border-radius: 2px;
}

.input-style {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: auto;
  margin-left: 8px;
  height: 100%;
  width: 256px;
}
.button-next {
  width: 150px;
  height: 32px;
  background: #02365b;
  border-radius: 2px;
  border: 1px solid #077edb;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  text-align: center;
}
@media screen and (min-width: 2000px) {
  .input-style {
    width: 326px;
  }
}

@media screen and (min-width: 3000px) {
  .input-style {
    width: 392px;
  }
}
@media screen and (min-width: 4000px) {
  .input-style {
    width: 592px;
  }
}

.ellipsis-text {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  width: 240px;
  text-align: left;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0;
  display: block;
  margin:16px 0 16px 20px;
}
.ellipsis-text:hover {
  text-overflow: inherit;
  overflow: visible;
  white-space: pre-line;
}
@media screen and (min-width: 1921px) {
  .ellipsis-text {
    width: 240px;
  }
}
@media screen and (min-width: 2000px) {
  .ellipsis-text {
    width: 280px;
  }
}
@media screen and (min-width: 3000px) {
  .ellipsis-text {
    width: 360px;
  }
}
@media screen and (min-width: 4000px) {
  .ellipsis-text {
    width: 400px;
  }
}
@media screen and (min-width: 6000px) {
  .ellipsis-text {
    width: 600px;
  }
}
.date-picker-width{
 .el-date-editor.el-input{
    width: 256px;
  }
 }

@media screen and (min-width: 2000px) {
  .input-style {
    width: 326px;
  }
 .date-picker-width{
 .el-date-editor.el-input{
    width: 326px;
  }
 }
}

@media screen and (min-width: 3000px) {
  .input-style {
    width: 392px;
  }
 .date-picker-width{
 .el-date-editor.el-input{
    width: 392px;
  }
 }
}
@media screen and (min-width: 4000px) {
  .input-style {
    width: 592px;
  }
 .date-picker-width{
 .el-date-editor.el-input{
    width: 592px;
  }
 }
}
</style>
