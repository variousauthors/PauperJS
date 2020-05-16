const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Nothing, Just } = require('./Maybe')

describe('Just', () => {
  const fArb = jsc.fn(jsc.number)
  const gArb = jsc.fn(jsc.number)
  const JustArb = jsc.number.smap(Just, just => just.value(), show)

  describe('functor', () => {
    const { identity, composition } = laws.Functor(Z.equals)

    it('obeys identity', identity(JustArb))
    it('obeys composition', composition(JustArb, fArb, gArb))
  })

  describe('chain', () => {
    const fArb = jsc.fn(JustArb)
    const gArb = jsc.fn(JustArb)
    const { associativity } = laws.Chain(Z.equals)

    it('obeys associativity', associativity(JustArb, fArb, gArb))
  })

  describe('apply', () => {
    const JustFnArb = jsc.fn(jsc.number).smap(Just, just => just.value(), show)
    const { composition } = laws.Apply(Z.equals)

    it('obeys composition', composition(JustFnArb, JustFnArb, JustArb))
  })
})

describe('Nothing', () => {
  const NothingArb = jsc.constant(Nothing)

  describe('functor', () => {
    const fArb = jsc.fn(jsc.number)
    const gArb = jsc.fn(jsc.number)
    const { identity, composition } = laws.Functor(Z.equals)

    it('obeys identity', identity(NothingArb))
    it('obeys composition', composition(NothingArb, fArb, gArb))
  })

  describe('chain', () => {
    const fArb = jsc.fn(NothingArb)
    const gArb = jsc.fn(NothingArb)
    const { associativity } = laws.Chain(Z.equals)

    it('obeys associativity', associativity(NothingArb, fArb, gArb))
  })

  describe('apply', () => {
    const NothingFnArb = jsc.fn(jsc.constant(Nothing))
    const { composition } = laws.Apply(Z.equals)

    it('obeys composition', composition(NothingFnArb, NothingFnArb, NothingArb))
  })
})