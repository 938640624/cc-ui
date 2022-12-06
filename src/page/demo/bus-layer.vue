<template>
  <div>
    <K3ModelEntity
      v-for="item in list"
      :id="`busarea${item.id}`"
      :key="`busarea${item.id}`"
      :position="item"
      :billboard="areaBillboard"
      dynamic
      @load="handleEntityLoad"
      @click="handleBusClick(item)"
    />
    <K3ModelEntity
      v-for="item in list"
      :id="`textbusarea${item.id}`"
      :key="`textbusarea${item.id}`"
      :position="item"
      :billboard="areaTextBillboard"
      dynamic
      :label="areaTextlabel(item)"
      @click="handleBusClick(item)"
    />

    <K3ModelEntity
      v-for="item in list"
      :id="`busline${item.id}`"
      :key="`busline${item.id}`"
      :position="item"
      :model="busModelStyle"
      dynamic
      @click="handleBusClick(item)"
    />
    <K3ModelEntity
      v-for="item in list"
      :id="`textbusline${item.id}`"
      :key="`textbusline${item.id}`"
      :position="item"
      :billboard="lineTextBillboard"
      :label="lineTextlabel(item)"
      dynamic
      @click="handleBusClick(item)"
    />

    <!-- <K3HtmlOverlay
      v-for="item in list"
      :key="`bus${item.id}`"
      :position="item"
      :offset="[0, -20]"
      dynamic
    >
      <WmlPopup>
        <div
          class="bus-label"
          @click="handleBusClick(item)"
        >
          <p>准点巴士：</p>
          <p>
            {{ item.busServing ? item.busServing.routeNo : "" }}&nbsp;{{
              item.carCode
            }}
          </p>
        </div>
      </WmlPopup>
    </K3HtmlOverlay> -->
  </div>
