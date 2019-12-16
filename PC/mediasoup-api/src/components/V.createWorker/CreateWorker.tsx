import React, { useState, useEffect } from 'react';

const mark = require('./createWorker.md');
const ReactMarkdown = require('react-markdown/with-html');

const CreateWorker: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('createWorker.md is loaded...');
      });

  }, []);

  return (
    <div className="CreateWorker">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default CreateWorker;
