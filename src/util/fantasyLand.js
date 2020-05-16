const isDefined = value => value !== undefined && value !== null
const isNil = value => !isDefined(value)

const fl = word => `fantasy-land/${word}`

function validateTarget(target, word) {
  if (isDefined(target[word]) || isDefined(target[fl(word)])) {
    throw new Error(`Namespace collision while trying to implement ${word}.`)
  }
}

function validateImplementation(implementation, word) {
  if (isNil(implementation[word])) {
    throw new Error(`Caller failed to provide an implementation for ${word}.`)
  }
}

function Spec (words) {
  return {
    implement: function implement (Type, implementation) {
      words.forEach(word => {
        validateTarget(Type.prototype, word)
        validateImplementation(implementation, word)

        Type.prototype[word] = implementation[word]
        Type.prototype[fl(word)] = implementation[word]
      })
    }
  }
}

function StaticSpec (words) {
  return {
    implement: function implement(Type, implementation) {
      words.forEach(word => {
        validateTarget(Type, word)
        validateImplementation(implementation, word)

        Type[word] = implementation[word]
        Type[fl(word)] = implementation[word]
      })
    }
  }
}

module.exports = {
  implement: function implement(spec, Type, implementation) {
    spec.implement(Type, implementation)
  },
  Functor: Spec(['map']),
  Setoid: Spec(['equals']),
  Apply: Spec(['ap']),
  Chain: Spec(['chain']),
  Applicative: StaticSpec(['of']),
  Foldable: Spec(['reduce']),
}