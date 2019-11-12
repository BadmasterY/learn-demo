import HeaderBar from '../../components/header';
import { Link, NavLink } from 'react-router-dom';
import { Row, Col } from 'antd';

const React = require('react');

class HeadBar extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {logo, list, version} = this.props;
        return (
            <HeaderBar>
                <Row>
                    <Col xs={{ span: 5, offset: 1 }} sm={{span: 2, offset: 0}}>
                        <Link to="/" className="logo">
                            <img scr={logo.url} className="logo-img" />
                            <span className="logo-text" alt={logo.name}>{logo.name}</span>
                        </Link>
                    </Col>
                    <Col xs={{span: 0}} sm={{span: 8, offset: 1}} className="list">
                        {list.map((item, index) => 
                            <Col sm={{span: 7}} md={{span: 5}} lg={{span: 4}} xl={{span: 4}} xxl={{span: 3}} key={item.id}>
                                <NavLink to={item.url}>{item.text}</NavLink>
                            </Col>
                        )}
                    </Col>
                    <Col xs={{span: 6, push: 10}} sm={{span: 4, push: 10}}>
                        <a href="https://github.com/BadmasterY/react-personal-homepage" target="_blank" className="github-url">
                            GitHub
                            <svg x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15">
                                <path fill="currentColor" d="
                                M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,
                                0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z
                                "></path>
                                <polygon fill="currentColor" points="
                                45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,
                                14.9 62.8,22.9 71.5,22.9
                                "></polygon>
                            </svg>
                        </a>
                    </Col>
                </Row>
            </HeaderBar>
        );
    }
}

export default HeadBar;