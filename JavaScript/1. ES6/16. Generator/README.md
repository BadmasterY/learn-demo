# Generator

## 1. function*
`function*` 这种声明方式(`function` 关键字之后跟一个星号)会定义一个**生成器函数**(`generator function`)，这种声明方式返回一个 `Generator` 对象。

调用**生成器函数**并不会马上执行(这与普通函数不同)，而是返回这个生成器的**迭代器对象**(`iterator`)。只有当这个迭代器的 `next()` 方法被调用时，其内的语句会执行到下一个 `yield` 出现的位置停止(每次执行都是**从停止的位置开始**继续执行)。

如果停止位置为 `yield*`，则表示将执行权移交给另一个生成器函数，而当前的生成器将暂停执行。

`next()` 方法返回一个对象 `{value: 'xx', done: true/false}`，`value` 表示当前停止位置 `yield` 表达式的返回值，`done` 为布尔值，表示函数后续是否还有 `yield` 语句(也就是说，这个生成器函数是否执行完毕)。

同时，调用 `next()` 方法时，如果传入参数，这个参数会传递给上一条执行的 **`yeild` 语句左边的变量**。

如果在生成器函数中显示的调用 `return`，会导致生成器立即变成完成状态，同时 `return` 后紧跟的返回值会被作为当前调用 `next()` 方法返回的 `value` 值。

#### 语法:
```js
function* name([param[, param[, ...param]]]) { statements };
```

#### 参数:
`name`: 
函数名。

`param`: 
要传递给函数的一个参数的名称，一个函数**最多**支持 255 个参数。

`statements`: 
函数体内部语句(普通 Javascript 语句)。

#### 例子:
```js
function* hello(name) {
  yield name;
  let username = yield 'Hello! ' + name;
  return {name: username}; // 这里就结束了
  yield {age: 18};
}

let hey = hello('Mr.');

console.log(hey.next().value); // ==> 'Mr.'
console.log(hey.next().value); // ==> 'Hello! Mr.'
console.log(hey.next('Badmaster').value); // ==> {name: 'Badmaster'}
console.log(hey.next().value); // ==> undefined
```

## 2. Generator
`Generator` 对象是由一个 `function*` 返回，并且这个对象符合`可迭代协议`和`迭代器协议`。

#### 语法:
```js
function* hello() {
  yield 'Mr.';
  yield 'welcome~';
  return 'end';
}

let hey = hello();
// ==> 'hello {<suspended>}'
```

### 1). Generator.prototype.next()
`Generator.prototype.next` 方法返回一个包含属性 `value` 和 `done` 的对象。该方法也可以通过接收一个参数用以向生成器传值。

#### 语法:
```js
generator.next(value);
```

#### 参数:
`value`: 
向生成器传递的值。

#### 返回值:
返回 `Object`，包含两个属性:
- `value`: 迭代器返回的任意的 Javascript 值。当 `done` 的值为 `true` 时可以忽略;
- `done`(布尔值): 
  - 如果迭代器超过迭代序列的末尾，则值为 `true`。在这种情况下， `value` 可选地指定迭代器的返回值;
  - 如果迭代器能够生成序列中的下一个值，则值为 `false`。相当于没有完全指定 `done` 属性。

#### 例子:
```js
function* hello() {
  yield 'Mr.';
  yield 'welcome~';
  return 'end';
}

let generator = hello();
generator.next(); // ==> {value: 'Mr.', done: false}
generator.next(); // ==> {value: 'welcome~', done: false}
generator.next(); // ==> {value: 'end', done: true}
generator.next(); // ==> {value: undefined, done: false}
```

### 2). Generator.prototype.return()
`Generator.prototype.return` 方法返回给定的值并结束生成器。

#### 语法:
```js
generator.return(value);
```

#### 参数:
`value`: 
需要返回的值。

#### 返回值:
返回该函数参数中给定的值。

#### 例子:
```js
function* hello() {
  yield 'Mr.';
  yield 'welcome~';
  return 'end';
}

let generator = hello();
generator.next(); // ==> {value: 'Mr.', done: false}
generator.return('stop'); // ==> {value: 'stop', done: true}
generator.next(); // ==> {value: undefined, done: true}
```

### 3). Generator.prototype.throw()
`Generator.prototype.throw` 方法用来向生成器抛出异常，并恢复生成器的执行，返回带有 `done` 和 `value` 两个属性的对象。

#### 语法:
```js
generator.throw(exception);
```

#### 参数:
`exception`: 
用于抛出的异常。使用 `Error` 实例对调试非常有帮助。

#### 返回值:
返回 `Object`，带有两个属性:
- `value`: 迭代器返回的任意的 Javascript 值。当 `done` 的值为 `true` 时可以忽略;
- `done`(布尔值): 
  - 如果迭代器超过迭代序列的末尾，则值为 `true`。在这种情况下， `value` 可选地指定迭代器的返回值;
  - 如果迭代器能够生成序列中的下一个值，则值为 `false`。相当于没有完全指定 `done` 属性。
