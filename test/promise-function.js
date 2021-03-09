const assert = require('assert')
const Promise = require('../src/promise')

describe('Promise Function', function () {
  describe('Promise.prototype.catch', () => {
    it('throws on implicit undefined', function () {
      return Promise.all().then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
  })

  describe('Promise.all', function () {
    it('throws on implicit undefined', function () {
      return Promise.all().then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on explicit undefined', function () {
      return Promise.all(undefined).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on null', function () {
      return Promise.all(null).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on 0', function () {
      return Promise.all(0).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on false', function () {
      return Promise.all(false).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a number', function () {
      return Promise.all(20).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a boolean', function () {
      return Promise.all(true).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on an object', function () {
      return Promise.all({ test: 'object' }).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('works on multiple resolved promises', function () {
      return Promise.all([Promise.resolve(), Promise.resolve()]).then(
        function () {
          assert.ok(true)
        },
        function () {
          assert.fail()
        }
      )
    })
    it('works on rejected promises', function () {
      return Promise.all([Promise.reject(), Promise.resolve()]).then(
        function () {
          assert.fail()
        },
        function () {
          assert.ok(true)
        }
      )
    })
    it('works on empty array', function () {
      return Promise.all([]).then(
        function (arr) {
          assert.ok(arr.length === 0)
        },
        function () {
          assert.fail()
        }
      )
    })
  })

  describe('Promise.race', function () {
    it('throws on implicit undefined', function () {
      return Promise.race().then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on explicit undefined', function () {
      return Promise.race(undefined).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on null', function () {
      return Promise.race(null).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on 0', function () {
      return Promise.race(0).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on false', function () {
      return Promise.race(false).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a number', function () {
      return Promise.race(20).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a boolean', function () {
      return Promise.race(true).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on an object', function () {
      return Promise.race({ test: 'object' }).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on multiple promises', function () {
      return Promise.race(Promise.resolve(), Promise.resolve()).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('works on basic values', function () {
      return Promise.race([1, 2, 3]).then(
        function (val) {
          assert.ok(val == 1)
        },
        function () {
          assert.fail()
        }
      )
    })
    it('works on success promise', function () {
      var doneProm = Promise.resolve(10)
      var pendingProm1 = new Promise(function () {})
      var pendingProm2 = new Promise(function () {})

      return Promise.race([pendingProm1, doneProm, pendingProm2]).then(
        function (val) {
          assert.ok(val == 10)
        },
        function () {
          assert.fail()
        }
      )
    })
    it('works on empty array', function () {
      var prom = Promise.race([])
      return assert(prom instanceof Promise)
    })
  })

  describe('Promise.allSettled', function () {
    it('throws on implicit undefined', function () {
      return Promise.allSettled().then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on explicit undefined', function () {
      return Promise.allSettled(undefined).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on null', function () {
      return Promise.allSettled(null).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on 0', function () {
      return Promise.allSettled(0).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on false', function () {
      return Promise.allSettled(false).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a number', function () {
      return Promise.allSettled(20).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a boolean', function () {
      return Promise.allSettled(true).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on an object', function () {
      return Promise.allSettled({ test: 'object' }).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('works on multiple resolved promises', function () {
      return Promise.allSettled([Promise.resolve(), Promise.resolve()]).then(
        function () {
          assert.ok(true)
        },
        function () {
          assert.fail()
        }
      )
    })
    it('works even with rejected promises', function () {
      return Promise.allSettled([Promise.reject(), Promise.resolve()]).then(
        function (results) {
          assert.equal(results[0].status, 'rejected')
          assert.equal(results[1].status, 'fulfilled')
          assert.ok(true)
        },
        function () {
          assert.fail()
        }
      )
    })
    it('works on empty array', function () {
      return Promise.allSettled([]).then(
        function (arr) {
          assert.ok(arr.length === 0)
        },
        function () {
          assert.fail()
        }
      )
    })
  })

  describe('Promise.any', function () {
    it('throws on implicit undefined', function () {
      return Promise.any().then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on explicit undefined', function () {
      return Promise.any(undefined).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on null', function () {
      return Promise.any(null).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on 0', function () {
      return Promise.any(0).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on false', function () {
      return Promise.any(false).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a number', function () {
      return Promise.any(20).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on a boolean', function () {
      return Promise.any(true).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('throws on an object', function () {
      return Promise.any({ test: 'object' }).then(
        function () {
          assert.fail()
        },
        function (error) {
          assert.ok(error instanceof Error)
        }
      )
    })
    it('works on resolved promises', function () {
      return Promise.any([Promise.resolve()]).then(
        function () {
          assert.ok(true)
        },
        function () {
          assert.fail()
        }
      )
    })
    it('works on rejected promises', function () {
      return Promise.any([Promise.reject()]).then(
        function () {
          assert.fail()
        },
        function () {
          assert.ok(true)
        }
      )
    })
    it('works on empty array', function () {
      return Promise.any([]).then(
        function () {
          assert.ok(true)
        },
        function () {
          assert.fail()
        }
      )
    })
  })
})
