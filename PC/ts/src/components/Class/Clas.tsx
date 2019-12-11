import React, { useState, useEffect } from 'react';

const mark = require('./class.md');
const ReactMarkdown = require('react-markdown/with-html');

const Clas: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('class.md is loaded...');
      });

    class Greeter {
      greeting: string;
      constructor(message: string) {
        this.greeting = message;
      }

      greet(): string {
        return `Hello ${this.greeting}`;
      }
    }

    let greeter = new Greeter('world');
    console.log(`[Class] greeter.greet() ==> ${greeter.greet()}`);

    class Animal {
      move(distanceInMeters: number = 0): string {
        return `Animal moved ${distanceInMeters}m.`;
      }
    }

    class Dog extends Animal {
      brak(): string {
        return 'Woof! Woof!';
      }
    }

    const dog = new Dog();
    console.log(`[Class] dog.brak() ==> ${dog.brak()}`);
    console.log(`[Class] dog.move(10) ==> ${dog.move(10)}`);
    console.log(`[Class] dog.brak() ==> ${dog.brak()}`);

    class Animals {
      name: string;
      constructor(theName: string) {
        this.name = theName;
      }

      move(distanceInMeters: number = 0): string {
        return `${this.name} moved ${distanceInMeters}m.`;
      }
    }

    class Snake extends Animals {
      constructor(name: string) {
        super(name);
      }

      move(distanceInMeters: number = 5): string {
        return super.move(distanceInMeters);
      }
    }

    class Horse extends Animals {
      constructor(name: string) {
        super(name);
      }

      move(distanceInMeters: number = 45): string {
        return super.move(distanceInMeters);
      }
    }

    let snake: Animals = new Snake('snake');
    let horse: Animals = new Horse('horse');

    console.log(`[Class] snake.move() ==> ${snake.move()}`);
    console.log(`[Class] horse.move() ==> ${horse.move()}`);

    let passcode = 'secret passcode';

    class Employee {
      private _fullName: string = '';

      get fullName(): string {
        return this._fullName;
      }

      set fullName(newName: string) {
        if (passcode === 'secret passcode') {
          this._fullName = newName;
        } else {
          console.error('xxx...');
        }
      }
    }

    let employee = new Employee();
    employee.fullName = 'Mr. Bad';

    console.log(`[Class] employee.fullName ==> ${employee.fullName}`);

    class Grid {
      static origin = { x: 0, y: 0 };

      calculateDistanceFromOrigin(point: { x: number, y: number }): number {
        let xDist: number = (point.x - Grid.origin.x);
        let yDist: number = (point.y - Grid.origin.y);
        return Math.sqrt(xDist ** 2 + yDist ** 2) / this.scale;
      }

      constructor(public scale: number) { }
    }

    let grid = new Grid(1.0); // 1x scale
    console.log(`[Class](1x scale) grid.calculateDistanceFromOrigin({x: 10, y: 10}) ==> ${grid.calculateDistanceFromOrigin({ x: 10, y: 10 })}`);

    grid = new Grid(5.0); // 5x scale
    console.log(`[Class](5x scale) grid.calculateDistanceFromOrigin({x: 10, y: 10}) ==> ${grid.calculateDistanceFromOrigin({ x: 10, y: 10 })}`);

    class Point2D {
      x: number = 1;
      y: number = 1;
    }
    
    interface Point3D extends Point2D {
      z: number;
    }
    
    let point: Point3D = {x: 0, y: 0, z: 0};

    console.log(`[Class] point ==> ${JSON.stringify(point)}`);

  }, []);

  return (
    <div className="Interf">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Clas;
