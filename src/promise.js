/**
 * Promise A+ 规范实现
 **/

// 定义三个常量表示 Promise 的状态
// 等待状态 可以变更为成功或失败
const PENDING = 'pending'
// 成功状态
const FULFILLED = 'fulfilled'
// 失败状态
const REJECTED = 'rejected'

/**
 * 工具方法
 **/
function isFunction(value) {
  return typeof value === 'function'
}
function isObject(value) {
  return typeof value === 'object' && value !== null
}
function isIterator(value) {
  return value && isFunction(value[Symbol.iterator])
}

// 定时器函数
// 为了确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行
function nextTick(fn) {
  setTimeout(fn, 0)
}

/**
 * 规范 2.3
 * 实现兼容多种 Promise 的 resolutionProcedure 函数
 */
function resolutionProcedure(promise2, x, resolve, reject) {
  // 2.3.1 promise2 返回结果 x 为自身，应直接执行 reject
  if (promise2 === x) {
    return reject(new TypeError('Error 循环引用'))
  }

  // 2.3.2 如果 x 是一个 Promise 实例
  if (x instanceof Promise) {
    x.then(
      // 继续调用 resolutionProcedure 解析
      // 防止 value 的返回值还是一个 Promise
      (value) => resolutionProcedure(promise2, value, resolve, reject),
      reject
    )
    return
  }

  // 设置一个标志位，防止重复调用
  let called = false
  // 2.3.3 判断 x 是不是对象或函数
  if (isObject(x) || isFunction(x)) {
    // 防止取值时出错
    try {
      // 2.3.3.1 让 x 作为 x.then
      let then = x.then

      if (isFunction(then)) {
        // 2.3.3.3 如果 then 是一个方法，把 x 当作 this 来调用它
        // 其中第一个参数为 resolvePromise，第二个参数为 rejectPromise
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            // 防止 y 的返回值还是一个 Promise
            resolutionProcedure(promise2, y, resolve, reject)
          },
          (r) => {
            // 失败结果会向下传递
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 2.3.3.4 如果 then 不是一个函数，用 x 完成 promise
        resolve(x)
      }
    } catch (error) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e 则以 e 为据因执行 reject
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // 2.3.4 x 是一个普通值就直接调用 resolve(x)
    resolve(x)
  }
}

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
      // 如果 value 是个 Promise 则递归执行
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }

      nextTick(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED
          this.value = value

          // 执行 resolve 回调队列
          this.resolvedCallbacks.forEach((fn) => fn())
        }
      })
    }

    // 失败函数
    const reject = (reason) => {
      nextTick(() => {
        if (this.state === PENDING) {
          this.state = REJECTED
          this.reason = reason

          // 执行 reject 回调队列
          this.rejectedCallbacks.forEach((fn) => fn())
        }
      })
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
   * Promise.prototype.then() 实现
   * then 方法接收两个参数 onFulfilled 和 onRejected
   * onFulfilled 和 onRejected 均为可选参数
   */
  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (v) => v
    onRejected = isFunction(onRejected)
      ? onRejected
      : (e) => {
          throw e
        }
    /**
     * 在链式调用时需要返回一个新的 Promise，在 then 方法中，无论是成功还是失败的回调，只要返回了结果就会传入下一个 then 的回调
     * 当 then 方法返回的是一个 Promise 则根据这个 Promise 的状态去调用下一个 then 对应的回调
     * 当 then 方法返回的不是 Promise 则直接传入下一个 then 的成功回调
     * 如果在执行时出现错误就会传入下一个 then 的失败回调
     * 在 then 方法执行时， onFulfilled onRejected 可能会出现错误，这时需要捕获错误，并执行失败回调（处理成失败状态）
     * 总结：
     *    1. 下一个 then 的状态和上一个 then 执行时候的状态无关
     *    2. 只有在 then 方法执行出错或返回的是一个失败的 Promise 时才会走下一个 then 的失败回调，其他情况都会走下一个 then 的成功回调
     */
    const promise2 = new Promise((resolve, reject) => {
      if (this.state === FULFILLED) {
        nextTick(() => {
          // 成功状态调用 onFulfilled
          try {
            // 为了链式调用，需要获取 onFulfilled 函数执行的返回值，通过 resolve 返回
            const x = onFulfilled(this.value)
            // 通过 resolutionProcedure 函数对 x 的返回值做处理
            resolutionProcedure(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      if (this.state === REJECTED) {
        // 失败状态调用 onRejected
        nextTick(() => {
          try {
            // 为了链式调用，需要获取 onRejected 函数执行的返回值，通过 resolve 返回
            const x = onRejected(this.reason)
            resolutionProcedure(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      // 当 Promise 状态为等待状态 (pending) 时，将 onFulfilled 和 onRejected 存入对应的回调队列
      if (this.state === PENDING) {
        // 存入 onFulfilled 函数
        this.resolvedCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value)
            // 通过 resolutionProcedure 函数对 x 的返回值做处理
            resolutionProcedure(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        // 存入 onRejected 函数
        this.rejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason)
            resolutionProcedure(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
    })

    return promise2
  }

  /**
   * Promise.prototype.catch() 实现
   * catch 用于指定发生错误时的回调函数，实际就是 .then(null, onRejected) 的别名
   * https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-catch
   */
  catch(cb) {
    return this.then(null, cb)
  }

  /**
   * Promise.prototype.finally() 实现
   * finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
   * 在 finally 后还能继续 then ，并会将值原封不动的传递下去
   * finally 本质上是 then 方法的特例
   * 该方法由 ES2018 引入
   * https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-finally
   */
  finally(cb) {
    return this.then(
      (value) => Promise.resolve(cb()).then(() => value),
      (error) =>
        Promise.resolve(cb()).then(() => {
          throw error
        })
    )
  }

  /**
   * Promise.resolve() 实现
   * 将现有对象转为 Promise 实例，该实例的状态为 resolved
   * https://es6.ruanyifeng.com/#docs/promise#Promise-resolve
   */
  static resolve(value) {
    // 如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
    if (value instanceof Promise) {
      return value
    }

    return new Promise((resolve, reject) => {
      // 如果参数是一个 thenable 对象
      // thenable 对象指的是具有 then 方法的对象
      if (isObject(value) && isFunction(value.then)) {
        value.then(resolve, reject)
      } else {
        // 如果参数是一个原始值，则返回一个新的 Promise 对象，状态为 resolved
        resolve(value)
      }
    })
  }

  /**
   * Promise.reject() 实现
   * 将现有对象转为 Promise 实例，该实例的状态为 rejected
   * https://es6.ruanyifeng.com/#docs/promise#Promise-reject
   */
  static reject(error) {
    return new Promise((resolve, reject) => {
      reject(error)
    })
  }

  /**
   * Promise.all() 实现
   * 用于将多个 Promise 实例，包装成一个新的 Promise 实例
   * 只有所有的 Promise 状态成功才会成功，如果其中一个 Promise 的状态失败就会失败
   * https://es6.ruanyifeng.com/#docs/promise#Promise-all
   */
  static all(promises) {
    return new Promise((resolve, reject) => {
      // 参数不为 Iterator 时直接 reject
      if (!isIterator(promises)) {
        reject(new TypeError('参数必须具有 Iterator 接口'))
        return
      }

      const result = []

      // length 为 0 时直接返回
      if (promises.length === 0) {
        resolve(result)
        return
      }

      // 记录当前已成功的 Promise 数量
      let num = 0

      // resolve 验证函数
      function check(i, data) {
        result[i] = data
        num++
        // 只有成功的 Promise 数量等于传入的数组长度时才调用 resolve
        if (num === promises.length) {
          resolve(result)
        }
      }

      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (v) => {
            check(i, v)
          },
          (e) => {
            // 当其中一个 Promise 失败时直接调用 reject
            reject(e)
            return
          }
        )
      }
    })
  }

  /**
   * Promise.race() 实现
   * 用于将多个 Promise 实例，包装成一个新的 Promise 实例
   * 新的 Promise 实例状态会根据最先更改状态的 Promise 而更改状态
   * https://es6.ruanyifeng.com/#docs/promise#Promise-race
   */
  static race(promises) {
    return new Promise((resolve, reject) => {
      // 参数不为 Iterator 时直接 reject
      if (!isIterator(promises)) {
        reject(new TypeError('参数必须具有 Iterator 接口'))
        return
      }

      for (let i = 0; i < promises.length; i++) {
        // 只要有一个 Promise 状态发生改变，就调用其状态对应的回调方法
        Promise.resolve(promises[i]).then(resolve, reject)
      }
    })
  }

  /**
   * Promise.allSettled() 实现
   * 用于将多个 Promise 实例，包装成一个新的 Promise 实例
   * 新的 Promise 实例只有等到所有这些参数实例都返回结果，不管是 resolved 还是 rejected ，包装实例才会结束，一旦结束，状态总是 resolved
   * 该方法由 ES2020 引入
   * https://es6.ruanyifeng.com/#docs/promise#Promise-allSettled
   */
  static allSettled(promises) {
    return new Promise((resolve, reject) => {
      // 参数不为 Iterator 时直接 reject
      if (!isIterator(promises)) {
        reject(new TypeError('参数必须具有 Iterator 接口'))
        return
      }

      const result = []

      // length 为 0 时直接返回
      if (promises.length === 0) {
        resolve(result)
        return
      }

      // 记录当前已返回结果的 Promise 数量
      let num = 0

      // resolve 验证函数
      function check(i, data) {
        result[i] = data
        num++
        // 只有已返回结果的 Promise 数量等于传入的数组长度时才调用 resolve
        if (num === promises.length) {
          resolve(result)
        }
      }

      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (value) => {
            check(i, {
              status: FULFILLED,
              value,
            })
          },
          (reason) => {
            check(i, {
              status: REJECTED,
              reason,
            })
          }
        )
      }
    })
  }

  /**
   * Promise.any() 实现
   * 用于将多个 Promise 实例，包装成一个新的 Promise 实例
   * 只要参数实例有一个变成 resolved 状态，包装实例就会变成 resolved 状态；如果所有参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态
   * https://es6.ruanyifeng.com/#docs/promise#Promise-any
   */
  static any(promises) {
    return new Promise((resolve, reject) => {
      // 参数不为 Iterator 时直接 reject
      if (!isIterator(promises)) {
        reject(new TypeError('参数必须具有 Iterator 接口'))
        return
      }
      const rejects = []

      // 如果 length 为 0 时直接 reject
      if (promises.length === 0) {
        /**
         * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
         * reject(new AggregateError(rejects, 'All promises were rejected'))
         */
        reject(new Error('All promises were rejected'))
        return
      }

      // 记录当前已失败的 Promise 数量
      let num = 0

      // reject 验证函数
      function check(i, data) {
        rejects[i] = data
        num++
        // 只有失败的 Promise 数量等于传入的数组长度时才调用 reject
        if (num === promises.length) {
          reject(rejects)
        }
      }

      for (let i = 0; i < promises.length; i++) {
        // 当其中一个 Promise 成功时直接调用 resolve
        Promise.resolve(promises[i]).then(resolve, (r) => {
          check(i, r)
        })
      }
    })
  }

  /**
   * Promise.promisify() 实现
   * 用于将回调函数转换为 promise 的辅助函数，适用于 error-first 回调模式(nodejs)
   * error-first 模式的回调函数无论成功或者失败都会执行
   * error-first 回调定义规则：
   *    1. 回调函数的第一个参数保留给一个错误 error 对象，如果有错误发生，错误将通过第一个参数 err 返回。
   *    2. 回调函数的第二个参数为成功响应的数据保留，如果没有错误发生，err将被设置为null, 成功的数据将从第二个参数返回。
   *
   */
  static promisify(func) {
    return function (...options) {
      return new Promise((resolve, reject) => {
        func(...options, (err, ...data) => {
          // 通过回调函数返回的参数来控制 promise 的状态
          if (err) {
            reject(err)
          }
          resolve(...data)
        })
      })
    }
  }
}

// promises-aplus-tests 测试方法
Promise.defer = Promise.deferred = function () {
  const dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise
