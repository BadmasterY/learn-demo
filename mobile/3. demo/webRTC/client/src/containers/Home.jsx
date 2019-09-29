/**
 * 一开始进入的主页
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CreatLiving from '../components/CreateLiving';
import EmptyTips from '../components/EmptyTips';
import '../static/css/home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelList: [] // 当前在直播的列表
        };
    }

    componentDidMount() {
        this.setState({ channelList: [
            {
                id: '007',
                name: '特工007',
                onlines: '217',
                createTime: '2019-7-16 15:15:15',
            }
        ] });
    }

    render() {
        const { channelList } = this.state;
        return (
            <div>
                {
                    channelList.length > 0 ?
                        <ul className="living-list">
                            {
                                channelList.map(({ id, name, onlines, createTime }, index) => (
                                    <li key={id}>
                                        <Link className="living-link" to={`/room/${id}`}>
                                            <div className="living-img"></div>
                                            <div className="living-info">
                                                <div className="living-name">{name}的直播间</div>
                                                <div className="living-time">{createTime}</div>
                                                <div className="people-num">在线人数:{onlines}人</div>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                        :
                        <EmptyTips />
                }
                <CreatLiving />
            </div>
        );
    }
}

export default connect(state => ({
    user: state.user
}))(Home);