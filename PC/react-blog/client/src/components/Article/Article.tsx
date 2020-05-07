import React, { useState, useEffect } from 'react';
import { Divider, Spin, Tooltip, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Comment from '../Comment/Comment';
import { ArticleRes } from '../../interfaces/response';
import { actions as articleActions } from '../../redux/ducks/article';
import { actions as commentActions } from '../../redux/ducks/comment';
import { reduxState } from '../../interfaces/state';

import './article.css';

function Article() {
    const [isLoading, setLoading] = useState(true);
    const { title, content, author, createTime, updatedAt } = useSelector((item: reduxState) => item.article);
    const history = useHistory();
    const dispatch = useDispatch();

    async function getArticle(search: string) {
        const searchString = search.split('?')[1];
        const id = searchString.split('article_id=')[1];
        await axios.post('/article/getArticle', {
            id,
        }).then(result => {
            const data: ArticleRes = result.data;
            const { error, msg, content } = data;

            setLoading(false);

            if (error === 1) {
                message.error(msg);
                return;
            }

            if (content) {
                const { comments } = content;
                const arctileAction = articleActions.articaleGet(content);
                dispatch(arctileAction);
                const commentAction = commentActions.commentGet(comments);
                dispatch(commentAction);
            }
        }).catch(err => {
            message.error('Please check network!');
            console.log(err);
        });
    }

    useEffect(() => {
        if (isLoading) {
            const { search } = history.location;
            getArticle(search);
        }
    });

    return (
        <Spin tip="Loading..." spinning={isLoading}>
            <div className="article">
                <h2 className="article-title">{title}</h2>
                <p className="article-author">
                    <Tooltip placement="right" title={<div className="article-tooltip">
                        <p>{author.nickname}</p>
                        <p className="tooltip-bio">{author.bio}</p>
                    </div>}>
                        <span>{author.nickname}</span>
                    </Tooltip>
                </p>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                <p className="article-time">CreateTime: {createTime ? new Date(createTime).toLocaleString() : ''}</p>
                <p className="article-time">UpdatedAt: {updatedAt ? new Date(updatedAt).toLocaleString() : ''}</p>
                <Divider />
                <Comment />
            </div>
        </Spin>
    );
}

export default Article;