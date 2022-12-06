export function proxyEventListener(map) {
  const originEventMaps = Object.create(null)
  const originAddEventListener = map.addEventListener
  map.addEventListener = function () {
    const name = arguments[0]
    const callback = arguments[1]
    if (!originEventMaps[name]) {
      originEventMaps[name] = [callback]
    } else {
      originEventMaps[name].push(callback)
      arguments[1] = function () {
        originEventMaps[name].forEach((callback) => {
          callback.apply(map, arguments)
        })
      }
    }
    return originAddEventListener.apply(this, arguments)
  }

  const originRemoveEventListener = map.removeEventListener
  map.removeEventListener = function () {
    const name = arguments[0]
    const callback = arguments[1]
    if (!originEventMaps[name]) {
      return
    } else {
      const index = originEventMaps[name].find((item) => {
        return item === callback
      })
      originEventMaps[name].splice(index, 1)
    }

    if (!originEventMaps[name].length) {
      delete originEventMaps[name]
      originRemoveEventListener.apply(map, arguments)
    }
  }
}
