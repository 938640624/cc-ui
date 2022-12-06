<template>
  <el-popover
    placement="bottom"
    width="720"
    trigger="manual"
    :value="show"
  >
    <div class="location-picker">
      <div class="location-picker_map">
        <cross-map
          ref="crossMap"
          @load="handleMapLoad"
        />
      </div>
      <el-form
        class="location-picker_form"
        :inline="true"
        :model="formData"
      >
        <el-form-item
          :label="isMapSystemMapbox ? '经度' : 'x'"
        >
          <el-input
            v-model="formData.lng"
            readonly
          />
        </el-form-item>
        <el-form-item
          :label="isMapSystemMapbox ? '纬度' : 'y'"
        >
          <el-input
            v-model="formData.lat"
            readonly
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            确定
          </el-button>
          <el-button
            @click="onCancel"
          >
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="reference">
      <slot />
    </div>
  </el-popover>
</template>
<script type = 'text/javascript'>
import CrossMap from "@/components/cross-map/index"
import config from "@/config"

const EVENT_LOAD = "load"
export default {
  name: "",
  components: {
    CrossMap
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: Array,
      default: () => {
        return [600, 220]
      }
    }
  },
  data () {
    return {
      marker: null,
      formData: this.value,
      show: this.visible,
      clickMap: false
    }
  },
  computed: {
    isMapSystemMapbox () {
      if (config.coordSystem !== "CARELAND") {
        return true
      }
      return false
    },
  },
  watch: {
    // value (val, oldVal) {
    //   if (val !== oldVal && this.visible) {
    //     console.log(val, "编辑")
    //     this.isMapSystemMapbox ? this.updateMapbox84Marker(val) : this.updateCarelandMarker(val)
    //   }
    // },
    async visible (val) {
      await this.mapLoadedPromise
      if (val) {
        this.resize()
        if (val && Object.keys(this.value).length > 0) {
          console.log("这是编辑页面")
          this.isMapSystemMapbox ? this.updateMapbox84Marker(this.value) : this.updateCarelandMarker(this.value)
        } else {
          console.log("这是新增页面")
          this.isMapSystemMapbox ? this.addMapbox84Marker(this.value) : this.addCarelandMarker(this.value)
        }
        // this.isMapSystemMapbox ? this.updateMapbox84Marker(this.value) : this.updateCarelandMarker(this.value)
      }
      this.show = val;
    },
  },
  beforeCreate () {
    // 地图图层加载完成标志
    this.mapLoadedPromise = new Promise((resolve) => {
      this.mapLoadedPromiseResolve = resolve
    })
  },
  methods: {
    onSubmit () {
      this.show = false;
      this.clearMarker()
      this.$emit("update:visible", false);
      this.$emit("input", this.formData);
    },
    onCancel () {
      this.show = false;
      this.clearMarker()
      this.$emit("update:visible", false);
    },
    handleMapLoad (map) {
      this.map = map
      this.$emit(EVENT_LOAD, this.map)
      this.mapLoadedPromiseResolve()
      this.center = this.map.getCenter()

      if (this.isMapSystemMapbox) {
        this.map.on("click", (event) => {
          const { lngLat } = event
          if (Object.keys(this.data).length > 0) {
            this.data.clickMap = true
          }
          this.clickMap = true
          this.updateMapbox84Marker(lngLat)
        })
      } else {
        this.initCarelandLayer()
        this.map.addEventListener("click", (event) => {
          if (Object.keys(this.data).length > 0) {
            this.data.clickMap = true
          }
          this.clickMap = true
          this.updateCarelandMarker(event)
        })
      }
    },

    // mapbox的新增部门
    addMapbox84Marker (coordinates) {
      coordinates = this.center
      this.createMapbox84Marker(coordinates)
    },
    // careland的新增部门
    addCarelandMarker (coordinates) {
      coordinates = this.center
      const { x, y } = coordinates
      this.formData = { lng: x, lat: y }
      this.createCarelandMarker(coordinates)
    },
    // mapbox的修改部门
    updateMapbox84Marker (coordinates) {
      const isInitFormData = this.initFormData()
      if (isInitFormData) return

      const { lng, lat } = coordinates
      if (!this.clickMap) {
        this.map.panTo([lng, lat])
      }
      this.createMapbox84Marker(coordinates)
    },
    // careland的修改部门
    updateCarelandMarker (coordinates) {
      const isInitFormData = this.initFormData()
      if (isInitFormData) return

      const isMapSystemLatLng = "lng" in coordinates && "lat" in coordinates
      if (isMapSystemLatLng) {
        const { lng, lat } = coordinates
        this.point = new Careland.Point(lng, lat)
        this.formData = { lng, lat }
      } else {
        const { x, y } = coordinates
        this.point = new Careland.Point(x, y)
        this.formData = { lng: x, lat: y }
      }
      if (!this.clickMap) {
        this.map.setCenter(this.point)
      }
      this.createCarelandMarker(this.point)
    },

    createMapbox84Marker (coordinates) {
      const { lng, lat } = coordinates
      const { mapbox } = this.map
      if (this.marker) {
        this.marker.remove()
        this.marker = null
      }
      this.marker = new mapbox.Marker()
      this.marker.setLngLat([lng, lat])
      this.marker.addTo(this.map)
    },

    createCarelandMarker (coordinates) {
      if (this.marker) {
        this.carelandLayer.clear()
        this.marker = null
      }
      const styleMarker = new Careland.PointStyle({
        src: "/static/images/map-icon/icon-map-choice.png",
        width: 20,
        height: 20,
        offsetX: -10,
        offsetY: -10
      })
      this.marker = new Careland.Marker("image")
      this.marker.setPoint(coordinates)
      this.marker.setStyle(styleMarker)
      this.carelandLayer.add(this.marker)
    },

    // 更新mapbox地图的marker
    // updateMapbox84Marker (coordinates) {
    //   if (Object.values(coordinates).length === 0) {
    //     coordinates = this.center
    //   }
    //   const isInitFormData = this.initFormData()
    //   if (isInitFormData) return

    //   const { lng, lat } = coordinates
    //   if (!this.clickMap) {
    //     this.map.panTo([lng, lat])
    //   }
    //   this.formData = { lng, lat }
    //   const { mapbox } = this.map

    //   if (this.marker) {
    //     this.marker.remove()
    //     this.marker = null
    //   }
    //   this.marker = new mapbox.Marker()
    //   this.marker.setLngLat([lng, lat])
    //   this.marker.addTo(this.map)
    // },

    // 更新careland地图的marker
    // updateCarelandMarker (coordinates) {
    //   if (Object.values(coordinates).length === 0 || coordinates.lat === 0) {
    //     this.point = this.center
    //     const { x, y } = this.point
    //     this.formData = { lng: x, lat: y }
    //   } else {
    //     const isInitFormData = this.initFormData()
    //     if (isInitFormData) return
    //     const isMapSystemLatLng = "lng" in coordinates && "lat" in coordinates
    //     if (isMapSystemLatLng) {
    //       const { lng, lat } = coordinates
    //       this.point = new Careland.Point(lng, lat)
    //       this.formData = { lng, lat }
    //     } else {
    //       const { x, y } = coordinates
    //       this.point = new Careland.Point(x, y)
    //       this.formData = { lng: x, lat: y }
    //     }
    //   }
    //   // 未点击地图时将marker居中
    //   if (!this.clickMap) {
    //     this.map.setCenter(this.point)
    //   }

    //   if (this.marker) {
    //     this.carelandLayer.clear()
    //     this.marker = null
    //   }
    //   const styleMarker = new Careland.PointStyle({
    //     src: "/static/images/map-icon/icon-map-choice.png",
    //     width: 20,
    //     height: 20,
    //     offsetX: -10,
    //     offsetY: -10
    //   })
    //   this.marker = new Careland.Marker("image")
    //   this.marker.setPoint(this.point)
    //   this.marker.setStyle(styleMarker)
    //   this.carelandLayer.add(this.marker)
    // },

    // 添加凯立德marker图层
    initCarelandLayer () {
      this.carelandLayerId = "careland-marker-layer"
      this.carelandLayer = new Careland.Layer("point", this.carelandLayerId)
      this.map.addLayer(this.carelandLayer)
    },

    // 根据coordSystem判断是否报错重置表单
    initFormData () {
      if (Object.keys(this.data).length === 0) return false
      if (this.data.coordSystem !== config.coordSystem && !this.data.clickMap) {
        this.$message({
          message: "坐标系不同，请重新选择机构坐标",
          type: "error",
          showClose: true
        })
        this.formData = {}
        return true
      }
      return false
    },

    clearMarker () {
      this.point = null
      this.clickMap = false
      if (this.marker) {
        this.isMapSystemMapbox ? this.marker.remove() : this.map.getLayerById(this.carelandLayerId).clear()
        this.marker = null
      }
    },

    // 跳转页面路由时需要清除凯立德监听事件与图层
    clearLayer () {
      this.clearMarker()
      // mapbox未创建图层，不需要做清除处理
      if (!this.isMapSystemMapbox) {
        this.map.removeEventListener("click")
      }
    },

    resize () {
      if (this.isMapSystemMapbox) {
        const canvas = this.map.getCanvas()
        canvas.style.width = `${this.size[0]}px`
        canvas.style.height = `${this.size[1]}px`
        window.setTimeout(() => {
          this.map.resize()
        }, 100)
      } else {
        this.map.setSize(...this.size)
      }
    }
  },
}
</script>
<style lang='scss' scoped>
.location-picker {
  width: 100%;
  .location-picker_map {
    width: 720px;
    height: 280px;
  }
  .location-picker_form {
    margin: 16px 0 -16px 0;
  }
}

</style>
