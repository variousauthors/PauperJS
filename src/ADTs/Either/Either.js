const { makeLazyInstance } = require('../../util')
const { head } = require('../../helpers')
const { implement, Functor, Setoid, Apply, Chain, Applicative, Foldable } = require('../../util/fantasyLand')
const Z = require ('sanctuary-type-classes');

const makeRight = makeLazyInstance(Right)
const makeLeft = makeLazyInstance(Left)

function Left (value) {
  return makeLeft(
    function reduce(reducer, initial) {
      return reducer(initial, value)
    },
  )
}

implement(Functor, Left, {
  map: function map (_) {
    return this
  }
})

implement(Setoid, Left, {
  equals: function equals(other) {
    return Z.equals(head(this), head(other))
  }
})

implement(Apply, Left, {
  ap: function ap(_) {
    return this
  }
})

implement(Chain, Left, {
  chain: function chain(_) {
    return this
  }
})

implement(Foldable, Left, {
  reduce: function reduce(_, initial) {
    return initial
  }
})


function Right (value) {
  return makeRight(
    function reduce(reducer, initial) {
      return reducer(initial, value)
    },
  )
}

implement(Applicative, Right, {
  of: function (value) { return new Right(value) }
})

implement(Functor, Right, {
  map: function (f) {
    const value = this.reduce((_, el) => el, undefined)

    return makeRight(function reduce (reducer, initial) {
      return reducer(initial, f(value))
    })
  }
})

implement(Setoid, Right, {
  equals: function equals(other) {
    if (!(other instanceof Right)) return false

    return Z.equals(
      this.reduce((_, el) => el, undefined),
      other.reduce((_, el) => el, undefined),
    )
  }
})

implement(Apply, Right, {
  ap: function (other) {
    return other.chain(f => this.map(f))
  }
})

implement(Chain, Right, {
  chain: function (f) {
    return this.map(f).reduce((_, el) => el, undefined)
  }
})


module.exports = {
  Left,
  Right,
}