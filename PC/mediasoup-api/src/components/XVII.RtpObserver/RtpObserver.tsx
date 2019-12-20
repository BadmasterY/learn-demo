import React, { useState, useEffect } from 'react';

const mark = require('./rtpObserver.md');
const ReactMarkdown = require('react-markdown/with-html');

const RtpObserver: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('rtpObserver.md is loaded...');
      });

  }, []);

  return (
    <div className="RtpObserver">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default RtpObserver;
