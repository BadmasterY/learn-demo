import React from 'react';
import ReactDOM from 'react-dom';

class BarrageInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            barrage: ''
        };

        this.change = this.change.bind(this);
    }

    change(e) {
        this.setState({
            barrage: e.target.value
        });

        console.log(e.keyCode);
    }

    sendBarrage(e) {
        if(this.state.barrage == '') return;

        this.props.onBarrageSend(this.state.barrage);
        this.setState({
            barrage: ''
        });
    }

    render() {
        const { barrage } = this.state;
        return (
            <div className="barrage-input-container">
                <input type="text" className="barrage-input-text" ref="barrageMessage" value={barrage} onChange={this.change} placeholder="吐槽一下~" maxLength="10" />
                <input type="button" value="发送弹幕" onClick={e => this.sendBarrage(e)} className="barrage-input-submit" />
            </div>
        );
    }
}

export default BarrageInput;