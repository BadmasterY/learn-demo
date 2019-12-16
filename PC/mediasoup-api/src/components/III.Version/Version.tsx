import React, { useState, useEffect } from 'react';

const mark = require('./version.md');
const ReactMarkdown = require('react-markdown/with-html');

const Version: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('version.md is loaded...');
      });

  }, []);

  return (
    <div className="Version">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Version;
