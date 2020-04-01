import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Form, Input, Button, message } from 'antd';
import axios from 'axios';

import { Action, Payload } from '../../interfaces/user';
import { UserRes } from '../../interfaces/response';
import { reduxState } from '../../interfaces/state';
import { actions } from '../../redux/ducks/user';

import './user.css';

function User() {
    const { isLogin, id, bio, url, name, username, position } = useSelector((state: reduxState) => state.user);
    const [isUpdate, setUpdate] = useState(false);
    const [updateName, setName] = useState(name);
    const [updateBio, setBio] = useState(bio);
    const [updateUrl, setUrl] = useState(url);
    const dispacth = useDispatch();

    const initFormValues = {
        bio,
        url,
        name,
    };

    async function updateProfile() {
        setUpdate(true);
        const payload: Payload = {
            id,
            name: updateName,
            bio: updateBio,
            url: updateUrl,
        };

        await axios.post('/user/update', payload).then(result => {
            const data: UserRes = result.data;
            setUpdate(false);

            if(data.error === 1) {
                message.error(data.msg);
                return;
            }
            const action: Action = actions.userUpdate(payload);
            dispacth(action);
            message.success('Updated!');
        }).catch(err => {
            setUpdate(false);
            message.error('Update error!');
        });

    }

    function nameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    function bioChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setBio(e.target.value);
    }

    function urlChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUrl(e.target.value);
    }

    return (
        <div className="user-box" key={id}>
            {
                isLogin ?
                    <Form
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 9 }}
                        initialValues={initFormValues}
                    >
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                        >
                            <Avatar shape="square" size="large">
                                {name}
                            </Avatar>
                        </Form.Item>
                        <Form.Item
                            label="Username"
                        >
                            <>{username}</>
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            help="Input your name, like's your nickname. Does not change the 'username' used to login."
                        >
                            <Input
                                placeholder="Input your name"
                                defaultValue={name}
                                onChange={nameChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Bio"
                            name="bio"
                            help="Input something you like. This will be shown on your home page."
                        >
                            <Input.TextArea
                                placeholder="Input something you like"
                                defaultValue={bio}
                                onChange={bioChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label="URL"
                            name="url"
                        >
                            <Input
                                placeholder="Input your homepage url"
                                defaultValue={url}
                                onChange={urlChange}
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

export default User;
