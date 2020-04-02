import React from 'react';
import { Layout } from 'antd';

import './footer.css';

const { Footer } = Layout;

function MyFooter() {
    return (
        <Footer className="footer">
            <p>Created by <a target="_blank" rel="noopener noreferrer" href="https://badmastery.github.io/me">Badmaster</a></p>
            <p>Powered By <a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">React</a>.</p>
        </Footer>
    );
}

export default MyFooter;
