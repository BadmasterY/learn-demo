import React, { useState, useEffect } from 'react';

const mark = require('./parseScalabilityMode.md');
const ReactMarkdown = require('react-markdown/with-html');

const ParseScalabilityMode: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('parseScalabilityMode.md is loaded...');
      });

  }, []);

  return (
    <div className="ParseScalabilityMode">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default ParseScalabilityMode;
