const util = require('util');
const { inspect } = require('./util')

class Maybe {

  static of (value) {
    return Just.of(value)
  }
}

const Nothing = {
  [util.inspect.custom] () {
    return `Nothing`
  },
  map (_f) {
    return Nothing
  }
}

class Just {

  constructor (value) {
    this.value = value
  }

  static of (value) {
    return new Just(value)
  }

  map (f) {
    return Just.of(f(this.value))
  }

  [util.inspect.custom] () {
    return `Just(${inspect(this.value)})`
  }
}

module.exports = {
  Maybe,
  Nothing,
  Just,
}