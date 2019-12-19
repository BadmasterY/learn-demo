import React, { useState, useEffect } from 'react';

const mark = require('./pipeTransport.md');
const ReactMarkdown = require('react-markdown/with-html');

const PipeTrasnport: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('pipeTransport.md is loaded...');
      });

  }, []);

  return (
    <div className="PipeTrasnport">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default PipeTrasnport;
