# Symbol
`Symbol()` 函数会返回 symbol 类型的值，该类型具有静态属性和静态方法。静态属性会暴露几个内建的成员对象，静态方法会暴露全局的symbol注册，类似于内建对象类，但作为构造函数是不完整的，**不支持** `new Symbol()`。

每个从 `symbol()` 返回的 symbol 值都是唯一的。

`symbol` 是 ES6 引入的第七种基础数据类型。

#### 语法:
```js
Symbol([description]);
```

#### 参数:
`description`: 
**可选**，字符串，`symbol` 的描述，可用于调试但是**不能访问** `symbol`。

#### 例子:
```js
let sym1 = Symbol('name');
let sym2 = Symbol('age');

sym1 === sym2; // ==> false

let obj = {name: 'Mr.'};
obj[sym1] = 'Mr.';

obj; // ==> {name: "Mr.", Symbol(name): "Mr."}
```

## 1. Object.getOwnPrototypeSymbols()
`Object.getOwnPropertySymbols()` 方法返回一个给定对象自身的所有 `Symbol` 属性的数组。

#### 语法:
```js
Object.getOwnPrototypeSymbols(obj);
```

#### 参数:
`obj`: 
要返回 `Symbol` 属性的对象。

#### 返回值:
在给定对象自身上找到的所有 `Symbol` 属性的数组。

#### 例子:
```js
let name = Symbol('age');
let obj = {};

obj[age] = 'Mr.';

obj.age; // ==> undefined

let symbolsArr = Object.getOwnPrototypeSymbols(obj);

symbolsArr; // ==> [Symbol(age)]
```

## 2. Symbol.for()
`Symbol.for(key)` 方法会根据给定的键 `key`，来从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，否则新建一个与该键关联的 symbol，并放入全局的 symbol 注册表中。

和 `Symbol()` 不同，`Symbol.for()` 创建的 symbol 会被存到一个全局的注册表中。

#### 语法:
```js
Symbol.for(key);
```

#### 参数:
`key`: 
一个字符串，作为 symbol 注册表中与某 symbol 关联的键(也是 symbol 的描述)。

#### 返回值:
返回由给定的 key 找到的 symbol，否则就是返回新创建的 symbol。

#### 例子:
```js
Symbol.for('Mr.') === Symbol.for('Mr.'); // ==> true
Symbol('Mr.') === Symbol('Mr.'); // ==> false
```

## 3. Symbol.keyFor()
`Symbol.keyFor()` 方法用来获取 symbol 注册表中与某个 symbol 关联的键。

#### 语法:
```js
Symbol.keyFor(sym);
```

#### 参数:
`sym`: 
存储在 symbol 注册表中的某个 symbol。

#### 返回值:
如果全局注册表中查找到该 symbol，则返回该 symbol 的 `key` 值，形式为 `string`。如果 symbol 未在注册表中，返回 `undefined`。

#### 例子:
```js
let sym = Symbol.for('Mr.');
Symbol.keyFor(sym); // ==> 'Mr.'
```

## 4. Symbol.hasInstance
`Symbol.hasInstance` 属性，指向一个内部方法。当其他对象使用 `instanceof` 运算符，判断是否为该对象的实例时，会调用这个方法。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass(); // ==> true
// ==> MyClass[Symbol.hasInstance]([1, 2, 3])
```

## 5. Symbol.isConcatSpreadable
`Symbol.isConcatSpreadable` 属性等于一个布尔值，表示该对象用于 `Array.prototype.concat()` 时，是否可以展开。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
// 数组默认展开
let arr = [1, 2];
[].concat(arr, 3); // ==> [1, 2, 3]

arr[Symbol.isConcatSpreadable] = false;
[].concat(arr, 3); // ==> [Array(2), 3]

// 对象默认不展开
let obj = {0: 'a', 1: 'b', length: 2};
[].concat(obj, 'c'); // ==> [{…}, "c"]

obj[Symbol.isConcatSpreadable] = true;
[].concat(obj, 'c'); // ==> ["a", "b", "c"]
```

## 6. Symbol.species
`Symbol.species` 属性，指向一个构造函数。创建衍生对象时，会使用该属性。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
class Arr1 extends Array {
  // 默认
  static get [Symbol.species]() {return this;}
}
class Arr2 extends Array {
  static get [Symbol.species]() {return Array;}
}

let arr1 = (new Arr1(1, 2, 3)).filter(x => x > 1);
let arr2 = (new Arr2(1, 2, 3)).filter(x => x > 1);

