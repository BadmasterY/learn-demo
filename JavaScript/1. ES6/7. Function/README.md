# 函数(Function)
`Function` **构造函数**创建一个新的 Function 对象。 在 JavaScript 中, 每个函数实际上都是一个 `Function 对象`。

## 1. 函数参数的默认值:
ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面:
```javascript
// 默认值只会检测输入是否为 undefined
// 同时,具备默认值的参数需要放在没有默认值的参数后面
// Error: function f(x = 'haha', y ){...}
// f(, 'Mr.'); ==> 报错
function log(x, y = 'haha') {
  console.log(x, y);
}

log(); // ==> undefined haha
log('wa'); // ==> wa haha
log('wa', ''); // ==> wa
```

## 2. 函数参数的解构赋值:
与第二篇的解构赋值类型一致,结合默认值示例如下:
```javascript
function foo({x = 1, y = 2} = {}) {
  console.log(x, y);
}

foo({}); // ==> 1 2
foo({x: 2}); // ==> 2 2
foo(); // ==> 1 2
```

## 3. 函数的 length 属性:
函数的 `length` 属性，将返回没有指定默认值的参数个数。但是指定参数默认值之后,参数及之后的所有参数将不被 `length` 捕获,`length` 失真:
```javascript
(function (a, b){}).length; // ==> 2
(function (a = 1, b){}).length; // ==> 0
```

## 4. 函数的 rest 参数:
ES6 引入 `rest` 参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用 `arguments` 对象了。`rest` 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
```javascript
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(1,2,3,4,5); // ==> 15
```

## 5. name 属性:
函数的name属性，返回该函数的函数名。

如果将一个匿名函数赋值给一个变量，ES6 的 `name` 属性会返回实际的函数名。

`bind` 返回的函数，`name` 属性值会加上 `bound` 前缀。
```javascript
var a = function() {};

a.name; // ES5 ==> ''
a.name; // ES6 ==> 'a'

var b = function fun() {};

b.name; // ES5 ==> 'fun'
b.name; // ES6 ==> 'fun'

a.bind({}).name; // ==> 'bound '
b.bind({}).name; // ==> 'bound fun'
```

## 6. 箭头函数:
ES6 允许使用"箭头"(`=>`)定义函数。

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用 `return` 语句返回。
```javascript
let a = num => num;
// ES5写法
var a = function(num) {
  return num;
}

let b = (num1, num2) => num1 + num2;
//ES5写法
var b = function(num1, num2) {
  return num1 + num2;
}

let c = (num1, num2) => {
  let temp = num1 + num2;
  return temp;
}
```

**注意事项**:
- 函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象，同时 `this` 指向无法改变。
- 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误。
- 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替。
- 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数。
