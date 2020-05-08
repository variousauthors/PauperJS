const laws = require ('fantasy-laws');
const jsc = require ('jsverify');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const { Nothing, Just } = require('./src')

function Sum(value) {
  if (!(this instanceof Sum)) return new Sum (value);
  this.value = value;
}

//  Sum.fantasy-land/empty :: () -> Sum
Sum['fantasy-land/empty'] = function() { return Sum (0); };

//  Sum#fantasy-land/equals :: Sum ~> Sum -> Boolean
Sum.prototype['fantasy-land/equals'] = function(other) {
  return Z.equals (this.value, other.value);
};

//  Sum#fantasy-land/concat :: Sum ~> Sum -> Sum
Sum.prototype['fantasy-land/concat'] = function(other) {
  return Sum (this.value + other.value);
};

//  Sum#fantasy-land/invert :: Sum ~> () -> Sum
Sum.prototype['fantasy-land/invert'] = function() {
  return Sum (-this.value);
};

const SumArb = jsc.number.smap (Sum, sum => sum.value, show);
const {leftInverse, rightInverse} = laws.Group (Z.equals, Sum);
//    testLeftInverse :: () -> Undefined !
const testLeftInverse = leftInverse (SumArb);

//    testRightInverse :: () -> Undefined !
const testRightInverse = rightInverse (SumArb);

testRightInverse()
testLeftInverse()


const JustArb = jsc.number.smap(Just, just => just.value, show)
const NothingArb = jsc.number.smap(Nothing, nothing => nothing, show)

{
  const fArb = jsc.fn(jsc.number)
  const gArb = jsc.fn(jsc.number)

  {
    const { identity, composition } = laws.Functor(Z.equals, Just)
    identity(JustArb)()
    composition(JustArb, fArb, gArb)()
  }

  {
    const { identity, composition } = laws.Functor(Z.equals, Nothing)
    identity(NothingArb)()
    composition(NothingArb, fArb, gArb)()
  }
}

{
  const fArb = jsc.fn(JustArb)
  const gArb = jsc.fn(JustArb)

  {
    const { associativity } = laws.Chain(Z.equals)
    associativity(JustArb, fArb, gArb)()
  }

  {
    const { associativity } = laws.Chain(Z.equals)
    associativity(NothingArb, fArb, gArb)()
  }
}

{
  const JustFnArb = jsc.fn(jsc.number).smap(Just, just => just.value, show)

  {
    const { composition } = laws.Apply(Z.equals)
    composition(JustFnArb, JustFnArb, JustArb)()
  }

}