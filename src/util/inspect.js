
function inspect (value) {
  switch (typeof value) {
    case 'string': return `'${value}'`
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