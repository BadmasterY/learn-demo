import React from 'react';
import { Typography, Button } from 'antd';
import { ApiOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import './notfound.css';

const { Paragraph, Title, Text } = Typography;

function NotFound() {
    const history = useHistory();

    function run() {
        history.push('/');
    }

    return (
        <div className="notfound">
        <Typography className="notfound-box">
            <Title className="title" level={2}>404</Title>
            <Paragraph>Lost page in the universe.<ApiOutlined /></Paragraph>
            <Paragraph>It may have been captured by <Text strong>E.T.</Text> or killed by a passing <Text strong>Thanos</Text>.</Paragraph>
            <Button className="ghost-btn" type="dashed" ghost block onClick={run}>Run!</Button>
        </Typography>
        </div>
    );
}

export default NotFound;
