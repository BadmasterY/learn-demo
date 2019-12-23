import React, { useState, useEffect } from 'react';

const mark = require('./rtcStatistics.md');
const ReactMarkdown = require('react-markdown/with-html');

const RtcStatistics: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('rtcStatistics.md is loaded...');
      });

  }, []);

  return (
    <div className="RtcStatistics">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default RtcStatistics;
