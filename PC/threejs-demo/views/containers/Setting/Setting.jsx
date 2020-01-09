import * as React from 'react';

import btns from './btns';

import Title from '../../components/Title.jsx';
import List from '../../components/List.jsx';
import Switch from '../../components/Switch.jsx';

class Setting extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const {style, onExitClick, app} = this.props;
        return (
            <div id='setting' style={style}>
                <Title name='设置' id='setting-title' />
                <List btns={btns} id='setting-list' app={app}>
                    {(key, clickCallback) => <Switch classN='setting-switch' clickCallback={clickCallback} btnKey={key}/>}
                </List>
                <div id='setting-exit' onClick={onExitClick}></div>
            </div>
        );
    }
}

export default Setting;