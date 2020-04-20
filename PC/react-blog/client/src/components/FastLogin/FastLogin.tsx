import React, { useState } from 'react';
import { Modal, Form, Button, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { md5 } from '../../utils/md5';
import { UserRes } from '../../interfaces/response';
import { Action, Payload } from '../../interfaces/user';
import { actions } from '../../redux/ducks/user';

import './fastlogin.css';

interface Props {
    isShow: boolean;
    closeFn: () => void;
    callback?: () => void;
}

function FastLogin(props: Props) {
    const { isShow, closeFn, callback } = props;

    const [isLogging, setLogging] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    
    function onCancel() {
        closeFn();
    }

    async function login() {
        setLogging(true);
        await form.validateFields().then(async result => {
            // axios
            const { username, password } = result;
            const md5Password = md5(password);
            await axios.post('/user/login', { username, password: md5Password }).then(res => {
                setLogging(false);
                const data: UserRes = res.data;
                if (data.error === 1) {
                    message.error(data.msg);
                    return;
                }
                message.success('Login success!');
                if (typeof data.content === 'object') {
                    const payload: Payload = Object.assign({}, data.content, {isLogin: true});
                    const action: Action = actions.userLogin(payload);
                    // user login
                    dispatch(action);
                }
                if(callback) callback();
            }).catch(err => {
                setLogging(false);
                message.error(err);
            });
        }).catch(err => {
            setLogging(false);
            message.error('Please input username and password!');
            console.log(err);
        });
    }

    return (
        <Modal
            className="fastlogin"
            visible={isShow}
            closable={false}
            footer={null}
            onCancel={onCancel}
        >
            <Form
                form={form}
                hideRequiredMark={true}
            >
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
            </Form>
        </Modal>
    )
}

export default FastLogin;