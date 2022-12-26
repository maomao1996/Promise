# Promise A+ 规范实现

## 规范文档

- [英文文档](https://promisesaplus.com/)
- [中文翻译 - 图灵社区](https://www.ituring.com.cn/article/66566)
- [中文翻译 - 掘金](https://juejin.im/post/5b6161e6f265da0f8145fb72)

## 测试用例

- [promises-aplus-tests](https://github.com/promises-aplus/promises-tests)

## 实现内容

- [处理同步调用最简易实现](/src/easy.js)
- [处理异步调用最简易实现](/src/easy-async.js)
- [链式调用简易实现](/src/easy-chain.js)
- [支持异步链式调用简易实现](/src/easy-chain-async.js)
- [Promise A+ 规范实现](/src/promise.js)
  - [Promise.prototype.then()](/src/promise.js#L159)
  - [Promise.prototype.catch()](/src/promise.js#L235)
  - [Promise.prototype.finally()](/src/promise.js#L244)
  - [Promise.resolve()](/src/promise.js#L262)
  - [Promise.reject()](/src/promise.js#L285)
  - [Promise.all()](/src/promise.js#L296)
  - [Promise.race()](/src/promise.js#L346)
  - [Promise.allSettled()](/src/promise.js#L367)
  - [Promise.any()](/src/promise.js#L422)
  - [Promise.promisify()](/src/promise.js#469)

## 关键点

### 原型方法

#### then 方法

- 在链式调用时需要返回一个新的 `Promise`
- 在 `then` 方法中，无论是成功还是失败的回调，只要返回了结果就会传入下一个 `then` 的回调
  - 当 `then` 方法返回的是一个 `Promise` 则根据这个 `Promise` 的状态去调用下一个 `then` 对应的回调
  - 当 `then` 方法返回的不是 `Promise` 则直接传入下一个 `then` 的成功回调
  - 在 `then` 方法执行时， `onFulfilled` `onRejected` 可能会出现错误，这时需要捕获错误，并执行失败回调（处理成失败状态）
- 总结
  - **下一个 `then` 的状态和上一个 `then` 执行时候的状态无关**
  - **只有在 `then` 方法执行出错或返回的是一个失败的 `Promise` 时才会走下一个 `then` 的失败回调，其他情况都会走下一个 `then` 的成功回调**

#### catch 方法

`catch` 方法是 `.then(null, onRejected)` 或 `.then(undefined, onRejected)` 的别名

#### finally 方法

- `finally` 方法本质上是 `then` 方法的特例
- `finally` 方法的回调函数不接受任何参数，所以不知道前面 `Promise` 的状态
- `finally` 方法在执行不出错的情况下，总是返回原来的值，当执行出错时则返回一个失败的 `Promise`

### 静态方法

`Promise.all()` `Promise.race()` `Promise.allSettled()` `romise.any()` 的**参数可以不是数组，但是必须具有 `Iterator` 接口**
