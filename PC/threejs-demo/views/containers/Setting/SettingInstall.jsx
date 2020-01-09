import * as React from 'react';

import Setting from './Setting.jsx';
import SettingBtn from './SettingBtn.jsx';

class SettingInstall extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            right: -350
        };

        this.onExitClick = this.onExitClick.bind(this);
        this.onSettingClick = this.onSettingClick.bind(this);
    }

    onExitClick(e) {
        e.stopPropagation();

        if(this.props.isHidden)return;

        this.setState({
            right: -350
        });
    }

    onSettingClick(e) {
        e.stopPropagation();

        if(this.props.isHidden)return;

        this.setState({
            right: 0
        });
    }

    render() {
        const {app, isHidden} = this.props;
        return (
            <div className='setting-install'>
                <Setting style={isHidden ? {right: -350} : this.state} onExitClick={this.onExitClick} app={app}/>
                <SettingBtn style={isHidden ? {right: -36} : {right: 10}} onClick={this.onSettingClick} />
            </div>
        );
    }
}

export default SettingInstall;