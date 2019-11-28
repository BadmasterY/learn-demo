## 在Typescript中使用函数

### 函数声明和函数表达式

```js
console.log(named('Mr.')); // ==> 'Hi! Mr.'
console.log(unnamed('Mr.')); // ==> TypeError: unnamed is not a function
function named(name: string): string | void{
  if(name) {
    return 'Hi! ' + name;
  }
}
var unnamed = function(name: string): string | void{
  if(name) {
    return 'Hi! ' + name;
  }
}
```

很明显，第二个方法会**报错**，与普通 `js` 函数没有什么区别。

### 函数类型
#### 为函数定义类型
