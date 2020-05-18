const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Left, Right } = require('./Either')
const { head, isDefined } = require('../../helpers')

describe('Either', () => {
  describe('Right', () => {
    const fromNullable = value => isDefined(value) ? Right.of(value) : Left('It was null!')
    const value = m => m.reduce((_, el) => el, undefined)

    describe('reduce', () => {
      it('works like a reduce', () => {
        const result = Right.of(0).reduce((acc, el) => acc.concat(el), [])

        expect(result).toEqual([0])
      })

      it('is not lazy', () => {
        const fn = jest.fn().mockImplementation(x => x)
        Right.of(0).reduce(fn, undefined)

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
})
