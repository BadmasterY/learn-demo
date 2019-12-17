import React, { useState, useEffect } from 'react';

const mark = require('./transport.md');
const ReactMarkdown = require('react-markdown/with-html');

const Transport: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('transport.md is loaded...');
      });

  }, []);

  return (
    <div className="Transport">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Transport;
