# Number
JavaScript 的 `Number` 对象是经过封装的能让你处理数字值的对象。`Number` 对象由 `Number()` 构造器创建。

JavaScript的 `Number` 类型为 [IEEE 754 64位浮点](https://baike.baidu.com/item/IEEE%20754)类型。

## 1. Number.isFinite()
`Number.isFinite()` 方法用来检测传入的参数是否是一个有穷数（finite number）。

和全局的 `isFinite()` 函数相比，这个方法不会强制将一个非数值的参数转换成数值，这就意味着，只有数值类型的值，且是有穷的（finite），才返回 `true`。

#### 语法:
```javascript
Number.isFinite(value);
```

#### 参数:
`value`: 
要被检测有穷性的值。

#### 返回值:
一个布尔值表示给定的值是否是一个有穷数。

#### 例子:
```javascript
Number.isFinite(Infinity); // ==> false
Number.isFinite(NaN); // ==> false
Number.isFinite(12); // ==> true
Number.isFinite('10'); // ==> false
```

## 2. Number.isNaN()
`Number.isNaN()` 方法确定传递的值是否为 `NaN` 和其类型是 `Number`。它是原始的全局 `isNaN()` 的更强大的版本。

和全局函数 `isNaN()` 相比，该方法不会强制将参数转换成数字，只有在参数是真正的数字类型，且值为 `NaN` 的时候才会返回 `true`。

#### 语法:
```javascript
Number.isNaN(value);
```

#### 参数:
`value`: 
要被检测是否为 `NaN` 的值。

#### 返回值:
一个布尔值,表示给定的值是否是 `NaN`。

#### 例子:
```javascript
Number.isNaN(NaN); // ==> true
Number.isNaN(Number.NaN); // ==> true
Number.isNaN(0 / 0); // ==> true
Number.isNaN('NaN'); // ==> false
```

## 3. Number.isInteger()
`Number.isInteger()` 方法用来判断给定的参数是否为整数。

如果被检测的值是整数，则返回 `true`，否则返回 `false`。注意 `NaN` 和正负 `Infinity` 不是整数。

#### 语法:
```javascript
Number.isInteger(value);
```

#### 参数:
`value`: 
要判断此参数是否为整数。

#### 返回值:
判断给定值是否是整数的布尔值。

#### 例子:
```javascript
Number.isInteger(0); // ==> true
Number.isInteger(10); // ==> true
Number.isInteger(-10); // ==> true
Number.isInteger(0.1); // ==> false
Number.isInteger(Math.PI); // ==> false
Number.isInteger(Infinity); // ==> false
Number.isInteger(3.0000000000000002); // true
```

## 4. Number.isSafeInteger()
`Number.isSafeInteger()` 方法用来判断传入的参数值是否是一个"安全整数"(safe integer)。

安全整数范围为 [-(2<sup>53</sup> - 1), 2<sup>53</sup> - 1] (也就是 `[-(Math.pow(2, 53) - 1), +(Math.pow(2, 53) - 1)]`)。 

##### 语法:
```javascript
Number.isSafeInteger(testValue);
```

##### 参数:
`testValue`: 
需要检测的参数。

#### 返回值:
布尔值,表示给定的值是否是一个安全整数(safe integer)。

#### 例子:
```javascript
Number.isSafeInteger(3); // ==> true
Number.isSafeInteger(Math.pow(2, 53)); // ==> false
Number.isSafeInteger(Math.pow(2, 53) - 1); // ==> true
Number.isSafeInteger(NaN); // ==> false
Number.isSafeInteger(Infinity); // ==> false
Number.isSafeInteger("3"); // ==> false
```

## 5. Number.MAX\_SAFE\_INTEGER
`Number.MAX_SAFE_INTEGER` 常量表示在 JavaScript 中最大的安全整数: (2<sup>53</sup> - 1)。

## 6. Number.MIN\_SAFE\_INTEGER
`Number.MIN_SAFE_INTEGER` 常量表示在 JavaScript 中最小的安全整数: -(2<sup>53</sup> - 1)。