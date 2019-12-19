import React, { useState, useEffect } from 'react';

const mark = require('./webRtcTransport.md');
const ReactMarkdown = require('react-markdown/with-html');

const WebRtcTransport: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('webRtcTransport.md is loaded...');
      });

  }, []);

  return (
    <div className="WebRtcTransport">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default WebRtcTransport;
