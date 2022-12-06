/**
 * 创建缩放补丁
 * 解决父元素有transform:scale(n) 且 n !== 1 的时候，地图缩放与点击都会偏移
 *
 * @param {Object} viewer Cesium.Viewer 对象
 * @param {Function} getScale 获取缩放比例的函数
 * @returns {Object} api
 * api.install():uninstall
 * api.wrapMovementPositionListener(function):function
 */
export default function createScalePatch (viewer, getScale) {
  const { scene, screenSpaceEventHandler } = viewer;
  let localScale = getScale();
  function wheelHandler (event) {
    if (localScale !== 1) {
      const position = getPosition(screenSpaceEventHandler, event, new Cesium.Cartesian2());
      position.x = position.x / localScale
      position.y = position.y / localScale
      scene.screenSpaceCameraController._aggregator._currentMousePosition = position;
    }
  }

  const originCb = window.onresize;
  window.onresize = function () {
    originCb();
    localScale = getScale()
  }

  // detect available wheel event
  let wheelEvent;
  if ("onwheel" in screenSpaceEventHandler._element) {
  // spec event type
    wheelEvent = "wheel";
  } else if (document.onmousewheel !== undefined) {
  // legacy event type
    wheelEvent = "mousewheel";
  } else {
  // older Firefox
    wheelEvent = "DOMMouseScroll";
  }

  function registerWheelListener () {
    document.addEventListener(wheelEvent, wheelHandler)
    return _ => {
      window.onresize = originCb;
      document.removeEventListener(wheelEvent, wheelHandler)
    }
  }

  function wrapMovementPositionListener (listener) {
    return function (movement) {
      if (localScale !== 1) {
        const { x, y } = movement.position || movement.endPosition;
        const newPosition = new Cesium.Cartesian2(x / localScale, y / localScale);
        if (movement.position) {
          movement.position = newPosition;
        } else if (movement.endPosition) {
          movement.endPosition = newPosition;
        }
        scene.screenSpaceCameraController._aggregator._currentMousePosition = newPosition;
      }
      listener.call(this, movement)
    }
  }

  return {
    install: registerWheelListener,
    wrapMovementPositionListener
  }
}

function getPosition (screenSpaceEventHandler, event, result) {
  var element = screenSpaceEventHandler._element;
  if (element === document) {
    result.x = event.clientX;
    result.y = event.clientY;
    return result;
  }

  var rect = element.getBoundingClientRect();
  result.x = event.clientX - rect.left;
  result.y = event.clientY - rect.top;
  return result;
}
