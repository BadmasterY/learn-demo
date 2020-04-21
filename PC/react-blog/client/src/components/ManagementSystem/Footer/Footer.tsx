import React from 'react';
import { Layout } from 'antd';

import './footer.css';

const { Footer } = Layout

function SystemFooter() {
    return (
        <Footer className="system-footer">
            <p>Created by <a target="_blank" rel="noopener noreferrer" href="https://badmastery.github.io/me">Badmaster</a></p>
            <p>Created {new Date().getFullYear()}</p>
        </Footer>
    )
}

export default SystemFooter;