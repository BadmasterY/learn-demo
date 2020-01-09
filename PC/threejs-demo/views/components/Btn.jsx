import * as React from 'react';

class Btn extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {id, classN, text = '', onClick, style} = this.props;
        return (
            <div id={id} onClick={onClick} style={style} className={classN}>{text}</div>
        );
    }
}

export default Btn;