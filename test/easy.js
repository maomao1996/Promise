const Promise = require('../src/easy')

new Promise((resolve, reject) => {
  resolve('成功')
}).then(
  (data) => {
    console.log('easy 1 data', data)
  },
  (err) => {
    console.log('easy 1 err', err)
  }
)

const p1 = new Promise((resolve, reject) => {
  reject('失败')
})

console.log(p1)

p1.then(
  (data) => {
    console.log('easy 2 data', data)
  },
  (err) => {
    console.log('easy 2 err', err)
  }
)

new Promise((resolve, reject) => {
  throw new Error('出错啦')
}).then(
  (data) => {
    console.log('easy 3 data', data)
  },
  (err) => {
    console.log('easy 3 err', err)
  }
)
