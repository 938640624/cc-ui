// 根据权限数组判断Dom进行显示隐藏
const permission = {
  inserted(el, binding) {
    let permission = binding.value  // 获取到v-permission的值
    if (permission) {
      let hasPermission = checkArray(permission)
      if (!hasPermission) {
        // 没有权限，移除Dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}

function checkArray (key) {
  const arr = ['1', '2', '3', '4']
  if (arr.indexOf(key) > -1) {
    return true
  } else {
    return false
  }
}

export default permission


