import React from 'react';
import { List, Comment, Avatar, Popover } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

import './commentlist.css';

interface Props {
    comments: {
        authorId: string;
        author: {
            id: string;
            nickname: string;
            url: string;
            bio: string;
        }[];
        avatar: string;
        content: string;
        datetime: string;
    }[];
}

function CommentList(props: Props) {
    const { comments } = props;

    return (
        <>
            <List
                className="comment-list"
                dataSource={comments}
                header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
                itemLayout="horizontal"
                renderItem={({ author, avatar, content, datetime }) => {
                    return (<Comment
                        author={author[0].nickname}
                        avatar={
                            <Popover style={{ maxWidth: '80px' }} placement="top" content={
                                <div style={{ textAlign: 'center' }}>
                                    <div>
                                        <Avatar shape="square" size={64}>{avatar}</Avatar>
                                    </div>
                                    <div style={{ fontWeight: 700 }}>{author[0].nickname}</div>
                                    <div style={{ color: 'rgba(0,0,0,0.3)', fontSize: '.8em' }}>{author[0].bio}</div>
                                    <div>{
                                        author[0].url ?
                                            <>
                                                <LinkOutlined /> <a target="_blank" rel="noopener noreferrer" href={`http://${author[0].url}`}>{author[0].url}</a>
                                            </>
                                            : ''
                                    }</div>
                                </div>
                            }>
                                <Avatar>{avatar}</Avatar>
                            </Popover>}
                        content={<p className="comment-content">{content}</p>}
                        datetime={datetime}
                    />);
                }}
            />
        </>
    )
}

export default CommentList;