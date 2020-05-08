import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Button, message } from 'antd';
import axios from 'axios';

import { showDeleteFn } from '../Delete/Delete';

import { system } from '../../../config/default.json';
import { ArticlesRes, Articles as ArticlesItem, Response } from '../../../interfaces/response';

import './articles.css';

const { initialPageSize, columns } = system;
const initialData: ArticlesItem[] = [];

function Articles() {
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setLoadding] = useState(true);
    const [initialPage, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [dataSource, setData] = useState(initialData);

    useEffect(() => {
        if (firstLoad) loadArticles(initialPage, initialPageSize);
    });

    async function loadArticles(page: number, pageSize: number, query = {}) {
        setFirstLoad(false);

        await axios.post('/article/getArticles', {
            page,
            pageSize,
            query,
        }).then(result => {
            const data: ArticlesRes = result.data;
            const { error, msg, content } = data;

            setLoadding(false);

            if (error === 1) {
                message.error(msg);
                return;
            }

            if (content) {
                const { articles, maxLength } = content;
                const data: ArticlesItem[] = [];

                setTotal(maxLength);
                for(let i = 0; i< articles.length; i++) {
                    data[i] = Object.assign({}, articles[i], { key: articles[i].id });
                }
                setData(data);
            }
        }).catch(err => {
            message.error('Please check network!');
            console.log(err);
        });
    }

    function pageChange(page: number, pageSize?: number) {
        setPage(page);

        if (pageSize) loadArticles(page, pageSize);
    }

    async function deleteOkFn(record: ArticlesItem) {
        const { id } = record;
        await axios.post('/article/deletArticle', { id }).then(result => {
            const data: Response = result.data;
            const { error, msg } = data;

            if(error === 1) {
                message.error(msg);
                return;
            }

            message.success('Deleted!');
            const length = dataSource.length;
            const newPage = length === 1 ? initialPage - 1 : initialPage;
            if (newPage <= 0) {
                setData(initialData);
                return;
            }
            setPage(newPage);
            loadArticles(newPage, initialPageSize);
        }).catch(err => {
            message.error('Please check network!');
            console.log(err);
        })
    }

    const initialColumns = [
        columns.title,
        columns.author,
        {
            ...columns.createTime,
            render: (text: any, record: ArticlesItem) => <span>{new Date(record.createTime).toLocaleString()}</span>,
        },
        {
            ...columns.updatedAt,
            render: (text: any, record: ArticlesItem) => <span>{new Date(record.updatedAt).toLocaleString()}</span>,
        },
        {
            title: "Action",
            key: "action",
            render: (text: any, record: ArticlesItem) => {
                return (<Row gutter={[6, 6]}>
                    <Col span={24}>
                        <Button
                            block
                            onClick={() => {
                                showDeleteFn(record, deleteOkFn);
                            }}
                        >Delete</Button>
                    </Col>
                </Row>)
            },
        }
    ];

    return (
        <div className="system-articles">
            <div className="button-box">
                <Button type="primary" onClick={() => {
                    setLoadding(true);
                    loadArticles(initialPage, initialPageSize);
                }}>Refresh</Button>
            </div>
            <Table
                className="articles-table"
                loading={isLoading}
                pagination={{
                    position: 'bottomRight',
                    current: initialPage,
                    pageSize: initialPageSize,
                    total,
                    onChange: pageChange,
                }}
                bordered={false}
                dataSource={dataSource}
                columns={initialColumns}
                scroll={{
                    x: 'max-content'
                }}
            />
        </div>
    );
}

export default Articles;