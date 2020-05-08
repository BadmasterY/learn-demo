import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Button, Tooltip, message } from 'antd';
import axios from 'axios';

import { system } from '../../../config/default.json';
import { showDeleteFn } from '../Delete/Delete';
import { Comments as CommentsItem, CommentsRes, Response } from '../../../interfaces/response';

import './comments.css';

const { initialPageSize, columns } = system;
const initialData: CommentsItem[] = [];

function Comments() {
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setLoadding] = useState(true);
    const [dataSource, setData] = useState(initialData);
    const [initialPage, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (firstLoad) loadComments(initialPage, initialPageSize);
    });

    async function loadComments(page: number, pageSize: number, query = {}) {
        setFirstLoad(false);

        await axios.post('/comment/getComments', {
            page,
            pageSize,
            query,
        }).then(result => {
            const data: CommentsRes = result.data;
            const { error, msg, content } = data;

            setLoadding(false);

            if (error === 1) {
                message.error(msg);
                return;
            }

            if (content) {
                const { maxLength, comments } = content;
                const data: CommentsItem[] = [];

                setTotal(maxLength);
                for(let i = 0; i < comments.length; i++) {
                    data[i] = Object.assign({}, comments[i], {
                        key: comments[i].id,
                    });
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

        if (pageSize) loadComments(page, pageSize);
    }

    async function deleteOkFn(record: CommentsItem) {
        const { id } = record;

        await axios.post('/comment/deleteComment', { id }).then(result => {
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
            loadComments(newPage, initialPageSize);
        }).catch(err => {
            message.error('Please check network!');
            console.log(err);
        })
    }

    const initialColumns = [
        columns.content,
        {
            ...columns.author,
            render: (text: any, record: CommentsItem) => <Tooltip title={record.author.id}><span>{record.author.nickname}</span></Tooltip>,
        },
        {
            ...columns.createTime,
            render: (text: any, record: CommentsItem) => <span>{new Date(record.createTime).toLocaleString()}</span>,
        },
        {
            ...columns.updatedAt,
            render: (text: any, record: CommentsItem) => <span>{new Date(record.updatedAt).toLocaleString()}</span>,
        },
        {
            title: "Action",
            key: "action",
            render: (text: any, record: CommentsItem) => {
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
        <div className="system-comments">
            <div className="button-box">
                <Button type="primary" onClick={() => {
                    setLoadding(true);
                    loadComments(initialPage, initialPageSize);
                }}>Refresh</Button>
            </div>
            <Table
                className="users-table"
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

export default Comments;