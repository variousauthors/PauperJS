
const names = ['of', 'ap', 'chain', 'reduce']

module.exports = {
  addFantasyLand: function addFantasyLand(f) {
    names.map(name => f.prototype[`fantasy-land/${name}`] = f.prototype[name])
  }
} 