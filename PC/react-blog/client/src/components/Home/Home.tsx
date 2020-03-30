import React, { useState, useEffect } from 'react';
import { Skeleton, List } from 'antd';

import { State as ArticaleState } from '../../interfaces/articale';
import { content } from '../../config/default.json';

import './home.css';

const { pageSize } = content;

function Home() {
    const [loading, setLoading] = useState(true);
    const articales: ArticaleState[] = [];

    useEffect(() => {
        // post data
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    });

    return (
        <div className="home">
            <Skeleton loading={loading} active>
                <List 
                    itemLayout="vertical"
                    size="large"
                    pagination= {{
                        position: 'bottom', // 分页位置
                        onChange: (page, pageSize) => {
                            console.log(page, pageSize);
                        },
                        pageSize, // 每页显示数量
                        total: 11, // 总数
                    }}
                    dataSource={articales}
                renderItem = {item => (
                    <List.Item></List.Item>
                )}
                />
            </Skeleton>
        </div>
    );
}

export default Home;
