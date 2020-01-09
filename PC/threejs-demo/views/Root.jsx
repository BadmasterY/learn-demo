import './css/main.css';
import './css/loading.css';
import './css/setting.css';

import * as React from 'react';

import SettingInstall from './containers/Setting/SettingInstall.jsx';
import BtnList from './containers/BtnList/BtnList.jsx';
import Observation from './containers/Observation/Observation.jsx';
import ToolTip from './containers/ToolTip/ToolTip.jsx';

class Root extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isHidden: false,
            topTip: this.props.innerText
        };

        this.clickObserv = this.clickObserv.bind(this);
    }

    clickObserv(e){
        e.stopPropagation();

        this.setState({
            isHidden: !this.state.isHidden
        });
    }

    render() {
        const {app, btns} = this.props;
        return (
            <div key='root'>
                <SettingInstall app={app} isHidden={this.state.isHidden}/>
                {btns ? <BtnList btns={btns} isHidden={this.state.isHidden} /> : ''}
                <Observation isHidden={this.state.isHidden} clickObserv={this.clickObserv}/>
                <ToolTip innerText={this.state.topTip} isHidden={this.state.isHidden}/>
            </div>
        );
    }
}

export default Root;