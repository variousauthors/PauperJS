const util = require('util');
const { inspect, compose } = require('../../util')
const { implement, Functor, Setoid, Apply, Chain, Applicative, Foldable } = require('../../util/fantasyLand')
const Z = require ('sanctuary-type-classes');

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

function makeJust (reduce) {
  return {
    /** the things I do for encapsulation */
    reduce,
    __proto__: Just.prototype,
    [util.inspect.custom]: function () {
      return `Just(${inspect(reduce((_, el) => el, undefined))})`
    }
  }
}

function Just(value) {
  return makeJust(
    function reduce (reducer, initial) {
      return reducer(initial, value)
    },
  )
}

implement(Applicative, Just, {
  of: function (value) { return Just(value) }
})

implement(Functor, Just, {
  map: function (f) {
    const value = this.reduce((_, el) => el, undefined)

    return makeJust(function reduce (reducer, initial) {
      return reducer(initial, f(value))
    })
  }
})

implement(Setoid, Just, {
  /** I don't actually know that other is an instance of _my_ Just 
   * it could be a Just from any fantasy-land compliant library 
   * so the only method I know it has is `fantasy-land/map`
   * and yet I must scream */
  equals: function equals(other) {
    return this.ap(
      other.map(x => a => Z.equals(x, a))
    ).reduce(
      (_, el) => el, 
      false
    )
  }
})

implement(Apply, Just, {
  ap: function (other) {
    return other.chain(f => this.map(f))
  }
})

implement(Chain, Just, {
  chain: function (f) {
    return this.map(f).reduce((_, el) => el, undefined)
  }
})

module.exports = {
  Nothing,
  Just,
}