import hat from 'hat'
const _toString = Object.prototype.toString
// 判断数据类型
export function toRawType(value) {
  return _toString.call(value).slice(8, -1)
}

// 深拷贝
// WeakMap与Map区别是weakMap只接受对象作为key，是一组键值对的集合，键是弱引用(可能在任何时候被回收，弱引用对象，垃圾回收机制会自动帮我们回收)，避免内存泄漏，不能遍历，在拷贝内容非常庞大时可以使用WeakMap
export function deepClone(value) {
  const map = new WeakMap()

  function _deepClone(value) {
    let ret
    // 判断数据类型
    // slice(8, -1)是截取[object type]中的type
    const type = _toString.call(value).slice(8, -1)

    if (type === 'Object') {
      ret = {}
    } else if (type === 'Array') {
      ret = []
    } else {
      return value
    }

    const isExist = map.has(value)
    if (isExist) {
      return map.get(value)
    }
    map.set(value, ret)
    Object.keys(value).forEach((key) => {
      const copy = value[key]
      ret[key] = _deepClone(copy)
    })
    return ret
  }

  return _deepClone(value)
}

/**
  * @desc new关键字
  * @param context 对象值
*/
export function objNew(context) {
  const obj = new Object()
  obj.__proto__ = context.prototype
  const res = context.apply(obj, [...arguments].slice(1))
  return typeof res === "object" ? res : obj
}

// 实现原生的AJAX请求
export const ajax = {
  get(url, fn) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)  // 第三个参数决定异步与否
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        fn(xhr.responseText)
      }
    }
    xhr.send()
  },
  post(url, data, fn) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        fn(xhr.responseText)
      }
    }
    xhr.send(data)
  }
}

/**
 * 防抖与节流：都是为了防止scroll等操作处理函数频繁的渲染页面加重浏览器负担，影响用户体验，可以通过防抖节流减少触发的频率又不影响实际效果
 * 防抖：合并事件且不会去触发事件，当一定时间内没有触发这个事件后，才会真正去触发事件
 * 节流：当持续触发事件时，保证隔一定时间段触发一次事件
 */

/**
  * @desc 函数防抖
  * @param interval 延迟执行毫秒数
  * @param immediate true 立即执行，false 非立即执行
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
  * @desc 函数节流
  * @param interval 延迟执行毫秒数
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

/**
  * @desc instanceOf关键字，判断一个变量是否是某个对象实例
  * @param value 变量
  * @param obj 对象实例
*/
export function instanceOf(value, obj) {
  const objProto = obj.prototype
  let valueProto = value.__proto__
  if (obj === String) return false  // String原型链为undefined
  while (valueProto) {
    if (valueProto === objProto) {
      return true
    }
    // 深遍历
    valueProto = valueProto.__proto__
  }
  return false
}

/**
  * @desc 扁平化对象
  * @param obj 对象实例
*/
// 判断是否为有值对象
// const isObject = (val) => typeof val === 'object' && val !== null
const isObject = (val) => Object.keys(value).length === 0
export function flatten(obj) {
  if (!isObject(obj)) return
  const res = {}
  const _flatten = (flaValue, pre) => {
    if (isObject(flaValue)) {
      if (Array.isArray(flaValue)) {
        flaValue.forEach((item, index) => {
          _flatten(item, `${pre}[${index}]`)
        })
      } else {
        for (let key in flaValue) {
          _flatten(flaValue[key], `${pre}${pre ? '.' : ''}${key}`)
        }
      }
    } else {
      res[pre] = flaValue
    }
  }
  _flatten(obj, '')
  return res
}

/**
 * 原生removeEventListener要找到addEventListener的listener才能解绑
 * 使用addEvent添加的listener可以通过removeEvent(el), removeAllEvent(el)方便解绑
 * el: dom元素
 * type: 事件类型
 * listener: 事件回调函数
 * useCapture: true 捕获阶段执行 false 冒泡阶段执行
 */
const eventListenerMap = new WeakMap()
export function addEvent(el, type, listener, useCapture = false) {
  const id = hat()
  el.addEventListener(type, listener, useCapture)
  if (!eventListenerMap.has(el)) {
    eventListenerMap.set(el, [])
  }
  const eventList = eventListenerMap.get(el)
  eventList.push({
    id,
    type,
    listener,
    useCapture
  })
  return id
}

