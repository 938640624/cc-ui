// 方法一
export default class Schedular {
  constructor(number = 1) {
    // 最大可并发任务数，默认为1
    this.number = number
    // taskArray用来存储等待执行的任务
    this.taskArray = []
    // 当前并发任务数
    this.count = 0
  }

  add(scheFunction) {
    if (this.count >= this.number) {
      this.taskArray.push(scheFunction)
    } else {
      this.start(scheFunction)
    }
  }

  async start(scheFunction) {
    this.count += 1
    // 使用await执行函数
    await scheFunction()
    // 执行完毕，当前并发任务数--
    this.count -= 1
    // 若队列中有值，将其resolve弹出并执行
    if (this.taskArray.length > 0) {
      // 采取递归方法
      this.start(this.taskArray.shift())
    }
  }
}

// 方法二
export default class Schedular2 {
  constructor(number = 1) {
    // 最大可并发任务数，默认为1
    this.number = number
    // taskArray用来存储等待执行的任务
    this.taskArray = []
    // 当前并发任务数
    this.count = 0
  }

  add(scheFunction) {
    // 若当前正在执行任务达到最大容量max，则放入taskArray进入阻塞队列，等待前面任务执行完毕后将resolve弹出并执行
    if (this.count >= this.number) {
      new Promise((resolve) => {
        this.taskArray.push(resolve)
      }).then(() => {
        this.start(scheFunction)
      })
    } else {
      this.start(scheFunction)
    }
  }

  async start(scheFunction) {
    this.count += 1
    await scheFunction()
    // 执行完毕，当前并发任务数--
    this.count -= 1
    // 若队列中有值，将其resolve弹出并执行
    if (this.taskArray.length > 0) {
      this.taskArray.shift()()
    }
  }
}

// 方法三
export default class Schedular3 {
  constructor(number = 1) {
    // 最大可并发任务数，默认为1
    this.number = number
    // taskArray用来存储等待执行的任务
    this.taskArray = []
    // 当前并发任务数
    this.count = 0
  }

  async add(scheFunction) {
    // 若当前正在执行任务达到最大容量max，则放入taskArray进入阻塞队列，等待前面任务执行完毕后将resolve弹出并执行
    if (this.count >= this.number) {
      await new Promise((resolve) => {
        this.taskArray.push(resolve)
      })
    }
    this.count += 1
    await scheFunction()
    // 执行完毕，当前并发任务数--
    this.count -= 1
    // 若队列中有值，将其resolve弹出并执行
    if (this.taskArray.length > 0) {
      this.taskArray.shift()()
    }
  }
}

// 调用方法
this.schedular = new Schedular()
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
this.schedular.add(() => {
  return timeout(3000).then(() => {
    console.log("3s后执行完毕")
  })
})
this.schedular.add(() => {
  return timeout(5000).then(() => {
    console.log("5s后执行完毕")
  })
})
this.schedular.add(() => {
  return timeout(6000).then(() => {
    console.log("6s后执行完毕")
  })
})

