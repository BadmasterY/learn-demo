import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, Typography, Button, Skeleton, Space } from 'antd';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';

import { reduxState } from '../../interfaces/state';
import { } from '../../interfaces/user';

import './user.css';

const { Title, Paragraph } = Typography;

function User() {
    const { isLogin, username, nickname, bio, url, position } = useSelector((item: reduxState) => item.user);
    const [ loading, setLoading ] = useState(false);

    return (
        <div className="user-box">
            {
                !isLogin ?
                    <>
                        You haven't signed in yet, <Link to={'/login'}>to login</Link>.
                    </>
                    :
                    <>
                    <Typography className="user-sider">
                        <Avatar size={200} shape="square">{nickname}</Avatar>
                        <Title level={3} className="user-nickname">{nickname}</Title>
                        <Title level={4} id="user-name" className="user-name">{username}</Title>
                        <Paragraph>{bio}</Paragraph>
                        <Paragraph><LinkOutlined/>: <a href={`http://${url}`}>{url}</a></Paragraph>
                        <Paragraph>
                            <UserOutlined /> {position}
                        </Paragraph>
                        <Button danger>Reset Password</Button>
                    </Typography>
                    <Skeleton 
                        className="user-content"
                        loading={loading}
                        active
                    >
                        <div className="user-content">
                            <Space>
                                <Button>Write</Button>
                            </Space>
                        </div>
                    </Skeleton>
                    </>
            }
        </div>
    );
}

export default User;
