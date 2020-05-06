const { Nothing, Just, Maybe } = require('./src')
const { show } = require('./src/util/inspect')

const isNil = value => value === undefined || value === null
const fromNullable = value => isNil(value) ? Nothing : Just.of(value)
const prop = p => obj => fromNullable(obj[p])

const getName = prop('name')

const a = getName({
  name: 'Bob'
})

const b = getName({ })

const c = a.constructor.of('what')

const d = Maybe.of('stuff')

show(
  a instanceof Just,
  b instanceof Nothing,
  a.map(name => `Hello ${name}`),
  b.map(name => `Hello ${name}`),
  c.map(name => `Hello ${name}`),
  d.map(name => `Hello ${name}`),
  a.reduce((_, name) => name, '...'),
  b.reduce((_, name) => name, '...'),
  a.reduce((acc, x) => acc.concat([x]), []),
  b.reduce((acc, x) => acc.concat([x]), []),
)