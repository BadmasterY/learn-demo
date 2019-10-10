# Math
`Math` 是一个内置对象， 它具有数学常数和函数的属性和方法。不是一个函数对象。

与其它全局对象不同的是, `Math` 不是一个构造器.  `Math` 的所有属性和方法都是静态的. 你用到的常数 pi 可以用 `Math.PI` 表示,用 x 作参数 `Math.sin(x)` 调用 sin 函数. JavaScript 中的常数, 是以全精度的实数定义的。

## 1. Math.trunc()
`Math.trunc()` 方法会将数字的小数部分去掉，只保留整数部分。

不像 Math 的其他三个方法： `Math.floor()`、`Math.ceil()`、`Math.round()` ，`Math.trunc()` 的执行逻辑很简单，仅仅是**删除**掉数字的小数部分和小数点，不管参数是正数还是负数。

传入该方法的参数会被**隐式转换**成数字类型。

#### 语法:
```javascript
Math.trunc(value);
```

#### 参数:
`value`: 
任意数字。

#### 返回值:
给定数字的整数部分。

#### 例子:
```javascript
Math.trunc(13.3); // ==> 13
Math.trunc(13.9); // ==> 13
Math.trunc(0.9); // ==> 0
Math.trunc(-0.9); // ==> -0
Math.trunc('-13.3'); // ==> -13
Math.trunc(NaN); // ==> NaN
Math.trunc('Mr.'); // ==> NaN
Math.trunc(); // ==> NaN
```

## 2. Math.sign()
`Math.sign()` 函数返回一个数字的符号, 指示数字是正数，负数还是零。

此函数共有5种返回值, 分别是 **1, -1, 0, -0, NaN**。 代表的各是**正数, 负数, 正零, 负零, NaN**。

传入该函数的参数会被**隐式转换**成数字类型。

#### 语法:
```javascript
Math.sign(value);
```

#### 参数:
`value`: 
任意数字。

#### 例子:
```javascript
Math.sign(10); // ==> 1
Math.sign(-10); // ==> -1
Math.sign(0); // ==> 0
Math.sign(-0); // ==> -0
Math.sign(NaN); // ==> NaN
```

## 3. Math.cbrt()
`Math.cbrt()` 函数返回任意数字的立方根。

cbrt 是 "cube root" 的缩写, 意思是立方根。

传入该函数的参数会被**隐式转换**成数字类型。

#### 语法:
```javascript
Math.cbrt(value);
```

#### 参数:
`value`: 
任意数字。

#### 例子:
```javascript
Math.cbrt(1); // ==> 1
Math.cbrt(-1); // ==> -1
Math.cbrt(0); // ==> 0
Math.cbrt('8'); // ==> 2
```

## 4. Math.clz32()
`Math.clz32()` 函数返回一个数字在转换成 32 无符号整形数字的二进制形式后, 开头的 0 的个数, 比如 `1000000` 转换成 32 位无符号整形数字的二进制形式后是 `00000000000011110100001001000000`, 开头的 0 的个数是 12 个, 则 `Math.clz32(1000000)` 返回 12。

"clz32" 是 `CountLeadingZeroes32` 的缩写。

传入该函数的参数会被**隐式转换**成数字类型。

#### 语法:
```javascript
Math.clz32(value);
```

#### 参数:
`value`: 
任意数字。

#### 例子:
```javascript
Math.clz32(1); // ==> 31
Math.clz32(0); // ==> 32
Math.clz32(0b01000000000000000000000000000000); // ==> 1
```

## 5. Math.imul()
该函数返回两个参数的类C的32位整数乘法运算的运算结果。

#### 语法:
```javascript
Math.imul(multiplicand, multiplier);
```
#### 参数:
`multiplicand`: 
被乘数。
`multiplier`: 
乘数。

#### 返回值:
是一个 32 位的带符号整数。

#### 例子:
```javascript
Math.imul(2, 4); // ==> 8
Math.imul(-1, 8); // ==> -8
Math.imul(-2, -2); // ==> 4
```

## 6. Math.fround()
`Math.fround()` 可以将任意的数字转换为离它最近的单精度浮点数形式的数字。

精度为 [-2<sup>24</sup>, 2<sup>24</sup>]。

