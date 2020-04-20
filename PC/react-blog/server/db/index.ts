/**
 * 创建可食用的数据库实例
 */

import { connectMongoDB, closeMongoDB } from './base/Mongo';
import { Users, Articles, Comments } from './models';
import { Dao } from './base/Dao';

connectMongoDB();

const users = new Dao(Users);
const articles = new Dao(Articles);
const comments = new Dao(Comments);

export {
    users,
    articles,
    comments,
}