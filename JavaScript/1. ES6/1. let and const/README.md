# Let and Const
-----
提到var,let,const三者的区别，不得不先提一下变量提升,作用域,即时函数与闭包。

## 变量提升
首先，众所周知的一件事，js的执行顺序是由上至下的。但这个顺序真的是按照书写的代码那样执行的么？看下列代码:

```javascript
console.log(a); // ==> undefined
var a = 100;

fn('Mr.'); // ==> name: Mr., age: 18
function fn(userName){
  var age = 18;
  console.log(`
    name: ${userName},
    age: ${age}
  `);	
}
```

很奇怪，变量 `a` 明明是在调用之后声明的，但是在调用 `console.log` 进行打印的时候，只抛出 `undefined`。而方法 `fn` 也是在代码声明之前调用的，同时方法并没有报错，抛出了正确的结果 `name: Mr., age: 18`。

因为在js引擎内实际执行顺序如下:

```javascript
function fn(userName){
  var age = 18;
  console.log(`
    name: ${userName},
    age: ${age}
  `);	
}
var a;

console.log(a);
a = 100;

fn('Mr.');
```

在变量赋值与函数调用之前，js引擎会将变量的声明提前与函数预解析。

补充一个 js 函数的探究，众所周知，js 的函数可以通过两种形式创建： 函数表达式,函数声明式。

```javascript
// 声明式
fn1('声明式'); // ==> '声明式'
function fn1(string){
  console.log(string);
}

// 表达式
fn2('表达式'); // ==> TypeError: fn2 is not a function
var fn2 = function(string){
  console.log(string);
}
```

声明式好解释，就是函数预解析，然后可以很轻松的执行代码。而表达式其实可以看成是变量：
```javascript
var fn2;
fn2('表达式'); // ==> TypeError: fn2 is not a function
fn2 = function(string){
  console.log(string);
}
```

## 作用域

再看一个例子:
```javascript
var a = 1;

fn(); // ===> undefined

function fn(){
  console.log(a);
  var a = 2;
}
```

由前两个例子可知，这里的实际执行顺序如下:
```javascript
function fn(){
  console.log(a);
  var a = 2;
}
var a;

a = 1;

fn(); // ==> undefined
```

抛出 `undefined` 而不是 1。这是因为在 `fn` 这个函数内部也同样使用 `var` 声明了一个 `a` 变量，这时解析器会在当前 `fn` 函数内部查找，只有在找不到声明的时候才会到 `fn` 函数之外查找 `a`。 所以下面的方法输出 `1`。

```javascript
var a = 1;

fn(); // ===> 1

function fn(){
  console.log(a);
  a = 2;
}
```

这个方法内部没用使用 `var` 去声明变量 `a`，只是对其进行了简单的赋值，所以在执行的时候，解析器会在 `fn` 函数的方法体外寻找变量 `a` 的实际值，最后抛出结果为 `1`。

这样可能不是很清晰，假如当前有这样一个需求：现在需要动态生成三个链接，显示不同的内容，同时在点击的时候弹出对应的内容。来看下一个例子:
```javascript
for(var i = 0; i < 3; i++) {
  var a = document.createElement('a');
  a.innerHTML = i;
  a.addEventListener('click', function(e) {
    e.preventDefault();
    alert(i);
  });

  document.body.appendChild(a);
}

console.log(i); // ==> 3
```

最后 `console.log` 输出结果为 `3`。因为 `for` 循环内部实际上并无法算是一个独立的作用域，导致变量 `i` 被抛到了全局，所以在全局打印会得到结果为 `3`。

每次点击对应的链接都只会显示 `3`，而不是希望的 0,1,2。为什么既不是全部弹出 0，不是 1，也不是 2。因为在 js 中函数在预解析阶段并不会执行，只会整体当作代码块保存在内存中，在需要执行的时候才会执行。而用于输出的代码为 `alert(i)`，js 引擎会去寻找这个 `i` 变量的最近声明作用域，而在上面提到，`for` 循环无法提供一个有效的作用域，所以会在全局寻找 `i`。而这时变量 `i` 已经变成了 `3`，这也就是为什么每次都只会抛出 `3` 的原因 。

