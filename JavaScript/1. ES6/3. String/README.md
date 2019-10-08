# String
String 全局对象是一个用于字符串或一个字符序列的构造函数。
## 1. String.fromCodePoint()
String.fromCodePoint() 静态方法返回使用指定的代码点序列创建的字符串。

该方法返回一个字符串，而不是一个 `String` 对象。

因为 `fromCodePoint()` 是 `String` 的一个静态方法，所以只能通过 `String.fromCodePoint()` 这样的方式来使用，**不能**在你创建的 `String` 对象实例上直接调用。

**<font color=#ff4400>注意</font>**: `String.fromCharCode()` 不能识别大于 `0xFFFF` 的码点,发生溢出最高位将被舍弃。

#### 语法:
```javascript
String.fromCodePoint(num1[, ...[, numN]]);
```
#### 参数:
`num1, ..., numN`
一串 Unicode 编码位置，即"[代码点](https://baike.baidu.com/item/点代码/22038405?fr=aladdin)"。

#### 返回值:
使用指定的 Unicode 编码位置创建的字符串。

#### 异常:
`RangeError`
如果传入无效的 Unicode 编码，将会抛出一个 `RangeError` (例如： `RangeError: NaN is not a valid code point`)。

#### 例子:
```javascript
let a = String.fromCodePoint(42);
let b = String.fromCodePoint(65, 90);
let c = String.fromCodePoint(0x20BB7);
let d = String.fromCodePoint(0x0BB7);

a // ==> '*'
b // ==> 'AZ'
c // ==> 'ஷ'
d // ==> 'ஷ'

a.fromCodePoint // ==> undefined
b.fromCodePoint // ==> undefined
```

## 2. String.raw()
`String.raw()` 是一个模板字符串的标签函数，它的作用类似于 Python 中的字符串前缀 `r` 和 C# 中的字符串前缀 `@`（还是有点区别的，详见[这里](https://bugs.chromium.org/p/v8/issues/detail?id=5016)），是用来获取一个模板字符串的原始字符串的，比如说，占位符（例如 `${foo}`）会被处理为它所代表的其他字符串，而转义字符（例如 `\n`）不会。

#### 语法:
```javascript
// 第一种
String.raw(callSite, ...substitutions);

// 第二种
String.raw`templateString`;
```

#### 参数:

##### 第一种
`callStie`
一个模板字符串的"调用点对象"。类似 `{ raw: ['foo', 'bar', 'baz'] }`。

`...substitutions`
任意个可选的参数，表示任意个内插表达式对应的值。

##### 第二种
`templateString`
模板字符串，可包含占位符 `${...}`。

#### 返回值:
给定模板字符串的原始字符串。

#### 异常:
`TypeError`
如果第一个参数没有传入一个格式正确的对象，则会抛出 `TypeError` 异常。

在大多数情况下, `String.raw()` 是用来处理**模版字符串**的. 不要被复杂的参数要求吓到，因为像所有的标签函数一样，通常不需要把它看成一个普通函数，只需要把它放在模板字符串前面就可以了，而不是在它后面加个括号和一堆参数来调用它，引擎会替去调用它。

#### 例子:
```javascript
String.raw`Hi\n${2+3}!`;
// 'Hi\n5!'，Hi 后面的字符不是换行符，\ 和 n 是两个不同的字符

String.raw`Hi\u000A!`;             
// "Hi\\u000A!"，同上，这里得到的会是 \、u、0、0、0、A 6个字符，
// 任何类型的转义形式都会失效，保留原样输出，不信你试试.length

let name = "Bob";
String.raw`Hi\n${name}!`;             
// "Hi\nBob!"，内插表达式还可以正常运行

// 正常情况下，也许不需要将 String.raw() 当作函数调用。
// 但是为了模拟 `t${0}e${1}s${2}t` 可以这样做:
String.raw({ raw: 'test' }, 0, 1, 2); // 't0e1s2t'

// 注意这个测试, 传入一个 string, 和一个类似数组的对象
// 下面这个函数和 `foo${2 + 3}bar${'Java' + 'Script'}baz` 是相等的.

String.raw({
  raw: ['foo', 'bar', 'baz'] 
}, 2 + 3, 'Java' + 'Script'); // 'foo5barJavaScriptbaz'
```

## 3. String.prototype.codePointAt()
`codePointAt()` 方法返回 一个 Unicode 编码点值的非负整数。

#### 语法:
```javascript
str.codePointAt(pos);
```

#### 参数:
`pos`
这个字符串中需要转码的元素的位置。

#### 返回值:
返回值是在字符串中的给定索引的编码单元体现的数字，如果在索引处没找到元素则返回 `undefined` 。

如果在指定的位置没有元素则返回 `undefined` 。如果在索引处开始没有 `UTF-16` **代理对**，将直接返回在那个索引处的编码单元。

Surrogate Pair 是 `UTF-16` 中用于扩展字符而使用的编码方式，是一种采用四个字节(两个 `UTF-16` 编码)来表示一个字符，称作**代理对**。

