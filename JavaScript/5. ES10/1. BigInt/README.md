# BigInt
`BigInt` 第七种基础数据类型。

`BigInt` 是一种内置对象，它提供了一种方法来表示大于 2<sup>53</sup> - 1 的整数，这原本是 `JavaScript` 可以用 `Number` 表示的最大数字。`BigInt` 可以用于任意大的整数。

`BigInt` 是通过将 `n` 附加到整数文本的末尾 `10n` 或者通过调用 `BigInt()` 函数创建的。

某些方面类似于 `Number`，但是也有几个关键的不同点：
- 不能用于 `Math` 对象中的方法；
- 不能和任何 `Number` 实例混合运算，两者必须转换成同一种类型。

`BigInt` 可以使用以下操作符: `+`，`-`，`*`，`**`，`%`，或者除 `>>>` 之外的其他`位操作`。

#### 语法:
```js
BigInt(value);
```

#### 参数:
`value`: 
需要转换成 `BigInt` 类型的数字或者字符串。

#### 例子:
```js
let bigint = BigInt('10');
let num = 3n;

console.log(typeof bigint); // ==> 'bigint'
console.log(bigint / num); // ==> 3n
```

## 1. BigInt.asIntN()
`BigInt.asIntN` 静态方法将 `BigInt` 值转换为一个 -2<sup>width-1</sup> 与 2<sup>width-1</sup> - 1 之间的有符号整数。

#### 语法:
```js
BigInt.asIntN(width, bigint);
```

#### 参数:
`width`: 
可存储整数的位数。

`bigint`: 
要存储在指定位数上的整数。

#### 返回值:
`bigint` 模(modulo) 2<sup>`width`</sip> 作为有符号整数的值。

#### 例子:
```js
let bigint = 2n ** (64n - 1n) - 1n;

BigInt.asIntN(64, bigint); // ==> 9223372036854775807n
BigInt.asIntN(64, bigint + 1n); // ==> -9223372036854775808n，越界，所以为负数
```

## 2. BigInt.asUintN()
`BigInt.asUintN` 静态方法将 `BigInt` 值转换为一个 0 与 2<sup>width</sup> - 1 之间的无符号整数。

#### 语法:
```js
BigInt.asUintN(width, bigint);
```

#### 参数:
`width`: 
可存储整数的位数。

`bigint`: 
要存储在指定位数上的整数。

#### 返回值:
`bigint` 模(modulo) 2<sup>`width`</sip> 作为无符号整数的值。

#### 例子:
```js
let bigint = 2n ** 64n - 1n;

BigInt.asUintN(64, bigint); // ==> 18446744073709551615n
BigInt.asUintN(64, bigint + 1n); // ==> 0n，越界，所以为 0n
```

## 3. BigInt.prototype.toLocaleString()
`BigInt.prototype.toLocaleString` 方法返回一个字符串，该字符串具有此 `BigInt` 的 language-sensitive 表示形式。

#### 语法:
```js
bigint.toLocaleString([locales [, options]]);
```

#### 参数:
`locales` 和 `options` 参数可自定义函数的行为，并允许应用程序指定应使用其格式约定的语言。在忽略 `locales` 和 `options` 参数的实现中，使用的 `locale` 和返回的字符串形式完全依赖于实现。

`locales`: 
**可选**，带有 BCP 47 语言标记的字符串，或此类字符串的数组。有关 locales 参数的一般形式和解释，请参见[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation)。允许使用以下 `Unicode` 扩展键:
- `nu`: 要使用的编号系统。可能的值包括：`"arab"`, `"arabext"`, `"bali"`, `"beng"`, `"deva"`, `"fullwide"`, `"gujr"`, `"guru"`, `"hanidec"`, `"khmr"`, `"knda"`, `"laoo"`, `"latn"`, `"limb"`, `"mlym"`, `"mong"`, `"mymr"`, `"orya"`, `"tamldec"`, `"telu"`, `"thai"`, `"tibt"`。

