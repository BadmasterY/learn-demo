import React, { useState, useEffect } from 'react';
import { Table, message, Row, Col, Button, Form, Input } from 'antd';
import axios from 'axios';

import { showDeleteFn } from '../Delete/Delete';
import { UserList, ListContent, UserRes } from '../../../interfaces/response';
import { system } from '../../../config/default.json';

import './users.css';

const { initialPageSize, columns } = system;
const initialData: any[] = [];

function Users() {
    const [dataSource, setData] = useState(initialData);
    const [total, setTotal] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [initialPage, setPage] = useState(1);
    const [form] = Form.useForm();

    async function loadUserList(page: number, pageSize: number, query = {}) {
        if(firstLoad) setFirstLoad(false);
        setLoading(true);
        await axios.post('/user/getUserList', {
            page,
            pageSize,
            query,
        }).then(res => {
            setLoading(false);
            const data: UserList = res.data;
            const { error, msg, content } = data;
            if (error === 1) {
                message.error(msg);
                return;
            }
            if (content) {
                const { users, maxLength } = content;
                const userList = [];

                if (users)
                    for (let i = 0; i < users.length; i++) {
                        userList.push(users[i]);
                        userList[i].key = `${i}`;
                    }
                setData(userList);
                if (maxLength) setTotal(maxLength);
            }
        }).catch(err => {
            setLoading(false);
            message.error('Error! Check network!');
            console.log(err);
        });
    }

    async function deleteOkFn(record: ListContent) {
        await axios.post('/user/deleteUser', {
            id: record.id
        }).then(result => {
            const data: UserList = result.data;
            const { error, msg } = data;

            if (error === 1) {
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
            loadUserList(newPage, initialPageSize);
        }).catch(err => {
            message.error('Error! Check network!');
            console.log(err);
        });
    }

    async function searchByUsername() {
        await form.validateFields().then(async result => {
            await loadUserList(initialPage, initialPageSize, {
                username: {
                    $regex: result.username
                }
            });
        }).catch(err => {
            setLoading(false);
            message.error('Please input something!');
            console.log(err);
        });
    }

    async function changeState(record: ListContent) {
        setLoading(true);

        const { id, useState } = record;

        const newState = useState === 1 ? 0 : 1;
        await axios.post(
            '/user/updateUser', 
            {id, updateUserData: {
                useState: newState,
            }}
        ).then(result => {
            const data: UserRes = result.data;
            const { error, msg } = data;

            setLoading(false);

            if(error === 1) {
                message.error(msg);
                return;
            }

            message.success('Updated!');
            dataSource.map((item) => {
                if(item === record) {
                    item.useState = newState;
                }
                return null;
            });
            // update state
            setData(Object.assign([], dataSource));
        }).catch(err => {
            setLoading(false);
            message.error('Please check network!');
            console.log(err);
        });
    }

    async function clearSearch() {
        console.log(form);
        form.resetFields();
        await loadUserList(initialPage, initialPageSize);
    }

    function pageChange(page: number, pageSize?: number) {
        setPage(page);
        if (pageSize) loadUserList(page, pageSize);
    }

    useEffect(() => {
        if (!firstLoad) return;
        loadUserList(initialPage, initialPageSize);
    });

    const state = {
        ...columns.state,
        render: (state: number) => {
            const showState = state === 0 ? '禁用' : '启用';
            const color = state === 0 ? '#ed4014' : '#19be6b';
            return (
                <span style={{ color }}>{showState}</span>
            )
        }
    }

    const initialColumns = [
        columns.nickname,
        columns.username,
        columns.position,
        state,
        {
            title: "Action",
            key: "action",
            render: (text: ListContent, record: ListContent) => {
                return (<Row gutter={[6, 6]}>
                    <Col xs={24} sm={12}>
                        <Button 
                            block
                            onClick={() => {
                                changeState(record);
                            }}
                        >{
                                record.useState === 1 ? 'Forbidden' : 'Enable'
                        }</Button>
                    </Col>
                    <Col xs={24} sm={12}>
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
        <div className="system-users">
            <Form
                form={form}
                hideRequiredMark={true}
            >
                <Row gutter={8}>
                    <Col xs={22} sm={12} md={6}>
                        <Form.Item
                            label="username"
                            name="username"
                            rules={[{ required: true, message: 'Please input something!' }]}
                        >
                            <Input placeholder="search by username..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="button-box">
                        <Button
                            type="primary"
                            onClick={searchByUsername}
                        >
                            Search
                        </Button>
                        <Button
                            style={{ margin: '0 8px' }}
                            onClick={clearSearch}
                        >
                            Clear
                        </Button>
                    </Col>
                </Row>
            </Form>
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

export default Users;