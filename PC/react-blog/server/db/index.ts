/**
 * 创建可食用的数据库实例
 */

import { connectMongoDB, closeMongoDB } from './base/Mongo';
import { Users, Articles } from './models';
import { Dao } from './base/Dao';

connectMongoDB();

const users = new Dao(Users);
const articles = new Dao(Articles);

export {
    users,
    articles,
}