import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { blogName } from '../../../config/default.json';
import { reduxState } from '../../../interfaces/state';

import './header.css';

const { Header } = Layout;

function SystemHeader() {
    const { nickname } = useSelector((item: reduxState) => item.user);
    const history = useHistory();

    function goHome() {
        history.push('/');
    }
    
    return (
        <Header className="system-header">
            <h1 onClick={goHome}>{blogName}</h1>
            <Link to="/user" className="header-name">{nickname}</Link>
        </Header>
    );
}

export default SystemHeader;