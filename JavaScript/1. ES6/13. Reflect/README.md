# Reflect
`Reflect` 是一个内置对象，主要用于修正 `Object` 的部分方法、方法返回值、操作函数化和保留原方法的默认行为(当有 `Proxy` 进行修改默认行为时，依旧保持默认形式，不会被污染)。

`Reflect` 并不是一个构造函数，所以不能使用 `new`。

`Proxy` 上可以修改的方法在 `Reflect` 中都是存在的。

## 1. Reflect.get()
`Reflect.get` 方法查找并返回 `target` 对象的 `name` 属性，如果没有该属性，则返回 `undefined`。

#### 语法:
```js
Reflect.get(target, propertyKey[, receiver]);
```

#### 参数
`target`: 
目标对象

`propertyKey`: 
需要取值的键名。

`receiver`: 
如果 `target` 对象中指定了 `getter`，`receiver` 则为 `getter` 调用时的 `this` 值。

#### 返回值:
对应键名的值。

#### 异常:
如果目标值类型不是 `Object`，则抛出一个 `TypeError`。

#### 例子:
```js
let obj = {name: 'Mr.', age: 18, get hey(){console.log(`${this.name} age: ${this.age}...`)}};
let arr = ['Mr.', 18];

Reflect.get(obj, 'name'); // ==> 'Mr.'
Reflect.get(arr, 1); // ==> 18
Reflect.get(obj, 'hey', {name: 'Me', age: 3}); // ==> 'Me age 3...'
```

## 2. Reflect.set()
`Reflect.set` 方法设置 `target` 对象的 `name` 属性的值。

#### 语法:
```js
Reflect.set(target, propertyKey, value[, receiver]);
```

#### 参数:
`target`: 
目标对象。

`propertyKey`: 
需要设置值的属性。

`value`: 
设置的值。

`receiver`: 
如果 `target` 对象中指定了 `setter`，`receiver` 则为 `setter` 调用时的 `this` 值。

#### 返回值:
返回一个 `Boolean` 值表明是否成功设置属性。

#### 异常:
如果目标不是 `Object`，抛出 `TypeError` 异常。

#### 例子:
```js
let obj = {set address(value){return this.address = value;}};
let receiver = {};
let arr = [];

Reflect.set(obj, 'name', 'Mr.');
Reflect.set(obj, 'address', 'China', receiver);
Reflect.set(arr, '0', 'Mr.');

console.log(obj.name); // ==> 'Mr.'
console.log(obj.address); // ==> undefined
console.log(receiver.address); // ==> 'China'
console.log(arr[0]); // ==> 'Mr.'
```

## 3. Reflect.has()
`Reflect.has` 方法与 in 操作符效果一致(`name in obj`)。

#### 语法:
```js
Reflect.has(target, propertyKey);
```

#### 参数:
`target`: 
目标对象。

`propertyKey`: 
属性名，用来检测目标对象是否存在此属性。

#### 返回值:
返回一个 `Boolean`。如果目标对象存在被检测的属性名返回 `true`，否则返回 `false`。

#### 异常:
如果目标对象不是 `Object` 类型，抛出 `TypeError`。

#### 例子:
```js
let obj = {name: 'Mr.'};

Reflect.has(obj, 'name'); // ==> true
Reflect.has(obj, 'age'); // ==> false
Reflect.has(obj, 'toString'); // ==> true，会检测原型链
```

## 4. Reflect.deleteProperty()
`Reflect.deleteProperty` 方法用于删除对象的属性，等同于 `delete obj[name]`。

#### 语法:
```js
Reflect.deleteProperty(target, propertyKey);
```

#### 参数:
`target`:
目标对象。

`propertyKey`:
需要删除的属性的名称。

#### 返回值:
返回一个 `Boolean`。如果该属性被成功删除返回 `true`，否则返回 `false`。

#### 异常:
如果目标对象不是 `Object` 类型，抛出一个 `TypeError` 异常。

