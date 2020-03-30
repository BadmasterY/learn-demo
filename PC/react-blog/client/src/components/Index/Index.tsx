import React from 'react';
import { Layout, BackTop } from 'antd';
import MyHeader from '../Header/Header';
import MyFooter from '../Footer/Footer';
import { Route } from 'react-router-dom';
import Home from '../Home/Home';
import Login from '../Login/Login';

import './index.css';

const { Content } = Layout;

function App() {
  return (
    <>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path={['/', '/about', '/user']}>
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
      </Route>
    </>
  );
}

export default App;
