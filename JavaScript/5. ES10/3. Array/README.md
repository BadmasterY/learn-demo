# Array

## 1. Array.prototype.flat()
`Array.prototype.flat` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

#### 语法:
```js
let newArr = arr.flat([depth]);
```

#### 参数:
`depth`: 
**可选**，指定要提取嵌套数组的结构深度，默认值为 1。

#### 返回值:
一个包含数组与子数组中所有元素的新数组。

#### 例子:
```js
let arr = [1, [2, [3, [4]]]];
let newArr = arr.flat(Infinity);

console.log(newArr); // ==> [1, 2, 3, 4]
```

## 2. Array.prototype.flatMap()
`Array.prototype.flatMap` 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 `map` 连着深度值为 1 的 `flat` 几乎相同，但 `flatMap` 通常在合并成一种方法的效率稍微高一些。

#### 语法:
```js
let newArr = arr.flatMap(function callbak(currentValue[, index[, array]]){
  // 新数组的返回元素
}[, thisArg]);
```

#### 参数:
`callback`: 
可以生成一个新数组中的元素的函数，可以传入三个参数:
- `currentValue`: 当前正在数组中处理的元素。
- `index`: **可选**，数组中正在处理的当前元素的索引。
- `array`: **可选**，被调用的 `map` 数组。

`thisArg`: 
**可选**，执行 `callback` 函数时使用的 `this` 值。

#### 返回值:
一个新的数组，其中每个元素都是回调函数的结果，并且结构深度 `depth` 值为 1。

#### 例子:
```js
let arr = [1, 2, 3];

arr.flatMap(x => [x * 2]); // ==> [2, 4, 6]
arr.flatMap(x => [[x * 2]]); // ==> [[2], [4], [6]]
```