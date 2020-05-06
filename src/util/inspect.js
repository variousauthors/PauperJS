
function inspect (value) {
  switch (typeof value) {
    case 'string': return `'${value}'`
    default: return value
  }
}

module.exports = inspect