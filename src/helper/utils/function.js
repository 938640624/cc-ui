/**
  * @desc function的call
  * @param obj 对象
  * @param ...arg 属性值
*/
Function.prototype.thisCall = function (obj, ...args){
  // 判断obj是否传入，如果没传就设置为window
  obj = obj || window
  // symbol是唯一的，防止重名key
  const fn = Symbol()
  // 将被调用的方法设置为context属性，this即是我们要调用的方法
  obj[fn] = this
  // 执行调用的方法
  return obj[fn](...args)
}
const testObj = {
  name: '乔丹',
  testFn(age) {
    console.log(`${this.name}${age}岁了`)
  }
}
const testObj2 = {
  name: '詹姆斯'
}
testObj.testFn.thisCall(testObj2, 33)

/**
  * @desc function的apply
  * @param obj 对象
  * @param ...arg 属性值
  * 与call方法一样
*/

/**
  * @desc function的bind
  * @param obj 对象
  * @param ...arg 属性值
*/
Function.prototype.sx_bind = function (obj, ...args) {
  obj = obj || window

  // Symbol是唯一的，防止重名key
  const fn = Symbol()
  obj[fn] = this
  const _this = this

  const res = function (...innerArgs) {
    console.log(this, _this)
    if (this instanceof _this) {
      this[fn] = _this
      this[fn](...[...args, ...innerArgs])
      delete this[fn]
    } else {
      obj[fn](...[...args, ...innerArgs])
      delete obj[fn]
    }
  }
  res.prototype = Object.create(this.prototype)
  return res
}
