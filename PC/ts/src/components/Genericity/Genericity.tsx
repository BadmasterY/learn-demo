import React, { useState, useEffect } from 'react';

const mark = require('./genericity.md');
const ReactMarkdown = require('react-markdown/with-html');

const Genericity: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('genericity.md is loaded...');
      });

  }, []);

  return (
    <div className="Interf">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Genericity;
