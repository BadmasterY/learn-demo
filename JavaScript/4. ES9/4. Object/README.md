# Object

## 1. Rest
`Rest` 运算符 `...` 允许提取 `Object` 的剩余属性(与 `Array` 的行为一致)。

```js
let {name, ...other} = {
  name: 'Mr.',
  age: 18,
  address: 'China'
};

console.log(name, other); // ==> 'Mr.' {age: 18, address: 'China'}
```

## Spread
展开剩余属性，与 `Array` 的剩余属性展开行为一致。

```js
let obj_1 = {name: 'Mr.'};
let obj_2 = {age: 18, address: 'China'};
let obj = {...obj_1, ...obj_2};

console.log(obj); // ==> {name: 'Mr.', age: 18, address: 'China'}
```