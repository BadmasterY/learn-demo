/**
 * 创建模型
 * 可以都写在这个文件
 * 也可以拆分在不同的文件
 */
import { createModel } from './base/Model';

const Users = createModel('users', {
    nickname: String,
    password: String,
    position: String,
});

export {
    Users,
}