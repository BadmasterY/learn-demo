import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import './footer.css';

const { Footer } = Layout;

function User() {
    return (
        <Footer className="footer">
            <p>Personal blog by <Link to={"/about"}>Badmaster</Link></p>
            <p>Powered By <a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">React</a>.</p>
        </Footer>
    );
}

export default User;
