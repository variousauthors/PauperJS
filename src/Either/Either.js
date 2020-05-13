const util = require('util');
const { inspect, addFantasyLand } = require('../util')
const Z = require ('sanctuary-type-classes');

const compose = (f, g) => x => f(g(x))

function Either (value) {
  return Right.of(value)
}

Either.of = function (value) {
  return Right.of(value)
}

function Left (value) {
  return {
    value: () => value,
    __proto__: Left.prototype,
  }
}

Left.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(this.value(), other.value())
}

Left.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(this.value(), other.value())
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
  return `Left(${inspect(this.value())})`
}

function Right (value) {
  return {
    value: () => value,
    __proto__: Right.prototype,
  }
}

Right.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(this.value(), other.value())
}

Right.of = function (value) {
  return Right(value)
}

Right.prototype.map = function (f) {
  return {
    value: compose(f, this.value),
    __proto__: Right.prototype,
  }
}

Right.prototype.ap = function (other) {
  return other.map(fn => fn(this.value()))
}

Right.prototype.chain = function (f) {
  return {
    value: () => f(this.value()).value(),
    __proto__: Right.prototype,
  }
}

Right.prototype.reduce = function (reducer, initial) {
  return reducer(initial, this.value())
}

Right.prototype[util.inspect.custom] = function () {
  return `Right(${inspect(this.value())})`
}

addFantasyLand(Right)
addFantasyLand(Left)

module.exports = {
  Either,
  Left,
  Right,
}