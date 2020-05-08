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
    Tooltip,
    message,
} from 'antd';
import axios from 'axios';

import Publish from '../Publish/Publish';
import ResetPassword from '../ResetPassword/ResetPassword';
import { reduxState } from '../../interfaces/state';
import { UserInfoResult } from '../../interfaces/response';

import './user.css';

const { Title, Paragraph } = Typography;

function User() {
    const { isLogin, id, username, nickname, avatarUrl, bio, url, position } = useSelector((item: reduxState) => item.user);
    const [ firstLoad, setFirstLoad ] = useState(true);
    const [ loading, setLoading ] = useState(true);
    const [ resetPass, setResetPass ] = useState(false);
    const [ publish, setPublish ] = useState(false);
    const [ articles, setArctiles ] = useState(0);
    const [ comments, setComments ] = useState(0);

    useEffect(() => {
        if(isLogin&&firstLoad) loadUserInformation();
    });

    async function loadUserInformation() {
        setFirstLoad(false);

        await axios.post('/user/getUserInfo', { id }).then(result => {
            const data: UserInfoResult = result.data;
            const { error, msg, content } = data;

            setLoading(false);

            if(error === 1) {
                message.error(msg);
                return;
            }

            if(content) {
                const { comments, articles } = content;

                setArctiles(articles);
                setComments(comments);
            }
        }).catch(err => {
            message.error('Please check network!');
            console.log(err);
        });
    }

    function resetPassword() {
        setResetPass(true);
    }

    function publishArticale() {
        setPublish(true);
    }

    function closeResetFn() {
        setResetPass(false);
    }
    
    function closePublishFn() {
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
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6} xxl={4}>
                    <Typography className="user-sider">
                        <Link to="/setting">
                            <Tooltip title="change avatar">
                                {
                                    avatarUrl && avatarUrl!=='' ?
                                        <Avatar src={`/user/${avatarUrl}`} size={200} shape="square" />
                                        :
                                        <Avatar size={200} shape="square">{nickname}</Avatar>
                                }
                            </Tooltip>
                        </Link>
                        <Title level={3} className="user-nickname">{nickname}</Title>
                        <Title level={4} id="user-name" className="user-name">{username}</Title>
                        <Paragraph>{bio}</Paragraph>
                        <Paragraph>{
                            url ?
                            <>
                                <LinkOutlined/> <a target="_blank" rel="noopener noreferrer" href={`http://${url}`}>{url}</a>
                            </>
                            : ''    
                        }</Paragraph>
                        <Paragraph>
                            <UserOutlined /> {position}
                        </Paragraph>
                        <Button danger onClick={resetPassword}>Reset Password</Button>
                    </Typography>
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={18} xxl={20}>
                    <Skeleton 
                        className="user-content"
                        loading={loading}
                        active
                    >
                        <div className="user-content">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12} xxl={6}>
                                    <Card>
                                        <Statistic title="Articales" value={articles} />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={24} md={12} xxl={6}>
                                    <Card>
                                        <Statistic title="Comments" value={comments} />
                                    </Card>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={12} xxl={6}>
                                    <Button onClick={publishArticale} block>Publish articles</Button>
                                </Col>
                            </Row>
                        </div>
                    </Skeleton>
                    </Col>
                    </Row>
            }
            <Publish visible={publish} callback={closePublishFn} />
            <Modal 
                visible={resetPass}
                onCancel={closeResetFn}
                footer={null}
                closable={false}
                destroyOnClose={true}
            >
                <ResetPassword callback={closeResetFn} />
            </Modal>
        </div>
    );
}

export default User;
