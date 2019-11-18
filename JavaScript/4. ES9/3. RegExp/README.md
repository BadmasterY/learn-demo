# RegExp

## 1. RegExp.prototype.dotAll
`RegExp.prototype.dotAll` 属性表明是否在正则表达式中一起使用 `s` 修饰符(引入 `/s` 修饰符，使得 `.` 可以匹配任意单个字符)。 `dotAll` 是一个只读属性，属于单个正则表达式实例。

`dotAll` 返回一个 `Boolean` 值，如果使用了 `s` 修饰符，将返回 `true`，否则返回 `false`。

`s` 修饰符表示，特殊字符 `.` 应另外匹配字符串中的下述行终止符，否则将会匹配失败：
- U+000A 换行符(`\n`)。
- U+000D 回车符(`\r`)。
- U+2028 行分隔符。
- U+2029 段分隔符。

这实际上意味着 `.` 将会匹配任意的单个 Unicode BMP 字符。若要使其与 astral 字符(大于 `\uFFFF` 的 Unicode 字符)匹配，应当使用 `u` 修饰符。一起使用这两个修饰符，`.` 将无一例外地匹配任意 Unicode 字符。

无法直接修改此属性。

## 2. 命名组
这个增强功能带来了其他语言（如 `Python`，`Java` 等）的有用 `RegExp` 功能，称为 `"命名组"`。这个功能允许允许正则表达式给每一个捕获组起一个名字 `(?<name>...)`，然后，可以使用该名称轻松获取需要的任何群组。

```js
let regexp = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
let result = regexp.exec('2019-11-18');
console.log(result.groups); // ==> {day: "18", month: "11", year: "2019"}
```

## 3. Lookbehind
正则表达式后行断言，这是 `RegExp` 的一个增强，允许确保某些子字符串恰好出现在某些子字符串之前。

先行断言 `(?<=…)`。

后行断言 `(?<!…)`，基本上，只要 -ve 断言通过，这将匹配。

## 4. Unicode 属性转义
详情查看[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes)。