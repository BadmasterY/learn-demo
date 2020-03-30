// 后台登录
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogName, login } from '../../config/default.json';

import './login.css';
import { Form, Input, Button } from 'antd';

const { useVideo, useBackground, noBackground, randomBackgroundSize } = login;
const num = Math.floor(Math.random() * randomBackgroundSize);

function Login() {
    const [isLogging, setLoging] = useState(false);

    function login() {
        setLoging(true);

        setTimeout(() => setLoging(false), 2000);
    }

    return (
        <>
            {
                useVideo ?
                    <video id="login-video" src={''} muted={true} loop={true} autoPlay></video>
                    :
                    ''
            }
            {
                useBackground ?
                    <img id="login-image" src={require(`../../assets/bg/bg_${num}.jpg`)} />
                    :
                    ''
            }
            {
                noBackground ?
                    <div id="login-box"></div>
                    :
                    ''
            }
            <Form
                id="login"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <h2>
                    <Link className="login-blogname" to="/">
                        {blogName}
                    </Link>
                </h2>
                <Form.Item
                    label="Username"
                    name="username"
                >
                    <Input className="login-input" placeholder="Input username..." />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                >
                    <Input.Password className="login-input" placeholder="Input password..." />
                </Form.Item>
                <Button loading={isLogging} block className="login-btn" onClick={login}>{
                    isLogging ?
                        'Logging'
                        :
                        'Login'
                }</Button>
            </Form>
        </>
    );
}

export default Login;
