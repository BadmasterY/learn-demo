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

    function showAuthor(author: {id: string, nickname: string}) {
        console.log(author);
    }

    return (
        <List
            className="comment-list"
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={({ author, avatar, content, datetime }) => {
                return (<Comment
                    author={author.nickname}
                    avatar={<div onClick={() => { showAuthor(author) }}><Avatar>{avatar}</Avatar></div>}
                    content={<p className="comment-content">{content}</p>}
                    datetime={datetime}
                />);
            }}
        />
    )
}

export default CommentList;