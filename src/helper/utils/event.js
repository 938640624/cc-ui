// 实现发布订阅模式的on, emit, once, off方法
export default class Event {
  constructor() {
    // 这种方法创建的空对象拥有原型链
    this.events = Object.create(null)
  }

  on(name, fn) {
    if (this.events[name]) {
      this.events[name].push(fn)
      return
    }
    this.events[name] = [fn]
  }

  emit(name, ...args) {
    // 复制一份，防止回调里继续on导致死循环
    const tasks = this.events[name].slice()
    if (tasks) {
      tasks.forEach((fn) => {
        fn(...args)
      })
    }
  }

  off(name) {
    if (!arguments.length) {
      this.events = Object.create(null)
    }
    if (this.events[name]) {
      delete this.events[name]
    }
  }

  once(name, cb) {
    function fn(...args) {
      cb(args)
      this.off(name, fn)
    }
    this.on(name, fn)
  }
}