#### 例子:
```js
let obj = {name: 'Mr.', age: 18};
let arr = ['Mr.', 18];

Reflect.deleteProperty(obj, 'age'); // ==> true
Reflect.deleteProperty(arr, '1'); // ==> true

console.log(obj); // ==> {name: 'Mr.'}
console.log(arr); // ==> ['Mr.', empty]

Reflect.deleteProperty(obj, 'age'); // ==> true，如果属性不存在也是返回 true
```

## 5. Reflect.construct()
`Reflect.construct` 方法等同于 `new target(..args)`，这是一种不使用 `new` 来调用构造函数的方法。

#### 语法:
```js
Reflect.construct(target, argumentsList[, newTarget]);
```

#### 参数:
`target`: 
目标构造函数。

`argumentsList`: 
类数组，目标构造函数调用时的参数。

`newTarget`: 
可选，新创建对象的原型对象，默认为 `target`。

#### 返回值:
一个以 `target`(如果有 `newTarget` 那就是 `newTarget`)函数为构造函数，`argumentsList` 为其初始化参数的对象实例。

#### 异常:
如果 `target` 或 `newTarget` 不是构造函数，抛出 `TypeError`。

#### 例子:
```js
function fn_1(){ this.name = 'Mr.'; }
function fn_2(){ this.name = 'Javascript'; }

let obj_1 = Reflect.construct(fn_1, []);
let obj_2 = Reflect.construct(fn_1, [], fn_2);

console.log(obj_1.name); // ==> 'Mr.'
console.log(obj_2.name); // ==> 'Mr.'

console.log(obj_1 instanceof fn_1); // ==> true
console.log(obj_2 instanceof fn_2); // ==> true
```

## 6. Reflect.getPrototypeOf()
`Reflect.getPrototypeOf` 方法与 `Object.getPrototypeOf()` 方法一样，都是返回指定对象的原型 `[[Prototype]]`。

#### 语法:
```js
Reflect.getPrototypeOf(target);
```

#### 参数:
`target`: 
目标对象。

#### 返回值: 
目标对象的原型。如果没有继承的属性，返回 `null`。

#### 异常:
如果目标对象不是 `Object`，则抛出 `TypeError`。

#### 例子:
```js
Reflect.getPrototypeOf({}); // ==> Object.prototype
Reflect.getPrototypeOf(Object.prototype); // ==> null
Reflect.getPrototypeOf(Object.create(null)); // ==> null
```

## 7. Reflect.setPrototypeOf()
`Reflect.setPrototypeOf` 方法与 `Object.setPrototypeOf()` 方法一致，用来设置目标对象的原型 `[[Prototype]]`。

#### 语法:
```js
Reflect.setPrototypeOf(target, prototype);
```

#### 参数:
`target`: 
目标对象。

`prototype`: 
对象的新原型(一个对象或 `null`)。

#### 返回值:
返回一个 `Boolean`，如果设置成功返回 `true`，否则返回 `false`。

#### 异常:
如果目标对象不是 `Object`，或者新的原型不是一个对象或者 `null`，抛出 `TypeError`。

#### 例子:
```js
Reflect.setPrototypeOf({}, Object.prototype); // ==> true

let target = {};
let proto = Object.create(target);
Reflect.setPrototypeOf(target, proto); // ==> false，原型链循环
```

## 8. Reflect.apply()
`Reflect.apply` 方法等同于 `Function.prototype.apply.call()` 通过指定的参数列表发起对目标函数的调用。

#### 语法:
```js
Reflect.apply(target, thisArgument, argumentsList);
```

#### 参数:
`target`: 
目标对象。

`thisArgument`: 
`target` 函数调用时绑定的 `this` 对象。

`argumentsList`: 
`target` 函数调用时传入的实参列表，该参数应该是一个类数组对象。

#### 返回值:
返回值是调用完带着指定参数和 `this` 值的给定函数后返回的结果。

#### 异常:
如果 `target` 对象不可调用，抛出 `TypeError`。

