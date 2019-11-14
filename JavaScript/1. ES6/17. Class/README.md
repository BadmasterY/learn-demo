# Class
`class` 声明创建一个基于原型继承的具有给定名称的新类。

类同样分为声明式和表达式(与方法一致)，但类声明**不可以提升**。

和类表达式一样，类声明体在严格模式下运行，构造函数是可选的。

#### 语法:
```js
class name [extends] {
  // class body
}
```

#### 例子:
```js
class A {
  constructor(name) {
    this.name = name;
  }
}

class B extends A {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}
```

**后记**:整体来说，`class` 相比于 `ES5` 的构造函数有以下提升:
1. `class` 写法更加简洁、含义更加明确、代码结构更加清晰。
2. `class` 尽管也是函数，却无法直接调用(不使用 `new` 无法直接调用，抛出异常)。
3. `class` 不存在变量提升(关于变量提升，详细内容可以查看《You Don't Know JS》上卷)。
4. `class` 不会污染 `window` 等全局变量。
5. `class` 函数体中的代码始终以严格模式执行(提高代码可靠性，避免 hack 方法)
6. `class` 底层实现其实与 `ES5` 的构造函数、链式继承类似(有一些区别，但是核心思想一致)，可以理解为一种语法糖。
7. 所以，严格来说，`js` 依旧没有真正的类/继承(与其他语言相比，`js` 的行为很怪异)。