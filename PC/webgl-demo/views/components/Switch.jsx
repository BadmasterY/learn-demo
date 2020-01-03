import * as React from 'react';

class Switch extends React.Component {
    constructor(props){
        super(props);
        this.state = {isOpen: this.getIsOpen(this.props.btnKey)};

        this.clickOpen = this.clickOpen.bind(this);
        this.clickClose = this.clickClose.bind(this);
    }

    clickOpen(e) {
        e.stopPropagation();

        this.setState({
            isOpen: true
        });
        this.props.clickCallback(true);
    }

    clickClose(e) {
        e.stopPropagation();

        this.setState({
            isOpen: false
        });
        this.props.clickCallback(false);
    }

    getIsOpen(key){
        return localStorage.getItem(key) === 'true';
    }

    render() {
        const {openBtn = '开启', closeBtn = '关闭', classN} = this.props;
        return (
            <div className={'switch ' + classN}>
                <span className={this.state.isOpen ? 'openBtn active' : 'openBtn'} onClick={this.clickOpen}>{openBtn}</span>
                <span className={this.state.isOpen ? 'closeBtn' : 'closeBtn active'} onClick={this.clickClose}>{closeBtn}</span>
            </div>
        );
    }
}

export default Switch;