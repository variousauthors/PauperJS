const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
require('./Function')

describe('Function', () => {
  const fArb = jsc.fn(jsc.number)
  const gArb = jsc.fn(jsc.number)
  const FuncArb = jsc.number.smap(Function.of, f => f(), show)

  describe('functor', () => {
    const { identity, composition } = laws.Functor(Z.equals)

    it('obeys identity', identity(FuncArb))
    it('obeys composition', composition(FuncArb, fArb, gArb))
  })

  describe('chain', () => {
    const fArb = jsc.fn(FuncArb)
    const gArb = jsc.fn(FuncArb)
    const { associativity } = laws.Chain(Z.equals)

    it('obeys associativity', associativity(FuncArb, fArb, gArb))
  })

  describe('apply', () => {
    const FuncFnArb = jsc.fn(jsc.number).smap(Function.of, f => f(), show)
    const { composition } = laws.Apply(Z.equals)

    it('obeys composition', composition(FuncFnArb, FuncFnArb, FuncArb))
  })
})