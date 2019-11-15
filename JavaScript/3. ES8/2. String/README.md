# String

## 1. String.prototype.padStart()
`String.prototype.padStart` 方法用另一个字符串填充当前字符串(重复)，以便产生的字符串达到给定的长度。从字符串开始(左侧)的位置填充。

#### 语法:
```js
str.padStart(targetLength[, padString]);
```

#### 参数:
`targetLength`: 
当前字符串需要填充到的目标长度。如果比当前字符串小，直接返回原字符串。

`padString`: 
可选，填充字符串，如果字符串太长，只保留最左侧的部分，其他部分会被截断。默认为`' '`(U+0020)。

#### 返回值:
返回一个 `String`，在原字符串开头填充指定字符串直到目标长度的新字符串。

#### 例子:
```js
'100.00'.padStart(7, '0'); // ==> '0100.00'
```

## 2. String.prototype.padEnd()
`String.prototype.padEnd` 方法用另一个字符串填充当前字符串(重复)，以便产生的字符串达到给定的长度。从字符串结束(右侧)的位置填充。

#### 语法:
```js
str.padEnd(targetLength[, padString]);
```

#### 参数:
`targetLength`: 
当前字符串需要填充到的目标长度。如果比当前字符串小，直接返回原字符串。

`padString`: 
可选，填充字符串，如果字符串太长，只保留最左侧的部分，其他部分会被截断。默认为`' '`(U+0020)。

#### 返回值:
返回一个 `String`，在原字符串结尾填充指定字符串直到目标长度的新字符串。

#### 例子:
```js
'100'.padEnd(5, '大洋'); // ==> '100大洋'
```