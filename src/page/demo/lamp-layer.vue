<template>
  <div class="lamp-layer">
    <K3ModelEntity
      v-for="item in list"
      :id="`lampDistrict${item.id}`"
      :key="`lampDistrict${item.id}`"
      :position="item"
      :billboard="districtBillboard(item)"
      :click-to-fly="false"
      @load="handleEntityLoad"
      @click="handleModelClick($event, item)"
      @mousemove="handleMousemove($event, item)"
      @mouseout="handleMouseout"
    />

    <K3ModelEntity
      v-for="item in list"
      :id="`lampCross${item.id}`"
      :key="`lampCross${item.id}`"
      :position="item"
      :model="lampModelStyle"
      :billboard="crossBillboard(item)"
      :click-to-fly="false"
      @click="handleModelClick($event, item)"
      @mousemove="handleMousemove($event, item)"
      @mouseout="handleMouseout"
    />

    <K3HtmlOverlay
      v-if="overlayVisible"
      :id="overlayEntity.id"
      :key="overlayEntity.id"
      :position="overlayEntity"
      :offset="overlayOffset"
      origin="left bottom"
      click-to-fly
    >
      <HoverPopup
        :content-bg-image="lampBackgroundImage"
        :border-color="lampBorderColor"
      >
        <div class="event-layer-label">
          <span>站台名称：{{ overlayEntity.equipmentLocation }}</span>
        </div>
      </HoverPopup>
    </K3HtmlOverlay>

    <!-- <K3HtmlOverlay
      v-if="overlayVisible"
      :id="overlayItem.id"
      :key="overlayItem.id"
      :position="overlayEntity"
      :offset="overlayOffset"
      origin="left bottom"
      click-to-fly
    >
      <HoverPopup
        :content-bg-image="lampBackgroundImage"
        :border-color="lampBorderColor"
      >
        <div class="event-layer-label">
          <span>站台名称：{{ overlayItem.equipmentLocation }}</span>
        </div>
      </HoverPopup>
    </K3HtmlOverlay> -->

    <K3HtmlOverlay
      v-if="visiblePopup"
      :position="activeItem"
      :offset="[0, -50]"
    >
      <WmlPopup
        :title="`信号灯编号${signalLightRsuInfo.number}`"
        class="animate__animated animate__fadeIn"
        @click-close="closeLampPopup"
      >
        <WmlCell
          label="设备状态"
          :value="signalLightRsuInfo.status | statusFilter"
        />
        <WmlCell
          label="设备位置"
          :value="signalLightRsuInfo.equipmentLocation"
        />
        <WmlCell
          label="优先次数"
          :value="`${signalLightRsuInfo.signalPriorityAccumulationCount}次`"
        />
        <WmlCell
          label="信号优先率"
          :value="`${signalLightRsuInfo.busPassRate * 100}%`"
        />
      </WmlPopup>
    </K3HtmlOverlay>
    <div
      v-if="visiblePopup"
      class="detection-traffic-right"
    >
      <DetectionRight :signal-light-object="signalLightObject" />
    </div>
  </div>
</template>
<script type = 'text/javascript'>
import { objArr2filter } from "@/utils/convertor"
import { useEquipmentStatus } from "@/hooks/useApiConstant"
import { isEmpty } from "@/utils/is"
import { signalLightInfo, MONITOR_GET_MAPS } from "@/api/modules/bus";
import DetectionRight from "./detection-right.vue";
import { lampMarkerDest } from "@/api/modules/roadside";
// import { EntityCluster } from "@/plugins/EntityCluster/index.js";

