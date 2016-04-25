const assert = require('assert');
const MyPromise = require('../promise');

// Should not return the promise since this is not native Promise

describe('Promise', () => {

  describe('#resolve', () => {
    it('should resolve a value', done => {
      MyPromise.resolve('beauty')
      .then(data => {
        assert.equal(data, 'beauty');
      })
      .then(done, done);
    });

    it('should resolve a promise and passes its value', done => {
      MyPromise.resolve(MyPromise.resolve('beauty'))
      .then(data => {
        assert.equal(data, 'beauty');
      })
      .then(done, done);
    });

    it('should pass to the next handler if null is met', done => {
      MyPromise.resolve('beauty')
      .then(null, null)
      .then(data => {
        assert.equal(data, 'beauty');
      })
      .then(done, done);
    });

    it('should invoke synchronously', () => {
      var data = '';
      MyPromise.resolve(1)
      .then(res => {
        data += res;
      });
      data += 2;
      assert.equal(data, '12');
    });

    it('should resolve Promise-like object', done => {
      MyPromise.resolve(1)
      .then(data => Promise.resolve(data))
      .then(data => {
        assert.equal(data, 1);
      })
      .then(done, done);
    });
  });

  describe('#reject', () => {
    it('should catch an exception', done => {
      MyPromise.resolve()
      .then(() => {
        throw 'exception';
      })
      .catch(err => {
        assert.equal(err, 'exception');
      })
      .then(done, done);
    });

    it('should reject a value', done => {
      MyPromise.reject('beauty')
      .then(null, data => {
        assert.equal(data, 'beauty');
      })
      .then(done, done);
    });

    it('should reject whatever is passed even if a promise', done => {
      const toBeRejected = Promise.reject('rejected');
      MyPromise.reject(toBeRejected)
      .then(null, data => {
        assert(data === toBeRejected);
      })
      .then(done, done);
    });

    it('should pass to the next handler if null is met', done => {
      MyPromise.reject('beauty')
      .then(null, null)
      .then(null, data => {
        assert.equal(data, 'beauty');
      })
      .then(done, done);
    });
  });

  describe('#all', () => {
    it('should resolve promises', done => {
      MyPromise.all([
        new MyPromise((resolve, reject) => setTimeout(() => resolve(1), 500)),
        MyPromise.resolve(2),
        3,
      ])
      .then(data => {
        assert.deepEqual(data, [1, 2, 3]);
      })
      .then(done, done);
    });

    it('should resolve non-promise values', done => {
      MyPromise.all([1, 2, 3])
      .then(data => {
        assert.deepEqual(data, [1, 2, 3]);
      })
      .then(done, done);
    });

    it('should reject immediately when got a rejection', done => {
      MyPromise.all([
        new MyPromise((resolve, reject) => setTimeout(() => resolve(1), 500)),
        MyPromise.reject(2),
        3,
      ])
      .then(data => {
        throw 'should not execute here';
      }, data => {
        assert.equal(data, 2);
      })
      .then(done, done);
    });
  });

  describe('#race', () => {
    it('should resolve the first value', done => {
      MyPromise.race([1, 2])
      .then(data => {
        assert.equal(data, 1);
      })
      .then(done, done);
    });

    it('should resolve the first resolve', done => {
      MyPromise.race([
        new MyPromise((resolve, reject) => setTimeout(() => reject(1), 500)),
        new MyPromise(resolve => setTimeout(() => resolve(2), 100)),
      ])
      .then(data => {
        assert.equal(data, 2);
      }, data => {
        throw 'should not execute here';
      })
      .then(done, done);
    });

    it('should reject the first reject', done => {
      MyPromise.race([
        new MyPromise(resolve => setTimeout(() => resolve(1), 500)),
        new MyPromise((resolve, reject) => setTimeout(() => reject(2), 100)),
      ])
      .then(data => {
        throw 'should not execute here';
      }, data => {
        assert.equal(data, 2);
      })
      .then(done, done);
    });
  });

});
