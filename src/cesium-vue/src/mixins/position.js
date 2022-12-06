import { makeCartesian2, makeCartesian3FromDegrees } from "../../../helper/utils/cesiumHelpers"
export const positionMixin = {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    position: {
      type: [Array, Object],
      default() {
        return []
      }
    },
    dynamic: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cartesian3() {
      return makeCartesian3FromDegrees(this.position);
    }
  },
  watch: {
    cartesian3 (val, oldVal) {
      if (!this.show) return false
      const graphic = this.graphic || {}
      if (!this.dynamic) return (graphic.position = val);
      // clock：用于跟踪模拟时间的简单时钟
      const clock = this.viewer.clock;
      if (this.firstTime) {
        graphic.position = this.sampledPosition;
        // VelocityOrientationProperty:一个属性其计算结果为四元数旋转基于提供的PositionProperty的速度
        graphic.orientation = new Cesium.VelocityOrientationProperty(this.sampledPosition)
        clock.clockRange = Cesium.ClockRange.CLAMPED;
        clock.currentTime = this.firstTime.clone();
        this.firstTime = null;
      }
      clock.stopTime = Cesium.JulianDate.now();
      const target = val || oldVal;
      const cvm = this.viewer.clockViewModel;
      this.sampledPosition.addSample(Cesium.JulianDate.now(), target);
      cvm.shouldAnimate = cvm.shouldAnimate || true
    }
  },
  created() {
    if (this.dynamic) {
      this.firstTime = Cesium.JulianDate.now();
      this.sampledPosition = new Cesium.SampledPositionProperty();
      this.sampledPosition.addSample(this.firstTime, this.cartesian3);
    }
  }
}

export const offsetMixin = {
  props: {
    offset: {
      type: [Array, Object],
      default() {
        return []
      }
    },
  },
  computed: {
    cartesian2() {
      return makeCartesian2(this.offset);
    }
  }
}
