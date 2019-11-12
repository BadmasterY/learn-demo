const React = require('react');

class Progress extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {width} = this.props;

        return(
            <div className="progress" style={{width: width + '%'}}></div>
        );
    }
}

export default Progress;