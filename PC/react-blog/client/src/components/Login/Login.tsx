import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, message, Modal } from 'antd';
import axios from 'axios';

import Register from '../Register/Register';
import { reduxState } from '../../interfaces/state';
import { Action, Payload } from '../../interfaces/user';
import { UserRes } from '../../interfaces/response';
import { blogName, login } from '../../config/default.json';
import { actions } from '../../redux/ducks/user';

import './login.css';

const { useVideo, useBackground, noBackground, randomBackgroundSize } = login;
const num = Math.floor(Math.random() * randomBackgroundSize);

function Login() {
    const [isLogging, setLoging] = useState(false);
    const [form] = Form.useForm();
    const [showRegister, setRegister] = useState(false);
    const history = useHistory();
    const { isLogin } = useSelector((state: reduxState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLogin) history.push('/');
    });

    // 登录逻辑
    async function login() {
        setLoging(true);
        await form.validateFields().then(async result => {
            // axios
            await axios.post('/user/login', result).then(res => {
                setLoging(false);
                const data: UserRes = res.data;
                if (data.error === 1) {
                    message.error(data.msg);
                    return;
                }
                message.success('Login success!');
                if (typeof data.content === 'object') {
                    const payload: Payload = Object.assign({}, data.content, {isLogin: true});
                    const action: Action = actions.userLogin(payload);
                    // 触发 user login
                    dispatch(action);
                }
            }).catch(err => {
                setLoging(false);
                message.error(err);
            });
        }).catch(err => {
            setLoging(false);
            message.error('Please input username and password!');
            console.log(err);
        });
    }

    function showFn() {
        setRegister(true);
    }

    function closeFn() {
        setRegister(false);
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
                hideRequiredMark={true}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                form={form}
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
                        autoFocus={true}
                        className="login-input"
                        onPressEnter={login}
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
                <Button
                    className="login-register"
                    type="link"
                    onClick={showFn}
                >register now!</Button>
            </Form>
            <Modal
                visible={showRegister}
                onCancel={closeFn}
                footer={null}
                closable={false}
                destroyOnClose={true}
            >
                <Register callback={closeFn} />
            </Modal>
        </>
    );
}

export default Login;
