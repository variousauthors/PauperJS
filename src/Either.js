class Either {

}

class Left {
  
  map (_) {
    return this
  }

  reduce (_, initial) {
    return initial
  }

  [util.inspect.custom] () {
    return `Left(${inspect(this.value)})`
  }
}

class Right {
  constructor (value) {
    this.value = value
  }

  static of (value) {
    return new Right(value)
  }

  map (f) {
    return Right.of(f(this.value))
  }

  reduce (reducer, initial) {
    return reducer(this.value, initial)
  }

  [util.inspect.custom] () {
    return `Right(${inspect(this.value)})`
  }
}