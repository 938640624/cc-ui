
/**
 * dom中是否存在指定类名
 * @param: el 指定dom元素
 * @param: className class类名
 * @return 布尔值
 */
export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/**
 * dom中添加指定类名
 * @param: el指定dom元素
 * @param: className class类名
 */
export function addClass(el, className) {
  /* istanbul ignore if */
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  newClass = newClass.filter(item => (item))  // 数组去重
  el.className = newClass.join(' ')
}

/**
 * dom中移除指定类名
 * @param: el指定dom元素
 * @param: className class类名
 */
export function removeClass(el, className) {
  /* istanbul ignore if */
  if (!hasClass(el, className)) {
    return
  }

  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

/**
 * dom中获取style样式
 * @param: el指定dom元素
 * @param: styleName style名
 */
export const getStyle = (el, styleName) => {
  if (!el || !styleName) return null
  let newStyleName = styleName
  const stringArray = newStyleName.split('')
  stringArray.forEach(item => {
    if (/[A-Z]/g.test(item)) {
      newStyleName = styleName.replace(item, `-${item.toLowerCase()}`)
    }
  })
  const result = getComputedStyle(el, null).getPropertyValue(newStyleName)
  if (!result) {
    return false
  }
  return result
}

/**
 * dom中修改指定style样式属性
 * @param: el指定dom元素
 * @param: styleName style名
 * @param: value style属性值
 */
export function setStyle(el, styleName, value) {
  if (!el || !styleName) return null
  let newStyleName = styleName
  // const stringArray = newStyleName.split('')
  // stringArray.forEach((item, index) => {
  //   if (/\-/g.test(item)) {
  //     newStyleName = newStyleName.replace(item + stringArray[index + 1], stringArray[index + 1].toUpperCase())
  //   }
  //   // if (/\-[a-z]{1}$/g.test(item)) {
  //   //   console.log(item, "item")
  //   //   newStyleName = newStyleName.replace(item, item.toUpperCase())
  //   // }
  // })
  // console.log(newStyleName, "newStyleName")
  if (!newStyleName in el.style) {
    return false
  }
  // style自带转换功能
  el.style[styleName] = value
}
