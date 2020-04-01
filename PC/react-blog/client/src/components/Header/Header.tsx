import React, { useState } from 'react';
import { Layout, Menu, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { blogName, header } from '../../config/default.json';
import { reduxState } from '../../interfaces/state';
import { actions } from '../../redux/ducks/user';
import './header.css';

const { Header } = Layout;

function MyHeader() {
    const { isLogin, nickname } = useSelector((state: reduxState) => state.user);
    const [logined, setLogin] = useState(isLogin);
    const dispatch = useDispatch();
    const history = useHistory();

    function logout() {
        const action = actions.userLogout();
        dispatch(action);

        setLogin(false);
        history.push('/');
        message.success('Logout success!');
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
                    logined ?
                        <Menu.SubMenu
                            title={
                                <span>{nickname}</span>
                            }
                            key="user-menu"
                        >
                            <Menu.Item key="setting">
                                <Link className="header-link" to={'/user'}>
                                    Setting
                                </Link>
                            </Menu.Item>
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
