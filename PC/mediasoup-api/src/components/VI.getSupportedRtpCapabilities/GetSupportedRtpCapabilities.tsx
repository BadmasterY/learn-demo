import React, { useState, useEffect } from 'react';

const mark = require('./getSupportedRtpCapabilities.md');
const ReactMarkdown = require('react-markdown/with-html');

const GetSupportedRtpCapabilities: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('getSupportedRtpCapabilities.md is loaded...');
      });

  }, []);

  return (
    <div className="GetSupportedRtpCapabilities">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default GetSupportedRtpCapabilities;
