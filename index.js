const { Nothing, Just } = require('./src')

const isNil = value => value === undefined || value === null
const fromNullable = value => isNil(value) ? Nothing : Just.of(value)
const prop = p => obj => fromNullable(obj[p])

const getName = prop('name')

const a = getName({
  name: 'Bob'
})

const b = getName({ })

console.log(a.map(name => `Hello ${name}`))
console.log(b.map(name => `Hello ${name}`))