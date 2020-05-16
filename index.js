const { Nothing, Just, Right } = require('./src')
const { show, isNil } = require('./src/util')

const fromNullable = value => isNil(value) ? Nothing : Just.of(value)

const prop = p => obj => fromNullable(obj[p])
const getName = prop('name')

const a = getName({
  name: 'Bob'
})

const b = getName({ })

const c = a.constructor.of('what')

const d = Just.of('stuff')

const uncurry = f => (...args) => args.reduce((fn, arg) => fn(arg), f)

// find :: (a -> b) -> Array a -> Maybe b
const find = uncurry(f => arr => fromNullable(arr.find(f)))

const findById = uncurry(id => find(el => el.id === id))
const findBigNumbers = find(x => x > 2) // this also works

const getFriends = prop('friends')

const e = getFriends({
  friends: [{ id: 1 }, { id: 2 }]
})

// lifts a function into a functor
const map = f => fa => fa.map(f)

// lifts a value into a functor
const of = F => a => F.of(a)

show(
  a instanceof Just,
  b instanceof Nothing,
  a.ap(Just.of(a => a + 1)),
  b.ap(Just.of(a => a + 1)),
  a.map(name => `Hello ${name}`),
  b.map(name => `Hello ${name}`),
  c.map(name => `Hello ${name}`),
  map(name => `Hello ${name}`)(d),
  a.reduce((_, name) => name, '...'),
  b.reduce((_, name) => name, '...'),
  a.reduce((acc, x) => acc.concat([x]), []),
  b.reduce((acc, x) => acc.concat([x]), []),
  find(x => x === 4)([1, 2, 3]),
  find(x => x === 3, [1, 2, 3]),
  find(x => x === 3)([1, 2, 3]),
  find(x => x > 2, [1, 2, 3]),
  findById(3, [{ id: 2 }]),
  findBigNumbers([1, 2, 3]),
  e.chain(findById(1)),
  e.chain(findById(3)),
  b.chain(findById(3)),
  Right.of(3).chain(x => Right.of(x)),
)