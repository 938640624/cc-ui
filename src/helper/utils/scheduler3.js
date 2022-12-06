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

