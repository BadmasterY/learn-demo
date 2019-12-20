import React, { useState, useEffect } from 'react';

const mark = require('./dataConsumer.md');
const ReactMarkdown = require('react-markdown/with-html');

const DataConsumer: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('dataConsumer.md is loaded...');
      });

  }, []);

  return (
    <div className="DataConsumer">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default DataConsumer;
