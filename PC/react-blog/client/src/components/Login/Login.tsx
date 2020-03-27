import React from 'react';
import { Button } from 'antd';

function clickFn() {
    console.log('点击!');
}

function Login() {
  return (
    <div className="index">
        <Button onClick={clickFn}>我是登录界面</Button>
    </div>
  );
}

export default Login;
