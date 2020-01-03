import * as React from 'react';

class Tip extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {id, classN, innerText} = this.props;
        return (
            <div style={this.props.isHidden ? {opacity: 0} : {opacity: 1}} id={id} className={classN}>
                {innerText}
            </div>
        );
    }
}

export default Tip;