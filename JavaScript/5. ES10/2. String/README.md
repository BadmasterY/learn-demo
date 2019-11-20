# String
## 1. String.prototype.matchAll()
`String.prototype.matchAll` 方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。

#### 语法:
```js
string.matchAll(regexp);
```

#### 参数:
`regexp`: 
正则表达式对象。如果所传参数不是一个正则表达式对象，则会隐式地使用 `new RegExp(obj)` 将其转换成一个 `RegExp`。

#### 返回值:
一个迭代器(不可复用，结果耗尽需要再次调用方法，获取一个新的迭代器)。

#### 例子:
```js
const regexp = RegExp('foo[a-z]*','g');
const str = 'table football, foosball';
let match;

while ((match = regexp.exec(str)) !== null) {
  console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
}

// ==> 'Found football start=6 end=14.'
// ==> 'Found foosball start=16 end=24.'
```

## 2. String.prototype.trimStart()
`String.prototype.trimStart` 方法从字符串的开头删除空格。`trimLeft` 是此方法的别名。

#### 语法:
```js
str.trimStatr();
```

#### 返回值:
返回一个 `String`，表示从开头(左端)去除空格的调用字符串。

#### 例子:
```js
let str = '  Mr.  ';
console.log(str.length); // ==> 7

str = str.trimStart();
console.log(str.length); // ==> 5
console.log(str); // ==> 'Mr.  '
```

## 3. String.prototype.trimEnd()
`String.prototype.trimEnd` 方法从字符串的结尾删除空格。`trimRight` 是此方法的别名。

#### 语法:
```js
str.trimEnd();
```

#### 返回值:
返回一个 `String`，表示从结尾(右端)去除空格的调用字符串。

#### 例子:
```js
let str = '  Mr.  ';
console.log(str.length); // ==> 7

str = str.trimEnd();
console.log(str.length); // ==> 5
console.log(str); // ==> '  Mr.'
```