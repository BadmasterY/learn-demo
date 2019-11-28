import React, { useState ,useEffect } from 'react';
import './Func.css';

const mark = require('./function.md');
const ReactMarkdown = require('react-markdown/with-html');

const Func: React.FC = () => {
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
      })
  }, []);

  return (
    <div className="Func">
      <ReactMarkdown
        source={markstr}
      />
    </div>
  );
}

export default Func;
