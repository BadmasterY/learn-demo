import React, { useState, useEffect } from 'react';

const mark = require('./tricks.md');
const ReactMarkdown = require('react-markdown/with-html');

const Tricks: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('tricks.md is loaded...');
      });

  }, []);

  return (
    <div className="Tricks">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Tricks;
