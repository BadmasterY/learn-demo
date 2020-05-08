import React, { useEffect } from 'react';
import { Layout, BackTop } from 'antd';
import { useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';

import MyHeader from '../Header/Header';
import MyFooter from '../Footer/Footer';
import Home from '../Home/Home';
import Login from '../Login/Login';
import About from '../About/About';
import Animation from '../Animation/Animation';
import NotFound from '../NotFound/NotFound';
import User from '../User/User';
import Setting from '../Setting/Setting';
import System from '../ManagementSystem/Index';
import Article from '../Article/Article';

import { reduxState } from '../../interfaces/state';
import { Data as LoginData } from '../../interfaces/localstorage';
import { localName } from '../../config/default.json';

import './index.css';

const { Content } = Layout;

function App() {
  const { isLogin } = useSelector((item: reduxState) => item.user);
  const history = useHistory();

  useEffect(() => {
    if (!isLogin) {
      if (history.location.pathname === '/login') return;

      const localItem = localStorage.getItem(localName);
      if (localItem !== null) {
        const loginData: LoginData = JSON.parse(localItem);
        if (loginData.isLogin) history.push('/login');
      }
    }
  });

  return (
      <Switch>
        <Route exact strict path={['/', '/about', '/user', '/setting', '/article/*']}>
          <Layout className="index">
            <MyHeader />
            <Content className="index-content">
              <Route exact path="/" children={props => Animation(<Home />, props, '/')} />
              <Route path="/about" children={props => Animation(<About />, props, '/about')} />
              <Route path="/user" children={props => Animation(<User />, props, '/user')} />
              <Route path="/setting" children={props => Animation(<Setting />, props, '/setting')} />
              <Route path="/article/*" children={props => Animation(<Article />, props, '/article/*')} />
            </Content>
            <MyFooter />
            <BackTop style={{
              right: '10px',
              bottom: '30px'
            }} />
          </Layout>
        </Route>
        <Route exact strict path="/login" children={props => Animation(<Login />, props, '/login')} />
        <Route exact strict path="/system" children={props => Animation(<System />, props, '/system')} />
        <Route path="*" children={props => Animation(<NotFound />, props, '/404')} />
      </Switch>
  );
}

export default App;
