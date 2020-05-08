import React from 'react';
import { Layout, Menu, message } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { blogName, localName, header } from '../../config/default.json';
import { reduxState } from '../../interfaces/state';
import { actions } from '../../redux/ducks/user';
import { Data as LoginData } from '../../interfaces/localstorage';

import './header.css';

const { Header } = Layout;

function MyHeader() {
    const { isLogin, nickname } = useSelector((state: reduxState) => state.user);
    const dispatch = useDispatch();

    function logout() {
        const action = actions.userLogout();
        dispatch(action);

        message.success('Logout success!');

        const localItem = localStorage.getItem(localName);
        if(localItem !== null) {
            const loginData: LoginData = JSON.parse(localItem);
            const { username, password } = loginData;

            localStorage.setItem(localName, JSON.stringify({
                username,
                password,
                isLogin: false,
            }));
        }
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
                        <Menu.SubMenu
                            title={
                                <span>{nickname}</span>
                            }
                            key="user-menu"
                        >
                            <Menu.Item key="user">
                                <Link className="header-link" to={'/user'}>{nickname}</Link>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="setting">
                                <Link className="header-link" to={'/setting'}>
                                    Setting
                                </Link>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="logout" onClick={logout}>
                                Logout
                            </Menu.Item>
                        </Menu.SubMenu>
                        :
                        <Menu.Item key="login">
                            <Link to="/login">
                                LOGIN
                            </Link>
                        </Menu.Item>
                }
            </Menu>
        </Header>
    );
}

export default MyHeader;
