// import Link from '../../components/link';
import Progress from '../../components/progress';
import { message, Row, Col } from 'antd';

const React = require('react');

message.config({
    duration: 2
});

class ScrollView extends React.Component {
    constructor(props) {
        super(props);

        this.oldDate = new Date();

        this.state = {
            active: 0,
            height: window.innerHeight,
            progressWidth: (1 / this.props.contents.length) * 100
        }

        this.resize = this.resize.bind(this);
    }

    active(index, otherName) {
        otherName = otherName ? otherName : '';
        if (index == this.state.active) {
            return otherName + ' active';
        }

        return otherName;
    }

    resize(e) {
        e.stopPropagation();

        this.setState({ height: window.innerHeight });
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    onMouseWheel(e) {
        e.stopPropagation();

        let date = new Date();

        if (date - this.oldDate < 500) return;

        let index = this.state.active;
        let len = e.currentTarget.children.length;
        message.destroy();
        if (e.nativeEvent.deltaY > 0) {
            if (index >= len - 1) {
                message.warning('到底了,没有更多内容了 >_<');
                return;
            }

            this.setState({ progressWidth: ((index + 2) / len) * 100 });
            this.setState({ active: ++index });
        } else {
            if (index <= 0) {
                message.warning('到头了,赶紧往下翻吧 >_<');
                return;
            }

            this.setState({ progressWidth: ((index) / len) * 100 });
            this.setState({ active: --index });
        }

        this.oldDate = new Date();
    }

    render() {
        const { contents } = this.props;

        return (
            <div className="scroll-view">
                <ul className="scroll-ul clearfix" onWheel={e => this.onMouseWheel(e)} style={{ top: - (this.state.height * this.state.active) + 'px' }}>
                    {
                        contents.map((content, index) => {
                            let url = require('./../../../static/' + content.url);
                            return (
                                <li className={this.active(index, "scroll-item")} key={content.id} index={index} style={content.color ? { color: content.color, backgroundImage: `url(${url})` } : { backgroundImage: `url(${url})` }}>
                                    <div className="mask"></div>
                                    <div className="scroll-content">
                                        <Row className="scroll-content-row">
                                            <Col className="scroll-name">
                                                <h2>{content.name}</h2>
                                            </Col>
                                            <Col className="scroll-date">
                                                <p>
                                                    {content.date}
                                                </p>
                                            </Col>
                                            <Col className="scroll-text">
                                                <p>
                                                    {content.text}
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </li>
                            );
                        }
                        )
                    }
                </ul>
                <Progress width={this.state.progressWidth} />
            </div>
        );
    }
}

export default ScrollView;