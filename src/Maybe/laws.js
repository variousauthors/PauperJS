const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Nothing, Just } = require('./Maybe')

module.exports = {
  laws: function () {
    const JustArb = jsc.number.smap(Just, just => just.value, show)
    const NothingArb = jsc.number.smap(Nothing, nothing => nothing, show)

    function functor () {
      const fArb = jsc.fn(jsc.number)
      const gArb = jsc.fn(jsc.number)

      {
        const { identity, composition } = laws.Functor(Z.equals, Just)
        identity(JustArb)()
        composition(JustArb, fArb, gArb)()
      }

      {
        const { identity, composition } = laws.Functor(Z.equals, Nothing)
        identity(NothingArb)()
        composition(NothingArb, fArb, gArb)()
      }
    }

    function chain () {
      const fArb = jsc.fn(JustArb)
      const gArb = jsc.fn(JustArb)

      {
        const { associativity } = laws.Chain(Z.equals)
        associativity(JustArb, fArb, gArb)()
      }

      {
        const { associativity } = laws.Chain(Z.equals)
        associativity(NothingArb, fArb, gArb)()
      }
    }

    function apply () {
      const JustFnArb = jsc.fn(jsc.number).smap(Just, just => just.value, show)
      const NothingFnArb = jsc.fn(jsc.number).smap(Nothing, nothing => nothing, show)

      {
        const { composition } = laws.Apply(Z.equals)
        composition(JustFnArb, JustFnArb, JustArb)()
      }

      {
        const { composition } = laws.Apply(Z.equals)
        composition(NothingFnArb, NothingFnArb, NothingArb)()
      }
    }

    functor()
    chain()
    apply()
  }
}