#### 例子:
```javascript
'ABC'.codePointAt(1);          // ==> 66
'\uD800\uDC00'.codePointAt(0); // ==> 65536

'XYZ'.codePointAt(42); // ==> undefined
```

## 4. String.prototype.normalize()
normalize() 方法会按照指定的一种 Unicode 正规形式将当前字符串正规化。

#### 语法:
```javascript
str.normalize([form]);
```

#### 参数:
`form`
四种 Unicode 正规形式:
- `NFC`，默认参数，表示"标准等价合成"( `Normalization Form Canonical Composition` )，返回多个简单字符的合成字符。所谓"标准等价"指的是视觉和语义上的等价。
- `NFD`，表示"标准等价分解"( `Normalization Form Canonical Decomposition` )，即在标准等价的前提下，返回合成字符分解的多个简单字符。
- `NFKC`，表示"兼容等价合成"( `Normalization Form Compatibility Composition` )，返回合成字符。所谓"兼容等价"指的是语义上存在等价，但视觉上不等价，比如"囍"和"喜喜"。（这只是用来举例，`normalize` 方法不能识别中文。）
- `NFKD`，表示"兼容等价分解"( `Normalization Form Compatibility Decomposition` )，即在兼容等价的前提下，返回合成字符分解的多个简单字符。

#### 返回值:
含有给定字符串的Unicode规范化表单的字符串。

#### 异常:
`RangeError`
如果给 `form` 传入了非法的参数值, 则会抛出 `RangeError` 异常。

#### 例子:
```javascript
let a = '\u004F\u030C';
let b = '\u01D1';

a // ==> 'Ǒ'
b // ==> 'Ǒ'

a == b; // ==> false

a.length; // ==> 2
b.length; // ==> 1

a.normalize() == b.normalize(); // ==> true
```

## 5. String.prototype.includes()
`includes()` 方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回 `true` 或 `false`。

#### 语法:
```javascript
str.includes(searchString[, position]);
```

#### 参数:
`searchString`
要在此字符串中搜索的字符串。即需要匹配的字符串。

`position`
**可选**,从当前字符串的哪个索引位置开始搜寻子字符串,默认值为`0`。

#### 返回值:
如果当前字符串包含被搜寻的字符串,就返回 `true`,否则为 `false`。

**注**:`includes()` 方法是区分大小写的。例如，下面的表达式会返回 `false`。
```javascript
'Blue'.includes('blue'); // ==> false
```

#### 例子:
```javascript
let str = 'Hello world!';

str.includes('Hello'); // ==> true
str.includes('o'); // ==> true
str.includes('hello'); // ==> false
```

## 6. String.prototype.startsWith()
`startsWith()` 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true` 或 `false`。

#### 语法:
```javascript
str.startsWith(searchString[, position]);
```

#### 参数:
`searchString`
要搜索的子字符串。

`position`
**可选**,从当前字符串的哪个索引位置开始搜寻子字符串,默认值为`0`。

#### 返回值:
如果在字符串的开头找到了给定的字符则返回 `true`;否则, 返回 `false`。

**注**:方法区分大小写。

#### 例子:
```javascript
let str = 'Hello world!';

str.startsWith('H'); // ==> true
str.startsWith('Hello'); // ==> true
str.startsWith('hello'); // ==> false
```

## 7. String.prototype.endsWith()
`endsWith()` 方法用来判断当前字符串是否是以另外一个给定的子字符串结尾，根据判断结果返回 `true` 或 `false`。

#### 语法:
```javascript
str.endsWith(searchString[, length]);
```

#### 参数:
`searchString`
要搜索的子字符串。

`length`
**可选**,针对前 `length` 个字符，作为 `str` 的长度，即到当前长度位置。默认值为 `str.length`。

#### 返回值:
如果传入的子字符串在搜索字符串的末尾则返回 `true`；否则将返回 `false`。

**注**:区分大小写。

#### 例子:
```javascript
let str = 'Hello world!';

str.endsWith('!'); // ==> true
str.endsWith('world!'); // ==> true
str.endsWith('World!'); // ==> false
str.endsWith('world!', 5); // false
```

## 8. String.prototype.repeat()
`repeat()` 构造并返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本。

#### 语法:
```javascript
let resultString = str.repeat(count);
```

#### 参数:
`count`
介于 0 和正无穷大之间的整数: `[0, +∞)`。表示在新构造的字符串中重复了多少遍原字符串。

#### 返回值:
包含指定字符串的指定数量副本的新字符串。

#### 异常:
`RangeError`
重复次数不能为负数，且必须小于 `Infinity`，长度不会大于最长的字符串。

#### 例子:
```javascript
'Mr.'.repeat(0); // ==> ''
'Mr.'.repeat(1); // ==> 'Mr.'
'Mr.'.repeat(1.9); // ==> 'Mr.'
'Mr.'.repeat('1'); // ==> 'Mr.'
'Mr.'.repeat(-1); // ==> RangeError
'Mr.'.repeat(Infinity); // ==> RangeError
```
