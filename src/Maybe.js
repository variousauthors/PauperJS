const util = require('util');
const { inspect } = require('./util')

function Maybe (value) {
  return Just(value)
}

Maybe.of = function (value) {
  return Just(value)
}

function Nothing () {
  return Nothing
}

/** Nothing is both the class and the only instance of Nothing 
 * calling new Nothing() just gives you Nothing
 * Nothing instanceof Nothing is true
*/
Nothing.__proto__ = Nothing.prototype

Nothing.prototype.map = function (_) {
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
    value,
    __proto__: Just.prototype,
  }
}

Just.of = function (value) { return Just(value) }

Just.prototype.map = function (f) {
  return Just.of(f(this.value))
}

Just.prototype.reduce = function (reducer, initial) {
  return reducer(initial, this.value)
}

Just.prototype[util.inspect.custom] = function () {
  return `Just(${inspect(this.value)})`
}

module.exports = {
  Maybe,
  Nothing,
  Just,
}