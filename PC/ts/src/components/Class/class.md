## 类
传统的 `JavaScript` 程序使用函数和基于原型的继承来创建可重用的组件，但对于熟悉使用面向对象方式的程序员来讲就有些棘手，因为这一部分程序员用的是基于类的继承并且对象是由类构建出来的。 

从 `ECMAScript 2015`，也就是 `ECMAScript 6` 开始，`JavaScript` 程序员将能够使用基于类的面向对象的方式。

#### 类
```js
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return `Hello ${this.greeting}`;
  }
}

let greeter = new Greeter('world');
greeter.greet(); // ==> 'Hello world'
```

#### 继承
在 `TypeScript` 里，可以使用常用的面向对象模式。基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。

```js
class Animal {
  move(distanceInMeters: number = 0): void {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  brak(): void {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog();
dog.brak();
dog.move(10);
dog.brak();
```

这个例子展示了最基本的继承：类从基类中继承了属性和方法。

这里， `Dog` 是一个 派生类，它派生自 `Animal` 基类，通过 `extends` 关键字。

派生类通常被称作*子类*，基类通常被称作*超类*。

```js
class Animals {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }

  move(distanceInMeters: number = 0): void {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animals {
  constructor(name: string) {
    super(name);
  }

  move(distanceInMeters: number = 5): void {
    super.move(distanceInMeters);
  }
}

class Horse extends Animals {
  constructor(name: string) {
    super(name);
  }

  move(distanceInMeters: number = 45): void {
    super.move(distanceInMeters);
  }
}

let snake: Animals = new Snake('snake');
let horse: Animals = new Horse('horse');

snake.move();
horse.move();
```

#### 公共，私有与受保护的修饰符

##### public
上述例子中，可以自由的访问程序里定义的成员。如果对其它语言中的类比较了解，会注意到在之前的代码中并没有使用 `public` 修饰符。因为 `TypeScript` 中，成员默认为 `public`。

```js
class Animals {
  public name: string;
  public constructor(theName: string) {
    this.name = theName;
  }

  public move(distanceInMeters: number = 0): void {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```

##### private
当成员被标记成 `private` 时，它就不能在声明它的类外部访问。
```js
class Animals {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animals('Cat');
animal.name; // ==> error
```

`TypeScript` 使用的是结构性类型系统。当比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，就认为它们的类型时兼容的。

而当比较带有 `private` 或 `protected` 成员的类型的时候，情况并不相同。

如果其中一个类型包含一个 `private` 成员，那么只有当另外一个类型中也存在这样一个 `private` 成员，并且它们都是来自同一处声明时，才认为这两个类型时兼容的。这个规则同样适用于 `protected`。

```js
class Animals {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animals {
  constructor(name: string = 'Rhino') {
    super(name);
  }
}

class Employee {
  private name: string;
  constructor(theName: string = 'Employee') {
    this.name = theName;
  }
}

let animal: Animals;
let rhino = new Rhino();
let employee = new Employee();

animal = rhino;
animal = employee; // ==> error
```

##### protected
`protected` 与 `private` 修饰符行为类似，但是 `protected` 成员在派生类中仍然可以访问。

```js
class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;
  
  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  getElevatorPitch(): string {
    return `My name is ${this.name} and work in ${this.department}.`
  }
}

let emp = new Employee('Mr.', 'China');
emp.getElevatorPitch();
emp.name; // ==> error，受保护，只能在 Person 或其子类内访问
```

构造函数也可以被标记成 `protected`。这意味着这个类不能在包含它的类外被实例化，但是能被继承。

#### readonly
使用 `readonly` 修饰符将属性设置为只读的。只读属性必须在声明时或构造函数里被初始化。

```js
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}

let dad = new Octopus('Man with the 8 strong legs.');
dad.name = 'Man with the 3-piece suit.'; // ==> error
```

##### 参数属性

在上面的例子中，必须在 `Octopus` 类里定义一个只读成员 `name` 和一个参数为 `theName` 的构造函数，并且立刻将 `theName` 的值赋给 `name`，这种情况经常会遇到。

