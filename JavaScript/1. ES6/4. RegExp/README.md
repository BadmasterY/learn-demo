# 正则 RegExp
有两种方法来创建一个 `RegExp` 对象：一是字面量、二是构造函数。要指示字符串，字面量的参数不使用引号，而构造函数的参数使用引号。

`RegExp` 构造函数创建了一个正则表达式对象，用于将文本与一个模式匹配。

有关正则表达式的介绍，请阅读 [JavaScript指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/)中的[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)章节。

## 1. RegExp

#### 语法:
```javascript
// 构造函数
new RegExp(pattern);
// 工厂符号
RegExp(patttern[, flags]);
```
#### 参数:
`pattern`
正则表达式的文本。

`flags`
如果指定，标志可以具有以下值的任意组合:
- `g`: 全局匹配;找到所有匹配，而不是在第一个匹配后停止;
- `i`: 忽略大小写;
- `m`: 多行;将开始和结束字符(^ 和 $)视为在多行上工作,也就是,分别匹配每一行的开始和结束(由 `\n` 或 `\r` 分割),而不只是匹配整个输入字符串的最开始和最末尾处;
- `s`: dotAll模式,匹配任何字符(包括终止符 `\n`);

#### 例子:
```javascript
let regex = new RegExp('ab+c', 'i');
// 等价
let regex = /ab+c/i;

let regex = new RegExp(/ab+c/i);
// 等价
let regex = /ab+c/i;

let regex = new RegExp(/ab+c/, 'i'); 
// ==> Uncaught TypeError: Cannot supply flags when constructing one RegExp from another
```

## 2. 字符串的正则

### 1). String.prototype.match()
`match()` 方法检索返回一个字符串匹配正则表达式的的结果。该方法(`match()` 会更慢一些)类似于正则表达式的 `exec()` 方法。

#### 语法:
```javascript
str.match(regexp);
```

#### 参数:
`regexp`: 
一个正则表达式对象。如果传入一个非正则表达式对象，则会隐式地使用 `new RegExp(obj)` 将其转换为一个 `RegExp` 。如果你没有给出任何参数并直接使用 `match()` 方法 ，你将会得到一 个包含空字符串的 `Array`： [""] 。

#### 返回值:
- 如果使用 `g` 标签,则将返回与完整正则表达式的所有匹配结果(`Array`),但不会返回捕获组,或者未匹配 `null`。
- 如果未使用 `g` 标签,则仅返回第一个完整匹配及相关的捕获组(`Array`)。在这样的情况下，返回的项目将具有如下所述的其他属性,或者未匹配 `null`。

**附加属性**:
- **groups**: 一个捕获组数组或 `undefined`(如果没有定义命名捕获组);
-  **index**: 匹配的结果的开始位置;
-  **input**: 搜索的字符串。

`Array`，其内容取决于global(g)标志的存在与否，如果未找到匹配则为 `null`。

#### 例子:
```javascript
let str = 'For more information, see Chapter 3.4.5.1';
let re = /see (chapter \d+(\.\d)*)/i;
let found = str.match(re);

console.log(found);
// ==> ["see Chapter 3.4.5.1", "Chapter 3.4.5.1", ".1", index: 22, input: "For more information, see Chapter 3.4.5.1", groups: undefined]
```

### 2). String.prototype.replace()
`replace()` 方法返回一个由替换值( `replacement` )替换一些或所有匹配的模式( `pattern` )后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。

原字符串不会改变。

#### 语法:
```javascript
str.replace(regexp|substr, newSubStr|function);
```

#### 参数:
`regexp`(pattern): 
一个 `RegExp` 对象或者其字面量。该正则所匹配的内容会被第二个参数的返回值替换掉。

`substr`(pattern): 
一个将被 `newSubStr` 替换的字符串。其被视为一整个字符串，而不是一个正则表达式。仅第一个匹配项会被替换。

`newSubStr`(replacement): 
用于替换掉第一个参数在原字符串中的匹配部分的字符串。该字符串可以内插一些特殊的变量名。

`function`(replacement): 
一个用来创建新字符串的函数,该函数的返回值将替换掉第一个参数匹配到的结果。

#### 返回值:
一个部分或全部匹配由替代模式所取代的新的字符串。

