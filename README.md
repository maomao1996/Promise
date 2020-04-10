# Promise A+ 规范实现

## 规范文档

- [英文文档](https://promisesaplus.com/)
- [中文翻译 - 图灵社区](https://www.ituring.com.cn/article/66566)
- [中文翻译 - 掘金](https://juejin.im/post/5b6161e6f265da0f8145fb72)

## 内容

- [处理同步调用最简易实现](/src/easy.js)
- [处理异步调用最简易实现](/src/easy-async.js)
- [链式调用简易实现](/src/easy-chain.js)
- [支持异步链式调用简易实现](/src/easy-chain-async.js)
- [Promise A+ 规范实现](/src/promise.js)
  - [Promise.prototype.then()](/src/promise.js#L131)
  - [Promise.prototype.catch()](/src/promise.js#L204)
  - [Promise.prototype.finally()](/src/promise.js#213)
  - [Promise.resolve()](/src/promise.js#231)
  - [Promise.reject()](/src/promise.js#254)
  - [Promise.all()](/src/promise.js#265)
  - [Promise.race()](/src/promise.js#306)
  - [Promise.allSettled()](/src/promise.js#330)
  - [Promise.any()](/src/promise.js#376)
