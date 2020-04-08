const Promise = require('../src/promise')

function createPromis(t1, t2) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功了')
    }, t1)
    setTimeout(() => {
      reject('出错了')
    }, t2)
  })
}

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

setTimeout(() => {
  console.log('\n------ Promise.all ------')
  Promise.all([])
    .then((res) => {
      console.log('all then', res)
    })
    .catch((err) => {
      console.log('all catch', err)
    })
  const all1 = [
    Promise.resolve('all resolve1'),
    Promise.resolve('all resolve2'),
  ]
  Promise.all(all1)
    .then((res) => {
      console.log('all1 then', res)
    })
    .catch((err) => {
      console.log('all1 catch', err)
    })
  const all2 = [Promise.resolve('all resolve'), Promise.reject('all reject')]
  Promise.all(all2)
    .then((res) => {
      console.log('all2 then', res)
    })
    .catch((err) => {
      console.log('all2 catch', err)
    })
}, 100)

setTimeout(() => {
  console.log('\n------ Promise.race ------')

  Promise.race([])
    .then((res) => {
      console.log('race then', res)
    })
    .catch((err) => {
      console.log('race catch', err)
    })
  const all1 = [createPromis(5, 10), createPromis(5, 10)]
  Promise.race(all1)
    .then((res) => {
      console.log('all1 then', res)
    })
    .catch((err) => {
      console.log('all1 catch', err)
    })
  const all2 = [createPromis(20, 10), createPromis(20, 10)]
  Promise.race(all2)
    .then((res) => {
      console.log('all2 then', res)
    })
    .catch((err) => {
      console.log('all2 catch', err)
    })
}, 150)

setTimeout(() => {
  console.log('\n------ Promise.race ------')

  Promise.allSettled([])
    .then((res) => {
      console.log('allSettled then', res)
    })
    .catch((err) => {
      console.log('allSettled catch', err)
    })
  const all = [createPromis(5, 10), createPromis(10, 5)]
  Promise.allSettled(all)
    .then((res) => {
      console.log('allSettled all then', res)
    })
    .catch((err) => {
      console.log('allSettled all catch', err)
    })
}, 200)

setTimeout(() => {
  console.log('\n------ Promise.any ------')

  Promise.any([])
    .then((res) => {
      console.log('any then', res)
    })
    .catch((err) => {
      console.log('any catch', err)
    })
  const all1 = [createPromis(5, 10), createPromis(5, 10)]
  Promise.any(all1)
    .then((res) => {
      console.log('any all1 then', res)
    })
    .catch((err) => {
      console.log('any all1 catch', err)
    })
  const all2 = [createPromis(20, 10), createPromis(20, 10)]
  Promise.any(all2)
    .then((res) => {
      console.log('any all2 then', res)
    })
    .catch((err) => {
      console.log('any all2 catch', err)
    })
}, 250)
