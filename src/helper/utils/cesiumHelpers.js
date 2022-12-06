
// import { calcScale } from "@/directives/scale"
// import createScalePatch from "@/kczx-cesium-vue/src/utils/scalePatch"
import { isArray, isObject } from "./is"

/**
 * 获取 Cartesian2 坐标
 * @param {Object|Array} val 要转换的值，支持的格式：
 * { x: 0, y: 0}
 * [0, 0]
 * @returns {Cartesian2}
 */
export function makeCartesian2 (val) {
  const { Cartesian2 } = Cesium
  if (val instanceof Cartesian2) {
    return val
  }

  if (isObject(val) && Object.prototype.hasOwnProperty.call(val, "x")) {
    return new Cartesian2(val.x || 0, val.y || 0)
  }

  if (isArray(val)) {
    return new Cartesian2(val[0] || 0, val[1] || 0)
  }
}

/**
 * 获取 Cartesian3 坐标
 * @param {Object|Array} val 要转换的值，支持的格式：
 * { longitude: 0, latitude: 0, altitude: 0}
 * { lng: 0, lat: 0, height: 0}
 * [0, 0, 1]
 * @param {Object} ellipsoid 坐标
 * @returns {Cartesian3}
 */
export function makeCartesian3FromDegrees (val, ellipsoid) {
  const { Cartesian3 } = Cesium
  if (val instanceof Cartesian3) {
    return val
  }
  let lng = 0; let lat = 0; let height = 0;
  if (isArray(val)) {
    lng = val[0];
    lat = val[1];
    height = val[2];
  } else if (isObject(val)) {
    if ("lng" in val) {
      lng = val.lng;
      lat = val.lat;
      height = val.height;
    } else if ("longitude" in val) {
      lng = val.longitude;
      lat = val.latitude;
      height = val.height;
    }
  }
  return Cartesian3.fromDegrees(lng || 0, lat || 0, height || 0, ellipsoid || Cesium.Ellipsoid.WGS84)
}

export function wgs84ToWindowCoordinates (scene, LngLat) {
  const c3 = Cesium.Cartesian3.fromDegrees(...LngLat)
  const c2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, c3);
  return c2;
}
/**
 * 获取视口区域经纬度
 *
 * @param {Viewer} viewer
 * @returns {Object}
 */
export function getViewerRectangle (viewer) {
  const rectangle = viewer.camera.computeViewRectangle();
  if (!rectangle) {
    return undefined
  }
  const westLon = rectangle.west / Math.PI * 180;
  const eastLon = rectangle.east / Math.PI * 180;
  const northLat = rectangle.north / Math.PI * 180;
  const southLat = rectangle.south / Math.PI * 180;
  return { westLon, eastLon, northLat, southLat }
}

export function getOrientation ({ longitude, latitude, altitude }, { heading, pitch, roll } = {}) {
  var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude || 0);
  var h = Cesium.Math.toRadians(heading || 0);
  var p = Cesium.Math.toRadians(pitch || 0);
  var r = Cesium.Math.toRadians(roll || 0);
  var hpr = new Cesium.HeadingPitchRoll(h, p, r);
  var orientation = new Cesium.ConstantProperty(Cesium.Transforms.headingPitchRollQuaternion(position, hpr));
  return orientation;
}

/**
 * 拾取地理位置
 * @param {Viewer} viewer
 */
export function pickPosition (viewer) {
  const pickBox = document.getElementById("pickPosition");
  if (pickBox) {
    console.log(pickBox);
    pickBox.parentElement.removeChild(pickBox);
  }
  const cache = []
  const { input, msg } = addInputDom("pickPositionInput");
  function addInputDom (id) {
    const box = document.createElement("div")
    const input = document.createElement("textarea")
    const btnCopy = document.createElement("button");
    const btnClear = document.createElement("button");
    const msg = document.createElement("span");
    box.id = "pickPosition"
    box.style = "position: fixed; left: 0; top: 35vh; padding: 10px; background: #ccc;"
    msg.style = "font-size: 14px; color: #3cc73c;"
    input.style = "display: block;width: 18vw; height: 30vh;"
    input.id = id
    btnCopy.innerText = "复制"
    btnClear.innerText = "清除"
    btnCopy.style = "cursor: pointer;"
    btnClear.style = "cursor: pointer;"
    box.appendChild(btnCopy);
    box.appendChild(btnClear);
    box.appendChild(msg);
    box.appendChild(input);
    document.body.appendChild(box);
    btnCopy.addEventListener("click", () => {
      input.select();
      if (document.execCommand("copy")) {
        msg.innerText = "复制成功!"
      }
    })
    btnClear.addEventListener("click", () => {
      removeAllPoints();
    })
    return { input, msg };
  }
  function addPoint (position) {
    const posRadians = Cesium.Cartographic.fromCartesian(position);
    cache.push({
      longitude: Cesium.Math.toDegrees(posRadians.longitude),
      latitude: Cesium.Math.toDegrees(posRadians.latitude),
      altitude: posRadians.height,
    })
    input.textContent = JSON.stringify(cache);
    msg.innerText = ""
    viewer.entities.add({
      id: cache.length,
      position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        outlineWidth: 2, // default: 0
      },
    });
  }
  function removeAllPoints () {
    input.textContent = ""
    msg.innerText = ""
    for (let i = 1; i <= cache.length; i++) {
      viewer.entities.removeById(i)
    }
    cache.length = 0;
  }

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  const { wrapMovementPositionListener } = createScalePatch(viewer, function () {
    const { scale } = calcScale();
    return scale.rate;
  })
  handler.setInputAction(wrapMovementPositionListener((movement) => {
    addPoint(viewer.scene.pickPosition(movement.position))
  }), Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(_ => {
    removeAllPoints();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
