import React, { useState, useEffect } from 'react';

const mark = require('./producer.md');
const ReactMarkdown = require('react-markdown/with-html');

const Producer: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('producer.md is loaded...');
      });

  }, []);

  return (
    <div className="Producer">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Producer;