#### 例子:
```javascript
let str = 'abc12345#$*%';

// 字符串
let newStr_string = str.replace(/([^\d]*)(\d*)([^\w]*)/, '$1-$2-$3');

// 方法
function replacer(match, p1, p2, p3, offset, string){
	return [p1, p2, p3].join('-');
}

let newStr_function = str.replace(/([^\d]*)(\d*)([^\w]*)/, replacer);

console.log(newStr_string); // ==> 'abc-12345-#$*%'
console.log(newStr_function); // ==> 'abc-12345-#$*%'
```

#### 描述
##### 使用字符串作为参数:
替换字符串可以插入下面的特殊变量名：

变量名 | 代表的值
--- | ---
$$ | 插入一个`$`
$& | 插入匹配的子串
$` | 插入当前匹配的子串左边的内容
$' | 插入当前匹配的子串右边的内容
$n | 假如第一个参数是 `RegExp` 对象,并且 `n` 是个小于100 的非负整数，那么插入第 `n` 个括号匹配的字符串。提示：**索引是从1开始**

##### 使用函数作为参数:
可以指定一个函数作为第二个参数。在这种情况下，当匹配执行后，该函数就会执行。 函数的返回值作为替换字符串。 (**注意**：上面提到的特殊替换参数在这里不能被使用。) 另外要注意的是，如果第一个参数是正则表达式，并且其为全局匹配模式，那么这个方法将被多次调用，每次匹配都会被调用。

变量名 | 代表的值
--- | ---
match | 匹配的子串(对应于上述的 `$&`)
p1,p2,... | 假如 `replace()` 方法的第一个参数是一个`RegExp` 对象，则代表第 `n` 个括号匹配的字符串。（对应于上述的 `$1`，`$2` 等。）例如，如果是用 `/(\a+)(\b+)/` 这个来匹配，p1 就是匹配的 `\a+`，p2 就是匹配的 `\b+`。
offset | 匹配到的字符串在原字符串中的偏移量。(比如，如果原字符串是 `'abcd'`，匹配到的子字符串是 `'bc'`，那么这个参数将会是 `1`)。
string | 被匹配的原字符串。
NamedCaptureGroup | 命名捕获组匹配的对象

### 3). String.prototype.search()
`search()` 方法执行正则表达式和 `String` 对象之间的一个搜索匹配。类似于正则表达式的 `test()` 方法。

#### 语法:
```javascript
str.search(regexp);
```

#### 参数:
`regexp`: 
一个正则表达式对象。如果传入一个非正则表达式对象 `obj`，则会使用 `new RegExp(obj)` 隐式地将其转换为正则表达式对象。

#### 返回值:
如果匹配成功,则 `search()` 返回表达式在字符串中首次匹配的索引,否则返回 -1。

#### 例子:
```javascript
let str = 'hey Mr.';
let regex_1 = /[A-Z]/g;
let regex_2 = /[_]/g;

console.log(str.search(regex_1)); // ==> 4
console.log(str.search(regex_2)); // ==> -1
```

### 4). String.prototype.split()
`split()` 方法使用指定的分隔符字符串将一个String对象分割成字符串数组，以将字符串分隔为子字符串，以确定每个拆分的位置。 找到分隔符后，将其从字符串中删除，并将子字符串的数组返回。

#### 语法:
```javascript
str.split([separator[, limit]]);
```

#### 参数:
`separator`: 
指定表示每个拆分应发生的点的字符串。`separator` 可以是一个字符串或正则表达式。 如果纯文本分隔符包含多个字符，则必须找到整个字符串来表示分割点。如果在 `str` 中省略或不出现分隔符，则返回的数组包含一个由整个字符串组成的元素。如果分隔符为空字符串，则将 `str` 原字符串中每个字符的数组形式返回。

`limit`: 
一个整数，限定返回的分割片段数量。当提供此参数时，`split` 方法会在指定分隔符的每次出现时分割该字符串，但在限制条目已放入数组时停止。如果在达到指定限制之前达到字符串的末尾，它可能仍然包含少于限制的条目。新数组中不返回剩下的文本。

#### 返回值:
返回源字符串以分隔符出现位置分隔而成的一个 `Array`。

#### 例子:
```javascript
let names = 'Mr.;BadmasterY;yuzhoujie';

// 正则
let regexp = /\s*(?:;|$)\s*/;
let nameList = names.split(regexp);

console.log(nameList);
// ==> ['Mr.', 'BadmaseterY', 'yuzhoujie']

// 字符串
let splits = names.split(';');
console.log(splits);
// ==> ['Mr.', 'BadmaseterY', 'yuzhoujie']
```