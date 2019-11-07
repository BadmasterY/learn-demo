# Proxy
`Proxy` 对象用于自定义基本操作的默认行为。

等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

#### 语法:
```js
let proxy = new Proxy(target, handler);
```

#### 参数:
`target`: 
用 `Proxy` 包装的目标对象(可以是任何类型的对象，包括原生数组，函数，甚至另一个代理)。

`handler`: 
一个对象，其属性是当执行一个操作时自定义代理行为的函数。

#### 返回值:
返回所生成的代理对象。

#### 例子:
```js
let handler = {
  get: function(target, name) {
    return name in target ? target[name] : 37;
  }
}

let proxy = new Proxy({}, handler);

proxy.a = 1;
proxy.b = undefined;

console.log(proxy.a, proxy.b); // ==> 1 undefined
console.log('c' in proxy, proxy.c); // false 37
```

## 1. Proxy.revocable()
`Proxy.revocable` 方法可以用来创建一个可撤销的代理对象。

返回值是一个对象，其结构为： `{"proxy": proxy, "revoke": revoke}`。

一旦某个代理对象被撤销，它将变的几乎完全不可用，在它身上执行任何的**可代理操作**都会抛出 `TypeError` 异常。

一旦被撤销，这个代理对象永远不可能恢复到原来的状态，同时和它关联的**目标对象**以及**处理器对象**将有可能被垃圾回收掉。调用撤销方法多次将不会有任何效果，当然，也不会报错。

#### 语法:
```js
Proxy.revocable(target, handler);
```

#### 参数:
`target`: 
用 `Proxy` 包装的目标对象(可以是任何类型的对象，包括原生数组，函数，甚至另一个代理)。

`handler`: 
一个对象，其属性是当执行一个操作时自定义代理行为的函数。

#### 返回值:
返回一个包含了所生成的代理对象本身以及该对象的撤销方法。

#### 例子:
```js
let revocable = Proxy.revocable({}, {
  get(target, name) {
    return '[[' + name + ']]';
  }
});

let proxy = revocable.proxy;

console.log(proxy.name); // ==> '[[name]]'

revocable.revoke();

proxy.name; // ==> TypeError
proxy.name = 'Mr.'; // ==> TypeError
delete proxy.name; // ==> TypeError
typeof proxy; // ==> 'object' (typeof 不属于可代理操作，不会报错)
```

## 2. handler.get()
`handler.get` 方法用于拦截对象的读取属性事件。

`this 上下文绑定在 handler上`。

该方法会**拦截**目标对象的以下操作:
- 访问属性: `proxy[name]` 和 `proxy.name`;
- 访问原型链上的属性: `Object.create(proxy)[name]`;
- Relect.get()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 如果访问的目标的属性是不可写以及不可配置的，则返回值必须与该目标属性的值相同。
- 如果要访问的目标属性没有配置访问方法，即 `get` 方法为 `undefined`，则返回值必须为 `undefined`。

#### 语法:
```js
let proxy = new Proxy(target, {
  get(target, property, receiver) {...},
});
```

#### 参数:
`target`: 
目标对象。

`property`: 
被获取的属性名。

`receiver`: 
Proxy 或者继承 Proxy 的对象。

#### 例子:
```js
let proxy = new Proxy({}, {
  get(target, prop, receiver) {
    console.log('get: ' + prop);
    return 'Mr.';
  }
});

console.log(proxy.name);  // ==> 'get: name'  'Mr.'

let obj = {};
obj.defineProperty(obj, 'name', {
  configurable: false,
  enumerable: false,
  value: 'Mr.',
  writable: false
});

let proxy_2 = new Proxy(obj, {
  get(target, prop) {
    return 20;
  }
});

console.log(proxy_2.name); // ==> TypeError,未遵循约束
```

## 3. handler.set()
`handler.set` 方法用于拦截设置属性值的操作。

该方法会**拦截**目标对象的以下操作：
- 指定属性值: `proxy[name] = 'Mr.'` 和 `proxy.name = 'Mr.'`;
- 指定继承者的属性值: `Object.create(proxy)[name] = 'Mr.'`;
- Reflect.set()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 若目标属性是不可写及不可配置的，则不能改变它的值;
- 如果目标属性没有配置存储的方法，即 `set` 方法为 `undefined`，则不能设置它的值;
- 在严格模式下，若 `set` 方法返回 `false`，则会抛出 `TypeError`。

#### 语法:
```js
let proxy = new Proxy(target, {
  set(target, property, value, receiver) {...},
});
```

#### 参数:
`target`: 
目标对象。

`property`: 
被设置的属性名。

