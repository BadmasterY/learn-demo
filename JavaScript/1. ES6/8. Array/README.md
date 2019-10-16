# 数组
数组对象是一个有序的数据（数据可以是 `原始类型` 或 `对象类型`）集合。相对于变量，数组可用于在一个变量中存储多个变量值。

数组中的每一项都有一个数字附于其上，被称为索引。数组索引从 0 开始，并可以使用多种方法操作。

## 1. 扩展运算符
扩展运算符(`spread`)是三个点(`...`)。它好比 `rest` 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

只有函数调用时，扩展运算符才可以放在圆括号中。

```js
console.log(...[1, 2, 3]); // ==> 1 2 3

let x = 0;
let arr = [
  ...(x > 0 ? ['a'] : []),
  'b'
];

arr; // ==> ['b']
```

## 2. Array.from()
`Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。

#### 语法:
```js
Array.from(arrayLike[, mapFn[, thisArg]]);
```

#### 参数:
`arrayLike`: 
想要转化为数组的伪数组对象或可迭代对象。

`mapFn`: 
**可选**,新数组中的每个元素会执行该回调函数。

`thisArg`: 
**可选**,执行回调函数 mapFn 时 this 对象。

#### 返回值:
一个新的数组实例。

#### 例子:
```js
Array.from('foo'); // ==> ['f', 'o', 'o']
Array.from({'0':1, '1': 2, 'length': 2}); // ==> [1, 2]
```

## 3. Array.of()
`Array.of()` 方法创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。

#### 语法:
```js
Array.of(element0[, element1[, elementN]]);
```

#### 参数:
`elementN`: 
任意个参数,将按顺序成为返回数组中的元素。

#### 返回值:
新的 `Array` 实例。

#### 例子:
```js
Array(3); // ==> [ , , ]
Array.of(3); // ==> [3]
```

## 4. Array.prototype.copyWithin()
`copyWithin()` 方法浅复制数组的一部分到同一数组中的另一个位置(会覆盖原有成员)，并返回它，不会改变原数组的长度，但是会改变原数组。

#### 语法:
```js
arr.copyWithin(target[, start[, end]]);
```

#### 参数:
`target`: 
从该位置开始(从前向后)替换数据。如果为负值，表示倒数(由后向前)。必须为整数。

`start`: 
**可选**,从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。必须为整数。

`end`: 
**可选**,到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。必须为整数。

#### 返回值:
改变后的数组。

#### 例子:
```js
let numbers = [1, 2, 3, 4, 5];

numbers.copyWithin(-2); // ==> [1, 2, 3, 1, 2]
numbers.copyWithin(0, 3); // ==> [1, 2, 3, 1, 2]
numbers.copyWithin(0, 2, 4); // ==> [3, 1, 3, 1, 2]
```

## 5. Array.prototype.find()
`find()` 方法，用于找出第一个符合条件的数组成员。方法不会改变数组。

#### 语法:
```js
arr.find(callback[, thisArg]);
```

#### 参数:
`callback`: 
在数组每一项上执行的函数，接收 3 个参数：
- `element`: 当前遍历到的元素
- `index`: 可选,当前遍历到的索引
- `arry`: 可选,调用 `find` 的数组

`thisArg`: 
**可选**,执行回调时用作 `this` 的对象。

#### 返回值:
数组中第一个满足所提供测试函数的元素的值，否则返回  `undefined`。

#### 例子:
```js
let arr = [
  {name: 'Mr.', age: '18'},
  {name: 'Jack', age: '20'},
  {name: 'ming', age: '17'}
];

function findMr(element, index) {
  return element.name === 'Mr.';
}

console.log(arr.find(findMr)); // ==> {name: 'Mr.', age: '18'}
```

## 6. Array.prototype.findIndex()
`findIndex()` 方法返回数组中满足提供的测试函数的第一个元素的索引。

#### 语法:
```js
arr.findIndex(callback[, thisArg]);
```

#### 参数:
`callback`: 
针对数组中的每个元素, 都会执行该回调函数, 执行时会自动传入下面三个参数:
- `element`: 当前元素
- `index`: 可选,当前元素索引
- `array`: 可选,调用 `findIndex` 的数组

`thisArg`: 
**可选**,执行 `callback` 时作为 `this` 对象的值。

#### 返回值:
数组中通过提供测试函数的第一个元素的`索引`。否则，返回 `-1`。

#### 例子:
```js
let arr = [
  {name: 'Mr.', age: '18'},
  {name: 'Jack', age: '20'},
  {name: 'ming', age: '17'}
];

