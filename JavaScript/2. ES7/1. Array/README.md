# Array
## 1. Array.prototype.includes()
`Array.prototype.includes` 方法用来判断一个数组是否包含一个指定的值。

技术上来说，`includes` 方法使用 `sameValueZero` 算法来确定是否找到给定的值，与 `===` 最大的区别是，`includes` 可以比较 `NaN`。

**注意**: 对象数组不能使用 `includes` 方法来检测。

#### 语法:
```js
arr.includes(valueToFind[, fromIndex]);
```

#### 参数:
`valueToFind`: 
需要查找的元素值。在比较字符串和字符时，区分大小写。

`fromIndex`: 
可选，从 `fromIndex` 索引处开始查找 `valueToFind`。如果为负值，则按升序从 `array.length + fromIndex` 的索引开始搜索(如果依旧为负值，遍历整个数组)。默认为 0。

#### 返回值:
返回 `Boolean`，如果在数组中找到了，则返回 `true`，否则为 `false`。

#### 例子:
```js
let arr = [1, 2, 3, NaN];

arr.includes(1); // ==> true
arr.includes(4); // ==> false
arr.includes(2, -3); // ==> true
arr.includes(2, -2); // ==> false
arr.includes(2, -100); // ==> true
arr.includes(NaN); // ==> true
```