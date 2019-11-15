# Object

## 1. Object.values()
`Object.values` 方法返回一个给定对象自身的所有可枚举属性值的数组，值的顺序与使用 `for...in` 循环的顺序相同(区别在于 `for...in` 循环枚举原型链中的属性)。

#### 语法:
```js
Object.values(obj);
```

#### 参数:
`obj`: 
被返回可枚举属性值的对象。

#### 返回值:
返回一个 `Array`，包含对象自身所有可枚举属性值。

#### 例子:
```js
let obj = {name: 'Mr.', age: 18};
console.log(Object.values(obj)); // ==> ['Mr.', 18]
```

## 2. Object.entries()
`Object.entries` 方法返回一个目标对象自身可枚举属性的键值对数组，顺序与使用 `for...in` 循环的顺序相同(区别在于 `for...in` 循环枚举原型链中的属性)。

#### 语法:
```js
Obejct.entries(obj);
```

#### 参数:
`obj`: 
目标对象。

#### 返回值:
返回一个 `Array`，`obj` 可枚举属性的键值对数组。

#### 例子:
```js
let obj = {name: 'Mr.', age: 18};
console.log(Object.entries(obj)); // ==> [['name', 'Mr.'], ['age', 18]]
```

## 3. Object.getOwnPropertyDescriptors()
`Object.getOwnPropertyDescriptors` 方法用来获取一个对象的所有自身属性的描述符。

#### 语法:
```js
Object.getOwnPropertyDescriptors(obj);
```

#### 参数:
`obj`: 
目标对象。

#### 返回值:
返回一个 `Object`，返回目标对象的所有自身属性的描述符，如果没有，则返回空对象 `{}`。

#### 例子:
```js
// 浅拷贝
let obj = {name: 'Mr.', age(){console.log(`${this.name} is 18.`)}};
let clone_obj = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);

obj.age = function(){console.log(`${this.name} birthday is 2001.`)}

obj.age(); // ==> 'Mr. birthday is 2001.'
clone_obj.age(); // ==> 'Mr. is 18.'
```