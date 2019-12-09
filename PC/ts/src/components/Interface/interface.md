## 接口

#### 接口初探
```js
// 常规书写
// typescript 只会判断 obj.name 是否存在
// 而不会严格判断是否还有其他属性

function test_1(obj: {name: string}): string {
  return obj.name;
}

let obj = {name: 'Mr.', age: 18};
console.log(test_1(obj)); // ==> 'Mr.'

// 接口描述

interface objValue {
  name: string;
}

function test_2(obj: objValue): string {
  return obj.name;
}

console.log(test_2(obj)); // ==> 'Mr.'
```

`objValue` 接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 `name` 属性且类型为 `string` 的对象。

有一点值得提的是，类型检查器**不会**去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

#### 可选属性
接口里的属性不全都是必需的。有些是只在某些条件下存在，或者根本不存在。可选属性在应用接口时很常见，即给函数传入的参数对象中只有部分属性赋值了。

```js
interface user {
  name: string;
  age?: number;
  address?: string;
}

function addUser(userInfo: user): user {
  let tempUser = {
    name: userInfo.name,
    age: 99,
    address: 'China',
  };

  if(userInfo.age) tempUser.age = userInfo.age;
  if(userInfo.address) tempUser.address = userInfo.address;

  return tempUser;
}

let newUser = addUser({name: 'Mr.'}); // ==> {name: 'Mr.', age: 99, address: 'China'}
```

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个 `?` 符号。

好处：
- 可以对可能存在的属性进行预定义。
- 可以捕获引用了不存在的属性时的错误。

```js
if(userInfo.agee) {…} // Error: 'agee' 在 user 中未定义
```

#### 只读属性
一些对象属性只能在对象刚刚创建的时候修改其值。 可以在属性名前用 `readonly` 来指定只读属性:

```js
interface Point_2d {
  readonly x: number;
  readonly y: number;
}

let point: Point_2d = {x: 1, y: 1};

// 一旦创建就允许改变
// 如果没有检测机制并不会阻塞编译
// 因为这在 js 中是没有任何问题的

point.x = 10; // error
```

同时 `TypeScript` 具有 `ReadonlyArray<T>` 类型，与 `Array<T>` 相似，只是把所有可变方法去掉，因此可以确保数组创建之后再也不能被修改:

```js
let arr: number[] = [1, 2, 3];
let arr_readonly: ReadonlyArray<number> = arr;

arr_readonly[0] = 0; // ==> error
arr_readonly.push(4); // ==> error
arr_readonly.length = 100; // ==> error

arr = arr_readonly as number[]; // ==> 'ok'
```

#### 额外的属性检查
有时需要关注那些接口(interface)中的非必须变量，或者其他额外的变量。在 `TypeScript` 中，接口未声明的变量直接使用会产生错误信息。
```js
interface Point {
  x: number;
  y: number;
}

let point: Point = {x: 0, y: 0, z: 0}; // ==> error!
```

最佳的方式是能够添加一个字符串索引签名，前提是能够确定这个对象可能具有某些做为特殊用途使用的额外属性。

```js
interface Point {
  x: number;
  y: number;
  [propName: string]: any;
}

let point: Point = {x: 0, y: 0, z: 0}; // ==> ok!
```

也可以通过一些特殊的形式快速解决:
```js
// 使用 as
let point: Point = ({x: 0, y: 0, z: 0}) as Point;

// 直接绕过检测
let p = {x: 0, y: 0, z: 0};
let point = p;
```

要留意，在像上面一样的快速处理的代码里，可能不应该去绕开这些检查。 对于包含方法和内部状态的复杂对象字面量来讲，可能需要使用这些技巧，但是大部额外属性检查错误是真正的 `bug`。 

就是说遇到了额外类型检查出的错误，应该去审查一下类型声明。

#### 函数类型
接口可以描述 `JavaScript` 中对象拥有的各种各样的外形。除了描述带有属性的普通对象外，接口也可以描述函数类型。

为了使用接口表示函数类型，需要给接口定义一个调用签名。它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型:
```js
interface AddUserFn {
  (name: string, age: number): {name: string, age: number};
}
```

