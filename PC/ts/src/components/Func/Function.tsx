import React, { useState, useEffect } from 'react';

const mark = require('./function.md');
const ReactMarkdown = require('react-markdown/with-html');

const Func: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('function.md is loaded...');
      });

    function add(...arg: number[]): number {
      let result = 0;
      for (let value of arg) {
        result += value;
      }

      return result;
    }
    console.log(`[Function] add() ==> ${add()}`)
    console.log(`[Function] add(1) ==> ${add(1)}`)
    console.log(`[Function] add(1, 2) ==> ${add(1, 2)}`)
    console.log(`[Function] add(1, 2, 3) ==> ${add(1, 2, 3)}`)

    function test(name: string): string;
    function test(age: number): string;
    function test(single: boolean): string;
    function test(value: string | number | boolean): string {
      switch (typeof value) {
        case 'string':
          return `My name is ${value}.`;
        case 'number':
          return `I'm ${value} years old.`;
        case 'boolean':
          return value ? `I'm single.` : `I'm not single.`;
        default:
          return `Invalid Operation.`;
      }
    }

    console.log(`[Function] test('Mr.') ==> ${test('Mr.')}`)
    console.log(`[Function] test(18) ==> ${test(18)}`)
    console.log(`[Function] test(true) ==> ${test(true)}`)
    
  }, []);

  return (
    <div className="Func">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Func;
