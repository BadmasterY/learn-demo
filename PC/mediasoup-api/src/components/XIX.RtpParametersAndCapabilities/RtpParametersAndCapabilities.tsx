import React, { useState, useEffect } from 'react';

const mark = require('./rtpParametersAndCapabilities.md');
const ReactMarkdown = require('react-markdown/with-html');

const RtpParametersAndCapabilities: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('rtpParametersAndCapabilities.md is loaded...');
      });

  }, []);

  return (
    <div className="RtpParametersAndCapabilities">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default RtpParametersAndCapabilities;
