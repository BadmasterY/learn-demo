import React, { useState, useEffect } from 'react';
import './App.css';

import Overview from './components/I.Overview/Overview';
import Types from './components/II.Types/Types';
import Version from './components/III.Version/Version';
import Observer from './components/IV.Observer/Observer';
import CreateWorker from './components/V.createWorker/CreateWorker';
import GetSupportedRtpCapabilities from './components/VI.getSupportedRtpCapabilities/GetSupportedRtpCapabilities';
import ParseScalabilityMode from './components/VII.parseScalabilityMode/ParseScalabilityMode';

import Router from './components/VIII.Router/Router';
import Transport from './components/IX.Transport/Transport';

const mark = require('./index.md');
const ReactMarkdown = require('react-markdown/with-html');

const App: React.FC = () => {
  const [actived, setActived] = useState('index');
  const [markstr, setMarkstr] = useState('');

  useEffect(() => {
    fetch(mark)
      .then(response => {
        return response.text();
      })
      .then(text => {
        setMarkstr(text);
        console.log('introduce.md is loaded...');
      });

  }, []);

  function isShow(active: string): Boolean {
    return actived === active;
  }

  return (
    <div className="App">
      <div className="App-content">
        <div className="Content-sidbar">
          <ul>
            <span className="start">起步 ↓</span>
            <li style={{ background: isShow('index') ? '#d4d4d4' : '' }} onClick={() => { setActived('index') }}>介绍</li>
            <li style={{ background: isShow('overview') ? '#d4d4d4' : '' }} onClick={() => { setActived('overview') }}>总览</li>
            <span className="basics">基础 ↓</span>
            <li style={{ background: isShow('types') ? '#d4d4d4' : '' }} onClick={() => { setActived('types') }}>Types</li>
            <li style={{ background: isShow('version') ? '#d4d4d4' : '' }} onClick={() => { setActived('version') }}>Version</li>
            <li style={{ background: isShow('observer') ? '#d4d4d4' : '' }} onClick={() => { setActived('observer') }}>Observer</li>
            <li style={{ background: isShow('createworker') ? '#d4d4d4' : '' }} onClick={() => { setActived('createworker') }}>createWorker</li>
            <li style={{ background: isShow('getSupportedRtpCapabilities') ? '#d4d4d4' : '' }} onClick={() => { setActived('getSupportedRtpCapabilities') }}>GetSupportedRtpCapabilities</li>
            <li style={{ background: isShow('parseScalabilityMode') ? '#d4d4d4' : '' }} onClick={() => { setActived('parseScalabilityMode') }}>ParseScalabilityMode</li>
            <span className="extend">扩展 ↓</span>
            <li style={{ background: isShow('router') ? '#d4d4d4' : '' }} onClick={() => { setActived('router') }}>Router</li>
            <li style={{ background: isShow('transport') ? '#d4d4d4' : '' }} onClick={() => { setActived('transport') }}>Transport</li>
          </ul>
        </div>
        <div className="Content-info">
          <div style={{ display: isShow('index') ? 'block' : 'none' }}>
            <div style={{
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}>
              <ReactMarkdown
                source={markstr}
              />
            </div>
          </div>
          <div key='overview' style={{ display: isShow('overview') ? 'block' : 'none' }}>
            <Overview />
          </div>
          <div key='types' style={{ display: isShow('types') ? 'block' : 'none' }}>
            <Types />
          </div>
          <div key='version' style={{ display: isShow('version') ? 'block' : 'none' }}>
            <Version />
          </div>
          <div key='observer' style={{ display: isShow('observer') ? 'block' : 'none' }}>
            <Observer />
          </div>
          <div key='createworker' style={{ display: isShow('createworker') ? 'block' : 'none' }}>
            <CreateWorker />
          </div>
          <div key='getSupportedRtpCapabilities' style={{ display: isShow('getSupportedRtpCapabilities') ? 'block' : 'none' }}>
            <GetSupportedRtpCapabilities />
          </div>
          <div key='parseScalabilityMode' style={{ display: isShow('parseScalabilityMode') ? 'block' : 'none' }}>
            <ParseScalabilityMode />
          </div>
          <div key='router' style={{ display: isShow('router') ? 'block' : 'none' }}>
            <Router />
          </div>
          <div key='transport' style={{ display: isShow('transport') ? 'block' : 'none' }}>
            <Transport />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