function findMr(element, index) {
  return element.name === 'Mr.';
}

console.log(arr.findIndex(findMr)); // ==> 0
```

## 7. Array.prototype.fill()
`fill()` 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

#### 语法:
```js
arr.fill(value[, start[, end]]);
```
#### 参数:
`value`: 
用来填充数组元素的值。

`start`: 
**可选**,起始索引,默认为0。

`end`: 
**可选**,终止索引,默认为 `this.length`。

#### 返回值:
修改后的数组。

#### 例子:
```js
[1, 2, 3].fill(4); // ==> [4, 4, 4]
[1, 2, 3].fill(4, 1); // ==> [1, 4, 4]
[1, 2, 3].fill(4, 1, 2); // ==> [1, 4, 3]
[1, 2, 3].fill(4, 1, 1); // ==> [1, 2, 3]
```

## 8. Array,prototype.entries()
`entries()` 方法返回一个新的 `Array Iterator` 对象，该对象包含数组中每个**索引的键/值对**。

#### 语法:
```js
arr.entries();
```

#### 返回值:
一个新的 `Array` 迭代器对象。`Array Iterator` 是对象，它的原型(`__proto__:Array Iterator`)上有一个 `next` 方法，可用用于遍历迭代器取得原数组的 `[key, value]`。

#### 例子:
```js
let arr = [
  {name: 'Mr.', age: '18'},
  {name: 'Jack', age: '20'},
  {name: 'ming', age: '17'}
];

let iterator = arr.entries();
console.log(iterator.next().value); // ==> [0, {name: 'Mr.', age: '18'}]
console.log(iterator.next().value); // ==> [1, {name: 'Jack', age: '20'}]
console.log(iterator.next().value); // ==> [2, {name: 'ming', age: '17'}]
console.log(iterator.next().value); // ==> undefined
```

## 9. Array.prototype.keys()
`keys()` 方法返回一个包含数组中每个**索引键**的 `Array Iterator` 对象。

#### 语法:
```js
arr.keys();
```

#### 返回值:
一个新的 `Array` 迭代器对象。

#### 例子:
```js
let arr = [
  {name: 'Mr.', age: '18'},
  {name: 'Jack', age: '20'},
  {name: 'ming', age: '17'}
];

let iterator = arr.keys();
console.log(iterator.next().value); // ==> 0
console.log(iterator.next().value); // ==> 1
console.log(iterator.next().value); // ==> 2
console.log(iterator.next().value); // ==> undefined
```

## 10. Array.prototype.values()
`values()` 方法返回一个新的 `Array Iterator` 对象，该对象包含数组每个**索引的值**。

#### 语法:
```js
arr.values();
```

#### 返回值:
一个新的 `Array` 迭代器对象。

#### 例子:
```js
let arr = [
  {name: 'Mr.', age: '18'},
  {name: 'Jack', age: '20'},
  {name: 'ming', age: '17'}
];

let iterator = arr.values();
console.log(iterator.next().value); // ==> {name: 'Mr.', age: '18'}
console.log(iterator.next().value); // ==> {name: 'Jack', age: '20'}
console.log(iterator.next().value); // ==> {name: "ming", age: "17"}
console.log(iterator.next().value); // ==> undefined
```

## 11. Array.prototype.sort()
排序稳定性（stable sorting）是排序算法的重要属性，指的是排序关键字相同的项目，排序前后的顺序不变。

#### 语法:
```js
arr.sort([compareFunction]);
```

#### 参数:
`compareFunction`： 
**可选**,用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序。
- `firstEl`: 第一个用于比较的元素
- `secondEl`: 第二个用于比较的元素


#### 返回值:
排序后的数组。请注意，数组已原地排序，并且不进行复制。

#### 例子:
```js
let arr = [
  {name: 'Mr.', age: '18'},
  {name: 'Jack', age: '20'},
  {name: 'ming', age: '17'}
];

function compareFn(a, b) {
  if(a.name < b.name) return -1;
  return 1;
}

arr.sort(compareFn);
/*
==> [
  {name: 'Jack', age: '20'},
  {name: 'Mr.', age: '18'},
  {name: 'ming', age: '17'}
];
*/
```