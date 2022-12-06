const player = [
  { name: '乔丹', sex: '男', num: 4 },
  { name: '荆轲', sex: '女', num: 20 }
]

/**
  * @desc 数组的forEach
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrForEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this)
  }
}
player.arrForEach((item, index, arr) => {
  console.log(item, index, arr, "forEach")
})

/**
  * @desc 数组的map
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrMap = function (callback) {
  const res = []
  for (let i = 0; i < this.length; i++) {
    res.push(callback(this[i], i, this))
  }
  return res
}
console.log(player.arrMap((item, index) => `${item.name}-${item.sex}`))

/**
  * @desc 数组的filter
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrFilter = function (callback) {
  const res = []
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this) && res.push(this[i])
  }
  return res
}
console.log(player.arrFilter(item => item.sex === '男'))

/**
  * @desc 数组的every
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrEvery = function (callback) {
  let flag = true
  for (let i = 0; i < this.length; i++) {
    flag = callback(this[i], i, this)
    if (!flag) break
  }
  return flag
}
// console.log(player.arrEvery(item => item.num >= 20))

/**
  * @desc 数组的some
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrSome = function (callback) {
  let flag = false
  for (let i = 0; i < this.length; i++) {
    flag = callback(this[i], i, this)
    if (flag) break
  }
  return flag
}
// console.log(player.arrSome(item => item.num >= 20))

/**
  * @desc 数组的reduce
  * @param arr 数组
  * @param pre 前一项
  * @param next 下一项
  * @param index 遍历项索引
*/
Array.prototype.arrReduce = function (callback, ...args) {
  let start = 0, pre
  if (args.length) {
    pre = args[0]
  } else {
    pre = this[0]
    start = 1
  }
  for (let i = start; i < this.length; i++) {
    pre = callback(pre, this[i], i, this)
  }
  return pre
}
const sum = player.arrReduce((pre, next) => {
  return pre + next.num
}, 0)
console.log(sum)

/**
  * @desc 数组的includes
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrIncludes = function (value, start = 0) {
  if (start < 0) start = this.length + start
  const isNaN = Number.isNaN(value)
  for (let i = 0; i < this.length; i++) {
    if (this[i] === value || (isNaN && Number.isNaN(this[i]))) {
      return true
    }
  }
  return false
}
console.log([1,2,3].arrIncludes(2))

/**
  * @desc 数组的splice
  * @param arr 数组
  * @param item 遍历项
  * @param index 遍历项索引
*/
Array.prototype.arrSplice = function(start, length, ...values) {
  if (length === 0) return
  length = start + length > this.length - 1 ? this.length - start : length
  const res = [], tempArr = [...this]
  for (let i = start; i < start + values.length; i++) {
    this[i] = values[i - start]
  }
  this.length =  start + values.length
  if (values.length < length) {
    const cha = length - values.length
    for (let i = start + values.length; i < tempArr.length; i++) {
      this[i] = tempArr[i + cha]
    }
    this.length = this.length - cha
  }
  if (values.length > length) {
    for (let i = start + length; i < tempArr.length; i++) {
      this.push(tempArr[i])
    }
  }
  for (let i = start; i < start + length; i++) {
    res.push(tempArr[i])
  }
  return res
}
const spliceArr = [1,2,3,4,5]
console.log(spliceArr.arrSplice(1, 2))
