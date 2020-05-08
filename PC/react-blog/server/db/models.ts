/**
 * 创建模型
 * 可以都写在这个文件
 * 也可以拆分在不同的文件
 */
import { createModel } from './base/Model';
import { Schema } from 'mongoose';

const Users = createModel('users', {
    url: String,
    bio: String,
    avatarUrl: String,
    nickname: String,
    username: String,
    password: String,
    position: String,
    removed: Number,
    useState: Number,
});

const Articles = createModel('articles', {
    authorId: Schema.Types.ObjectId,
    title: String,
    content: String,
    removed: Number,
});

const Comments = createModel('comments', {
    articleId: Schema.Types.ObjectId,
    title: String,
    authorId: Schema.Types.ObjectId,
    content: String,
    removed: Number,
    datetime: String,
    avatar: String,
});

export {
    Users,
    Articles,
    Comments,
}