#### 语法:
```javascript
Math.fround(doubleFloat);
```

#### 参数:
`doubleFloat`: 
一个 `Number`。若参数为非数字类型，则会被转投成数字。无法转换时，设置成 `NaN`。

#### 返回值:
指定数字最接近的32位单精度浮点数表示。

#### 例子:
```javascript
Math.fround(0); // ==> 0
Math.fround(1); // ==> 1
Math.fround(Math.pow(2, 24) - 1); // ==> 16777215
Math.fround(Math.pow(2, 24)); // ==> 16777216
Math.fround(Math.pow(2, 24) + 1); // ==> 16777216
```

## 7. Math.hypot()
`Math.hypot()` 函数返回它的所有参数的平方和的平方根。

#### 语法:
```javascript
Math.hypot([value1[, value2, ...]]);
```

#### 参数:
`value1, value2, ...`: 
任意多个数字。

#### 返回值:
将所提供的参数求平方和后开平方根的结果。如果有参数不能转换为数字，则返回 `NaN`。

#### 例子:
```javascript
Math.hypot(3, 4); // ==> 5
Math.hypot(3, 4, 5); // ==> 7.0710678118654755
Math.hypot(); // ==> 0
Math.hypot(NaN); // ==> NaN
```

## 8. 对数方法
ES6 新增了 4 个对数相关方法。

### 1). Math.expm1()
`Math.expm1()` 函数返回 e<sup>x</sup> - 1, 其中 x 是该函数的参数, e 是自然对数的底数 `2.718281828459045`。

expm1 是 "exponent minus 1" 的缩写。

#### 语法:
```javascript
Math.expm1(x);
```

#### 参数:
`x`: 
任意数字。

#### 例子:
```javascript
Math.expm1(1); // ==> 1.7182818284590453
Math.expm1(-38); // ==> -1
Math.expm1("-38"); // ==> -1
Math.expm1("foo"); // ==> NaN
```

### 2). Math.log1p()
`Math.log1p()` 函数返回一个数字加1后的自然对数(底为 e), 既 `Math.log(x+1)`。

#### 语法:
```javascript
Math.log1p(x);
```

#### 参数:
`x`: 
任意数字。

#### 例子:
```javascript
Math.log1p(Math.E-1); // ==> 1
Math.log1p(0); // ==> 0
Math.log1p("0"); // ==> 0
Math.log1p(-1); // ==> -Infinity
Math.log1p(-2); // ==> NaN
Math.log1p("foo"); // ==> NaN
```

### 3). Math.log10()
`Math.log10()` 函数返回一个数字以 10 为底的对数。

如果传入的参数小于 0, 则返回 NaN。

#### 语法:
```javascript
Math.log10(x);
```

#### 参数:
`x`: 
任意数字。

#### 例子:
```javascript
Math.log10(10); // ==> 1
Math.log10(100); // ==> 2
Math.log10("100"); // ==> 2
Math.log10(1); // ==> 0
Math.log10(0); // ==> -Infinity
Math.log10(-2); // ==> NaN
Math.log10("foo"); // ==> NaN
```

### 4). Math.log2()
`Math.log2()` 函数返回一个数字以 2 为底的对数。

如果传入的参数小于 0, 则返回 `NaN`。

#### 语法:
```javascript
Math.log2(x);
```

#### 参数:
`x`: 
任意数字。

#### 例子:
```javascript
Math.log2(1); // ==> 0
Math.log2(0); // ==> -Infinity
Math.log2(-2); // ==> NaN
Math.log2("1024"); // ==> 10
Math.log2("foo"); // ==> NaN
```

## 9. 双曲函数方法

- `Math.sinh(x)` 返回x的双曲正弦（hyperbolic sine）
- `Math.cosh(x)` 返回x的双曲余弦（hyperbolic cosine）
- `Math.tanh(x)` 返回x的双曲正切（hyperbolic tangent）
- `Math.asinh(x)` 返回x的反双曲正弦（inverse hyperbolic sine）
- `Math.acosh(x)` 返回x的反双曲余弦（inverse hyperbolic cosine）
- `Math.atanh(x)` 返回x的反双曲正切（inverse hyperbolic tangent）