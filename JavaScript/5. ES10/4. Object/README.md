# Object

## 1. Object.fromEntries()
`Object.fromEntries` 方法把键值对列表转换成一个对象。

#### 语法:
```js
Object.fromEntries(iterable);
```

#### 参数:
`iterable`: 
可迭代对象，类似 `Array`，`Map` 或者其他实现了可迭代协议的对象。

#### 返回值:
一个由 `iterable` 对象提供对应键值对的新对象。

#### 例子:
```js
let map = new Map([['name', 'Mr.'], ['age', 18]]);
let obj = Object.fromEntries(map);

console.log(obj); // ==> {name: "Mr.", age: 18}

let arr = [['name_arr', 'Mr.'], ['age_arr', 18]];
obj = Object.fromEntries(arr);

console.log(obj); // ==> {name_arr: "Mr.", age_arr: 18}
```