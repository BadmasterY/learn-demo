# Async 函数

## 1. async function
`async function` 用来定义一个异步函数。

异步函数是指通过事件循环异步执行的函数，它会通过一个隐式的 `Promise` 返回结果。

异步函数的语法和结构更像是标准的同步函数。

异步函数可以包含 `await` 指令，该指令会暂停异步函数的执行，并等待 `Promise` 执行，然后继续执行异步函数，并返回结果。`await` 关键字只在异步函数内有效，如果在异步函数之外使用会抛出语法错误。

**注意**: 当异步函数暂停时，调用的函数会继续执行(收到异步函数返回的隐式 `Promise`)。

#### 语法:
```js
async function name([param[, param[, ...param]]]) { statements };
```

#### 参数:
`name`: 
函数名。

`param`: 
要传递给函数的参数。

`statements`: 
函数体语句。

#### 返回值:
返回 `Promise` 对象，对象如果正常运行，将执行 `resolve` 异步函数返回结果，否则通过 `reject` 抛出异常。

#### 例子:
```js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})(); // ==> 1000(并不一定准确)
```

## 2. await
`await` 操作符用于等待一个 `Promise` 对象。只能在异步函数 `async function` 中使用。

`await` 表达式会暂停当前 `async function` 的执行，等待 `Promise` 处理完成。若 `Promise` 正常处理，其回调的 `resolve` 函数作为 `await` 表达式的值，继续执行 `async function`。

如果 `Pormise` 处理异常(`rejected`)，`await` 表达式会把 `Promise` 的异常原因抛出。

#### 语法:
```js
[return_value] = await expression;
```

#### 参数:
`expression`: 
一个 `Promise` 对象或者任何要等待的值。

#### 返回值:
返回 `Promise` 对象的处理结果。如果等待的不是 `Promise` 对象，则返回该值本身。

#### 例子:
```js
async function asyncPrint(value, ms) {
  await setTimeout(() => {console.log('timeout end.')}, ms); // 非 promise 对象
  console.log(value);
}

asyncPrint('hello world', 50);
// ==> 'hello world'
// ==> 'timeout end.'
```