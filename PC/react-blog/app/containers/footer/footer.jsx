import Footer from '../../components/footer.jsx';
import Link from '../../components/link.jsx';

const React = require('react');

class FootBar extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Footer>
                Personal homepage by <Link href='/ME'>BadmasterY</Link>.
            </Footer>
        );
    }
}

export default FootBar;