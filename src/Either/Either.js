const util = require('util');
const { inspect, addFantasyLand } = require('../util')

function Either (value) {
  return Right.of(value)
}

Either.of = function (value) {
  return Right.of(value)
}

function Left (value) {
  return {
    value,
    __proto__: Left.prototype,
  }
}

Left.of = function (value) {
  return Left(value)
}

Left.prototype.map = function (_) {
  return this
}

Left.prototype.ap = function (_) {
  return this
}

Left.prototype.chain = function (_) {
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

Right.of = function (value) {
  return Right(value)
}

Right.prototype.map = function (f) {
  return Right.of(f(this.value))
}

Right.prototype.ap = function (other) {
  return other.map(fn => fn(this.value))
}

Right.prototype.chain = function (f) {
  return f(this.value)
}

Right.prototype.reduce = function (reducer, initial) {
  return reducer(initial, this.value)
}

Right.prototype[util.inspect.custom] = function () {
  return `Right(${inspect(this.value)})`
}

addFantasyLand(Right)
addFantasyLand(Left)

module.exports = {
  Either,
  Left,
  Right,
}