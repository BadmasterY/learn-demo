import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

import { reduxState } from '../../interfaces/state';
import { Action } from '../../interfaces/user';
import { UserRes } from '../../interfaces/response';
import { blogName, login } from '../../config/default.json';
import { types } from '../../redux/ducks/user';

import './login.css';

const { useVideo, useBackground, noBackground, randomBackgroundSize } = login;
const num = Math.floor(Math.random() * randomBackgroundSize);

function Login() {
    const [isLogging, setLoging] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const { isLogin } = useSelector((state: reduxState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLogin) history.push('/');
    }, []);

    // 登录逻辑
    async function login() {
        if (username === '' || password === '') {
            message.error('Please input your username and password!');
            return;
        }
        setLoging(true);

        await axios.post('/user/login', { username, password }).then(res => {
            const data: UserRes = res.data;
            if (data.error === 1) {
                message.error(data.msg);
                return;
            }
            if (typeof data.content === 'object') {
                const { id, name, position } = data.content;
                const action: Action = {
                    type: types.LOGIN,
                    payload: {
                        id,
                        name,
                        position,
                        isLogin: true
                    }
                };
                dispatch(action);
            }
            setLoging(false);
            history.push('/');
        }).catch(err => message.error(err));
    }

    function userNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function passwordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
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
                    <img id="login-image" alt={`bg_${num}.jpg`} src={require(`../../assets/bg/bg_${num}.jpg`)} />
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
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
            >
                <h2>
                    <Link className="login-blogname" to="/">
                        {blogName}
                    </Link>
                </h2>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input
                        className="login-input"
                        onPressEnter={login}
                        defaultValue={username}
                        onChange={userNameChange}
                        placeholder="Input username..."
                        allowClear={true}
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        className="login-input"
                        onPressEnter={login}
                        defaultValue={password}
                        onChange={passwordChange}
                        placeholder="Input password..."
                        autoComplete=''
                    />
                </Form.Item>
                <Button loading={isLogging} block className="login-btn" onClick={login}>{
                    isLogging ?
                        'Logging...'
                        :
                        'Login'
                }</Button>
            </Form>
        </>
    );
}

export default Login;