</template>
<script type = 'text/javascript'>
import { isEmpty } from "@/utils/is";
import { deepCopy } from "@/permission/helper";
import { busfilterMap, BUS_TYPE, MONITOR_LEVEL_MAPS, MONITOR_DISABLE_DEPTH_TEST_DISTANCE } from "@/api/modules/bus";
import { objArr2obj } from "@/utils/convertor";
export default {
  name: "BusLayer",
  inject: ["viewerPromise"],
  props: {
    viewRectangle: {
      type: Object,
      default () {
        return {}
      }
    },
    zoomLevel: {
      type: String,
      default: MONITOR_LEVEL_MAPS.area
    }
  },
  data () {
    return {
      list: [],
    }
  },
  computed: {
    areaTextlabel () {
      return (bus) => {
        return {
          text: `${bus.busServing ? bus.busServing.routeNo : ""}\u00A0${bus.carCode}`,
          font: "normal 14px PingFang SC, PingFangSC-Regular",
          fillColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0, -80),
          // pixelOffsetScaleByDistance: new Cesium.NearFarScalar(60, 5, 520, 1),
          // scaleByDistance: new Cesium.NearFarScalar(60, 1, 520, 1),
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: MONITOR_DISABLE_DEPTH_TEST_DISTANCE
        }
      }
    },
    lineTextlabel () {
      return (bus) => {
        return {
          text: `${bus.busServing ? bus.busServing.routeNo : ""}\u00A0${bus.carCode}`,
          font: "normal 14px PingFang SC, PingFangSC-Regular",
          fillColor: Cesium.Color.WHITE,
          pixelOffset: new Cesium.Cartesian2(0, -80),
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: 0
        }
      }
    },
  },
  watch: {
    viewRectangle: {
      handler (val) {
        if (isEmpty(val)) {
          this.listSub && this.listSub.unsubscribe();
          this.list = [];
        } else {
          this.fetchListData();
        }
      },
      immediate: true
    },
    zoomLevel: {
      async handler (val) {
        await this.mapLoadedPromise
        switch (val) {
          case MONITOR_LEVEL_MAPS.area: {
            this.entitiesIdVisible("busarea", true)
            this.entitiesIdVisible("busline", false)
            break
          }
          case MONITOR_LEVEL_MAPS.line: {
            this.entitiesIdVisible("busarea", false)
            this.entitiesIdVisible("busline", true)
            break
          }

          case MONITOR_LEVEL_MAPS.measure: {
            this.entitiesIdVisible("busarea", false)
            this.entitiesIdVisible("busline", true)
            break
          }
          default: {
            this.entitiesIdVisible("busarea", true)
            this.entitiesIdVisible("busline", false)
          }
        }
      },
      immediate: true
    },
  },
  beforeCreate () {
    this.mapLoadedPromise = new Promise((resolve) => {
      this.mapLoadedPromiseResolve = resolve
    })

    this.busModelStyle = {
      uri: "/static/models/bus.gltf",
      scale: 0.05,
    }

    this.areaBillboard = {
      image: require(`@/assets/images/priority/bus-layer.svg`),
      width: 42,
      height: 54,
      horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: MONITOR_DISABLE_DEPTH_TEST_DISTANCE
    }

    this.areaTextBillboard = {
      image: require(`@/assets/images/priority/bus-label-layer.svg`),
      width: 122,
      height: 38,
      pixelOffset: new Cesium.Cartesian2(0, -60),
      horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: MONITOR_DISABLE_DEPTH_TEST_DISTANCE
    }

    this.lineTextBillboard = {
      image: require(`@/assets/images/priority/bus-model-label-layer.svg`),
      width: 122,
      height: 98,
      horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: 0
    }
  },
  created () {
    this.viewerPromise.then(viewer => {
      this.viewer = viewer
    })
  },
  beforeDestroy () {
    this.listSub && this.listSub.unsubscribe();
  },
  methods: {
    // 设置事件加载完成状态
    async handleEntityLoad () {
      this.mapLoadedPromiseResolve()
    },
    fetchListData () {
      const busTypeMap = objArr2obj(BUS_TYPE);
      const req = { loopCoordinate: this.viewRectangle, carTypes: busTypeMap.onTime };
      this.listSub && this.listSub.unsubscribe();
      this.listSub = busfilterMap.subscribe(req,
        update => {
          const cacheBusList = deepCopy(this.list);
          update.busList.forEach(bus => {
            const index = cacheBusList.findIndex(cBus => cBus.id === bus.id);
            if (~index) {
              cacheBusList[index] = bus;
            } else {
              cacheBusList.push(bus);
            }
          });
          this.list = cacheBusList;
          // this.createWaveCircle()
        },
        query => {
          this.list = query.busList;
        }
      );
    },

    // createWaveCircle () {
    //   this.removeAllWaveCircle()
    //   this.circleArr = this.list.map(bus => {
    //     const position = Cesium.Cartesian3.fromDegrees(bus.longitude, bus.latitude, 0);
    //     return new window.xt3d.CircleObject.WaveCircle(this.viewer, position, {
    //       height: 1,
    //       radius: 10,
    //       color: Cesium.Color.GREEN,
    //       duration: 4000,
    //       count: 2
    //     });
    //   })
    // },
    // removeAllWaveCircle () {
    //   if (this.circleArr?.length) {
    //     this.circleArr.forEach(circle => {
    //       const id = circle.circleEntity.id
    //       this.viewer.entities.removeById(id)
    //     })
    //   }
    // },
    handleBusClick (item) {
      sessionStorage.setItem("activeBus", JSON.stringify(item))
      this.$router.push({ name: "FtcBus", query: { isOnTimeBus: true } })
    },
    entitiesIdVisible (id, visible) {
      this.viewer.entities._entities._array.forEach(item => {
        if (item.id.indexOf(id) >= 0) {
          item.show = visible
        }
      })
    },
    // 生成动态的position位置
    // dynamicPosition (position) {
    //   let firstTime = Cesium.JulianDate.now();
    //   let curPosition = null
    //   const sampledPosition = new Cesium.SampledPositionProperty();
    //   const clock = this.viewer.clock
    //   sampledPosition.addSample(firstTime, position);
    //   if (firstTime) {
    //     curPosition = sampledPosition
    //     clock.clockRange = Cesium.ClockRange.CLAMPED
    //     clock.currentTime = firstTime.clone()
    //     firstTime = null
    //   }
    //   clock.stopTime = Cesium.JulianDate.now()
    //   const target = position
    //   const cvm = this.viewer.clockViewModel
    //   sampledPosition.addSample(Cesium.JulianDate.now(), target)
    //   cvm.shouldAnimate = cvm.shouldAnimate || true
    //   return curPosition
    // }
  },
}
</script>
<style lang='scss' scoped>
  .bus-label {
    padding: 6px 0;
    line-height: 26px;
    font-size: 16px;
  }
</style>
