const DEFAULT_INTERVAL = 100 / 6
let timeStart
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (cb) {
    return window.setTimeout(() => {
      const timestamp = new Date().getTime()
      if (!timeStart) {
        timeStart = timestamp
      }
      const timePast = timestamp - timeStart
      cb(timePast)
    }, DEFAULT_INTERVAL)
  }

export const cancelAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (id) {
    return window.clearTimeout(id)
  }

const intervals = new Map()

export const setIntervals = function (callback, interval) {
  let i = 1
  const id = intervals.size
  intervals.set(id, false)
  const timeStart = new Date().getTime()

  function loop () {
    if (intervals.get(id)) {
      intervals.delete(id)
      return
    }

    requestAnimationFrame (() => {
      const timestamp = new Date().getTime()
      if ((timestamp - timeStart) / i > interval) {
        callback()
        i++
      }
      loop()
    })
  }
  loop()
  return id
}

export const clearInterval = function (id) {
  if (intervals.has(id)) {
    intervals.set(id, true)
  }
}
