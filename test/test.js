const assert = require('assert');
const MyPromise = require('../promise');

function asyncEqual(func, done) {
  try {
    func();
  } catch (err) {
    return done(err);
  }
  done();
}

describe('Promise', function () {

  describe('#resolve', function () {
    it('should resolve a value', function (done) {
      MyPromise.resolve('beauty')
      .then((data) => {
        asyncEqual(() => assert.equal(data, 'beauty'), done);
      });
    });

    it('should resolve a promise and passes its value', function (done) {
      MyPromise.resolve(MyPromise.resolve('beauty'))
      .then((data) => {
        asyncEqual(() => assert.equal(data, 'beauty'), done);
      });
    });

    it('should pass to the next handler if null is met', function (done) {
      MyPromise.resolve('beauty')
      .then(null, null)
      .then((data) => {
        asyncEqual(() => assert.equal(data, 'beauty'), done);
      });
    });

    it('should invoke synchronously', function (done) {
      var data = '';
      MyPromise.resolve(1)
      .then((res) => {
        data += res;
      });
      data += 2;
      asyncEqual(() => assert.equal(data, '12'), done);
    });
  });

  describe('#reject', function () {
    it('should reject a value', function (done) {
      MyPromise.reject('beauty')
      .then(null, (data) => {
        asyncEqual(() => assert.equal(data, 'beauty'), done);
      });
    });

    it('should reject whatever is passed even if a promise', function (done) {
      const toBeRejected = Promise.reject('rejected');
      MyPromise.reject(toBeRejected)
      .then(null, (data) => {
        asyncEqual(() => assert(data === toBeRejected), done);
      });
    });

    it('should pass to the next handler if null is met', function (done) {
      MyPromise.reject('beauty')
      .then(null, null)
      .then(null, (data) => {
        asyncEqual(() => assert.equal(data, 'beauty'), done);
      });
    });
  });

  describe('#all', function () {
    it('should resolve promises', function (done) {
      MyPromise.all([
        new MyPromise((resolve, reject) => setTimeout(() => resolve(1), 500)),
        MyPromise.resolve(2),
        3,
      ]).then((data) => {
        asyncEqual(() => assert.deepEqual(data, [1, 2, 3]), done);
      });
    });

    it('should resolve non-promise values', function (done) {
      MyPromise.all([1, 2, 3])
      .then((data) => {
        asyncEqual(() => assert.deepEqual(data, [1, 2, 3]), done);
      });
    });

    it('should reject immediately when got a rejection', function (done) {
      MyPromise.all([
        new MyPromise((resolve, reject) => setTimeout(() => resolve(1), 500)),
        MyPromise.reject(2),
        3,
      ]).then((data) => {
        done('should not execute here');
      }, (data) => {
        asyncEqual(() => assert.equal(data, 2), done);
      });
    });
  });

  describe('#race', function () {
    it('should resolve the first value', function (done) {
      MyPromise.race([1, 2]).then((data) => {
        asyncEqual(() => assert.equal(data, 1), done);
      });
    });

    it('should resolve the first resolve', function (done) {
      MyPromise.race([
        new MyPromise((resolve, reject) => setTimeout(() => reject(1), 500)),
        new MyPromise((resolve) => setTimeout(() => resolve(2), 100)),
      ]).then((data) => {
        asyncEqual(() => assert.equal(data, 2), done);
      }, (data) => {
        console.log('should not execute here');
      });
    });

    it('should reject the first reject', function (done) {
      MyPromise.race([
        new MyPromise((resolve) => setTimeout(() => resolve(1), 500)),
        new MyPromise((resolve, reject) => setTimeout(() => reject(2), 100)),
      ]).then((data) => {
        console.log('should not execute here');
      }, (data) => {
        asyncEqual(() => assert.equal(data, 2), done);
      });
    });
  });

});
