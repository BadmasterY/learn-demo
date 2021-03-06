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
import WebRtcTransport from './components/X.WebRtcTransport/WebRtcTransport';
import PlainRtpTransport from './components/XI.PlainRtpTransport/PlainRtpTransport';
import PipeTransport from './components/XII.PipeTransport/PipeTransport';
import Producer from './components/XIII.Producer/Producer';
import Consumer from './components/XIV.Consumer/Consumer';
import DataProducer from './components/XV.DataProducer/DataProducer';
import DataConsumer from './components/XVI.DataConsumer/DataConsumer';
import RtpObserver from './components/XVII.RtpObserver/RtpObserver';
import AudioLevelObserver from './components/XVIII.AudioLevelObserver/AudioLevelObserver';

import RtpParametersAndCapabilities from './components/XIX.RtpParametersAndCapabilities/RtpParametersAndCapabilities';
import SctpParameters from './components/XX.SctpParameters/SctpParameters';
import RtcStatistics from './components/XXI.RtcStatistics/RtcStatistics';
import Tricks from './components/XXII.Tricks/Tricks';

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
            <li style={{ background: isShow('webRtcTransport') ? '#d4d4d4' : '' }} onClick={() => { setActived('webRtcTransport') }}>WebRtcTransport</li>
            <li style={{ background: isShow('plainRtpTransport') ? '#d4d4d4' : '' }} onClick={() => { setActived('plainRtpTransport') }}>PlainRtpTransport</li>
            <li style={{ background: isShow('pipeTransport') ? '#d4d4d4' : '' }} onClick={() => { setActived('pipeTransport') }}>PipeTransport</li>
            <li style={{ background: isShow('producer') ? '#d4d4d4' : '' }} onClick={() => { setActived('producer') }}>Producer</li>
            <li style={{ background: isShow('consumer') ? '#d4d4d4' : '' }} onClick={() => { setActived('consumer') }}>Consumer</li>
            <li style={{ background: isShow('dataProducer') ? '#d4d4d4' : '' }} onClick={() => { setActived('dataProducer') }}>DataProducer</li>
            <li style={{ background: isShow('dataConsumer') ? '#d4d4d4' : '' }} onClick={() => { setActived('dataConsumer') }}>DataConsumer</li>
            <li style={{ background: isShow('rtpObserver') ? '#d4d4d4' : '' }} onClick={() => { setActived('rtpObserver') }}>RtpObserver</li>
            <li style={{ background: isShow('audioLevelObserver') ? '#d4d4d4' : '' }} onClick={() => { setActived('audioLevelObserver') }}>AudioLevelObserver</li>
            <span className="other">补充 ↓</span>
            <li style={{ background: isShow('rtpParametersAndCapabilities') ? '#d4d4d4' : '' }} onClick={() => { setActived('rtpParametersAndCapabilities') }}>RtpParametersAndCapabilities</li>
            <li style={{ background: isShow('sctpParamters') ? '#d4d4d4' : '' }} onClick={() => { setActived('sctpParamters') }}>SctpParamters</li>
            <li style={{ background: isShow('rtcStatistics') ? '#d4d4d4' : '' }} onClick={() => { setActived('rtcStatistics') }}>RtcStatistics</li>
            <li style={{ background: isShow('tricks') ? '#d4d4d4' : '' }} onClick={() => { setActived('tricks') }}>Tricks</li>
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
          <div key='webRtcTransport' style={{ display: isShow('webRtcTransport') ? 'block' : 'none' }}>
            <WebRtcTransport />
          </div>
          <div key='plainRtpTransport' style={{ display: isShow('plainRtpTransport') ? 'block' : 'none' }}>
            <PlainRtpTransport />
          </div>
          <div key='pipeTransport' style={{ display: isShow('pipeTransport') ? 'block' : 'none' }}>
            <PipeTransport />
          </div>
          <div key='producer' style={{ display: isShow('producer') ? 'block' : 'none' }}>
            <Producer />
          </div>
          <div key='consumer' style={{ display: isShow('consumer') ? 'block' : 'none' }}>
            <Consumer />
          </div>
          <div key='dataProducer' style={{ display: isShow('dataProducer') ? 'block' : 'none' }}>
            <DataProducer />
          </div>
          <div key='dataConsumer' style={{ display: isShow('dataConsumer') ? 'block' : 'none' }}>
            <DataConsumer />
          </div>
          <div key='rtpObserver' style={{ display: isShow('rtpObserver') ? 'block' : 'none' }}>
            <RtpObserver />
          </div>
          <div key='audioLevelObserver' style={{ display: isShow('audioLevelObserver') ? 'block' : 'none' }}>
            <AudioLevelObserver />
          </div>
          <div key='rtpParametersAndCapabilities' style={{ display: isShow('rtpParametersAndCapabilities') ? 'block' : 'none' }}>
            <RtpParametersAndCapabilities />
          </div>
          <div key='sctpParamters' style={{ display: isShow('sctpParamters') ? 'block' : 'none' }}>
            <SctpParameters />
          </div>
          <div key='rtcStatistics' style={{ display: isShow('rtcStatistics') ? 'block' : 'none' }}>
            <RtcStatistics />
          </div>
          <div key='tricks' style={{ display: isShow('tricks') ? 'block' : 'none' }}>
            <Tricks />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
