import React, { useState,useEffect } from 'react';
import { Typography, Divider } from 'antd';

import './about.css';

const { Title, Paragraph, Text } = Typography;

function About() {
    const [workYear, setWorkYear] = useState(0);

    useEffect(() => {
        const year = new Date().getFullYear();
        setWorkYear((year - 2017));
    }, []);

    return (
        <Typography className="about-box">
            <Title level={2} className="about-header">Badmaster</Title>
            <Paragraph>
                前端, 工作了<Text strong>{workYear}</Text>年...
            </Paragraph>
            <Divider />
            <Paragraph>
                一些<Text underline>工作经历</Text>...
            </Paragraph>
        </Typography>
    );
}

export default About;
