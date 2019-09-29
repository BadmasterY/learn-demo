import React from 'react';
import { connect } from 'react-redux';
import BarrageInput from '../components/BarrageInput';

class HostRoom extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <BarrageInput></BarrageInput>
        );
    }
}

export default HostRoom;