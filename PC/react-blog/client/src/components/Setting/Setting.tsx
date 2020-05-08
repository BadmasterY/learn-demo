import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Upload, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload';
import axios from 'axios';

import { Action, Payload } from '../../interfaces/user';
import { UserRes } from '../../interfaces/response';
import { reduxState } from '../../interfaces/state';
import { actions } from '../../redux/ducks/user';
import { user as UserConfig } from '../../config/default.json';
import { RcCustomRequestOptions } from 'antd/lib/upload/interface';

import './setting.css';

const { maxImageSize } = UserConfig;

function Setting() {
    const { isLogin, id, bio, url, nickname, username, avatarUrl, position } = useSelector((state: reduxState) => state.user);
    const [form] = Form.useForm();
    const [isUpdate, setUpdate] = useState(false);
    const dispacth = useDispatch();

    const initFormValue = {
        nickname,
        bio,
        url,
    }

    async function updateProfile() {
        setUpdate(true);
        await form.validateFields().then(async result => {
            const pyload: Payload = result;
            await axios.post('/user/update', { id, ...result }).then(result => {
                const data: UserRes = result.data;
                setUpdate(false);

                if (data.error === 1) {
                    message.error(data.msg);
                    return;
                }
                const action: Action = actions.userUpdate(pyload);
                dispacth(action);
                message.success('Updated!');
            }).catch(err => {
                setUpdate(false);
                message.error('Update error!');
            });

        }).catch(err => {
            setUpdate(false);
            message.error('Please check input!');
            console.log(err);
        });
    }

    function beforeUpload(file: RcFile) {
        const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJPGorPNG) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < maxImageSize;

        if (!isLt2M) {
            message.error(`Image must smaller than ${maxImageSize}MB!`);
            return false;
        }

        return true;
    }

    async function uploadFn(options: RcCustomRequestOptions) {
        const { file, filename } = options;

        const formData = new FormData();
        formData.append('userId', id);
        formData.append('file', file);
        formData.append('filename', filename);

        await axios.post('/user/uploadAvatar', formData).then(result => {
            console.log(result);
        }).catch(err => {
            message.error('Please check network!');
            console.log(err);
        })
    }

    function onUploadChange() {

    }

    return (
        <div className="setting-box" key={id}>
            {
                isLogin ?
                    <Form
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 9 }}
                        initialValues={initFormValue}
                        form={form}
                    >
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                        >
                            <Upload
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                customRequest={uploadFn}
                                onChange={onUploadChange}
                            >
                                {
                                    avatarUrl && avatarUrl !== '' ?
                                        <Avatar src={`/user/${avatarUrl}`} shape="square" size={64} />
                                        :
                                        <Avatar shape="square" size={64}>
                                            {nickname}
                                        </Avatar>
                                }
                                <div className="avatar-text">
                                    <EditOutlined />
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label="Username"
                        >
                            <>{username}</>
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="nickname"
                            help="Input your name, like's your nickname. Does not change the 'username' used to login."
                        >
                            <Input
                                placeholder="Input your name"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Bio"
                            name="bio"
                            help="Input something you like. This will be shown on your home page."
                        >
                            <Input.TextArea
                                placeholder="Input something you like"
                            />
                        </Form.Item>
                        <Form.Item
                            label="URL"
                            name="url"
                        >
                            <Input
                                placeholder="Input your homepage url"
                            />
                        </Form.Item>
                        {
                            position === '管理员' ?
                                <Form.Item
                                    label="System"
                                    help="Manage users and articles."
                                >
                                    <Link to={'/system'}>Background management system</Link>
                                </Form.Item>
                                :
                                ''
                        }
                        <Form.Item
                            label=" "
                            colon={false}
                        >
                            <Button loading={isUpdate} type="primary" onClick={updateProfile}>Update</Button>
                        </Form.Item>
                    </Form>
                    :
                    <div>
                        You haven't signed in yet, <Link to={'/login'}>to login</Link>.
                    </div>
            }
        </div>
    );
}

export default Setting;
