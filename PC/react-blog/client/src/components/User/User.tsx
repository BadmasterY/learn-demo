import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';
import { 
    Avatar, 
    Typography, 
    Button, 
    Skeleton, 
    Row, 
    Col, 
    Card, 
    Statistic, 
    Divider,
    Modal,
} from 'antd';

import Publish from '../Publish/Publish';
import ResetPassword from '../ResetPassword/ResetPassword';
import { reduxState } from '../../interfaces/state';
import { } from '../../interfaces/user';

import './user.css';

const { Title, Paragraph } = Typography;

function User() {
    const { isLogin, username, nickname, bio, url, position } = useSelector((item: reduxState) => item.user);
    const [ loading, setLoading ] = useState(true);
    const [ resetPass, setResetPass ] = useState(false);
    const [ publish, setPublish ] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);

        return () => {clearTimeout(timer)};
    });

    function resetPassword() {
        setResetPass(true);
    }

    function publishArticale() {
        setPublish(true);
    }

    function closeFn() {
        setResetPass(false);
        setPublish(false);
    }

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
                        <Paragraph><LinkOutlined/> <a target="_blank" rel="noopener noreferrer" href={`http://${url}`}>{url}</a></Paragraph>
                        <Paragraph>
                            <UserOutlined /> {position}
                        </Paragraph>
                        <Button danger onClick={resetPassword}>Reset Password</Button>
                    </Typography>
                    <Skeleton 
                        className="user-content"
                        loading={loading}
                        active
                    >
                        <div className="user-content">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card>
                                        <Statistic title="Articales" value={10} />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Statistic title="Comments" value={1100} />
                                    </Card>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Button onClick={publishArticale} block>Publish articles</Button>
                                </Col>
                            </Row>
                        </div>
                    </Skeleton>
                    </>
            }
            <Modal 
                visible={resetPass || publish}
                onCancel={closeFn}
                footer={null}
                closable={false}
                destroyOnClose={true}
            >
                {
                    resetPass ? <ResetPassword callback={closeFn} /> : ''
                }
                {
                    publish ? <Publish callback={closeFn} /> : ''
                }
            </Modal>
        </div>
    );
}

export default User;
