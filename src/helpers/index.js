const head = m => m.reduce((_, el) => el, undefined)
const isNil = v => v === undefined || v === null
const not = f => x => !f(x)
const isDefined = not(isNil)

module.exports = {
  head,
  isNil,
  isDefined,
  not,
}