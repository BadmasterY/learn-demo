# 对象
`Object`是 JavaScript 最重要的数据结构,`Object` 构造函数创建一个对象包装器。

## 1. 对象的扩展
### 1). 属性
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。

```js
let name = 'Mr.';

let human = {
  name, // ==> name: name
  age: '18',
  address: 'China / beijing',
  hello() {console.log(`my name is: ${this.name}`);} // ==> hello: function(){...}
}
```

### 2). 属性名表达式
JavaScript 定义对象的属性，有两种方法:
- 标识符
- 表达式

```js
let obj = {};

// 标识符
obj.a = true;

// 表达式
obj.['b'] = false;
```

ES5，JavaScript 中使用字面量定义对象只能使用大括号的形式，ES6 新增表达式形式:
```js
// ES5
let obj = {
  a: true,
  b: false
};

// ES6
let a = 'name';
let b = 'hello';
let human = {
  [a]: 'Mr.',
  age: '18',
  [b]() {console.log(`Hello!`)}
}

console.log(human); // ==> {name: 'Mr.', age: '18', hello: f}
```

### 3). 枚举和遍历

#### ① 可枚举性
对象的每个属性都有一个描述对象(Descriptor)，用来控制该属性的行为。`Object.getOwnPropertyDescriptor` 方法可以获取该属性的描述对象。

```js
let obj = {name: 'Mr.'};

Object.getOwnPropertyDescriptor(obj, 'name'); // ==> {configurable: true,
enumerable: true,
value: "Mr.",
writable: true}
```

描述对象的 enumerable 属性，称为'可枚举性'，如果该属性为 `false`，就表示某些操作会忽略当前属性。

有三个操作会忽略 `enumerable` 为 `false` 的属性:
- `for...in` 循环: 只会遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`: 返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`: 只串行化对象自身的可枚举的属性。

其中只有 `for...in` 会返回继承的属性。

引入'可枚举'这个概念最初的目的，就是让某些属性可以规避掉 for...in 操作，不然所有内部属性和方法都会被遍历到。

#### ② 遍历
ES6 一共有五种方法可以遍历对象的属性。

- `for...in`: 遍历对象自身的和继承的可枚举属性(不含 `Symbol` 属性)。
- `Object.keys(obj)`: 返回一个数组，包括对象自身的所有可枚举属性(不含 `Symbol` 属性)的键名。
- `Object.getOwnPropertyNames(obj)`: 返回一个数组，包含对象自身的所有属性(不含 `Symbol` 属性，但是包含不可枚举的属性)的键名。
- `Object.getOwnPropertySymbols(obj)`: 返回一个数组，包含对象自身的所有 `Symbol` 属性的键名。
- `Reflect.ownKeys(obj)`: 返回一个数组，包含对象自身的所有键名，不管键名是 `Symbol` 或字符串，也不管是否可枚举。

以上的五种方法遍历对象的键名，都遵守同样的实行遍历的次序规则:
- 首先遍历所有的数值键，按照数值升序排列。
- 其次遍历所有的字符串键，按照加入时间升序排列。
- 最后遍历所有的 Symbol 键，按照加入时间升序排列。


### 4). super
`super` 关键字指向当前对象的原型对象。

`super` 关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。

```js
let parent = {
  sayHi(){
    return 'hello from parent';
  }
}

let child = {
  sayHi(){
    return 'hello from child';
  },
  greetings(){
    return super.sayHi();
  },
  // 以下方法均会报错
  // super 需要在对象的方法
  // greetings: super.sayHi,
  // greetings: () => super.sayHi(),
  // greetings: function(){return super.sayHi();},
}

Object.setPrototypeOf(child, parent);
child.greetings();
```

## 2. 对象方法
### 1). Object.is()
`Object.is()` 方法判断两个值是否是相同的值。如果下列任何一项成立，则两个值相同:
- 两个值都是 `undefined`
- 两个值都是 `null`
- 两个值都是 `true` 或者都是 `false`
- 两个值是由**相同个数**的字符串按照**相同顺序**组成的字符串
- 两个值指向同一个对象
- 两个值都是数字并且
  - 都是正零 +0
  - 都是负零 -0
  - 都是 NaN
  - 都是除零和 NaN 外的其它同一个数字

与传统 `==` 不同，不会进行隐式转换，同时与 `===` 也并不太相同。

#### 语法:
```js
Object.is(value1, value2);
```

#### 参数:
`value1`: 
第一个需要比较的值。

`value2`: 
第二个需要比较的值。

#### 返回值:
布尔值，表示两个参数是否相等。

#### 例子:
```js
Object.is('Mr.', 'Mr.'); // ==> true
Object.is('', false); // ==> false
Object.is(NaN, NaN); // ==> true
Object.is({}, {}); // ==> false
```

### 2). Object.assign()
`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回目标对象。

如果目标对象中的属性具备相同的键，则属性将被对象中的属性覆盖，同理，后面的源对象也会覆盖前面源对象具备相同键的值。

只会拷贝源对象自身的并且可枚举的属性到目标对象。该方法使用源对象的 `[[Get]]` 和目标对象的 `[[Set]]`，所以它会调用相关 `getter` 和 `setter`。因此，`Object.assign()` 分配属性，而不仅仅是复制或定义新的属性。

不会在那些源对象值为 `null` 或 `undefined` 的时候抛出错误，但是会忽略。

**注意**:
- 浅拷贝
- 同名属性覆盖
- 数组处理方式
- 取值函数的处理

#### 语法:
```js
Object.assign(target, ...sources);
```

#### 参数:
`target`: 
目标对象。

`sources`: 
源对象，可以是多个。

#### 返回值:
目标对象。

#### 例子:
```js
let source = {name: 'Mr.'};
let target = Object.assign({age: '18'}, source);

console.log(target); // ==> {age: '18', name: 'Mr.'}
```

### 3). Object.setPrototypeOf()
`Object.setPrototypeOf()` 方法设置一个指定对象的原型(即，内部 `[[Prototype]]` 属性)到另一个对象或 `null`。

如果新原型的参数不是一个对象或 `null`，则什么也不做。

#### 语法:
```js
Object.setPrototypeOf(obj, prototype);
```

#### 参数:
`obj`: 
要设置其原型的对象。

`prototype`: 
该对象的新原型(一个对象或者 `null`)。

#### 例子:
```js
let obj = {name: 'Mr.'};
let proto = {};

Object.setPrototypeOf(obj, proto);
proto.age = '18';

obj.age; // ==> '18'
```

### 4). Object.getPrototyeOf()
`Object.getPrototypeOf()` 方法返回指定对象的原型。

#### 语法:
```js
Object.getPrototypeOf(object);
```

#### 参数:
`object`: 
要返回其原型的对象。

#### 返回值:
给定对象的原型，如果没有继承属性，则返回 `null`。

#### 例子:
```js
function protoFn(){};
let obj = new protoFn();

Object.getPrototypeOf(obj) === protoFn.prototype; // ==> true
```