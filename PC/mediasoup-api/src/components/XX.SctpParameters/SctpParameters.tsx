import React, { useState, useEffect } from 'react';

const mark = require('./sctpParameters.md');
const ReactMarkdown = require('react-markdown/with-html');

const SctpParameters: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('sctpParameters.md is loaded...');
      });

  }, []);

  return (
    <div className="SctpParameters">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default SctpParameters;
