# Iterator

## 1. Iterator
`Iterator` 是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署了 `Iterator` 接口，就可以完成遍历操作。

**注意**: 高版本浏览器已不再支持手动创建(Chrome 77 直接全局调用 `Iterator` 会报错)。

#### 语法:
```js
Iterator(object[, keyOnly]);
```

#### 参数:
`object`: 
要迭代属性的对象。

`keyOnly`: 
如果 `keyOnly` 是真值，`Iterator.prototype.next` 只返回 `property_name`。

#### 例子:
```js
let obj = {
  name: 'Mr.',
  age: 18,
  address: 'China',
};

let iterator = Iterator(obj);

console.log(iterator.next()); // ==> ['name': 'Mr.']
console.log(iterator.next()); // ==> ['age': 18]
console.log(iterator.next()); // ==> ['address': 'China']
console.log(iterator.next()); // ==> throws StopIteration
```

## 2. for...of
`for...of` 语句在可迭代对象上创建一个迭代循环，调用自定义的迭代钩子，并为每个不同属性的值执行语句。

一个数据结构只要部署了 `Symbol.iterator` 属性，就被是为具有 `iterator` 接口，就可以用 `for...of` 循环进行遍历，也就是说，`for...of` 内部调用的是数据结构的 `Symbol.iterator` 方法。

可迭代对象包括 `Array`, `Map`, `Set`, `String`, `TypeArray`, `arguments`等。

#### 语法:
```js
for(variable of iterable) {
  // statements
}
```

#### 参数:
`variable`: 
在每次迭代中，将不同属性的值分配给变量。

`iterable`: 
该迭代枚举其属性的对象。

#### 例子:
```js
// Array
let arr = [1, 2, 3];

for(let value of arr) {
  value = value * 10;
  console.log(value);
}
// ==> 10 20 30

// String
let str = 'Mr.';

for(let value of str) {
  console.log(value);
}
// ==> 'M' 'r'  '.'

// Map
let map = new Map([['name', 'Mr.'], ['age', 18]]);
for(let value of map) {
  console.log(value);
}
// ==> ['name', 'Mr.']
// ==> ['age', 18]
```
