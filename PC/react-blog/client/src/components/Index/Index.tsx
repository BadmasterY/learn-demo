import React from 'react';
import { Layout, BackTop } from 'antd';
import { Route, Switch } from 'react-router-dom';

import MyHeader from '../Header/Header';
import MyFooter from '../Footer/Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import About from '../About/About';
import Animation from '../Animation/Animation';
import NotFound from '../NotFound/NotFound';
import User from '../User/User';
import System from '../ManagementSystem/Index';

import './index.css';

const { Content } = Layout;

function App() {
  return (
    <Switch>
      <Route exact strict path={['/', '/about', '/user', '/article/*']}>
        <Layout className="index">
          <MyHeader />
          <Content className="index-content">
            <Route exact path="/" children={props => Animation(<Home />, props, '/')} />
            <Route path="/about" children={props => Animation(<About />, props, '/about')} />
            <Route path="/user" children={props => Animation(<User />, props, '/user')} />
          </Content>
          <MyFooter />
          <BackTop />
        </Layout>
      </Route>
      <Route exact strict path="/login" children={props => Animation(<Login />, props, '/login')} />
      <Route exact strict path="/system" children={props => Animation(<System />, props, '/system')} />
      <Route path="*" children={props => Animation(<NotFound />, props, '/404')} />
    </Switch>
  );
}

export default App;
