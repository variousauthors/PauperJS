const util = require('util');
const { inspect } = require('./inspect')

const makeLazyInstance = Type => reduce => ({
  reduce,
  __proto__: Type.prototype,
  [util.inspect.custom]: function () {
    return `${Type.name}(${inspect(reduce((_, el) => el, undefined))})`
  }
})

module.exports = {
  makeLazyInstance,
}