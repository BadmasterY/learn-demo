/**
 * 创建模型
 * 可以都写在这个文件
 * 也可以拆分在不同的文件
 */
import { createModel } from './base/Model';

const Users = createModel('users', {
    url: String,
    bio: String,
    nickname: String,
    username: String,
    password: String,
    position: String,
    removed: Number,
    useState: Number,
});

const Articles = createModel('articles', {
    author: String,
    title: String,
    content: String,
});

export {
    Users,
    Articles,
}