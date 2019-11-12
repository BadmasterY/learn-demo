/**
 * A content page
 */
const React = require('react');

class Content extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="contents-box">{this.props.children}</div>
        );
    }
}

export default Content;