*参数属性*可以方便地在一个地方定义并初始化一个成员。下面的例子是对之前 `Octopus` 类的修改版，使用了参数属性：

```js
class Octopus {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string){}
}
```

#### 存取器
`TypeScript` 支持通过 `getters/setters` 的形式来截取对对象成员的访问。它能有效的控制对对象成员的访问。

```js
class Employee {
  fullName: string;
}

let employee = new Employee();
employee.fullName = 'Mr. Bad';
if(employee.fullName) {
  console.log(employee.fullName);
}
```

这样的写法可以随意的设置 `fullName`，非常便捷，但是也带来了不可控的麻烦。

```js
let passcode = 'secret passcode ? error';

class Employee {
  private _fullName: string = '';
  
  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string){
    if(passcode == 'secret passcode') {
      this._fullName = newName;
    }else {
      console.error('xxx...');
    }
  }
}

let employee = new Employee();
employee.fullName = 'Mr. Bad';

console.log(employee.fullName);
```

**注意**: 存取器需要将编译器设置为输出 `ECMAScript 5` 或更高。不支持降级到 `ECMAScript 3`。其次只带有 `get` 而不具备 `set` 的存取器自动被推断为 `readonly`。

#### 静态属性
上述例子只讨论了类的实例成员，那些仅当类被实例化的时候才会被初始化的属性。

同样也可以创建静态属性，这些属性将保留在类本身而不是类的实例上。

```js
class Grid {
  static origin = {x: 0, y: 0};

  calculateDistanceFromOrigin(point: {x: number, y: number}): number {
    let xDist: number = (point.x - Grid.origin.x);
    let yDist: number = (point.y - Grid.origin.y);
    return Math.sqrt(xDist ** 2 + yDist ** 2) / this.scale;
  }

  constructor(public scale: number) {}
}

let grid = new Grid(1.0); // 1x scale

console.log(grid.calculateDistanceFromOrigin({x: 10, y: 10}));
```

#### 抽象类
抽象类作为其他派生类的基类使用，一般不会直接被实例化。这不同于接口，抽象类可以包含成员的实现细节。

`abstract` 修饰符用于定义抽象类和在抽象类内定义抽象方法。

```js
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log('roaming the earch...');
  }
}
```

抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。

抽象方法的语法与接口方法相似。两者都是定义方法签名但**不包含**方法体。而抽象方法必须包含 `abstract` 修饰符。

```js
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log(`Department name: ${this.name}`);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
  constructor(){
    super('Accounting and Auditing'); // 派生类中必须调用 super
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}

let department: Department; // 允许是一个对抽象类型的引用
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();

department.generateReports(); // ==> error，方法在 Department 上不存在
department = new Department(); // ==> error，不能创建一个抽象类的实例
```

#### 高级技巧
##### 构造函数
在 `TypeScript` 里声明了一个类的时候，实际上同时声明了很多东西。首先是类的*实例*的类型。

```js
class Greeter {
  greetingL string;
  constructor(message: string) {
    this.greeting = message;
  }

  greet(): string {
    return `Hello, ${this.greeting}`;
  }
}

let greeter: Greeter;
greeter = new Greeter('world');
console.log(greeter.greet());
```

`let greeter: Greeter`，意思是 `Greeter` 类的实例的类型是 `Greeter`。这对于用过其它面向对象语言的程序员来讲已经是老习惯了。

同时也创建了一个叫做*构造函数*的值。这个函数会在使用 `new` 创建类实例的时候被调用。

当调用 `new` 并执行了这个函数后，便会得到一个类的实例。这个构造函数也包含了类的所有静态属性。换个角度说，可以认为类具有**实例部分**与**静态部分**这两个部分。

##### 把类当接口
类定义会创建两个东西：类的实例类型和一个构造函数。因为类可以创建出类型，所以能够在允许使用接口的地方使用类。

```js
class Point2D {
  x: number;
  y: number;
}

interface Point3D extends Point2D {
  z: number;
}

let point: Point3D = {x: 0, y: 0, z: 0};
```