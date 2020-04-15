import React, { useState, useEffect } from 'react';
import { Skeleton, List, message } from 'antd';
import axois from 'axios';

import { State as ArticaleState } from '../../interfaces/articale';
import { content } from '../../config/default.json';

import './home.css';

const { pageSize } = content;
const articales: ArticaleState[] = [];

function Home() {
    const [loading, setLoading] = useState(true);
    const [isInitial, setInitial] = useState(true);
    const [dataSource, setData] = useState(articales);
    const [maxLength, setMaxLength] = useState(0);
    const [initialPage, setPage] = useState(1);

    async function initialData() {
        setInitial(false);

        await axois.post('/article/getArticleList').then(result => {

        }).catch(err => {
            message.error('Please check network!')
            console.log(err);
        })
        setLoading(false);
    }

    function changePage(page: number, pageSize?: number) {
        console.log(page, pageSize);
    }

    useEffect(() => {
        if(isInitial) initialData();
    });

    return (
        <div className="home">
            <Skeleton loading={loading} active>
                <List 
                    itemLayout="vertical"
                    size="large"
                    pagination= {{
                        position: 'bottom', // 分页位置
                        onChange: changePage,
                        current: initialPage,
                        pageSize, // 每页显示数量
                        total: maxLength, // 总数
                    }}
                    dataSource={dataSource}
                renderItem = {item => (
                    <List.Item></List.Item>
                )}
                />
            </Skeleton>
        </div>
    );
}

export default Home;
