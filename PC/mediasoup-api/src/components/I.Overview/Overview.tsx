import React, { useState, useEffect } from 'react';

const mark = require('./overview.md');
const ReactMarkdown = require('react-markdown/with-html');

const Overview: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('overview.md is loaded...');
      });

  }, []);

  return (
    <div className="Overview">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Overview;
