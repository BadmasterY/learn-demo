## 可选链
在寻找树状结构深处的属性值时，通常必须检查中间节点是否存在。
可选的链接运算符允许开发人员处理许多情况，而无需重复在临时变量中分配中间结果。

#### 语法:
```js
obj?.prop       // optional static property access
obj?.[expr]     // optional dynamic property access
func?.(...args) // optional function or method call
```

#### 例子:
```js
const a = null; // a 为 null， 也没有 b 属性

a == null ? undefined : a();

// 现在
a?.(); // 如果 a 不存在，直接跳过
```