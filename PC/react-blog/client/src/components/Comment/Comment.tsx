import React, { useState } from 'react';
import { Comment, Avatar, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useSelector } from 'react-redux';
import axios from 'axios';

import List from '../CommentList/CommentList';
import Editor from '../CommentEditor/CommentEditor';
import Login from '../FastLogin/FastLogin';

import { reduxState } from '../../interfaces/state';
import { Response } from '../../interfaces/response';

import './comment.css';

function MyComment() {
    const [isSubmitting, setSubmitting] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const { isLogin, nickname, id } = useSelector((item: reduxState) => item.user);
    const { _id } = useSelector((item: reduxState) => item.article);
    const { list } = useSelector((item: reduxState) => item.comment);

    async function onSubmit(form: FormInstance) {
        if (!isLogin) {
            setShowLogin(true);
            return;
        }

        setSubmitting(true);
        await form.validateFields().then(async result => {
            const { commentContent } = result;

            await axios.post('/comment/addComment', {
                arctileId: _id,
                content: commentContent,
                author: {
                    id,
                    nickname,
                },
                datetime: new Date().toLocaleString(),
            }).then(result => {
                const data: Response = result.data;
                const { error, msg } = data;

                setSubmitting(false);

                if(error === 1) {
                    message.error(msg);
                    return;
                }

                message.success('Comment!');
            }).catch(err => {
                setSubmitting(false);
                message.error('Please check network!');
                console.log(err);
            });
        }).catch(err => {
            setSubmitting(false);
            message.error('Please check input!');
            console.log(err);
        })
    }

    function closeLoginFn() {
        setShowLogin(false);
    }

    return (
        <div className="comment">
            {list.length > 0 && <List comments={list} />}
            <Comment
                avatar={
                    <Avatar size="large">{isLogin ? nickname : 'User'}</Avatar>
                }
                content={
                    <Editor
                        isSubmitting={isSubmitting}
                        onSubmit={onSubmit}
                    />
                }
            />
            <Login isShow={showLogin} closeFn={closeLoginFn} callback={closeLoginFn} />
        </div>
    );
}

export default MyComment;