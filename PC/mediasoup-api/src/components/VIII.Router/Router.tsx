import React, { useState, useEffect } from 'react';

const mark = require('./router.md');
const ReactMarkdown = require('react-markdown/with-html');

const Router: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('router.md is loaded...');
      });

  }, []);

  return (
    <div className="Router">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Router;
