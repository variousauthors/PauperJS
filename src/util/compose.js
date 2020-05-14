
module.exports = {
  compose: (f, g) => x => f(g(x))
}
