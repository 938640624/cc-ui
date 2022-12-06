import { positionMixin } from "@/kczx-cesium-vue/src/mixins/position";
// import * as turf from "@turf/turf";

export default {
  name: "K3ModelEntity",
  inject: ["viewerPromise", "viewerClickEvent", "viewerMousemoveEvent"],
  mixins: [positionMixin],
  props: {
    id: String,
    uri: String,
    icon: String,
    width: {
      type: Number,
      default: 32
    },
    height: {
      type: Number,
      default: 32
    },
    scale: Number,
    orientation: Object,
    position: {
      type: [Array, Object],
      default () {
        return []
      }
    },
    clickToFly: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.viewerPromise.then(viewer => {
      this.viewer = viewer;
      this.init(viewer)
      this.bindEvents();
    })
  },
  beforeDestroy () {
    if (!this.viewer.isDestroyed()) {
      this.viewer.entities.remove(this.graphic)
    }
  },
  methods: {
    init (viewer) {
      const { cartesian3, uri, scale, orientation } = this;
      // const { scene } = viewer
      // const { cartesian3, position, uri, scale, orientation } = this;
      // const { longitude, latitude } = position
      // let alp = 1; let num = 0;
      // let newRotation = 0;
      // const surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0)
      // const heightPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 32)
      // const circleCenter = [longitude, latitude]
      // const circle = turf.circle(circleCenter, 5, { step: 128, units: "meters", properties: { foo: "bar" } })
      // // const coordinates = circle.geometry.coordinates[0]
      // const poly = turf.polygon([circle.geometry.coordinates[0]])
      // const rotatePoly = turf.transformRotate(poly, 90, { pivot: circleCenter })
      // const coordinates = rotatePoly.geometry.coordinates[0]
      // const coordinatesData = []
      // coordinates.forEach(item => {
      //   coordinatesData.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], 0))
      // })
      const graphic = new Cesium.Entity({
        id: this.id || this._uid,
        position: cartesian3,
        orientation,
        model: {
          uri,
          scale,
          show: false
        },
        billboard: {
          image: require(`@/assets/images/priority/${this.icon}.svg`),
          width: 54,
          height: 103,
          scaleByDistance: new Cesium.NearFarScalar(2000, 1, 8000, 0),
          horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        // polyline: {
        //   positions: new Cesium.ConstantProperty([surfacePosition, heightPosition]),
        //   width: 5,
        //   cornerType: Cesium.CornerType.MITERED,
        //   // material: Cesium.Color.GREEN,
        //   material: new Cesium.ImageMaterialProperty({
        //     transparent: true,
        //     color: new Cesium.CallbackProperty(() => {
        //       alp = num % 2 === 0 ? alp - 0.05 : alp + 0.05
        //       if (alp <= 0.3 || alp >= 1) {
        //         num++
        //       }
        //       return new Cesium.Color(1.0, 128.0, 0.0, alp)
        //     }, false),
        //   })
        // },
        // turf通过多边形画法
        // polygon: {
        //   hierarchy: new Cesium.PolygonHierarchy(coordinatesData),
        //   material: Cesium.Color.YELLOW,
        //   fill: false,
        //   outline: true,
        //   outlineColor: Cesium.Color.YELLOW,
        //   height: 32,
        // },
        // 圆圈画法
        // ellipse: {
        //   semiMinorAxis: 5,
        //   semiMajorAxis: 5,
        //   material: Cesium.Color.YELLOW,
        //   fill: false,
        //   outline: true,
        //   outlineColor: Cesium.Color.YELLOW,
        //   height: 32,
        //   numberOfVerticalLines: 128,
        //   granularity: Cesium.Math.toRadians(90.0),
        //   rotation: new Cesium.CallbackProperty(() => {
        //     newRotation += 1
        //     if (newRotation >= 360 && newRotation <= -360) newRotation = 0
        //     return Cesium.Math.toRadians(newRotation)
        //   }, false),
        //   // rotation: Cesium.Math.toRadians(60.0),
        //   stRotation: Cesium.Math.toRadians(60.0),
        //   zIndex: 10
        // }
      });
      // const circleOutlineInstance = new Cesium.GeometryInstance({
      //   geometry: new Cesium.CircleOutlineGeometry({
      //     center: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      //     radius: 5,
      //     height: 32,
      //     numberOfVerticalLines: 128
      //   }),
      //   // modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
      //   //   Cesium.Cartesian3.fromDegrees(longitude, latitude),
      //   //   new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0)),
      //   //   Cesium.Ellipsoid.WGS84,
      //   //   Cesium.Transforms.eastNorthUpToFixedFrame,
      //   //   new Cesium.Matrix4()
      //   // ),
      //   // modelMatrix: Cesium.Matrix4.multiplyByMatrix3(
      //   //   Cesium.Cartesian3.fromDegrees(longitude, latitude),
      //   //   Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(90)),
      //   //   new Cesium.Matrix4()
      //   // ),
      //   attributes: {
      //     color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOW)
      //   }
      // })
      // 通过primitive圆圈边框画法
      // const primitive = new Cesium.Primitive({
      //   geometryInstances: [circleOutlineInstance],
      //   appearance: new Cesium.PerInstanceColorAppearance({
      //     flat: true,
      //     translucent: false,
      //     renderState: {
      //       lineWidth: Math.min(6.0, scene.maximumAliasedLineWidth)
      //     }
      //   }),
      // })

      // const newModelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      //   Cesium.Cartesian3.fromDegrees(longitude, latitude),
      //   new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0)),
      //   Cesium.Ellipsoid.WGS84,
      //   Cesium.Transforms.eastNorthUpToFixedFrame,
      //   new Cesium.Matrix4()
      // )

      // const rotation = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90))
      // const ratationMatrix = Cesium.Matrix4.multiplyByMatrix3(primitive.modelMatrix, rotation, primitive.modelMatrix)
      // primitive.modelMatrix = newModelMatrix
      // primitive.appearance.material.uniforms.radians = 90;
      // console.log(ratationMatrix)
      // const rotationZ = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45))
      // const ratationMatrix = Cesium.Matrix4.fromRotationTranslation(rotationZ)
      // console.log(ratationMatrix, "ratationMatrix")
      // primitive.modelMatrix = ratationMatrix
      // primitive.modelMatrix[14] = 1.6

      // const tilesetCenter = Cesium.Cartesian3.fromDegrees(longitude, latitude)
      // const backtoMatrix = Cesium.Matrix4.fromTranslation(tilesetCenter);
      // const movetoVec = Cesium.Cartesian3.multiplyByScalar(tilesetCenter, -1, new Cesium.Cartesian3());
      // const movetoMatrix = Cesium.Matrix4.fromTranslation(movetoVec);
      // const cosRotateX = Math.cos(Math.PI / 2);
      // const sinRotateX = Math.sin(Math.PI / 2);
      // const arr = [1, 0, 0, 0, 0, cosRotateX, sinRotateX, 0, 0, -sinRotateX, cosRotateX, 0, 0, 0, 0, 1];
      // const rotateXMatrix = Cesium.Matrix4.fromArray(arr)
      // const temp = Cesium.Matrix4.multiply(rotateXMatrix, movetoMatrix, new Cesium.Matrix4())
      // const r = Cesium.Matrix4.multiply(backtoMatrix, temp, new Cesium.Matrix4())
      // console.log(r, "r")
      // primitive.modelMatrix = r
      // scene.primitives.add(primitive, "modelMatrix")

      this.graphic = graphic;
      viewer.entities.add(graphic);
    },
    // TODO: 待优化
    bindEvents () {
      const { click, mousemove } = this.$listeners;
      const curId = this.graphic.id;
      if (click) {
        this.viewerClickEvent.addEventListener(d => {
          const { pickedFeature } = d;
          if (!Cesium.defined(pickedFeature) || !(pickedFeature.id instanceof Cesium.Entity) || pickedFeature.id.id !== curId) {
            return false
          }
          if (this.clickToFly) {
            this.viewer.flyTo(this.graphic, { duration: 2 }).then(_ => this.$emit("fly-complete"))
          }
          this.$emit("click", d)
        })
      }

      if (mousemove) {
        this.viewerMousemoveEvent.addEventListener(d => {
          const { pickedFeature } = d;
          if (!Cesium.defined(pickedFeature) || !(pickedFeature.id instanceof Cesium.Entity) || pickedFeature.id.id !== curId) {
            return false
          }
          this.$emit("mousemove", d)
        })
      }
    },
  },
  render () { }
}
