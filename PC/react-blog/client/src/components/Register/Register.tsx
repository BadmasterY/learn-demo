import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

import { Response } from '../../interfaces/response';
import { md5 } from '../../utils/md5';

import './register.css';

function Register(props: {callback: Function}) {
    const { callback } = props;
    const [isRegister, setRegister] = useState(false);
    const [form] = Form.useForm();

    async function register() {
        setRegister(true);
        await form.validateFields().then(async result => {
            const { username, nickname, password } = result;
            const md5Password = md5(password);

            await axios.post('/user/register', {
                username,
                nickname,
                password: md5Password,
            }).then(result => {
                const data: Response = result.data;
                if(data.error === 1) {
                    message.error(data.msg);
                }else {
                    message.success('Register success!');
                    callback();
                }
                setRegister(false);
            }).catch(err => {
                message.error('Uh-oh! Something is bad...');
                console.log(err);
                setRegister(false);
            })
        }).catch(err => {
            console.log(err);
            message.error('Please check your input!');
            setRegister(false);
        });
    }

    return (
        <Form
            form={form}
            className="register"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Must input your username!" }]}
            >
                <Input onPressEnter={register} placeholder="Input your username" />
            </Form.Item>
            <Form.Item
                label="Name"
                name="nickname"
                rules={[{ required: true, max: 10, message: "Must input your nickname!" }]}
            >
                <Input onPressEnter={register} placeholder="Input your nickname" />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Must input your password!" }]}
            >
                <Input.Password onPressEnter={register} placeholder="Input your password" />
            </Form.Item>
            <Button loading={isRegister} type="primary" block onClick={register}>Register</Button>
        </Form>
    );
}

export default Register;
