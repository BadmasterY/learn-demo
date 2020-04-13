import React, { useState, useEffect } from 'react';
import { Table ,message } from 'antd';
import axios from 'axios';

import { UserRes } from '../../../interfaces/response';
import { system } from '../../../config/default.json';

import './users.css';

const { pageSize } = system;

function Users() {
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [initialPage, setPage] = useState(1);

    useEffect(() => {
        if(!isLoading) return;
        axios.post('/user/getUserList', {
            page: initialPage,
            pageSize,
            query: {}
        }).then(res => {
            setLoading(false);
            const data: UserRes = res.data;
            const { error, msg, content } = data;
            if(error === 1) {
                message.error(msg);
            }
        }).catch(err => {
            setLoading(false);
            message.error('Error! Check network!');
            console.log(err);
        })
    });

    return (
        <div className="system-users">
            <Table
                loading={isLoading}
                pagination={{
                    position: 'bottomRight',
                    current: initialPage,
                    pageSize,
                    total,
                }}
            />
        </div>
    );
}

export default Users;