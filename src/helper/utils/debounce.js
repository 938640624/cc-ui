/**
 * 防抖函数
 * interval: 延迟时间
 * immediate: 第一次是否立即执行
 */
export function debounce(interval = 400, immediate = false) {
    let timer
    return function (fn) {
        if (immediate) {
            immediate = false
            fn && fn()
            return
        }
        window.clearTimeout(timer)
        timer = window.setTimeout(() => {
            window.clearTimeout(timer)
            fn && fn()
        }, interval)
    }
}

/**
 * 节流函数
 * interval: 延迟时间
 */
export function throttle(interval = 400) {
    let lastTime = 0
    return function (fn) {
        const currentTime = new Date().getTime()
        if (currentTime - lastTime >= interval) {
            lastTime = currentTime
            fn && fn()
        }
    }
}
