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
    console.log(`add() ==> ${add()}`)
    console.log(`add(1) ==> ${add(1)}`)
    console.log(`add(1, 2) ==> ${add(1, 2)}`)
    console.log(`add(1, 2, 3) ==> ${add(1, 2, 3)}`)
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
