const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Left, Right } = require('./Either')
const { head } = require('../../helpers')

describe('Right', () => {
  const fArb = jsc.fn(jsc.number)
  const gArb = jsc.fn(jsc.number)
  const RightArb = jsc.number.smap(Right, head, show)

  describe('functor', () => {
    const { identity, composition } = laws.Functor(Z.equals)

    it('obeys identity', identity(RightArb))
    it('obeys composition', composition(RightArb, fArb, gArb))
  })

  describe('chain', () => {
    const fArb = jsc.fn(RightArb)
    const gArb = jsc.fn(RightArb)
    const { associativity } = laws.Chain(Z.equals)

    it('obeys associativity', associativity(RightArb, fArb, gArb))
  })

  describe('apply', () => {
    const RightFnArb = jsc.fn(jsc.number).smap(Right, head, show)
    const { composition } = laws.Apply(Z.equals)

    it('obeys composition', composition(RightFnArb, RightFnArb, RightArb))
  })
})

describe('Left', () => {
  const fArb = jsc.fn(jsc.number)
  const gArb = jsc.fn(jsc.number)
  const LeftArb = jsc.number.smap(Left, head, show)

  describe('functor', () => {
    const { identity, composition } = laws.Functor(Z.equals)

    it('obeys identity', identity(LeftArb))
    it('obeys composition', composition(LeftArb, fArb, gArb))
  })

  describe('chain', () => {
    const fArb = jsc.fn(LeftArb)
    const gArb = jsc.fn(LeftArb)
    const { associativity } = laws.Chain(Z.equals)

    it('obeys associativity', associativity(LeftArb, fArb, gArb))
  })

  describe('apply', () => {
    const LeftFnArb = jsc.fn(jsc.number).smap(Left, head, show)
    const { composition } = laws.Apply(Z.equals)

    it('obeys composition', composition(LeftFnArb, LeftFnArb, LeftArb))
  })
})