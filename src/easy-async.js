/**
 * 处理异步调用最简易实现
 **/

// 定义三个常量表示 Promise 的状态
// 等待状态 可以变更为成功或失败
const PENDING = 'PENDING'
// 成功状态
const RESOLVED = 'RESOLVED'
// 失败状态
const REJECTED = 'REJECTED'

class Promise {
  /**
   * 在 new Promise 的时候会传入一个执行器 (executor) 同时这个执行器是立即执行的
   * state              Promise 的初始状态为等待状态
   * value              成功的值
   * reason             失败的原因
   * resolvedCallbacks  resolve 回调队列
   * rejectedCallbacks  reject 回调队列
   **/
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined

    this.resolvedCallbacks = []
    this.rejectedCallbacks = []

    /**
     * 在 resolve 函数和 reject 函数中
     * 只有等待状态 (pending) 下的 Promise 才能修改状态
     */
    // 成功函数
    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = RESOLVED
        this.value = value

        // 执行 resolve 回调队列
        this.resolvedCallbacks.forEach((fn) => fn())
      }
    }

    // 失败函数
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED
        this.reason = reason

        // 执行 reject 回调队列
        this.rejectedCallbacks.forEach((fn) => fn())
      }
    }

    /**
     * 执行器 (executor) 接收两个参数，分别是 resolve, reject
     * 为了防止执行器 (executor) 在执行时出错，需要进行错误捕获，并将错误传入 reject 函数
     */
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  /**
   * then 方法接收两个参数 onFulfilled 和 onRejected
   */
  then(onFulfilled, onRejected) {
    if (this.state === RESOLVED) {
      // 成功状态调用 onFulfilled
      onFulfilled(this.value)
    }
    if (this.state === REJECTED) {
      // 失败状态调用 onRejected
      onRejected(this.reason)
    }

    // 当 Promise 状态为等待状态 (pending) 时，将 onFulfilled 和 onRejected 存入对应的回调队列
    if (this.state === PENDING) {
      // 存入 onFulfilled 函数
      this.resolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      // 存入 onRejected 函数
      this.rejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = Promise
