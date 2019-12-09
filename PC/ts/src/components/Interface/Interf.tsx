import React, { useState, useEffect } from 'react';

const mark = require('./interface.md');
const ReactMarkdown = require('react-markdown/with-html');

const Interf: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('interface.md is loaded...');
      });

    function test_1(obj: { name: string }): string {
      return obj.name;
    }

    let obj = { name: 'Mr.', age: 18 };
    console.log(`[Interface] test_1(obj) ==> ${test_1(obj)}`) // ==> 'Mr.'

    interface objValue {
      name: string;
    }

    function test_2(obj: objValue): string {
      return obj.name;
    }

    console.log(`[Interface] test_2(obj) ==> ${test_2(obj)}`);

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

      if (userInfo.age) tempUser.age = userInfo.age;
      if (userInfo.address) tempUser.address = userInfo.address;

      return tempUser;
    }

    console.log(`[Interface] addUser({name: 'Mr.'}) ==> ${JSON.stringify(addUser({ name: 'Mr.' }))}`);

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
        console.log('[Interface] DigitalClock: beep beep');
      }
    }
    
    class AnalogClock implements ClockInterface {
      constructor(h: number, m: number){}
    
      tick(){
        console.log('[Interface] AnalogClock: tick tock');
      }
    }
    
    let digital = createClock(DigitalClock, 12, 17);
    let analog = createClock(AnalogClock, 7, 32);

    digital.tick();
    analog.tick();
    
    interface Shape {
      color: string;
    }
    
    interface Square extends Shape {
      sideLength: number;
    }
    
    let square = {} as Square;
    
    square.color = 'blue';
    square.sideLength = 1;

    console.log(`[Interface] square ==> ${JSON.stringify(square)}`);

    interface Counter {
      (start: number): string;
      interval: number;
      reset(): void;
    }
    
    function getCounter(): Counter {
      let counter = function(start: number){} as Counter;
      counter.interval = 123;
      counter.reset = function(){
        console.log(`[Interface] ok reset`)
      };
    
      return counter;
    }
    
    let count = getCounter();
    count(10);
    count.reset();
    count.interval = 5.0;

    console.log(`[Interface] count ==> ${count}`);

  }, []);

  return (
    <div className="Interf">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Interf;
