const { Nothing, Just, Maybe } = require('./src')
const { show } = require('./src/util')

const prop = p => obj => Maybe.fromNullable(obj[p])
const getName = prop('name')

const a = getName({
  name: 'Bob'
})

const b = getName({ })

const c = a.constructor.of('what')

const d = Maybe.of('stuff')

const uncurry = f => (...args) => args.reduce((fn, arg) => fn(arg), f)

// find :: (a -> b) -> Array a -> Maybe b
const find = uncurry(f => arr => Maybe.fromNullable(arr.find(f)))

const findById = uncurry(id => find(el => el.id === id))
const findBigNumbers = find(x => x > 2) // this also works

const getFriends = prop('friends')

const e = getFriends({
  friends: [{ id: 1 }, { id: 2 }]
})

show(
  a instanceof Just,
  b instanceof Nothing,
  a.ap(Maybe.of(a => a + 1)),
  b.ap(Maybe.of(a => a + 1)),
  a.map(name => `Hello ${name}`),
  b.map(name => `Hello ${name}`),
  c.map(name => `Hello ${name}`),
  d.map(name => `Hello ${name}`),
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
)