import React, { useState, useEffect } from 'react';

const mark = require('./observer.md');
const ReactMarkdown = require('react-markdown/with-html');

const Observer: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('observer.md is loaded...');
      });

  }, []);

  return (
    <div className="Observer">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Observer;
