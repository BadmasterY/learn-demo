import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Index/Index';
import { Provider } from 'react-redux'; // 引入 redux
import { Router } from 'react-router-dom'; // 引入路由
import { createBrowserHistory } from 'history'; // 使用 history
import * as serviceWorker from './serviceWorker';

import stroe from './redux/store';

import './index.css';

const customHistory = createBrowserHistory(); // 创建 history 对象

ReactDOM.render(
  <Provider store={stroe}>
    <Router history={customHistory}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
