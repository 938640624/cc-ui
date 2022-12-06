export function isUndefined(value) {
  return value === undefined
}

const _toString = Object.prototype.toString

export function toRawType(value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * 深拷贝
 */
export function deepClone(value) {
  const map = new WeakMap()

  function _deepClone(value) {
    let ret
    const type = toRawType(value)

    if (type === 'Object') {
      ret = {}
    }
    else if (type === 'Array') {
      ret = []
    }
    else {
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
 * 深合并,是并集合并,对于数组来说,如果合并项的长度是减少的,目标有的下标会被保留
 * @param: target 目标项
 * @param: mixin 合并项
 */
function assign(target, mixin) {
  for (const key in mixin) {
    if (!target[key] || typeof target[key] !== 'object') {
      target[key] = mixin[key]
    }
    else {
      assign(target[key], mixin[key])
    }
  }
}

/**
 * 支持多参数的深度合并
 * 越后面的参数优先级越大
 * 是并集合并
 * @param: target 目标项
 * @param: rest 合并项
 * @return: target
 */
export function deepAssign(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    // const mixin = deepClone(rest[i])
    const mixin = rest[i]
    assign(target, mixin)
  }
  return target
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

const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * 防抖函数
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

export function isEmptyObject(value) {
  return Object.keys(value).length === 0
}

export function camelCase(str) {
  return str.replace(/-(\w)/g, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

export function kebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 监听一个纯对象
export function defineReactive(object, key, fn) {
  let val = object[key]
  Object.defineProperty(object, key, {
    enumerable: true,
    configurable: true,
    get() {
      return val
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      const oldVal = val
      val = newVal
      typeof fn === 'function' && fn(newVal, oldVal)
    }
  })
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

// 递归平级化指定的对象field字段
export function dispelField(object, field) {
  const value = deepClone(object)

  const type = toRawType(value)
  if (type === 'Object') {
    let fieldObject = {}
    for (const key in value) {
      const item = value[key]
      if (key === field && toRawType(item) === 'Object') {
        fieldObject = item
        delete value[field]
      }
      else {
        value[key] = dispelField(item, field)
      }
    }
    for (const key in fieldObject) {
      if (!hasOwn(value, key)) {
        value[key] = fieldObject[key]
      }
    }
    return value
  }
  else if (type === 'Array') {
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      value[i] = dispelField(item, field)
    }
    return value
  }
  else {
    return value
  }
}

// 平级化一个分类过的数组
export function dispelCategoryList(categoryList, field, handler) {
  if (categoryList instanceof Array) {
    const result = []
    for (const category of categoryList) {
      const list = category[field]
      if (list instanceof Array) {
        for (const item of list) {
          // 外部需要添加自定义属性时,使用自定义handler处理
          const element = handler && handler(item, list, category)
          if (element) {
            result.push(element)
          }
          else {
            result.push(item)
          }
        }
      }
    }
    return result
  }
  else {
    return []
  }
}

// 数组去重,支持多个数组
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
 * 解析一个对象多层的键值
 * @param obj: 解析的对象[Object]
 * @param accordingExp: 表达式[String]
 */
export function parsePath(obj, accordingExp) {
  if (/[^\w.$]/.test(accordingExp)) {
    return
  }
  const exps = accordingExp.split('.')
  for (let i = 0, len = exps.length; i < len; i++) {
    if (!obj) {
      return
    }
    obj = obj[exps[i]]
  }
  return obj
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
        }
        else {
          return false
        }
      }
      return true
    }
    return true
  })
}