/**
 * 移除dom上的事件,可以指定事件id
 * el: dom元素
 * type: 事件类型
 * id: 事件的id
 */
export function removeEvent(el, type, id) {
  if (eventListenerMap.has(el)) {
    const eventList = eventListenerMap.get(el)
    eventList.forEach((item, index) => {
      // 如果有id参数
      if (arguments.length === 3) {
        if (item.id === id) {
          const { listener, useCapture } = item
          eventList.splice(index, 1)
          el.removeEventListener(type, listener, useCapture)
          return
        }
      } else {
        if (item.type === type) {
          const { listener, useCapture } = item
          eventList.splice(index, 1)
          el.removeEventListener(type, listener, useCapture)
        }
      }
    })
  }
}

/**
 * 移除dom上的所有事件
 * el: dom元素
 */
export function removeAllEvent(el) {
  if (eventListenerMap.has(el)) {
    const eventList = eventListenerMap.get(el)
    eventList.forEach(item => {
      const { type, listener, useCapture } = item
      el.removeEventListener(type, listener, useCapture)
    })
    eventList.splice(0, eventList.length)
  }
}

/**
 * 获取url参数
 */
export function getUrlParams(url = window.location.href) {
  const result = {}
  if (url.indexOf('?') === -1) {
    return result
  }
  const paramsUrl = url.replace(/.*\?/g, '')
  const arr = paramsUrl.match(/[^&]+?=[^&]*/g)
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const reg = new RegExp('(.+?)=(.*)')
      reg.exec(arr[i])
      const key = decodeURIComponent(RegExp.$1)
      const value = decodeURIComponent(RegExp.$2)
      result[key] = value
    }
  }
  return result
}

