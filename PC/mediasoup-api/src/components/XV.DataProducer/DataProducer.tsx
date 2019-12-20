import React, { useState, useEffect } from 'react';

const mark = require('./dataProducer.md');
const ReactMarkdown = require('react-markdown/with-html');

const DataProducer: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('dataProducer.md is loaded...');
      });

  }, []);

  return (
    <div className="DataProducer">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default DataProducer;
