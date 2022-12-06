export default {
  name: "MarsEntity",
  inject: ['mapPromise', 'graphicLayer'],
  props: {
    id: String,
    position: [Array, Object],
    url: String,
    scale: Number,
    oprientation: Object,
    clickToFly: {
      type: Boolean,
      default: true
    },
    name: String,
    radius: {
      type: Number,
      default: 2000
    },
    speed: {
      type: Number,
      default: 20
    }
  },
  created() {
    this.mapPromise.then((map) => {
      this.map = map
      this.init()
    })
  },
  beforeDestory() {

  },
  methods: {
    init() {
      this.addCircleWave()
      this.addCircleLine()
      // console.log(this.graphicLayer, "graphicLayer")
    },
    // 添加原型波浪
    addCircleWave() {
      const graphic = new mars3d.graphic.CircleEntity({
        name: `波浪${this.name}`,
        // name: this.name,
        position: this.position,
        style: {
          radius: this.radius,
          height: 200,
          material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.CircleWave, {
            color: "#56E6B9",
            count: 2,
            speed: this.speed
          }),
          label: {
            text: "我是原始行\n换行",
            font_size: 18,
            color: "ffffff",
            pixelOffsetY: -10,
            distanceDisplayCondition: true,
            distanceDisplayCondition_far: 500000,
            distanceDisplayCondition_near: 0
          }
        },
        attr: { remark: "实例1" }
      })
      this.graphicLayer.addGraphic(graphic)
    },
    // 添加原型上直线
    addCircleLine() {
      const graphic = new mars3d.graphic.PolylineEntity({
        name: `直线${this.name}`,
        // name: this.name,
        positions: [
          this.position,
          this.getPositionLine(this.position)
        ],
        style: {
          width: 4,
          material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
            color: "#56E6B9",
            opacity: 0.4,
            speed: this.speed,
          }),
        },
        minPointNum: 2,
        attr: "实例2"
      })
      this.graphicLayer.addGraphic(graphic)
    },
    // 增加直线坐标另一头
    getPositionLine(position) {
      const lineX = 0.02
      const lineY = 0.05
      const x = position[0] - lineX
      const y = position[1] + lineY
      return [x, y]
    }
  },
  render() {

  }
}
