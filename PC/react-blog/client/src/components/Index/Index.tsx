import React from 'react';
import { Button } from 'antd';

function clickFn() {
    console.log('点击!');
}

function App() {
  return (
    <div className="index">
        <Button onClick={clickFn}>Hello World!</Button>
    </div>
  );
}

export default App;
