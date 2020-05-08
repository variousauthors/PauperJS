
function inspect (value) {
  switch (typeof value) {
    case 'string': return `'${value}'`
    case 'object': return JSON.stringify(value, null, 2)
    default: return value
  }
}

function show (...values) {
  values.forEach(value => console.log(value))
}

module.exports = {
  inspect,
  show
}