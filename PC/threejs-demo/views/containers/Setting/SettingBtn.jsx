import * as React from 'react';
import Btn from '../../components/Btn.jsx';

class SettingBtn extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {onClick, style} = this.props;
        return (
            <Btn id='setting-btn' style={style} onClick={onClick}/>
        );
    }
}

export default SettingBtn;