export default {
  name: "LampLayer",
  inject: ["viewerPromise"],
  filters: {
    statusFilter: objArr2filter(useEquipmentStatus())
  },
  components: {
    DetectionRight
  },
  props: {
    viewRectangle: {
      type: Object,
      default () {
        return {}
      }
    },
    zoomLevel: {
      type: String,
      default: "city"
    }
  },
  data () {
    return {
      list: [],
      listArr: [],
      activeItem: {},
      signalLightObject: {},
      // signalLightMousemoveObject: {},
      overlayEntity: {},
      visiblePopup: false,
      overlayVisible: false,
      lampBackgroundImage: "",
      lampBorderColor: "",
      lampStatusImage: [
        {
          status: 1,
          image: require("@/assets/images/priority/lamp-online-layer.svg"),
          modelImage: require("@/assets/images/priority/lamp-online-model-layer.svg"),
          color: "#FFC310",
          backgroudImage: "linear-gradient(270deg, #B98202 0%, rgba(185,130,2,0.00) 100%)"
        },
        {
          status: 2,
          image: require("@/assets/images/priority/lamp-offline-layer.svg"),
          modelImage: require("@/assets/images/priority/lamp-offline-model-layer.svg"),
          color: "#D7D7D7",
          backgroudImage: "linear-gradient(90deg, rgba(149,149,149,0.00) 0%, #959595 100%)"
        },
        {
          status: 3,
          image: require("@/assets/images/priority/lamp-fault-layer.svg"),
          modelImage: require("@/assets/images/priority/lamp-fault-model-layer.svg"),
          color: "#FF4602",
          backgroudImage: "linear-gradient(270deg, #CF330C 0%, rgba(207,51,12,0.00) 100%)"
        }
      ],
      lampOffset: {
        district: [30, -64],
        cross: [30, -127]
      },
      overlayOffset: [],
    }
  },
  computed: {
    signalLightRsuInfo () {
      if (Object.keys(this.signalLightObject).length === 0) {
        return {};
      }
      const signalLightRsu = this.signalLightObject.signalLightType1[0];
      return signalLightRsu;
    },
    // overlayItem () {
    //   if (Object.keys(this.signalLightMousemoveObject).length === 0) {
    //     return {};
    //   }
    //   const signalLightRsu = this.signalLightMousemoveObject.signalLightType1[0];
    //   return signalLightRsu;
    // },
    districtBillboard () {
      return (lamp) => {
        const image = this.lampStatusImage.filter(item => item.status === lamp.status)[0].image
        return {
          image,
          width: 44,
          height: 103,
          horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        }
      }
    },
    crossBillboard () {
      return (lamp) => {
        const modelImage = this.lampStatusImage.filter(item => item.status === lamp.status)[0].modelImage
        return {
          image: modelImage,
          width: 44,
          height: 59,
          pixelOffset: new Cesium.Cartesian2(0, -107),
          // pixelOffsetScaleByDistance: new Cesium.NearFarScalar(60, 5, 520, 1),
          // scaleByDistance: new Cesium.NearFarScalar(60, 1, 520, 1),
          horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        }
      }
    },
  },
  watch: {
    viewRectangle: {
      handler (val) {
        if (isEmpty(val)) {
          this.list = [];
        } else {
          this.fetchData();
        }
      },
      immediate: true
    },
    zoomLevel: {
      async handler (val) {
        await this.mapLoadedPromise
        switch (val) {
          case MONITOR_GET_MAPS.city: {
            this.entitiesIdVisible("lampDistrict", false)
            this.entitiesIdVisible("lampCross", false)
            this.waveCircleVisible(false)
            break
          }
          case MONITOR_GET_MAPS.district: {
            this.entitiesIdVisible("lampDistrict", true)
            this.entitiesIdVisible("lampCross", false)
            this.waveCircleVisible(true)
            this.overlayOffset = this.lampOffset.district
            break
          }

          case MONITOR_GET_MAPS.cross: {
            this.entitiesIdVisible("lampDistrict", false)
            this.entitiesIdVisible("lampCross", true)
            this.waveCircleVisible(true)
            this.overlayOffset = this.lampOffset.cross
            break
          }
          default: {
            this.entitiesIdVisible("lampDistrict", false)
            this.entitiesIdVisible("lampCross", false)
            this.waveCircleVisible(false)
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

    this.listPromise = new Promise((resolve) => {
      this.listPromiseResolve = resolve
    })

    this.lampModelStyle = {
      uri: "/static/models/lamp.gltf",
      scale: 0.1,
    }
  },
  created () {
    this.viewerPromise.then(viewer => {
      this.viewer = viewer
    })
  },
  beforeDestroy () {
    this.listSub && this.listSub.unsubscribe()
    this.infoClickSub && this.infoClickSub.unsubscribe()
    this.infoMousemoveSub && this.infoMousemoveSub.unsubscribe()
  },
  methods: {
    // 通过mapLoadedPromiseResolve来确定entity是否加载完成，Todo: 此方法循环中调用，后续使用防抖优化
    async handleEntityLoad () {
      this.mapLoadedPromiseResolve()
    },
    async fetchData () {
      this.listSub && this.listSub.unsubscribe();
      this.listSub = lampMarkerDest.subscribe({ loopCoordinate: this.viewRectangle }, res => {
        const list = res.equipmentList || [];
        this.list = list;
        this.createWaveCircle()

        this.list.forEach(async (item) => {
          this.listLampSub && this.listLampSub.unsubscribe()
          this.listLampSub = signalLightInfo.subscribe({ equipmentId: item.id }, stock => {
            this.equipmentLocation = this.filterObject(stock).signalLightType1[0].equipmentLocation
            this.listPromiseResolve()
          })
          await this.listPromise
          const listLampObject = { ...item, equipmentLocation: this.equipmentLocation }
          this.listArr.push(listLampObject)
        })
      })
    },
    handleModelClick (entity, item) {
      this.visiblePopup = false;
      this.infoClickSub = signalLightInfo.subscribe({ equipmentId: item.id }, stock => {
        this.signalLightObject = this.filterObject(stock);
        this.visiblePopup = true;
      });
      this.activeItem = item;
    },
    closeLampPopup () {
      this.activeItem = {}
      this.visiblePopup = false;
      this.infoClickSub.unsubscribe();
    },
    handleMousemove (entity, item) {
      const { id } = item
      this.overlayEntity = this.listArr.filter(lamp => lamp.id === id)[0]
      this.lampBackgroundImage = this.lampStatusImage.filter(lamp => lamp.status === item.status)[0].backgroudImage
      this.lampBorderColor = this.lampStatusImage.filter(lamp => lamp.status === item.status)[0].color
      this.overlayVisible = true
      // if (Object.keys(this.signalLightMousemoveObject).length === 0) {
      //   this.infoMousemoveSub = signalLightInfo.subscribe({ equipmentId: item.id }, stock => {
      //     this.signalLightMousemoveObject = this.filterObject(stock)
      //   })
      //   return false
      // }
      // this.overlayEntity = item
      // this.lampBackgroundImage = this.lampStatusImage.filter(lamp => lamp.status === item.status)[0].backgroudImage
      // this.lampBorderColor = this.lampStatusImage.filter(lamp => lamp.status === item.status)[0].color
      // this.overlayVisible = true
    },
    handleMouseout () {
      this.overlayEntity = {}
      this.overlayVisible = false
      // TODO: 重复移入一个信号灯可能报错，后续优化
      // this.infoMousemoveSub.unsubscribe()
    },
    // 创建波浪圆实体，Todo：后续取消xt3d创建
    createWaveCircle () {
      this.removeAllWaveCircle()
      this.circleArr = this.list.map(lamp => {
        const position = Cesium.Cartesian3.fromDegrees(lamp.longitude, lamp.latitude, 0)
        const lampColor = this.lampStatusImage.filter(item => item.status === lamp.status)[0].color
        return new window.xt3d.CircleObject.WaveCircle(this.viewer, position, {
          height: 1,
          radius: 10,
          color: Cesium.Color.fromCssColorString(lampColor),
          duration: 4000,
          count: 2
        });
      })
    },
    removeAllWaveCircle () {
      if (this.circleArr?.length) {
        this.circleArr.forEach(circle => {
          const id = circle.circleEntity.id
          this.viewer.entities.removeById(id)
        })
      }
    },
    waveCircleVisible (visible) {
      this.circleArr.forEach(item => {
        item.circleEntity.show = visible
      })
    },
    entitiesIdVisible (id, visible) {
      this.viewer.entities._entities._array.forEach(item => {
        if (item.id.indexOf(id) >= 0) {
          item.show = visible
        }
      })
    },
    filterObject (stock) {
      const obj = {};
      stock.forEach((item, index) => {
        for (const key in obj) {
          if (obj[key][0].equipmentType === item.equipmentType) {
            obj[key].push(item);
            return;
          }
        }
        obj[`signalLightType${item.equipmentType}`] = [item];
      });
      return obj;
    }
  },
}
</script>
<style lang='scss' scoped>
  .detection-traffic-right {
    position: absolute;
    margin: 80px auto;
    width: 360px;
    right: 70px;
    border: 1px solid #1f9cb4;
    animation: fadeInRight 0.5s 0s both;
    z-index: 10000000;
  }
</style>
