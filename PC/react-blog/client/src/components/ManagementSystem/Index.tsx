import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Header from './Header/Header';
import Sider from './Sider/Sider';
import Articles from './Articles/Articles';
import Comments from './Comments/Comments';
import Users from './Users/Users';
import Footer from './Footer/Footer';
import Setting from './Setting/Setting';

import { reduxState } from '../../interfaces/state';
import { system } from '../../config/default.json';

import './system.css';

const { Content } = Layout;
const { initialSelectItem } = system;

function System() {
    const [selectItem, setSelect] = useState(initialSelectItem);
    const { isLogin, position } = useSelector((item: reduxState) => item.user);
    const history = useHistory();

    useEffect(() => {
        if (!isLogin) {
            history.push('/login');
        }else if (position !== '管理员') {
            history.push('/');
        }
    });

    function changeSelect(key: string) {
        setSelect(key);
    }

    return (
        <>
            {
                isLogin && position === '管理员' ?
                    <Layout className="system">
                        <Header />
                        <Layout>
                            <Sider callback={changeSelect} />
                            <Content className="system-content">
                                {
                                    selectItem === 'articles' ?
                                        <Articles /> : ''
                                }
                                {
                                    selectItem === 'comments' ?
                                        <Comments /> : ''
                                }
                                {
                                    selectItem === 'users' ?
                                        <Users /> : ''
                                }
                                {
                                    selectItem === 'setting' ?
                                        <Setting /> : ''
                                }
                                <Footer />
                            </Content>
                        </Layout>
                    </Layout>
                    : ''
            }
        </>
    );
}

export default System;
