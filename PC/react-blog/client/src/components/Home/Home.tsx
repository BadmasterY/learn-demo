import React, { useState, useEffect } from 'react';
import { Skeleton, List, message, Avatar } from 'antd';
import axois from 'axios';

import { ArticleRes, ArticleItem } from '../../interfaces/response';
import { content } from '../../config/default.json';

import './home.css';
import { Link } from 'react-router-dom';

const { pageSize, pageSizeOptions } = content;
const articales: ArticleItem[] = [];

function Home() {
    const [loading, setLoading] = useState(true);
    const [isInitial, setInitial] = useState(true);
    const [dataSource, setData] = useState(articales);
    const [maxLength, setMaxLength] = useState(0);
    const [initialPage, setPage] = useState(1);

    async function initialData() {
        setInitial(false);

        await axois.post('/article/getArticleList', {
            page: initialPage,
            pageSize,
            query: {}
        }).then(result => {
            const data: ArticleRes = result.data;
            const { error, msg, content } = data;

            setLoading(false);

            if (error === 1) {
                message.error(msg);
                return;
            }

            if (content) {
                const { maxLength, articles } = content;
                setMaxLength(maxLength);
                if (articles) setData(articles);
            }
        }).catch(err => {
            setLoading(false);
            message.error('Please check network!')
            console.log(err);
        });
    }

    function changePage(page: number, pageSize?: number) {
        console.log(page, pageSize);
    }

    useEffect(() => {
        if (isInitial) initialData();
    });

    return (
        <div className="home">
            <Skeleton loading={loading} active>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        position: 'bottom', // 分页位置
                        onChange: changePage,
                        current: initialPage,
                        pageSize, // 每页显示数量
                        pageSizeOptions,
                        total: maxLength, // 总数
                    }}
                    dataSource={dataSource}
                    renderItem={item => (
                        <List.Item
                            key={item._id}
                        >
                            <List.Item.Meta
                                avatar={<Avatar>{item.author.nickname}</Avatar>}
                                title={<Link to={`/article/${item.title}`}>{item.title}</Link>}
                                description={''}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </Skeleton>
        </div>
    );
}

export default Home;