`value`: 
被设置的新值。

`receiver`: 
最初被调用的对象。通常是 `proxy` 本身，但 `handler` 的 `set` 方法也有可能在原型链上或以其他方式被间接调用(因此不一定是 `proxy` 本身)。

#### 返回值:
`set` 方法应该返回一个布尔值，返回 `true` 代表此次设置属性成功了，如果返回 `false` 且设置属性操作发生在严格模式下，那么会抛出一个 `TypeError`。

#### 例子:
```js
let proxy = new Proxy({}, {
  set(target, prop, value, receiver) {
    target[prop] = value;
    console.log(`set: ${prop} = ${value};`);
    return true;
  }
});

console.log('name' in proxy); // ==> false
proxy.name = 'Mr.'; // ==> set: name = Mr.;
console.log(proxy.name); // ==> 'Mr.'
```

## 4. handler.apply()
`handler.apply` 方法用于拦截函数的调用。

该方法会**拦截**目标对象的以下操作：
- `proxy(...args)`;
- `Function.prototype.apply()` 和 `Function.prototype.call()`;
- Reflect.apply()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- `target`(目标) 必需是可被调用的，也就是说必须是一个函数对象;

#### 语法:
```js
let proxy = new Proxy(target, {
  apply(target, thisArg, argumentsList) {...},
});
```

#### 参数:
`target`: 
目标对象(函数)。

`thisArg`: 
被动用时的上下文对象。

`argumentsList`: 
被调用时的参数数组。

#### 例子:
```js
let proxy = new Proxy(function(){}, {
  apply(target, thisArg, argumentsList){
    console.log(`called: ${argumentsList.join(',')}`);
    return argumentsList[0];
  },
});

console.log(proxy('Mr.', '18', 'man')); // ==> called: Mr.,18,man   'Mr.' 
```

## 5. handler.has()
`handler.has` 方法是针对 `in` 操作符的代理方法。

该方法会**拦截**目标对象的以下操作：
- 属性查询: `name in proxy`;
- 继承属性查询: `name in Object.create(proxy)`;
- `with` 检查: `with(proxy) { (name); }`
- Reflect.has()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 如果目标对象的某一属性本身不可被配置，则该属性不能够被代理隐藏;
- 如果目标对象为不可扩展对象，则该对象的属性不能够被代理隐藏。

#### 语法:
```js
let proxy = new Proxy(target, {
  has(target, property) {...},
});
```

#### 参数:
`target`: 
目标对象。

`property`: 
需要检查是否存在的属性。

#### 返回值:
`has` 方法返回一个 `Boolean` 值。

#### 例子:
```js
let proxy = new Proxy({}, {
  has(target, prop) {
    console.log('called: ' + prop);
    return true;
  },
});

console.log('name' in proxy); // ==> 'called: name'  true
```

## 6. handler.construct()
`handler.construct` 方法用于拦截 `new` 操作符，为了使 `new` 操作符在生成的 `Proxy` 对象上生效，用于初始化代理的目标对象自身必需具有 `[[Construct]]` 内部方法(即 `new target` 必须是有效的)。

该方法会**拦截**目标对象的以下操作：
- `new proxy(...args)`;
- Reflect.construct()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 必需返回一个对象。

#### 语法:
```js
let proxy = new Proxy(target, {
  construct(target, argumentsList, newTarget) {...},
});
```

#### 参数:
`target`: 
目标对象。

`argumentsList`: 
`constructor` 的参数列表。

`newTarget`: 
最初被调用的构造函数。

#### 返回值:
`construct` 方法必需返回一个对象。

#### 例子:
```js
let proxy = new Proxy(function() {}, {
  construct(target, argumentsList, newTarget) {
    console.log(`called: ${argumentsList.join(',')}`);
    return {name: argumentsList[0]};
  },
});

console.log(new proxy('Mr.').name); // called: Mr.   Mr.
```

## 7. handler.deleteProperty()
`handler.deleteProperty` 方法用于拦截对对象属性的 `delete` 操作。

该方法会**拦截**目标对象的以下操作：
- 删除属性: `delete proxy[name]` 和 `delete proxy.name`;
- Reflect.deleteProperty()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 如果目标对象的属性是不可配置的，那么该属性不会被删除。

#### 语法:
`target`: 
目标对象。

`property`: 
待删除的属性名。

#### 返回值:
`deleteProperty` 必需返回一个 `Boolean` 类型的值，表示该属性是否被删除。

#### 例子:
```js
let proxy = new Proxy({}, {
  deleteProperty(target, prop) {
    console.log(`called: ${prop}`);
    return true;
  },
});

delete proxy.name; // 'called: name'  true
```

