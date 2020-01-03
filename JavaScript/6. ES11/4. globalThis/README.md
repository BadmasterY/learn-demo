## globalThis
`globalThis` 属性包含全局 `this` 值，该值类似于全局对象。

#### 语法:
```js
globalThis
```

#### 例子:
在 `globalThis` 之前，获取环境全局对象的唯一可靠的跨平台方法是 `Function('return this')()`。但是，这会导致在某些设置中违反 [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)，因此 [es6-shim](https://github.com/paulmillr/es6-shim) 使用这样的检查，例如：
```js
var getGlobal = function () { 
  if (typeof self !== 'undefined') { return self; } 
  if (typeof window !== 'undefined') { return window; } 
  if (typeof global !== 'undefined') { return global; } 
  throw new Error('unable to locate global object'); 
}; 

var globals = getGlobal(); 

if (typeof globals.setTimeout !== 'function') { 
  // no setTimeout in this environment! 
}
```
有了 `globalThis` 之后:
```js
if (typeof globalThis.setTimeout !== 'function') {
  // no setTimeout in this environment!
}
```