arr1 instanceof Arr1; // ==> true
arr1 instanceof Array; // ==> true
arr2 instanceof Arr2; // ==> false
arr2 instanceof Array; // ==> true
```

## 7. Symbol.match
`Symbol.match` 指定了匹配的是正则表达式而不是字符串。`String.prototype.match()` 方法会调用此函数。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
let regexp = /Mr./;

'Mr.'.startsWith(regexp); // ==> Error

regexp[Symbol.match] = false;
'Mr.'.startsWith(regexp); // ==> false
```

## 8. Symbol.replace
`Symbol.replace` 这个属性指定了当一个字符串替换所匹配字符串时所调用的方法。`String.prototype.replace()` 方法会调用此方法。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
// String.prototype.replace(searchValue, replaceValue)
// 等同于
// searchValue[Symbol.replace](this, replaceValue)

let symbolReplace = {};
symbolReplace[Symbol.replace] = (...someArguments) => console.log(someArguments.join(' '));

'I\'m'.replace(symbolReplace, 'Mr.'); // ==> I'm Mr.
```

## 9. Symbol.search
`Symbol.search` 指定了一个搜索方法，这个方法接受用户输入的正则表达式，返回该正则表达式在字符串中匹配到的下标，这个方法由以下的方法来调用 `String.prototype.search()`。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 说明:
```js
// String.prototype.search(regexp)
// 等同于
// regexp[Symbol.search](this)
```

## 10. Symbol.split
`Symbol.split` 指向 一个正则表达式的索引处分割字符串的方法。 这个方法通过 `String.prototype.split()` 调用。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 说明:
```js
// String.prototype.split(separator, limit)
// 等同于
// separator[Symbol.split](this, limit)
```

## 11. Symbol.iterator
`Symbol.iterator` 为每一个对象定义了默认的迭代器。该迭代器可以被 `for...of` 循环使用。

当需要对一个对象进行迭代时（比如开始用于一个 `for..of` 循环中），它的 `@@iterator` 方法都会在不传参情况下被调用，返回的**迭代器**用于获取要迭代的值。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable] // [1, 2, 3]
```

## 12. Symbol.toPrimitive
`Symbol.toPrimitive` 是一个内置的 `Symbol` 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。

`Symbol.toPrimitive` 被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。
- `Number`：该场合需要转成数值
- `String`：该场合需要转成字符串
- `Default`：该场合可以转成数值，也可以转成字符串

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
let obj = {};

console.log(+obj); // ==> NaN
console.log(`${obj}`); // ==> [object Object]
console.log(obj + ''); // ==> [object Object]

obj[Symbol.toPrimitive] = function(hint) {
  if(hint == 'number') { return 18; }
  if(hint == 'string') { return 'I\'m Mr.'; }
  return 'ok, you are right...';
}

console.log(+obj); // ==> 18
console.log(`${obj}`); // ==> I'm Mr.
console.log(obj + ''); // ==> ok, you are right...
```

## 13. Symbol.toStringTag
`Symbol.toStringTag` 是一个内置 `symbol`，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

许多内置的 JavaScript 对象类型即便没有 `toStringTag` 属性，也能被 `toString()` 方法识别并返回特定的类型标签。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
// 带有友好默认
Object.prototype.toString.call('foo'); // ==> "[object String]"
Object.prototype.toString.call([1, 2]); // ==> "[object Array]"
Object.prototype.toString.call(3); // ==> "[object Number]"
Object.prototype.toString.call(true); // ==> "[object Boolean]"
Object.prototype.toString.call(undefined); // ==> "[object Undefined]"
Object.prototype.toString.call(null); // ==> "[object Null]"
// ... and more

// 引擎友好默认
Object.prototype.toString.call(new Map()) // ==> "[object Map]"
Object.prototype.toString.call(function* () {}); // ==> "[object GeneratorFunction]"
Object.prototype.toString.call(Promise.resolve()); // ==> "[object Promise]"
// ... and more

// 自定义创建的类
class User {}

Object.prototype.toString.call(new User()); // ==> "[object Object]"

class NewUser {
  get [Symbol.toStringTag]() { return 'NewUser'; }
}
Object.prototype.toString.call(new NewUser()); // ==> "[object NewUser]"
```

## 14. Symbol.unscopables
`Symbol.unscopables` 属性，指向一个对象。该对象指定了使用 `with` 关键字时，哪些属性会被with环境排除。

#### 属性特性:
特性 | default
-- | --
writable | false
enumerable | false
configurable | false

#### 例子:
```js
let obj = {
  name: 'Mr.',
  age: '18',
}

with(obj) {
  console.log(name); // ==> 'Mr.'
  console.log(age); // ==> '18'
}

obj[Symbol.unscopables] = {
  name: false,
  age: true,
}

with(obj) {
  console.log(name); // ==> 'Mr.'
  console.log(age); // ==> ReferenceError: age is not defined
}
```