`options`: 
**可选**，具有以下部分或全部属性的对象：
- `localeMatcher`: 要使用的 `locale` 匹配算法。可能的值是 `'lookup'` 和 `'best fit'`；默认值是 `'best fit'`。有关此选项的信息，请参阅[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation)。
- `style`: 要使用的格式样式。可能的值是 `'decimal'` 表示普通数字格式(十进制)，`'currency'` 表示货币格式，`'percent'` 表示百分比格式。默认为 `'decimal'`。
- `currency`: 要在货币格式中使用的货币。可能的值是 ISO 4217 货币代码。如: `USD` 表示美元，`EUR` 表示欧元，或 `CNY` 表示软妹币(RMB)-详情请参阅当前[货币与基金代码列表](https://www.currency-iso.org/en/home/tables/table-a1.html)。**没有默认值**，如果设置为 `currency` 格式，必须设置。
- `currencyDisplay`: 如何以货币格式显示货币。可能的值为 `'symbol'` 以使用本地化货币符号，如 `€`，`'code'` 以使用 ISO 货币代码，`'name'`以使用本地化货币名称，如 `'dollar'`；默认值为 `'symbol'`。
- `useGrouping`: 是否使用分组分隔符，如千分隔符或千/十万/千万分隔符。可能的值为 `true` 和 `false`；默认值为 `true`。

以下属性分为两组: 一组为 `minimumIntegerDigits`，`minimumFractionDigits` 和 `maximumFractionDigits`，另一组为 `minimumSignificantDigits` 和 `maximumSignificantDigits`。如果至少定义了第二组中的一个属性，则忽略第一个组。
- `minimumIntegerDigits`: 要使用的最小整数位数。可能的值为 1 到 21；默认值为 `1`。
- `minimumFractionDigits`: 要使用的小数位数的最小数目。可能的值为 0 到 20；普通数字和百分比格式的默认值为 `0`；货币格式的默认值为ISO 4217货币代码列表提供的小单位位数（如果列表未提供该信息，则为 `2`）。
- `maximumFractionDigits`: 要使用的分数位数的最大数。可能的值为 0 到 20；普通数字格式的默认值为 `minimumFractionDigits` 和 `3` 中的较大值；货币格式的默认值为 `minimumFractionDigits` 和ISO 4217货币代码列表提供的小单位数字中的较大值（如果列表不提供该信息，则为 `2`）；百分比的默认值格式设置为 `minimumFractionDigits` 和 `0` 中的较大值。
- `minimumSignificantDigits`: 要使用的最小有效位数。可能的值为 1 到 21；默认值为 `1`。
- `maximumSignificantDigits`: 要使用的有效数字的最大位数。可能的值为 1 到 21；默认值为 `21`。

#### 返回值:
具有此 `BigInt` 的 language-sensitive 表示形式的字符串。

#### 例子:
```js
let bigint = 3500n;
bigint.toLocaleString(); // ==> '3,500'
```

## 4. BigInt.prototype.toString()
`BigInt.prototype.toString` 方法返回一个表示指定 `BigInt` 对象的字符串。后面的 `'n'` 不是字符串的一部分。

#### 语法:
```js
bigint.toString([radix]);
```

#### 参数:
`radix`: 
**可选**，介于 2 到 36 之间的整数，指定用于表示数值的基数。

#### 返回值:
表示指定 `BigInt` 对象的字符串。

#### 异常:
如果 `toString()` 的基数小于 2 或大于 36，则抛出 `RangeError`。

#### 例子:
```js
let bigint = 17n;

bigint.toString(); // ==> '17'
bigint.toString(2); // ==> '10001'
bigint.toString(16); // ==> '11'
```

## 5. BigInt.prototype.valueOf()
`BigInt.prototype.valueOf` 方法返回 `BigInt` 对象包装的原始值。

#### 语法:
```js
bigintObj.valueOf();
```

#### 返回值:
表示指定 `BigInt` 对象的原始 `bigint` 值。

#### 例子:
```js
let bigintObj = Object(1n);

console.log(bigintObj); // ==> BigInt {1n}
bigintObj.valueOf(); // ==> 1n
```