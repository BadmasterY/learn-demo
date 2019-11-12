const React = require('react');

class Link extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {href, className, children, onClick} = this.props;
        return (
            <a href={href} className={className} onClick={onClick}>{children}</a>
        );
    }
}

export default Link;