const util = require('util');

function Either (value) {
  return Right(value)
}

Either.of = function (value) {
  return Right(value)
}

function Left (value) {
  return {
    value,
    __proto__: Left.prototype,
  }
}

Left.prototype.map = function (_) {
  return this
}

Left.prototype.reduce = function (_, initial) {
  return initial
}

Left.prototype[util.inspect.custom] = function () {
  return `Left(${inspect(this.value)})`
}

function Right (value) {
  return {
    value,
    __proto__: Right.prototype,
  }
}

Right.prototype.map = function (f) {
  return Right.of(f(this.value))
}

Right.prototype.reduce = function (reducer, initial) {
  return reducer(initial, this.value)
}

Right.prototype[util.inspect.custom] = function () {
  return `Right(${inspect(this.value)})`
}

module.exports = {
  Either,
  Left,
  Right,
}