这样定义之后，可以像使用其他接口一样使用这个函数类型的接口。

```js
let addUser: AddUserFn;
addUser = (name: string, age: number) {
  // do something...
  return {name, age};
}
```

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。

```js
let addUser: AddUserFn;
addUser = (name: string, age: number) {
  // do something...
  return {name, age};
}

// or

addUser = (n: string, a: number) {
  return {n, a};
}
```

函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。

如果不想指定类型，`TypeScript` 的类型系统会推断出参数类型，因为函数直接赋值给了 `AddUserFn` 类型变量。

函数的返回值类型是通过其返回值推断出来的。如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型与 `AddUserFn` 接口中的定义不匹配。

```js
addUser = (name: string, age: number) {
  // do something...
  return `name: ${name}, age: ${age}`; // ==> error!
}
```

#### 可索引的类型

与使用接口描述函数类型差不多，可以描述那些能够通过索引得到的类型，比如 `arr[0]` 或者 `map['keys']`。

可索引类型具有一个*索引签名*，它描述了对象索引的类型，还有相应的索引返回值类型。

```js
interface StringArray {
  [index: number]: string;
}

let arr: StringArray;
arr = ['Mr.', 'Badmaster'];

let name: string = arr[0];
```

`TypeScript` 支持两种索引签名: 字符串和数字。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的**子类**。

因为当使用 `number` 索引时，`JavaScript` 会将其转换成 `string` 然后再去索引对象。

```js
class Animal {
  name: string;
}

class Dog extends Animal {
  breed: string;
}

interface Animals {
  [x: number]: Animal; // ==> error
  [x: string]: Dog;
}
```

同时，字符串索引签名能够很好的描述 `dictionary` 模式，并且它们也会确保所有属性与其返回值类型相匹配。因为字符串索引声明了 `obj.prototype` 和 `obj['prototype']` 两种形式。

```js
interface NumberDictionary {
  [index: string]: number;
  length: number;
  name: string; // ==> error! 返回值类型不匹配
}
```

也可以将索引签名设置为只读，这样就防止给索引赋值:
```js
interface ReadonlyArray {
  readonly [index: number]: string;
}

let arr: ReadonlyArray = ['Mr.', 'China'];
arr[2] = 'Hello!'; // ==> error!
```

#### 类类型
##### 实现接口
接口的基本作用是用它来明确的强制一个类去符合某种契约:
```js
interface AddInterface {
  num: number;
  add(x: number): number;
}

class Add implements AddInterface {
  num = 0;
  add(x: number) {
    this.num += x;
    return this.num;
  }
}
```

##### 类静态部分与实例部分的区别

类是具有两个类型的：静态部分的类型和实例的类型。

当一个类实现了一个接口时，只对其实例部分进行类型检查。 `constructor` 存在于类的静态部分，所以不在检查的范围内。应该直接操作类的静态部分。

```js
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}

  tick() {
    console.log('beep beep');
  }
}

class AnalogClock implements ClockInterface {
  constructor(h: number, m: number){}

  tick(){
    console.log('tick tock');
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

#### 继承接口
和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```js
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
// .tsx 中使用 as
// let square = {} as Square;

square.color = 'blue';
square.sideLength = 1;
```

#### 混合类型
接口能够描述 `JavaScript` 里丰富的类型。 因为 `JavaScript` 其动态灵活的特点，有时会希望一个对象可以同时具有上面提到的多种类型。

```js
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function(start: number){};
  // .tsx 使用 as
  // let counter = function(start: number){} as Counter;
  counter.interval = 123;
  counter.reset = function(){
    console.log(`ok reset`)
  };

  return counter;
}

let count = getCounter();
count(10);
count.reset();
count.interval = 5.0;
```

#### 接口继承类
当接口继承了一个类类型时，它会继承类的成员但不包括其实现。就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的 `private` 和 `protected` 成员。

这意味着当创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（`implement`）。

```js
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select(){}
}

class TextBox extends Control {
  select(){}
}

// error: Property 'state' is missing in type 'Image'
// but required in type 'SelectableControl'. 

class Image implements SelectableControl {
  select(){}
}
```