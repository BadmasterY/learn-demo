## 在Typescript中使用函数

### 函数声明和函数表达式

```js
console.log(declarative('Mr.')); // ==> 'Hi! Mr.'
console.log(expression('Mr.')); // ==> TypeError: expression is not a function
function declarative(name: string): string{
  return 'Hi! ' + name;
}
var expression = function(name: string): string{
  return 'Hi! ' + name;
}
```

很明显，第二个方法会**报错**，与普通 `js` 函数没有什么区别。

### 函数类型
#### 为函数定义类型
上述函数中(`declarative` 与 `expression`)，定义了参数 `name` 的类型为 `string`，返回值类型为 `string`。

有时不仅需要定义函数中元素的类型，还需要定义函数本身的类型，可以通过以下方式定义。
```js
// 方式一:
let expression: (name: string) => string;

expression = function(name: string): string {
  return `Hi! ` + name;
}

// 方式二:
let expression: (name: string) => string = function(name: string): string {
  return `Hi! ` + name;
}
```

**注意**: 如果在赋值语句的一边指定了类型但是另一边没有类型的话，`TypeScript` 编译器会自动识别出类型。

#### 可选参数
`JavaScript` 里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是 `undefined`。 在 `TypeScript` 里我们可以在参数名旁使用 `?` 实现可选参数的功能。 比如：
```js
function buildName(firstName: string, lastName?: string): string {
  if(lastName) {
    return `${firstName} ${lastName}`;
  }else {
    return firstName;
  }
}

let name_1 = buildName('Mr.'); // ==> 'Mr.'
let name_2 = buildName('Mr.', 'Badmaster'); // ==> 'Mr. Badmaster'
let name_3 = buildName('Mr.', 'Badmaster', '18'); // ==> error, too many parameters
```

**注意**: 可选参数必须跟在必须参数**后面**。

#### 默认参数
在 `TypeScript` 里，也可以为参数提供一个默认值当用户没有传递这个参数或传递的值是 `undefined` 时。 它们叫做有默认初始化值的参数。
```js
function buildName(firstName: string, lastName: string = 'Badmaster'): string {
  return `${firstName} ${lastName}`;
}

let name = buildName('Mr.'); // ==> 'Mr. Badmaster'
```

**注意**: 带有默认值的可选参数可以在必须参数之前。

#### 剩余参数
必要参数，默认参数和可选参数有个共同点：**它们表示某一个参数**。 有时，想同时操作多个参数，或者并不知道会有多少参数传递进来。 在`JavaScript` 里，可以使用 `arguments` 来访问所有传入的参数。

在 `TypeScript` 里，可以把所有参数收集到一个变量里：
```js
function add(...arg: number[]): number {
  let result = 0;
  for(let value of arg) {
    result += value;
  }

  return result;
}

add(); // ==> 0
add(1); // ==> 1
add(1, 2); // ==> 3
add(1, 2, 3); // ==> 6
```

剩余参数会被当做个数不限的可选参数。 可以**一个都没有**，同样也**可以有任意个**。 编译器创建参数数组，名字是在省略号（ `...` ）后面给定的名字，可以在函数体内使用这个数组。

#### 重载
`JavaScript` 本身是个动态语言。 `JavaScript` 里函数根据传入不同的参数而返回不同类型的数据是很常见的。

函数(方法)重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

在 `Typescript` 中可以通过声明一个函数的所有的函数签名，然而再将一个签名作为实现。

```js
function test(name: string): string;
function test(age: number): string;
function test(single: boolean): string;
function test(value: string | number | boolean): string {
  switch(typeof value) {
    case 'string':
      return `My name is ${value}.`;
    case 'number':
      return `I'm ${value} years old.`;
    case 'boolean':
      return value ? `I'm single.` : `I'm not single.`;
    default:
      return `Invalid Operation.`;
  }
}

test('Mr.') // ==> 'My name is Mr..'
test(18) // ==> 'I'm 18 years old.'
test(true) // ==> 'I'm single.'
```
