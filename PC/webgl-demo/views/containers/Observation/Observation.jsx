import * as React from 'react';

import Btn from '../../components/Btn.jsx';
import '../../css/observation.css';

class Observation extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {isHidden, clickObserv} = this.props;
        return (
            <Btn id={isHidden ? 'closeObBtn' : 'openObBtn'} onClick={clickObserv} classN='observationBtn' />
        );
    }
}

export default Observation;