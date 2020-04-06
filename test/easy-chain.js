const Promise = require('../src/easy-chain')

new Promise((resolve, reject) => {
  resolve('成功')
})
  .then(
    (data) => {
      console.log('easy-chain 1 data', data)
      throw new Error('easy-chain 1 出错啦')
    },
    (err) => {
      console.log('easy-chain 1 err', err)
    }
  )
  .then(
    (data) => {
      console.log('easy-chain 2 data', data)
      return 2
    },
    (err) => {
      console.log('easy-chain 2 err', err)
      return 222
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
