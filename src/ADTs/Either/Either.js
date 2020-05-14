const util = require('util');
const { inspect, addFantasyLand, compose } = require('../../util')
const Z = require ('sanctuary-type-classes');

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

const Functor = {
  implement: function implement(Type, implementation) {
    Type.prototype.map = implementation.map
    Type.prototype['fantasy-land/map'] = implementation.map
  },
}

function implements (spec, Type, implementation) {
  spec.implement(Type, implementation)
}

implements(Functor, Left, {
  map: function map (_) {
    return this
  }
})

Left.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(this.value(), other.value())
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

implements(Functor, Right, {
  map: function map(f) {
    return {
      value: compose(f, this.value),
      __proto__: Right.prototype,
    }
  }
})

Right.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(this.value(), other.value())
}

Right.of = function (value) {
  return Right(value)
}

Right.prototype.join = function () {
  return {
    value: () => this.value().value(),
    __proto__: Right.prototype,
  }
}

Right.prototype.chain = function (f) {
  return this.map(f).join()
}

Right.prototype.ap = function (other) {
  return other.chain(f => this.map(f))
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