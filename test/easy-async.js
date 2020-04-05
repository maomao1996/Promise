const Promise = require('../src/easy-async')

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1e3)
}).then(
  (data) => {
    console.log('easy-async 1 data', data)
  },
  (err) => {
    console.log('easy-async 1 err', err)
  }
)

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('失败')
  }, 1e3)
})

console.log(p1)

p1.then(
  (data) => {
    console.log('easy-async 2 data', data)
  },
  (err) => {
    console.log('easy-async 2 err', err)
  }
)

new Promise((resolve, reject) => {
  throw new Error('出错啦')
}).then(
  (data) => {
    console.log('easy-async 3 data', data)
  },
  (err) => {
    console.log('easy-async 3 err', err)
  }
)
