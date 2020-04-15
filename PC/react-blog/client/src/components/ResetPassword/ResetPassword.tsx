import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { reduxState } from '../../interfaces/state';
import { Reset } from '../../interfaces/resetpassword';
import { Response } from '../../interfaces/response';
import { md5 } from '../../utils/md5';

import './reset.css';

function ResetPassword(props: { callback: Function }) {
    const { id } = useSelector((item: reduxState) => item.user);
    const [form] = Form.useForm();
    const [reseting, setReset] = useState(false);
    const { callback } = props;

    async function reset() {
        setReset(true);
        await form.validateFields().then(async result => {
            const { oldpass ,newpass, aginpass } = (result as Reset);
            if(oldpass === newpass) {
                message.error('Password is same! Please input other password!');
                setReset(false);
                return;
            }
            
            if(newpass === aginpass) {
                const md5OldPass = md5(oldpass);
                const md5NewPass = md5(newpass);

                await axios.post('/user/resetPassword', { 
                    id, 
                    oldpass: md5OldPass, 
                    newpass: md5NewPass 
                }).then((result) => {
                    const data: Response = result.data;
                    setReset(false);
                    if(data.error === 1) {
                        message.error(data.msg);
                        return;
                    }
                    message.success('Reset success!');

                    callback();
                }).catch(err => {
                    setReset(false);
                    message.error('Please try again later!');
                    console.log(err);
                });
            }else {
                setReset(false);
                message.error('Please check whether the two passwords are the same!');
            }

        }).catch(err => {
            setReset(false);
            console.log(err);
            message.error('Please check your input!');
        });
    }

    return (
        <Form
            className="reset-password"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
        >
            <Form.Item
                label="Old password"
                name="oldpass"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password
                    autoFocus={true}
                    onPressEnter={reset}
                    placeholder="Input your password"
                />
            </Form.Item>
            <Form.Item
                label="New password"
                name="newpass"
                rules={[{ required: true, message: 'Please input your new password!' }]}
            >
                <Input.Password onPressEnter={reset} placeholder="Input your new password" />
            </Form.Item>
            <Form.Item
                label="New password"
                name="aginpass"
                rules={[{ required: true, message: 'Please input your new password, agin!' }]}
            >
                <Input.Password onPressEnter={reset} placeholder="Input agin" />
            </Form.Item>
            <Button loading={reseting} danger block onClick={reset}>{reseting ? 'Resetting' : 'Reset'}</Button>
        </Form>
    );
}

export default ResetPassword;