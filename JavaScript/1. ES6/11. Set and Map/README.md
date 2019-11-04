# Set and Map
## 1. Set
`Set` 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

`Set` 对象是值的集合，可以按照插入的顺序迭代它的元素。 `Set` 中的元素只会出现一次，即 `Set` 中的元素是唯一的。

#### 语法:
```js
new Set([iterable]);
```

#### 参数:
`iterable`: 
如果传递一个可迭代的对象，它的所有元素将不重复地被添加到 `Set` 中。如果不指定此参数或其值为 `null`，则新的 `Set` 为空。

#### 返回值:
一个新的 `Set` 对象。

#### 例子:
```js
// 使用 Set 对象
let newSet = new Set(); // ==> Set(0) {}
let obj = {name: 'Mr.'};

// 添加元素
newSet.add(1); // ==> Set(1){1}
newSet.add(1); // ==> Set(1){1}
newSet.add(2); // ==> Set(2){1, 2}
newSet.add(obj); // ==> Set(3) {1, 2, {…}}

// 判断是否具有某些元素
newSet.has(1); // ==> true
newSet.has(2); // ==> true
newSet.has(3); // == false
newSet.has(obj); // ==> true

newSet.size; // ==> 3

// 删除元素
newSet.delete(1); // ==> Set(2) {2, {…}}

// 也可以这么玩,相当于 深度克隆 了一份,与原 set 不冲突
new Set(newSet); // ==> Set(2) {2, {…}}

// 通过 Arry.from 可以将 Set 转化为一个 Array
console.log(Array.from(newSet)); // ==> [2, {…}]
```

### 1). Set.prototype.size
`Set.prototype.size` 属性将会返回 `Set` 对象中元素的个数。

`size` 的值是一个整数，表示`Set` 对象有多少条目。`size` 的集合访问函数是 `undefined`; 不能改变这个属性。

#### 例子:
```js
let newSet = new Set();
newSet.size; // ==> 0
newSet.add(1);
newSet.add(2);
newSet.size; // ==> 1
```

### 2). Set.prototype.add()
`Set.prototype.add` 方法用来向一个 `Set` 末尾添加一个指定的值。

添加的值**不能重复**。

#### 语法:
```js
newSet.add(value);
```

#### 参数:
`value`: 
必需，需要添加到 `Set` 对象的元素的值。

#### 返回值:
`Set` 对象本身。

#### 例子:
```js
let newSet = new Set();

newSet.add(1); // ==> Set(1) {1}

// 重复的值不会被添加
newSet.add(1); // ==> Set(1) {1}
```

### 3). Set.prototype.delete()
`Set.prototype.delete` 方法可以从一个 `Set` 对象中删除指定的元素。

#### 语法:
```js
newSet.delete(value);
```

#### 参数:
`value`: 
将要删除的元素。

#### 返回值:
成功删除返回 `true`，否则返回 `false`

#### 例子:
```js
let newSet = new Set();

newSet.add(1);
newSet.add(2);

newSet.delete(3); // ==> false 并没有3
newSet.delete(1); // ==> true
```

### 4). Set.prototype.has(value)
`Set.prototype.has` 方法返回一个布尔值来指示对应的值(`value`)是否存在 `Set` 对象中。

#### 语法:
```js
newSet.has(value);
```

#### 参数:
`value`: 
必需，用以测试该值是否存在于 `Set` 对象中。

#### 返回值:
`Boolean`: 
如果指定的值(`value`)存在于 `Set` 对象中，返回 `true`。否则返回 `false`。

#### 例子:
```js
let newSet = new Set();

newSet.add(1);
newSet.add(2);

newSet.has(3); // ==> false 并没有3
newSet.has(1); // ==> true
```

### 5). Set.prototype.clear()
`Set.prototype.clear` 方法用来清空一个 `Set` 对象中的所有元素。

#### 语法:
```js
newSet.clear();
```

#### 例子:
```js
let newSet = new Set();

newSet.add(1);
newSet.add(2);

newSet.clear();

console.log(newSet); // ==> Set(0) {}
```

### 6). Set.prototype.keys()
`Set.prototype.keys` 方法返回当前 `Set` 对象的键名。

`Set` 对象没有键名，只有键值(或者可以说是键名和键值一致)。

#### 语法:
```js
newSet.keys();
```

#### 返回值:
`Iterator `: 
遍历器对象。

