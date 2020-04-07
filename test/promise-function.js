const Promise = require('../src/promise')

console.log('------ catch finally ------')

new Promise((resolve, reject) => {
  reject('出错了')
})
  .catch((err) => {
    console.log('catch', err)
  })
  .finally(() => {
    console.log('finally')
  })

setTimeout(() => {
  console.log('\n------ Promise.resolve Promise.reject ------')
  const resolve = Promise.resolve('resolve')
  setTimeout(() => {
    console.log('Promise.resolve', resolve)
  }, 0)
  const reject = Promise.reject('reject')
  setTimeout(() => {
    console.log('Promise.reject', reject)
  }, 0)
}, 50)
