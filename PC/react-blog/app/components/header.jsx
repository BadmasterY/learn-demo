import { Layout } from 'antd';

const { Header } = Layout;

const React = require('react');

class HeaderBar extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Header>
                <div className="header-box clearfix">
                    {this.props.children}
                </div>
            </Header>
        );
    }
}

export default HeaderBar;