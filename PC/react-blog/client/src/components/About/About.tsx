import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import './about.css';

const { Footer } = Layout;

function About() {
    return (
        <Footer className="about">
            <p>Personal blog by <Link to={"/about"}>Badmaster</Link></p>
            <p>Powered By <a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">React</a>.</p>
        </Footer>
    );
}

export default About;