#### 例子:
```js
Reflect.apply(Math.floor, undefined, [1.75]); // ==> 1
Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]); // ==> 'hello'
```

## 9. Reflect.defineProperty()
`Reflect.defineProperty` 方法与 `Object.defineProperty()` 方法基本一致，用来为对象定义属性，唯一**不同**的是返回 `Boolean` 值。

#### 语法:
```js
Reflect.defineProperty(target, propertyKey, attributes);
```

#### 参数:
`target`: 
目标对象。

`propertyKey`: 
要定义或修改的属性的名称。

`atrributes`: 
要定义或修改的属性的描述。

#### 返回值:
`Boolean` 值指示了属性是否被成功定义。

#### 异常:
如果 `target` 不是 `Object`，抛出一个 `TypeError`。

#### 例子:
```js
let obj = {};
Reflect.defineProperty(obj, 'name', {value: 'Mr.'}); // ==> true
obj.name; // ==> 'Mr.'
```

## 10. Reflect.getOwnPropertyDescriptor()
`Reflect.getOwnPropertyDescriptor` 方法与 `Object.getOwnPropertyDescriptor()` 方法类似。如果在对象中存在，则返回给定的属性的属性描述符，否则返回 `undefined`。

#### 语法:
```js
Reflect.getOwnPropertyDescriptor(target, propertyKey);
```

#### 参数:
`target`: 
目标对象。

`propertyKey`: 
需要获取属性描述的属性名称。

#### 返回值:
返回 `Boolean`，如果属性存在于给定的目标对象中，则返回属性描述符，否则返回 `undefined`。

#### 异常:
如果目标对象不是 `Object`，抛出 `TypeError`。

#### 例子:
```js
let obj = {name: 'Mr.'};

Reflect.getOwnPropertyDescriptor(obj, 'name'); // ==> {value: 'Mr.', writable: true, enumerable: true, configurable: true}
Reflect.getOwnPropertyDescriptor(obj, 'age'); // ==> undefined
```

## 11. Reflect.isExtensible()
`Reflect.isExtensible` 方法与 `Object.isExtensible()` 方法类似。用来判断一个对象是否可扩展(即是否能够添加新的属性)。

#### 语法:
```js
Reflect.isExtensible(target);
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
返回 `Boolean`，如果对象可扩展，返回 `true`，否则返回 `false`。

#### 异常:
如果目标对象不是 `Object`，抛出一个 `TypeError`。

#### 例子:
```js
let obj = {};
Reflect.isExtensible(obj); // ==> true

obj = Object.freeze({});
Reflect.isExtensible(obj); // ==> false
```

## 12. Reflect.preventExtensions()
`Reflect.preventExtensions` 方法与 `Object.preventExtensions()` 方法类似，用于将一个对象变为不可扩展。

#### 语法:
```js
Reflect.preventExtensions(target);
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
返回 `Boolean`，如果对象被成功设置为不可扩展，返回 `true`，否则返回 `false`。

#### 异常:
如果 `target` 不是 `Object`，抛出 `TypeError`。

#### 例子:
```js
let obj = {};
Reflect.isExtensible(obj); // ==> true

Reflect.preventExtensions(obj);
Reflect.isExtensible(obj); // ==> false
```

## 13. Reflect.ownKeys()
`Reflect.ownKeys` 方法类似于 `Object.getOwnPropertyNames()` 与 `Object.getOwnPropertySymbols()` 之和。用于返回一个由目标对象自身的属性键组成的数组。

#### 语法:
```js
Reflect.ownKeys(target);
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
由目标对象的自身属性键组成的 `Array`。

#### 异常:
如果 `target` 不是 `Object`，抛出 `TypeError`。

#### 例子:
```js
let obj = {name: 'Mr.', age: 18};
let arr = ['Mr.', 18];

Reflect.ownKeys(obj); // ==> ['name', 'age']
Reflect.ownKeys(arr); // ==> ['0', '1', 'length']
```