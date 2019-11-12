/**
 * entry file
 */
import { VERSION, logo, list } from './app.config';

import HeadBar from './containers/header/header';
import ScrollView from './containers/scroll-view/scroll-view';
import FootBar from './containers/footer/footer';
import Barrage from './containers/barrage/barrage';
import Me from './containers/me/me';
import Login from './containers/login/login';
import Notice from './containers/notice/notice';

import { Layout } from 'antd';

import "antd/dist/antd.css";
import './css/main.css';

import { store } from './redux/store'

import { BrowserRouter as Router, Route } from 'react-router-dom';
const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');

// 后续服务器提供内容
const contents = [
    {
        id: 'sadw1',
        name: '示例1',
        date: '2019-04-08 09:54:59',
        text: 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
        url: 'test_1.jpg'
    },
    {
        id: 'sadw2',
        name: '示例2',
        date: '2019-04-08 09:54:59',
        text: 'test',
        url: 'test_2.jpg',
        color: '#fff'
    },
    {
        id: 'sadw3',
        name: '示例3',
        date: '2019-04-08 09:54:59',
        text: 'test',
        url: 'test_3.jpg',
        color: '#fff'
    },
    {
        id: 'sadw4',
        name: '示例4',
        date: '2019-04-08 09:54:59',
        text: 'test',
        url: 'test_4.jpg',
        color: '#fff'
    }
]

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ScrollView contents={contents}/>
                <Barrage />
            </React.Fragment>
                
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Layout id="react-root" className="react-root">
                <HeadBar logo={logo} list={list}/>
                <Route path="/" component={App} />
                <Route path="/me" component={Me} />
                <Route path="/notice" component={Notice} />
                <Route path="/login" component={Login} />
                {/* <FootBar /> */}
            </Layout>
        </Router>
    </Provider>,
    document.getElementById('root')
);