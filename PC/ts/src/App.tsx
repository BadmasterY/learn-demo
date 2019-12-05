import React, { useState } from 'react';
import Func from './components/Func/Function';

import './App.css';

const App: React.FC = () => {
  const [more, setMore] = useState('none');
  const [actived, setActived] = useState('');

  function isShow(active: string): Boolean {
    return actived === active;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ts demo</h1>
        <p>A typescript demo file.For more information, see the 'More' link.</p>
        <p>This is just a simple typescript demo, not involving react code.</p>
        <p>By: <a className="App-link" href="https://github.com/facebook/create-react-app">create-react-app</a>.</p>
        <p>Show <span className="App-link" onClick={() => { setMore('block') }}>More</span>.</p>
      </header>
      <div style={{ display: more }} className="App-content">
        <div className="Content-sidbar">
          <ul>
            <li style={{ background: isShow('function') ? '#d4d4d4' : '' }} onClick={() => { setActived('function') }}>Function</li>
            <li style={{ background: isShow('O2O') ? '#d4d4d4' : '' }} onClick={() => { setActived('O2O') }}>O2O</li>
            <li style={{ background: isShow('Runtime') ? '#d4d4d4' : '' }} onClick={() => { setActived('Runtime') }}>Runtime</li>
          </ul>
        </div>
        <div className="Content-info">
          <div style={{ display: isShow('') ? 'block' : 'none' }}>
            <div style={{
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}>
              <h2>There are some demos</h2>
              <p>Click the left sidebar to view...</p>
            </div>
          </div>
          <div key='function' style={{ display: isShow('function') ? 'block' : 'none' }}>
            <Func />
          </div>
          <div style={{ display: isShow('O2O') ? 'block' : 'none' }}>
            O2O
          </div>
          <div style={{ display: isShow('Runtime') ? 'block' : 'none' }}>
            Runtime
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
