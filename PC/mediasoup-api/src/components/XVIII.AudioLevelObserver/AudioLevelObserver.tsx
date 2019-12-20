import React, { useState, useEffect } from 'react';

const mark = require('./audioLevelObserver.md');
const ReactMarkdown = require('react-markdown/with-html');

const AudioLevelObserver: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('audioLevelObserver.md is loaded...');
      });

  }, []);

  return (
    <div className="AudioLevelObserver">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default AudioLevelObserver;
