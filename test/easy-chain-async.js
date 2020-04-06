const Promise = require('../src/easy-chain-async')

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 0)
})
  .then(
    (data) => {
      console.log('easy-chain 1 data', data)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('成功1')
        }, 0)
      })
    },
    (err) => {
      console.log('easy-chain 1 err', err)
    }
  )
  .then(
    (data) => {
      console.log('easy-chain 2 data', data)
      throw new Error('easy-chain 2 出错啦')
    },
    (err) => {
      console.log('easy-chain 2 err', err)
    }
  )
  .then(
    (data) => {
      console.log('easy-chain 3 data', data)
    },
    (err) => {
      console.log('easy-chain 3 err', err)
    }
  )
