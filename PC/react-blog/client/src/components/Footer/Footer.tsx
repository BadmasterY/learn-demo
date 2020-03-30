import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import './footer.css';

const { Footer } = Layout;

function MyFooter() {
    return (
        <Footer className="footer">
            <p>Personal <a target="_blank" rel="noopener noreferrer" href="https://badmastery.github.io">blog</a> by <Link to={"/about"}>Badmaster</Link></p>
            <p>Powered By <a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">React</a>.</p>
        </Footer>
    );
}

export default MyFooter;
