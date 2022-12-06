/**
 * 从树状数组中找出匹配项的层级index的路径
 *
 * @param {Object[]} list 树状结构数组
 * @param {Function} compareFunc 比较函数
 * @return {Array} 匹配项的层级index路径
 */
export const getTreeIndexPath = (list, compareFunc) => {
  const temp = [];
  let find = false;
  const matchItem = (arr, level) => {
    for (let i = 0; i < arr.length; i++) {
      if (find) {
        return;
      }
      temp.splice(level, temp.length - 1, i);
      if (compareFunc.call(list, arr[i], i, arr)) {
        find = true
        return
      }
      if (arr[i].children && arr[i].children.length) {
        matchItem(arr[i].children, level + 1);
      }
    }
  }

  matchItem(list, 0);
  return find ? temp : [];
}

/**
 * 根据 index 路径获取匹配的那一项
 *
 * @param {Object[]} list 树状结构数组
 * @param {number[]} pathArr index路径
 * @return {Object|undefined} 返回匹配的项，或者undefined
 */
export const getTreeItemByIndexPath = (list, pathArr) => {
  const findOne = function (arr1, arr2) {
    const item = arr1[arr2.shift()];
    return arr2.length ? findOne(item.children, arr2) : item;
  }
  return findOne(list, [...pathArr]);
}

/**
 * 根据 index 路径获取路径项数组
 *
 * @param {Object[]} treeList 树状结构数组
 * @param {number[]} indexPath index路径
 */
export const getTreeItemPathByIndexPath = (treeList, indexPath) => {
  const ret = []
  const ip = [...indexPath]
  if (ip && ip.length) {
    while (ip.length) {
      const p = ip.splice(0, 1)[0]
      ret.push(treeList[p]);
      treeList = treeList[p].children
    }
  }
  return ret;
}

/**
 * 从树状结构数据中找出第一项：compareFunc 返回 true
 *
 * @param {Object[]} treeList 树状结构数组
 * @param {Function} compareFunc 要匹配的key
 */
export const getFirstOne = (treeList, compareFunc) => {
  const matchItem = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (compareFunc.call(arr, arr[i], i, arr)) {
        return arr[i]
      }
      if (arr[i].children && arr[i].children.length) {
        return matchItem(arr[i].children);
      }
    }
  }
  return matchItem(treeList);
}
