import { notice } from '../../notice.conf';

const React = require('react');
const { Row, Col, Button } = require('antd');

class Notice extends React.Component {
    constructor(props){
        super(props);
    }

    close(e) {
        e.stopPropagation();
        let classNameArr = e.target.className.split(' ');
        if(classNameArr.indexOf('notice') != -1)this.props.history.goBack();
    }

    render(){
        return (
            <Row className="notice" type="flex" align="middle" onClick={this.close.bind(this)}>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 18}} lg={{span: 16}} xl={{span: 14}} xxl={{span: 12}} className="notice-box">
                    {/* <Col span={24} className="notice-title">
                        <h2>公告</h2>
                    </Col> */}
                    <Col span={24} className="notice-list">
                        <ul>
                            {
                                notice.map(item => (
                                    <li key={item.key}>
                                        {item.title + ' | ' + item.date}
                                        <br />
                                        {item.content}
                                    </li>
                                ))
                            }
                        </ul>
                    </Col>
                </Col>
            </Row>
        );
    }
}

export default Notice;