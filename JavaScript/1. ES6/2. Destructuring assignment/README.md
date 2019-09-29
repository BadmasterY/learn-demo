# 解构赋值
解构赋值语法是一种 Javascript 表达式。通过解构赋值, 可以将属性/值从对象/数组中取出,赋值给其他变量。

## 数组
### 可以从数组中提取值，按照对应位置，对变量赋值:
```javascript
let [a, b, c] = [1, 2, 3];
a // ==> 1
b // ==> 2
c // ==> 3
```
### 只要等号两边的模式相同，左边的变量就会被赋予对应的值:
```javascript
let [a, ...b] = [1, 2, 3];
a // ==> 1
b // ==> [2, 3]

let [c, [d], e] = [4, [5], 6];
c // ==> 4
d // ==> 5
e // ==> 6

let [,, f] = [7, 8, 9];
f // ==> 9
```

### 如果没能成功匹配，变量等于 `undefined`:
```javascript
let [a] = [];
let [b, ...c] = [1];

a // ==> undefined
b // ==> 1
c // ==> []
```

### 上面都是在声明时就进行赋值，也可以先声明，再赋值：
```javascript
let a,b;

[a, b] = [1, 2];

a // ==> 1
b // ==> 2
```

### 为了防止从数组中取出一个值为 `undefined` 的对象，可以在表达式左边的数组中为任意对象预设默认值：
```javascript
let [a = 2, b = 3] = [1];

a // ==> 1
b // ==> 3
```

### 解构赋值的可以快速的交换两个变量：
```javascript
let a = 1;
let b = 2;

[a, b] = [b, a];

a // ==> 2
b // ==> 1
```

### 解析函数返回值:
```javascript
function fn(){
  return [1, 2];
}

let [a, b] = fn();

a // ==> 1
b // ==> 2
```

## 对象
### 对象结构与数组类似：
```javascript
let obj = {a: 1, b: 2};

let {a, b} = obj;

a // ==> 1
b // ==> 2
```

### 无声明赋值
```javascript
let a, b;

({a, b} = {a: 1, b: 2});
```

**注意**：赋值语句周围的圆括号 `(...)` 在使用对象字面量无声明解构赋值时是必须的。`{a, b} = {a: 1, b: 2}` 不是有效的独立语法，因为左边的 `{a, b}` 被认为是一个块而不是对象字面量。然而，`({a, b} = {a: 1, b: 2})` 是有效的，正如 `let {a, b} = {a: 1, b: 2}`。`(...)` 表达式之前需要有一个分号，否则它可能会被当成上一行中的函数执行。

### 给新的变量名赋值
可以从一个对象中提取变量并赋值给和对象属性名不同的新的变量名。
```javascript
let obj = {a: 1, b: 2};
let {a: c, b: d} = obj;

a // ==> ReferenceError: a is not defined
b // ==> ReferenceError: b is not defined
c // ==> 1
d // ==> 2
```

### 默认值
变量可以先赋予默认值。当要提取的对象没有对应的属性，变量就被赋予默认值。
```javascript
let {a = 1, b = 2, c} = {a: 3};

a // ==> 3
b // ==> 2
c // ==> undefined
```

### 给新的变量命名并提供默认值
一个属性可以同时从一个对象解构，并分配给一个不同名称的变量分配一个默认值，以防未解构的值是 `undefined`。
```javascript
let {a: aa = 1, b: bb = 2} = {a: 3};

a // ==> ReferenceError: a is not defined
b // ==> ReferenceError: b is not defined
aa // ==> 3
bb // ==> 2
```

## 字符串
也是类似的:
```javascript
let [a, b, c, d, e] = 'hello';

a // ==> 'h'
b // ==> 'e'
c // ==> 'l'
d // ==> 'l'
e // ==> 'o'
```

同时，字符串和数组有一个length对象，可以通过解构赋值快速获取：
```javascript
let {length} = 'hello';

length // ==> 5
```

## 函数参数
参考下列代码：
```javascript
// ES5
function draw(options){
  options = options === undefined ? {} : options;
  var size = options.size === undefined ? 'big' : options.size;
  var cords = options.cords === undefined ? {x: 0, y: 0} : options.cords;
  var radius = options.radius === undefined ? 25 : options.radius;
  console.log(size, cords, radius);
}

// ES6
function draw({size = 'big', cords = {x: 0, y: 0}, radius = 25} = {}) {
  console.log(size, cords, radius);
}

draw({
  cords: {x: 15, y: 15},
  radius: 30
});
```