// 拼接参数到url
export function parseParamsUrl(originUrl, params) {
  let url = ''
  for (const k in params) {
    const value = params[k] !== undefined ? params[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  url = url ? url.substring(1) : ''

  originUrl += (originUrl.indexOf('?') === -1 ? '?' : '&') + url

  return originUrl
}

// 数组去重
export function unionArray() {
  const args = arguments
  return Array.prototype.reduce.call(args, function (prev, next) {
    next.forEach(function (item) {
      if (prev.indexOf(item) === -1) {
        prev.push(item)
      }
    })
    return prev
  }, [])
}

/**
 * 解析一个对象多层的键值
 * @param obj: 解析的对象[Object]
 * @param accordingExp: 表达式[String]
 */
export function parsePath(obj, accordingExp) {
  if(/[^\w.$]/.test(accordingExp)) return
  const exps = accordingExp.split('.')
  for (let i = 0, len = exps.length; i < len; i++) {
    if (!obj) return
    obj = obj[exps[i]]
  }
  return obj
}

// TODO: 增加循环引用的跳出
export function deepCompare(left, right) {
  function _deepCompare(left, right) {
    if (left === right) {
      return true
    }

    const leftType = toRawType(left)
    const rightType = toRawType(right)

    if (leftType !== rightType) {
      return false
    }

    if (leftType !== 'Object' && leftType !== 'Array') {
      return left === right
    }

    if (Object.keys(left).length !== Object.keys(right).length) {
      return false
    }

    const caches = {}

    for (const key in left) {
      const leftItem = left[key]
      const rightItem = right[key]

      if (!deepCompare(leftItem, rightItem)) {
        return false
      }
      else {
        caches[key] = true
      }
    }

    for (const key in right) {
      if (caches[key]) {
        continue
      }

      const leftItem = left[key]
      const rightItem = right[key]

      if (!deepCompare(leftItem, rightItem)) {
        return false
      }
    }

    return true
  }

  return _deepCompare(left, right)
}

/**
 * 根据一个字段作为两个数组的的元素的标识,得出第一个数组相对第二个数组的增加和减少项的集合
 * @param target: 参照项
 * @param mixin: 对比项
 * @param? accordingExp: 字段表达式,判断依据
 * @return { decrease: 减少的项的集合, increase: 增加的项的集合 }
 */
export function calculateCreaseArray(target, mixin, accordingExp) {
  const decrease = calculateDecreaseArray(target, mixin, accordingExp)
  const increase = calculateDecreaseArray(mixin, target, accordingExp)

  return {
    decrease,
    increase,
  }
}

/**
 * 根据一个字段作为两个数组的的元素的标识,得出第一个数组相对第二个数组的减少项的集合
 * @param target: 参照项
 * @param mixin: 对比项
 * @param? accordingExp: 字段表达式,判断依据
 * @return 减少的项的集合
 */
export function calculateDecreaseArray(target, mixin, accordingExp) {
  const result = []
  for (const targetItem of target) {
    let isMixinHad = false

    for (const mixinItem of mixin) {
      if (accordingExp) {
        const mixinValue = parsePath(mixinItem, accordingExp)
        const targetValue = parsePath(targetItem, accordingExp)
        isMixinHad = mixinValue === targetValue
      }
      else {
        isMixinHad = mixinItem === targetItem
      }

      if (isMixinHad) {
        break
      }
    }
    if (!isMixinHad) {
      result.push(targetItem)
    }
  }
  return result
}

/**
 * 根据一个字段作为两个数组的的元素的标识和对比字段,深度对比两个数组,得出第一个数组相对于第二个数组差异项的集合
 * @param target: 参照项
 * @param mixin: 对比项
 * @param accordingExp: 字段表达式,作为判断依据
 * @param includes: 包含的字段
 */
export function calculateDifferentArray(target, mixin, accordingExp, includes) {
  const result = []
  for (const mixinItem of mixin) {
    for (const targetItem of target) {
      const mixinValue = parsePath(mixinItem, accordingExp)
      const targetValue = parsePath(targetItem, accordingExp)
      const isTargetHad = mixinValue === targetValue
      if (!isTargetHad) {
        continue
      }
      let isDeepEqual
      if (!includes) {
        isDeepEqual = deepCompare(mixinItem, targetItem)
      }
      else {
        isDeepEqual = includes.every((key) => {
          const mixinValue = parsePath(mixinItem, key)
          const targetValue = parsePath(targetItem, key)
          return deepCompare(mixinValue, targetValue)
        })
      }
      if (!isDeepEqual) {
        result.push(mixinItem)
      }
    }
  }
  return result
}

/**
 * 把对象数组根据要求转换为对象
 *
 * @param {Object[]} objArr 对象数组
 * @param {String} [keyKey="key"] 作为key的key
 * @param {String} [valueKey="value"] 作为value的key
 * @returns {Object} { [keyKey]: [valueKey] }
 */
export const objArrToObj = (objArr, keyKey = "key", valueKey = "value") => {
  const map = {}
  for (const item of objArr) {
    map[item[keyKey]] = item[valueKey]
  }
}

/**
 * 把对象数组根据要求转换为过滤器函数
 *
 * @param {Object[]} objArr 对象数组
 * @param {String} [matchKey="value"] 作为匹配项的key
 * @param {String} [labelKey="label"] 作为最终匹配项返回值的key
 * @returns {Function} 过滤器函数
 */
export const objArrFilter = (objArr, matchKey = "value", labelKey = "label") => {
  return function (val) {
    if (val === "" || val === "undefined") {
      return "-"
    }
    const matchItem = objArr.find(item => item[matchKey] === val)
    if (!matchItem) {
      return "-"
    }
    return matchItem
  }
}

// 前端模糊查询
export function fuzzySearch(list, queryParams) {
  return list.filter((item) => {
    for (const key in queryParams) {
      const query = queryParams[key]
      if (query) {
        if (!hasOwn(item, key)) {
          throw new Error(`不存在搜索字段${key}`)
        }
        if (item[key].indexOf(query) > -1) {
          return true
        } else {
          return false
        }
      }
      return true
    }
    return true
  })
}

/**
 * render字符串转字符串
 *
 * @param template render字符串
 * @param {object} data 模板字符串中的值
 */
export function renderTemplate(template, data) {
  const reg = /\{\{(\w+)\}\}/ // 模板字符串正则
  if(reg.test(template)) {  // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]
    template = template.replace(reg, data[name])
    return renderTemplate(template, data)
  }
  return template
}

// 函数柯里化,使用多个参数的函数转换成使用一个参数
function curry(fn) {
  let judge = (...args) => {
    if (args.length === fn.length) return fn(...args)
    return (...arg) => judge(...args, ...ars)
  }
  return judge
}