## 8. handler.defineProperty()
`handler.defineProperty` 方法用于拦截对对象的 `Object.defineProperty()` 操作。

该方法会**拦截**目标对象的以下操作：
- `Object.defineProperty()`;
- Reflect.defineProperty();
- proxy.perperty = 'Mr.'。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 如果目标对象不可扩展，将不能添加属性;
- 不能添加或者修改一个属性为不可配置的，如果它不作为一个目标对象的不可配置的属性存在的话;
- 如果目标对象存在一个对应的可配置属性，这个属性可能不会是不可配置的;
- 如果一个属性在目标对象中存在对应的属性，那么 `Object.defineProperty(target, prop, descriptor)` 将不会抛出异常;
- 在严格模式下，`false` 作为 `handler.defineProperty` 方法的返回值的话，将会抛出 `TypeError` 异常。

当调用 `Object.defineProperty()` 或者 `Reflect.defineProperty()`，其中传递的 `descriptor` 有一个限制，只会识别以下属性，其他的属性会被忽略:
- enumerable
- configurable
- writable
- value
- get
- set

#### 语法:
```js
let proxy = new Proxy(target, {
  defineProperty(target, property, descriptor) {...},
});
```

#### 参数:
`target`: 
目标对象。

`property`: 
待检索其描述的属性名。

`descriptor`: 
待定义或修改的属性的描述符。

#### 返回值:
`defineProperty` 方法必需以一个 `Boolean` 返回，表示定义该属性的操作是否成功。

#### 例子:
```js
let proxy = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(`called: ${prop} ==> ${descriptor.value}`);
    return true;
  }
});

let descriptor = {configurable: true, enumerable: true, value: 'Mr.'};
Object.defineProperty(proxy, 'name', descriptor); // ==> 'called: name ==> Mr.'
```

## 9. handler.getOwnPropertyDescriptor()
`handler.getOwnPropertyDescriptor` 方法是 `Object.getOwnPropertyDescriptor()` 的钩子。

该方法会**拦截**目标对象的以下操作：
- `Object.getOwnPropertyDescriptor()`;
- Reflect.getOwnPropertyDescriptor()。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- `getOwnPropertyDescriptor` 必需返回一个 `object` 或 `undefined`;
- 如果属性作为目标对象的不可配置的属性存在，则该属性无法报告为不存在;
- 如果属性作为目标对象的属性存在，并且目标对象不可扩展，则该属性无法报告为不存在;
- 如果属性不存在作为目标对象的属性，并且目标对象不可扩展，则不能将其报告为存在;
- 如果属性不作为目标对象的自身属性存在，或者作为目标对象的可配置属性存在，则不能将其报告为存在;
- `Object.getOwnPropertyDescriptor(target)` 的结果可以使用 `Object.defineProperty` 应用于目标对象，也不会抛出异常。

#### 语法:
```js
let proxy = new Proxy(target, {
  getOwnPropertyDescriptor(target, property) {...},
});
```

#### 参数:
`target`: 
目标对象。

`property`: 
返回属性名称的描述。

#### 返回值:
`getOwnPropertyDesciptor` 方法必需返回一个 `object` 或 `undefined`。

#### 例子:
```js
let proxy = new Proxy({age: 18}, {
  getOwnPropertyDescriptor(target, prop) {
    console.log(`called: ${prop}`);
    return {configurable: true, enumerable: true, value: 'Mr.'};
  }
});

console.log(Object.getOwnPropertyDescriptor(proxy, 'age').value); // ==> called: age  18
```

## 10. handler.getPrototypeOf()
`handler.getPrototypeOf` 是一个代理方法，当读取代理对象的原型时，该方法会被触发。

该方法会**拦截**目标对象的以下操作：
- `Object.getPrototypeOf()`;
- `Reflect.getPrototypeOf()`;
- `__proto__`;
- `Object.prototype.isPrototypeOf()`;
- `instanceof`。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- `getPrototypeOf()` 方法必需返回的一个对象或者 `null`;
- 如果目标对象是不可扩展的，则 `getPrototypeof()` 方法应当返回目标对象本身的原型。

#### 语法:
```js
let proxy = new Proxy(obj, {
  getPrototypeOf(target) {...},
});
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
`getPrototypeOf` 方法必需返回一个对象或者 `null`。

#### 例子:
```js
let obj = {};
let proto = {};
let handler = {
  getPrototypeOf(target) {
    console.log(target === obj);
    console.log(this === handler);
    return proto;
  }
}

