import React, { useState, useEffect } from 'react';

const mark = require('./types.md');
const ReactMarkdown = require('react-markdown/with-html');

const Types: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('types.md is loaded...');
      });

  }, []);

  return (
    <div className="Types">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Types;
