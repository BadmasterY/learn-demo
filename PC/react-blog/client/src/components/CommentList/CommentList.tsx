import React from 'react';
import { List, Comment, Avatar } from 'antd';

import './commentlist.css';

interface Props {
    comments: {
        author: {
            id: string;
            nickname: string;
        };
        avatar: string;
        content: string;
        datetime: string;
    }[];
}

function CommentList(props: Props) {
    const { comments } = props;

    return (
        <List
            className="comment-list"
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={({ author, avatar, content, datetime }) => {
                return (<Comment
                    author={author.nickname}
                    avatar={<Avatar>{avatar}</Avatar>}
                    content={<div dangerouslySetInnerHTML={{__html: content}}></div>}
                    datetime={new Date(datetime).toLocaleString()}
                />);
            }}
        />
    )
}

export default CommentList;