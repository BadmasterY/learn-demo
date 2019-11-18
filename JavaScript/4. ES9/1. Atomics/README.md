# Atomics
`Atomics` 对象提供了一组静态方法用来对 `SharedArrayBuffer` 对象进行原子操作。

这些原子操作属于 `Atomics` 模块。与一般的全局对象不同，`Atomics` 不是构造函数，因此不能使用 `new` 操作符调用，也不能将其当作函数直接调用。`Atomics` 的所有属性和方法都是静态的(与 `Math` 对象一样)。

## 1. Atomics.add()
`Atomics.add` 静态方法会将给定的值加到数组里的某个特定位置上，并返回该位置的旧值。该方法保证在写入修改的值之前不会发生其他写操作。

#### 语法:
```js
Atomics.add(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 中的位置，该位置数值会被加总并更新。

`value`: 
增加的数字。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);

Atomics.add(ta, 0, 12); // ==> 0，返回的是旧值
Atomics.load(ta, 0); // ==> 12
```

## 2. Atomics.and()
`Atomics.and` 静态方法会将给定的值与数组上的值进行**按位与**操作，并将结果赋值给数组，然后返回数组该位置上的旧值。该方法保证在写入修改的值之前不会发生其他写操作。

#### 语法:
```js
Atomics.and(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 中的位置，该位置数值会进行按位与操作。

`value`: 
给定的按位与操作的值。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);
ta[0] = 5;

Atomics.and(ta, 0, 1); // ==> 5，返回的是旧值
Atomics.load(ta, 0); // ==> 1
```

## 3. Atomics.compareExchange()
`Atomics.compareExchange` 静态方法会在数组的值与期望值相等的时候，将给定的替换值替换掉数组上的值，然后返回旧值。该方法保证在写入修改的值之前不会放生其他操作。

#### 语法:
```js
Atomics.compareExchange(typedArray, index, expectedValue, replacementValue);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

`expectedValue`: 
用于比较的值。

`replacementValue`: 
将要替换的值。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);
ta[0] = 5;

Atomics.and(ta, 0, 5, 12); // ==> 5，返回的是旧值
Atomics.load(ta, 0); // ==> 12
```

## 4. Atomics.exchange()
`Atomics.exchange` 静态方法会用给定的值替换掉数组上的值，然后返回数组的旧值。该方法保证在写入修改的值之前不会发生其他写操作。

#### 语法:
```js
Atomics.exchange(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

`value`: 
去替换的值。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);

Atomics.exchange(ta, 0, 12); // ==> 0，返回的是旧值
Atomics.load(ta, 0); // ==> 12
```

## 5. Atomics.load()
`Atomics.load` 静态方法返回一个数组当中给定位置的值。

#### 语法:
```js
Atomics.load(typedArray, index);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);

Atomics.load(ta, 0); // ==> 0
```

## 6. Atomics.or()
`Atomics.or` 静态方法会用数组中指定位置的值进行一次按位或运算，并返回未计算时数组中指定位置处的值。该方法保证在写入修改的值之前不会发生其他写操作。

#### 语法:
```js
Atomics.or(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

`value`: 
去替换的值。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);
ta[0] = 2;

Atomics.or(ta, 0, 1); // ==> 2，返回的是旧值
Atomics.load(ta, 0); // ==> 3
```

## 7. Atomics.store()
`Atomics.store` 静态方法将给定的值存储在数组中的指定位置。

#### 语法:
```js
Atomics.store(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

`value`: 
去替换的值。

#### 返回值:
被存储的值。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);

Atomics.store(ta, 0, 18); // ==> 18，返回的是被存储的值
```

## 8. Atomics.sub()
`Atomics.sub` 静态方法在数组中的给定位置减去给定值。该方法保证在写入修改的值之前不会发生其他写操作。

#### 语法:
```js
Atomics.sub(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

`value`: 
要减去的数字。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);
ta[0] = 48;

Atomics.store(ta, 0, 18); // ==> 48，返回的是旧值
Atomics.load(ta, 0); // ==> 30
```

## 9. Atomics.xor()
`Atomics.xor` 静态方法会在数组中给定位置进行一次按位异或操作。该方法保证在写入修改的值之前不会发生其他写操作。

#### 语法:
```js
Atomics.xor(typedArray, index, value);
```

#### 参数:
`typedArray`: 
一个共享的整型 `typed array`。如 `Int8Array`， `Uint8Array`， `Int16Array`， `Uint16Array`， `Int32Array`， 或者 `Uint32Array`。

`index`: 
`typedArray` 的索引。

`value`: 
要进行按位异或操作的数字。

#### 返回值:
给定位置的旧值(`typedArray[index]`)。

#### 异常:
- 假如 `typedArray` 不是允许的整型之一，则抛出 `TypeError`。
- 假如 `typedArray` 不是一个 `shared typed array` 类型，则抛出 `TypeError`。
- 如果 `index` 超出了 `typedArray` 的边界，则抛出 `RangeError`。

#### 例子:
```js
let sab = new SharedArrayBuffer(1024);
let ta = new Uint8Array(sab);
ta[0] = 5;

Atomics.xor(ta, 0, 8); // ==> 5，返回的是旧值
Atomics.load(ta, 0); // ==> 13
```

## 10. Atomics.wait()
`Atomics.wait` 静态方法确保了一个在 `Int32Array` 数组中给定位置的值没有发生变化、仍是给定的值时进程将会休眠，直到被唤醒或超时。

#### 语法:
```js
Atomics.wait(typedArray, index, value[, timeout]);
```

#### 参数:
`typedArray`: 
一个共享内存的 `Int32Array` 数组。

`index`: 
给定需要检测的 `typedArray` 数组的索引。

`value`: 
给定需要检测的索引的预期值。

`timeout`: 
可选，超时事件(`ms`)，默认为 `Infinity`。

#### 返回值:
返回一个 `String`，值为 `'ok'`，`'not-equal'`，或者 `'timed-out'` 三种之一。

#### 异常:
- 抛出 `TypeError`，如果参数 `typedArray` 不是一个共享内存的 `Int32Array` 数组。
- 抛出 `RangeError`，如果参数 `index` 超出了 `typedArray` 的边界。

#### 例子:
```js
// 先创建共享内存的 Int32Array
let sab = new SharedArrayBuffer(1024);
let int32 = new Int32Array(sab);

Atomics.wait(int32, 0, 0);

console.log(int32[0]); // 0;
Atomics.store(int32, 0, 123); 
Atomics.notify(int32, 0, 1);
```

## 11. Atomics.notify()
`Atomics.notify` 静态方法提醒一些在等待队列中休眠的代理。

#### 语法:
```js
Atomics.notify(typedArray, index, count);
```
#### 参数:
`typedArray`: 
一个共享内存的 `Int32Array` 数组。

`index`: 
给定需要唤醒的 `typedArray` 数组的索引。

`count`: 
要通知的正在休眠的代理的数量。默认为 `+Infinity`。

#### 返回值:
返回 `Number`，被唤醒的代理的数量。

#### 异常:
- 抛出 `TypeError`，如果参数 `typedArray` 不是一个共享内存的 `Int32Array` 数组。
- 抛出 `RangeError`，如果参数 `index` 超出了 `typedArray` 的边界。

#### 例子:
```js
// 先创建共享内存的 Int32Array
let sab = new SharedArrayBuffer(1024);
let int32 = new Int32Array(sab);

Atomics.wait(int32, 0, 0);

console.log(int32[0]); // 0;
Atomics.store(int32, 0, 123); 
Atomics.notify(int32, 0, 1);
```