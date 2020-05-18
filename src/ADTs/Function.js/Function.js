const { implement, Functor, Apply, Chain, Applicative, Setoid } = require('../../util/fantasyLand')
const Z = require ('sanctuary-type-classes');

implement(Applicative, Function, {
  of: function of (value) { return _ => value }
})

implement(Setoid, Function, {
  equals: function equals (other) {
    return Z.equals(this, other)
  }
})

implement(Functor, Function, {
  map: function map (f) {
    return x => f(this(x))
  }
})

implement(Apply, Function, {
  ap: function ap (f) {
    return x => f(x)(this(x))
  }
})

implement(Chain, Function, {
  chain: function chain (f) {
    return x => f(this(x))(x)
  }
})
