import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { blogName, header } from '../../config/default.json';

import { useSelector } from 'react-redux';
import { reduxState } from '../../interfaces/state';
import './header.css';

const { Header } = Layout;

function MyHeader() {
    const { isLogin, name } = useSelector((state: reduxState) => state.user);

    function showLogin() {
        console.log('login');
    }

    return (
        <Header className="header">
            <h1>
                <span className="header-logo"></span>
                <Link className="header-link" to={"/"}>
                    {blogName}
                </Link>
            </h1>
            <Menu className="header-menu" selectable={false} mode="horizontal">
                {
                    header.map(item => (
                        <Menu.Item key={item.key}>
                            <Link className="header-link" to={item.uri}>
                                {item.name}
                            </Link>
                        </Menu.Item>
                    ))
                }
                {
                    isLogin ?
                        <Menu.Item key="login">
                            <Link className="header-link" to={'/user'}>
                                {name}
                            </Link>
                        </Menu.Item>
                        :
                        <Menu.Item onClick={showLogin} key="login">
                            LOGIN
                        </Menu.Item>
                }
            </Menu>
        </Header>
    );
}

export default MyHeader;
