const util = require('util');
const { makeLazyInstance } = require('../../util')
const { implement, Functor, Setoid, Apply, Chain, Applicative, Foldable } = require('../../util/fantasyLand')
const Z = require ('sanctuary-type-classes');

const makeJust = makeLazyInstance(Just)

function Nothing() {
  if (isNil(Nothing.instance)) {
    Nothing.instance = this
  }

  return Nothing.instance
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
  equals: function equals(other) {
    return other instanceof Nothing
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

function Just (value) {
  return makeJust(
    function reduce(reducer, initial) {
      return reducer(initial, value)
    },
  )
}

implement(Applicative, Just, {
  of: function (value) { return new Just(value) }
})

implement(Functor, Just, {
  map: function (f) {
    const previous = () => this.reduce((_, el) => el, undefined)

    return makeJust(function reduce (reducer, initial) {
      return reducer(initial, f(previous()))
    })
  }
})

implement(Setoid, Just, {
  equals: function equals(other) {
    if (!(other instanceof Just)) return false

    return Z.equals(
      this.reduce((_, el) => el, undefined),
      other.reduce((_, el) => el, undefined),
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
    return this.map(x => f(x).reduce((_, el) => el, undefined))
  }
})

module.exports = {
  Nothing,
  Just,
}