解决:
```javascript
for(var i = 0; i < 3; i++) {
  (function(i) {
    var a = document.createElement('a');
    a.innerHTML = i;
    a.addEventListener('click', function(e) {
      e.preventDefault();
      alert(i);
    });

    document.body.appendChild(a);
  })(i);
}

console.log(i); // ==> 3
```

解决方法是使用：即时函数 `(function(i){})(i)` 的形式将原本 `for` 循环内部的代码进行包裹。因为从上面几个例子可以知道，`function` 可以提供一个单独的作用域。这时，每一个传入的变量 `i` 都有属于自己的作用域，就不存在需要去全局寻找变量 `i`。

### 即时函数
即时函数是指定义完了立即调用的匿名函数，往往用它来开辟一个独立的作用域(命名空间)。

## 闭包
**闭包指的是：能够访问另一个函数作用域的变量的函数**。清晰的讲：闭包就是一个函数，这个函数能够访问其他函数的作用域中的变量。

当然，如果在即时函数中定义的变量被内部函数捕获的话，那么这个即时函数就形成了一个闭包。将上述代码进行简单修改:
```javascript
var a = document.createElement('a');
a.innerHTML = 1;
(function() {
  var b = 123;
  a.addEventListener('click', function(e) {
    e.preventDefault();
    alert(b);
  });
})();

document.body.appendChild(a);
```

上面这个例子就是即时函数形成了闭包的情况。

实际上，人们经常用即时函数来构造闭包。为什么呢？因为即时函数只能执行一次，执行完了立马消失，所以不会重复创建闭包，也不会对当前作用域造成任何污染。

有些时候可以简单的认为只要一个函数引用了外部变量，那么就形成了闭包。例如：
```javascript
var a = 'hello world';
function fn() {
  console.log(a);
}
```

甚至可以认为所有函数都是闭包(或具有闭包的能力)。

这些说法都没有问题。实际上所有函数都有闭包的能力或者捕获外部自由变量的能力。但是通常说的闭包是指有用的闭包。所以上面这个例子，就算是个闭包，然而并没有什么用处，所以不把它叫闭包。至少它不是个有用的闭包。

那么，扯了一大堆，终于回归正题。

## var
`var` 语句用于声明变量。

js 变量的创建也叫作"声明"变量:
```javascript
var temp;
```

## let
`let` 命令，用来声明变量。它的用法类似于 `var`，但是所声明的变量，只在 `let` 命令所在的代码块内有效。
```javascript
{
  let a = 1;
  var b = 2;
}

a; // ==> ReferenceError: a is not defined
b; // ==> 2
```

如果用 `let` 修改上面的点击问题将十分简单：
```javascript
for(let i = 0; i < 3; i++) {
  var a = document.createElement('a');
  a.innerHTML = i;
  a.addEventListener('click', function(e) {
    e.preventDefault();
    alert(i);
  });

  document.body.appendChild(a);
}

console.log(i); // ==> ReferenceError: i is not defined
```

需要注意的是，在全局作用域下使用 `var` 和 `let` 声明变量是存在差异的:
```javascript
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
console.log(window.a); // 1

let b = 1;
console.log(window.b); // undefined
```

> 顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，window对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。

> ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。

## const
`const` 声明一个只读的常量。一旦声明，常量的值就不能改变。
```javascript
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.
```

简单来说就是使用 `const` 声明的变量无法进行修改。但是在复杂类型中存在例外：
```javascript
const obj = {};

obj.id = 1;

console.log(obj.id); // ==> 1

obj = {}; // TypeError: "obj" is read-only
```

上面代码中，常量 `obj` 储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把 `obj` 指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。

`const` 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const` 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。
因此，将一个对象声明为常量必须非常小心。