#### 例子:
```js
let newSet = new Set(['a', 'b', 'c']);

for(let item of newSet.keys()) {
  console.log(item);
}

// ==> 'a'
// ==> 'b'
// ==> 'c'
```

### 7). Set.prototype.values()
`Set.prototype.values` 方法返回当前 `Set` 对象的键值。

`Set` 对象没有键名，只有键值(或者可以说是键名和键值一致)，其实 `keys()` 方法返回值与 `values()` 一致。

#### 语法:
```js
newSet.values();
```

#### 返回值:
`Iterator `: 
遍历器对象。

#### 例子:
```js
let newSet = new Set(['a', 'b', 'c']);

for(let item of newSet.values()) {
  console.log(item);
}

// ==> 'a'
// ==> 'b'
// ==> 'c'
```

### 8). Set.prototype.entries()
`Set.prototype.entries` 方法返回当前 `Set` 对象的键值对。

为了保持与 `Map` 的 `API` 的一致性，而 `Set` 对象并没有键名，返回值类似于 `[value, value]`。

#### 语法:
```js
newSet.entries();
```

#### 返回值:
`Iterator `: 
遍历器对象。

#### 例子:
```js
let newSet = new Set(['a', 'b', 'c']);

for(let item of newSet.entries()) {
  console.log(item);
}

// ==> ['a', 'a']
// ==> ['b', 'b']
// ==> ['c', 'c']
```

### 9). Set.prototype.forEach()
`Set.prototype.forEach` 方法会根据集合中的元素插入顺序，依次执行提供的回调函数。

#### 语法:
```js
newSet.forEach(callback[, thisArg]);
```

#### 参数:
`callback`: 
为集合中每个元素执行的回调函数，该函数接收三个参数:
- `value`: 正在被操作的元素。
- `key`: 由于集合没有键名，所以 `key` 也表示正在被操作的元素。
- `set`: 调用当前 `forEach` 方法的集合对象。

`thisArg`: 
回调函数执行过程中的 `this` 值。

#### 例子:
```js
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(key + ' : ' + value));

// ==> '1 : 1'
// ==> '2 : 2'
// ==> '3 : 3'
```

## 2. WeakSet
`WeakSet` 对象允许将*弱保持对象*存储在一个集合中。

和 `Set` 对象的区别有两点:

- `WeakSet` 对象中只能存放**对象引用**, 不能存放值, 而 `Set` 对象都可以.
- `WeakSet` 对象中存储的对象值都是被弱引用的, 如果没有其他的变量或属性引用这个对象值, 则这个对象值会被当成垃圾回收掉. 正因为这样, `WeakSet` 对象是无法被枚举的, 没有办法拿到它包含的所有元素。

#### 语法:
```js
new WeakSet([iterable]);
```

#### 参数:
`iterable`: 
如果传入一个可迭代对象作为参数，则该对象的所有迭代值都会被自动添加进生成的 `WeakSet` 对象中。

### 1). WeakSet.prototype.add(value)
`WeakSet.prototype.add` 方法在 `WeakSet` 对象的最后一个元素后添加新的对象。

#### 语法:
```js
newWeakSet.add(value);
```

#### 参数:
`value`: 
必需，将对象添加进 `WeakSet` 聚合中。

#### 返回值:
`WeakSet` 对象。

#### 例子:
```js
let newWeakSet = new WeakSet();

newWeakSet.add({});
newWeakSet.add(window);

newWeakSet.add(1); // TypeError,参数必须是一个对象
```

### 2). WeakSet.prototype.delete()
`WeakSet.prototype.delete` 方法从 WeakSet 对象中移除指定的元素。

#### 语法:
```js
newWeakSet.delete(value);
```

#### 参数:
`value`: 
必需，从 `WeakSet` 对象中移除的对象。

#### 返回值:
如果在 `WeakSet` 对象中成功移除元素，返回 `true`；否则返回 `false`。

#### 例子:
```js
let newWeakSet = new WeakSet([{a: 1}, {b: 2}]);

newWeakSet.delete({a: 1}); // ==> false，这两个对象并不是同一个引用

let obj = {c: 3};

newWeakSet.add(obj);
newWeakSet.delete(obj); // ==> true
```

### 3). WeakSet.prototype.has(value)
`WeakSet.prototype.has` 方法根据 WeakSet 是否存在相应的对象返回布尔值。

