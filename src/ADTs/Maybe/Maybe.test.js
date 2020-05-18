const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Nothing, Just } = require('./Maybe')
const { head, isDefined } = require('../../helpers')

describe('Either', () => {
  describe('Just', () => {
    const fromNullable = value => isDefined(value) ? Just.of(value) : Nothing
    const value = m => m.reduce((_, el) => el, undefined)

    describe('reduce', () => {
      it('works like a reduce', () => {
        const result = Just.of(0).reduce((acc, el) => acc.concat(el), [])

        expect(result).toEqual([0])
      })

      it('is not lazy', () => {
        const fn = jest.fn().mockImplementation(x => x)
        Just.of(0).reduce(fn, undefined)

        expect(fn).toHaveBeenCalled()
      })
    })

    describe('releasing the value', () => {
      const fn = jest.fn().mockImplementation(x => x + 1)

      it('map', () => {
        const result = fromNullable(0)
          .map(x => fn(x))

        expect(value(result)).toBe(1)
      })

      it('chain', () => {
        const result = fromNullable(0)
          .chain(x => fromNullable(fn(x)))

        expect(value(result)).toBe(1)
      })

      it('ap', () => {
        const result = fromNullable(0)
          .ap(fromNullable(x => fn(x)))

        expect(value(result)).toBe(1)
      })
    })

    describe('it is lazy', () => {
      const fn = jest.fn().mockImplementation(x => x + 1)

      it('map is lazy', () => {
        fromNullable(0)
          .map(x => fn(x))

        expect(fn).not.toHaveBeenCalled()
      })

      it('chain is lazy', () => {
        fromNullable(0)
          .chain(x => fromNullable(fn(x)))

        expect(fn).not.toHaveBeenCalled()
      })

      it('ap is lazy', () => {
        fromNullable(0)
          .ap(fromNullable(x => fn(x)))

        expect(fn).not.toHaveBeenCalled()
      })
    })
  })
})

describe('fantasy-laws', () => {
  describe('Just', () => {
    const fArb = jsc.fn(jsc.number)
    const gArb = jsc.fn(jsc.number)
    const JustArb = jsc.number.smap(Just, head, show)

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
      const JustFnArb = jsc.fn(jsc.number).smap(Just, head, show)
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
})