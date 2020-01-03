import '../../css/toptip.css';

import * as React from 'react';

import Tip from '../../components/Tip.jsx';

class ToolTip extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Tip id='topTip' {...this.props} />
        );
    }
}

export default ToolTip;