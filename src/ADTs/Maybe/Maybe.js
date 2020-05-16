const util = require('util');
const { inspect, compose } = require('../../util')
const { implement, Functor, Setoid, Apply, Chain, Applicative, Foldable } = require('../../util/fantasyLand')
const Z = require ('sanctuary-type-classes');

function Maybe (value) {
  return Just(value)
}

Maybe.prototype.of = function (value) { return Just.of(value) }

function Nothing () {
  return Nothing
}

Nothing.__proto__ = Nothing.prototype

Nothing.prototype.value = () => Nothing

Nothing.prototype[util.inspect.custom] = function () {
  return `Nothing`
}

implement(Functor, Nothing, {
  map: function (_) {
    return this
  }
})

implement(Setoid, Nothing, {
  equals: function equals(_) {
    return true
  }
})

implement(Apply, Nothing, {
  ap: function ap (_) {
    return this
  }
})

implement(Chain, Nothing, {
  chain: function (_) {
    return this
  }
})

implement(Foldable, Nothing, {
  reduce: function (_, initial) {
    return initial
  }
})

function Just(value) {
  return {
    value: () => value,
    __proto__: Just.prototype,
    [util.inspect.custom]: function () {
      return `Just(${inspect(this.value())})`
    }
  }
}

implement(Applicative, Just, {
  of: function (value) { return Just(value) }
})

implement(Functor, Just, {
  map: function (f) {
    return {
      value: compose(f, this.value),
      __proto__: Just.prototype,
    }
  }
})

implement(Setoid, Just, {
  equals: function equals(other) {
    return Z.equals(other.reduce((acc, el) => acc.concat(el), [])[0], this.value())
  }
})

implement(Apply, Just, {
  ap: function (other) {
    return other.chain(f => this.map(f))
  }
})

implement(Chain, Just, {
  chain: function (f) {
    return this.map(f).value()
  }
})

implement(Foldable, Just, {
  reduce: function (reducer, initial) {
    return reducer(initial, this.value())
  }
})

module.exports = {
  Maybe,
  Nothing,
  Just,
}