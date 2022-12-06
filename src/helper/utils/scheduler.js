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