#### 语法:
```js
newWeakSet.has(value);
```

#### 参数:
`value`: 
必需，判断 `WeakSet` 对象中是否存在该对象。

#### 返回值:
`Boolean`: 
如果 `WeakSet` 对象中存在指定的元素，返回 `true`；否则返回 `false`。

#### 例子:
```js
let newWeakSet = new WeakSet();
let obj = {c: 3};

newWeakSet.add(obj);

newWeakSet.has(obj); // ==> true
newWeakSet.has({c: 3}); // ==> false
```

## 3. Map
`Map` 对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。

#### 语法:
```js
new Map([iterable]);
```

#### 参数:
`iterable`: 
`Iterable` 可以是一个数组或者其他 `iterable` 对象，其元素为键值对(两个元素的数组，例如: `[[ 1, 'one' ],[ 2, 'two' ]])`。 每个键值对都会添加到新的 `Map`。`null` 会被当做 `undefined`。

#### 例子:
```js
let newMap = new Map();

newMap.set('a', 'aaa');

let newMap_2 = new Map(newMap); // => 值与 newMap 一致
```

### 1). Map.prototype.size
`size` 是可访问属性，用于返回一个 Map 对象的成员数量。

#### 例子:
```js
let newMap = new Map();
newMap.set("a", "aaa");
newMap.set("b", "bbb");
newMap.set("c", "ccc");

newMap.size // 3
```

### 2). Map.prototype.set()
`Map.prototype.set` 方法为 `Map` 对象添加或更新一个指定了键(`key`)和值(`value`)的键值对。

#### 语法:
```js
newMap.set(key, value);
```

#### 参数:
`key`: 
要添加至相应 `Map` 对象的元素的键。

`value`: 
要添加至相应 `Map` 对象的元素值。

#### 返回值:
`Map` 对象。

#### 例子:
```js
let newMap = new Map();

// 新增
newMap.set('a', 'aaa');

// 更新
newMap.set('a', 'xxx');
```

### 3). Map.prototype.get()
`Map.prototype.get` 方法返回某一个 `Map` 对象中的一个指定元素。

#### 语法:
```js
newMap.get(key);
```

#### 参数:
`key`: 
必需参数，也是唯一参数，要从目标 `Map` 对象中获取元素的元素键。

#### 返回值:
返回一个 `Map` 对象中与指定键相关联的值，如果找不到则返回 `undefined`。

#### 例子:
```js
let newMap = new Map();

newMap.set('a', 'aaa');
newMap.set('b', 'bbb');
newMap.set('c', 'ccc');

newMap.get('a'); // ==> 'aaa'
newMap.get('aaa'); // ==> undefined
```

### 4). Map.prototype.has()
`Map.prototype.has` 方法返回一个布尔值，表示某个键是否在当前 `Map` 对象中。

#### 语法:
```js
newMap.has(key);
```

#### 参数:
`key`: 
必需，用来检测当前键是否在当前 `Map` 对象中。

#### 返回值:
`Boolean`: 
如果指定元素存在于 `Map` 中，则返回 `true`，否则返回 `false`。

#### 例子:
```js
let newMap = new Map();

newMap.set('a', 'aaa');
newMap.set('b', 'bbb');

newMap.has('a'); // ==> true
newMap.has('aaa'); // ==> false
```

### 5). Map.prototype.delete()
`Map.prototype.delete` 方法用于移除 `Map` 对象中指定的元素。

#### 语法:
```js
newMap.delete(key);
```

#### 参数:
`key`: 
必需，从 `Map` 对象中移除的元素的键。

#### 返回值:
`Boolean`: 
如果 `Map` 对象中存在该元素，则移除它并返回 `true`，否则返回 `false`。

#### 例子:
```js
let newMap = new Map();

newMap.set('a', 'aaa');
newMap.set('b', 'bbb');

newMap.delete('a'); // ==> true
newMap.has('a'); // ==> false
```

### 6). Map.prototype.clear()
`Map.prototype.clear` 方法移除 `Map` 对象中的虽有元素。

#### 语法:
```js
newMap.clear();
```

#### 例子:
```js
let newMap = new Map();

newMap.set('a', 'aaa');
newMap.set('b', 'bbb');

newMap.size; // ==> 2
newMap.clear();
newMap.size; // ==> 0
```