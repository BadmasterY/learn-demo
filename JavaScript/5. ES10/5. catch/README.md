# 可选的 catch 参数
在进行 `try catch` 错误处理过程中，如果没有给 `catch` 传参数的话，代码就会报错。

在 `es2019` 中，可以选择性地不给它传入参数。

一个比较常见的使用场景是: 在使用 `JSON.parse` 解析字符串的时候，虽然知道可能会报错，但是并不关心这个错误，这时候就可以把错误参数吞掉。

```js
// 新的代码
try {
    // do something
} catch {
   // do other thing without error parameter
}
```

虽然新的语言规范提供了吞掉错误参数的机制，不过建议在实际代码中还是要看情况选择性地使用。