let proxy = new Proxy(obj, handler);
console.log(Object.getPrototypeOf(proxy) === proto); // ==> true true true
```

## 11. handler.isExtensible()
`handler.isExtensible` 方法用于拦截对对象的 `Object.isExtensible()`。

该方法会**拦截**目标对象的以下操作：
- `Object.isExtensible()`;
- `Reflect.isExtensible()`。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- `Object.isExtensible(proxy)` 必需同 `Object.isExtensible(target)` 返回相同的值，即返回 `true` 或者 `truely` 的值。但返回 `flase` 或者 `falsely` 的值会报错。

#### 语法:
```js
let proxy = new Proxy(target, {
  isExtensible(target) {...},
});
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
`isExtensible` 方法必需返回一个 `Boolean`  值或可转换成 `Boolean` 的值。

#### 例子:
```js
let proxy = new Proxy({}, {
  isExtensible(target) {
    console.log('called');
    return true;
  }
});

console.log(Object.isExtensible(proxy)); // ==> 'called' true
```

## 12. handler.ownKeys()
`handler.ownKeys` 方法用于拦截 `Reflect.ownKeys()`。

该方法会**拦截**目标对象的以下操作：
- `Object.getOwnPropertyNames()`;
- `Object.getOwnPropertySymbols()`;
- `Object.keys()`;
- `Relect.ownKeys()`。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- `ownKeys` 的结果必需是一个数组;
- 数组的元素类型要么是一个 `String`，要么是一个 `Symbol`;
- 结果列表必需包含目标对象的所有不可配置、自有属性的 `key`;
- 如果目标对象不可扩展，那么结果列表必需包含目标对象的所有自有属性的 `key`，不能有其他值。

#### 语法:
```js
let proxy = new Proxy(target, {
  ownKeys(target) {...},
});
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
`ownKeys` 方法必需返回一个可枚举的对象。

#### 例子:
```js
let proxy = new Proxy({}, {
  ownKeys(target) {
    console.log('called');
    return ['a', 'b', 'c'];
  },
});

console.log(Object.getOwnPropertyNames(proxy)); // ==> 'called' ['a', 'b', 'c']
```

## 13. handler.preventExtensions()
`handler.preventExtensions` 方法用于设置对 `Object.preventExtensions()` 的拦截。

该方法会**拦截**目标对象的以下操作：
- `Object.preventExtensions()`;
- `Relect.preventExtensions()`。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 如果`Object.isExtensible(proxy)` 是 `false`，`Object.preventExtensions(proxy)` 只能返回 `true`。

#### 语法:
```js
let proxy = new Proxy(target, {
  preventExtensions(target) {...},
});
```

#### 参数:
`target`: 
目标对象。

#### 返回值:
`Boolean`。

#### 例子:
```js
let proxy = new Proxy({}, {
  preventExtensions(target) {
    console.log('called');
    Object.preventExtensions(target);
    return true;
  },
});

console.log(Object.preventExtensions(proxy)); // ==> 'called'  Proxy{}
```

## 14. handler.setPrototypeOf()
`handler.setPrototypeOf` 方法用来拦截 `Object.setPrototypeOf()` 。

该方法会**拦截**目标对象的以下操作：
- `Object.setPrototypeOf()`;
- `Relect.setPrototypeOf()`。

但是该方法也必须遵循以下**约束**，否则抛出 `TypeError`:
- 如果`target` 不可扩展，原型参数必须与 `Object.getPrototypeOf(target)` 的值相同。

#### 语法:
```js
let proxy = new Proxy(target, {
  setPrototypeOf(target, prototype) {...},
});
```

#### 参数:
`target`: 
目标对象。

`prototype`: 
对象的新原型或为 `null`。

#### 返回值:
如果成功修改了 `[[Prototype]]`，返回 `true`，否则返回 `fasle`。

#### 例子:
```js
// 如果不想为目标对象设置一个新的原型
// 可以考虑抛出异常或者返回 false
let returnFalse = {
  setPrototypeOf(target, newProto) {
    return false;
  }
};

let throwError = {
  setPrototypeOf(target, newProto) {
    throw new Error('>_<~ error');
  }
};

let target = {};
let newProto = {};

let proxy_1 = new Proxy(target, returnFalse);
let proxy_2 = new Proxy(target, throwError);

Object.setPrototypeOf(proxy_1, newProto); // ==> TypeError
Reflect.setPrototypeOf(proxy_1, newProto); // ==> false

Object.setPrototypeOf(proxy_2, newProto); // ==> Uncaught Error: >_<~ error
Reflect.setPrototypeOf(proxy_2, newProto); // ==> Uncaught Error: >_<~ error
```