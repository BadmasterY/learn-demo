import React from 'react';
import { Layout, BackTop } from 'antd';
import MyHeader from '../Header/Header';
import MyFooter from '../Footer/Footer';
import { Route } from 'react-router-dom';
import Home from '../Home/Home';

import './index.css';

const { Content } = Layout;

function App() {
  return (
    <Layout className="index">
        <MyHeader />
        <Content className="index-content">
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            关于我
          </Route>
          <Route exact path="/user">
            用户
          </Route>
        </Content>
        <MyFooter />
        <BackTop />
    </Layout>
  );
}

export default App;
