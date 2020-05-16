const util = require('util');
const { inspect, isNil, addFantasyLand, compose } = require('../../util')
const Z = require ('sanctuary-type-classes');

function Maybe (value) {
  return Just(value)
}

Maybe.of = function (value) {
  return Just.of(value)
}

// is this how I want to do helpers?
Maybe.fromNullable = value => isNil(value) ? Nothing : Just(value)

function Nothing () {
  return Nothing
}

Nothing.prototype.value = () => Nothing

Nothing.of = function (_) { return Nothing }

/** Nothing is both the class and the only instance of Nothing 
 * calling new Nothing() just gives you Nothing
 * Nothing instanceof Nothing is true
*/
Nothing.__proto__ = Nothing.prototype

Nothing.prototype.map = function map (_) {
  return this
}

Nothing.prototype['fantasy-land/map'] = Nothing.prototype.map
Nothing.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(other.value(), this.value())
}

Nothing.prototype.ap = function ap (_) {
  return this
}

Nothing.prototype.chain = function chain (_) {
  return this
}

Nothing.prototype.reduce = function (_, initial) {
  return initial
}

Nothing.prototype[util.inspect.custom] = function () {
  return `Nothing`
}

function Just (value) {
  return {
    value: () => value,
    __proto__: Just.prototype,
  }
}

Just.of = function (value) { return Just(value) }

Just.prototype.map = function (f) {
  return {
    value: compose(f, this.value),
    __proto__: Just.prototype,
  }
}

Just.prototype['fantasy-land/map'] = Just.prototype.map
Just.prototype['fantasy-land/equals'] = function equals (other) {
  return Z.equals(other.value(), this.value())
}

Just.prototype.join = function () {
  return this.value()
}

Just.prototype.chain = function (f) {
  return this.map(f).join()
}

Just.prototype.ap = function (other) {
  return other.chain(f => this.map(f))
}

Just.prototype.reduce = function (reducer, initial) {
  return reducer(initial, this.value())
}

Just.prototype[util.inspect.custom] = function () {
  return `Just(${inspect(this.value())})`
}

addFantasyLand(Nothing)
addFantasyLand(Just)

module.exports = {
  Maybe,
  Nothing,
  Just,
}