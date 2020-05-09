const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Left, Right } = require('./Either')

module.exports = {
  laws: function () {
    const LeftArb = jsc.number.smap(Left, left => left.value, show)
    const RightArb = jsc.number.smap(Right, right => right.value, show)

    function functor () {
      const fArb = jsc.fn(jsc.number)
      const gArb = jsc.fn(jsc.number)

      {
        const { identity, composition } = laws.Functor(Z.equals, Left)
        identity(LeftArb)()
        composition(LeftArb, fArb, gArb)()
      }

      {
        const { identity, composition } = laws.Functor(Z.equals, Right)
        identity(RightArb)()
        composition(RightArb, fArb, gArb)()
      }
    }

    function chain () {
      const fArb = jsc.fn(RightArb)
      const gArb = jsc.fn(RightArb)

      {
        const { associativity } = laws.Chain(Z.equals)
        associativity(RightArb, fArb, gArb)()
      }

      {
        const { associativity } = laws.Chain(Z.equals)
        associativity(LeftArb, fArb, gArb)()
      }
    }

    function apply () {
      const RightFnArb = jsc.fn(jsc.number).smap(Right, right => right.value, show)
      const LeftFnArb = jsc.fn(jsc.number).smap(Left, left => left.value, show)

      {
        const { composition } = laws.Apply(Z.equals)
        composition(RightFnArb, RightFnArb, RightArb)()
      }

      {
        const { composition } = laws.Apply(Z.equals)
        composition(LeftFnArb, LeftFnArb, LeftArb)()
      }
    }

    functor()
    chain()
    apply()
  }
}