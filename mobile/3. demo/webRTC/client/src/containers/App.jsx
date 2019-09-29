/**
 * 拼装入口
 */
import React from 'react';
import { HashRouter as Router, Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Home from './Home';
import HostRoom from './HostRoom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {} }
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home}></Route>
                        <Route path="/room/host" component={HostRoom}></Route>
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default App;