import React, { useState, useEffect } from 'react';

const mark = require('./plainRtpTransport.md');
const ReactMarkdown = require('react-markdown/with-html');

const PlainRtpTransport: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('plainRtpTransport.md is loaded...');
      });

  }, []);

  return (
    <div className="PlainRtpTransport">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default PlainRtpTransport;
