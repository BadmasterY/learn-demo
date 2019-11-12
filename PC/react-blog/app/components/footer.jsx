const React = require('react');
import {Layout} from 'antd';

const {Footer} = Layout;

class FooterBar extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Footer>{this.props.children}</Footer>
        );
    }
}

export default FooterBar;