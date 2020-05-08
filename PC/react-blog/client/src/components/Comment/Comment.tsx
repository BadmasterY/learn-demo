import React, { useState } from 'react';
import { Comment, Avatar, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import List from '../CommentList/CommentList';
import Editor from '../CommentEditor/CommentEditor';
import Login from '../FastLogin/FastLogin';

import { reduxState } from '../../interfaces/state';
import { Response } from '../../interfaces/response';
import { Comment as UploadComment } from '../../interfaces/comment';
import { actions } from '../../redux/ducks/comment';

import './comment.css';

function MyComment() {
    const [isSubmitting, setSubmitting] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const { isLogin, nickname, avatarUrl, id, url, bio } = useSelector((item: reduxState) => item.user);
    const { _id } = useSelector((item: reduxState) => item.article);
    const { list } = useSelector((item: reduxState) => item.comment);
    const dispatch = useDispatch();

    async function onSubmit(form: FormInstance) {
        if (!isLogin) {
            setShowLogin(true);
            return;
        }

        setSubmitting(true);
        await form.validateFields().then(async result => {
            const { commentContent } = result;
            const commentData: UploadComment = {
                articleId: _id,
                content: (commentContent as string),
                authorId: id,
                avatar: nickname,
                datetime: new Date().toLocaleString(),
            };

            await axios.post('/comment/addComment', commentData).then(result => {
                const data: Response = result.data;
                const { error, msg } = data;

                setSubmitting(false);

                if (error === 1) {
                    message.error(msg);
                    return;
                }

                message.success('Comment!');
                const action = actions.commentAdd(Object.assign({}, commentData, {
                    author: [{
                        id,
                        nickname,
                        avatarUrl,
                        url,
                        bio,
                    }]
                }));
                dispatch(action);
                form.resetFields();
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
                    avatarUrl && avatarUrl !== '' ?
                        <Avatar src={`/user/${avatarUrl}`} size="large" />
                        :
                        < Avatar size="large">{isLogin ? nickname : 'User'}</Avatar>
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