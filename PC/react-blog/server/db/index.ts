/**
 * 创建可食用的数据库实例
 */

import { connectMongoDB, closeMongoDB } from './base/Mongo';
import { Users } from './models';
import { Dao } from './base/Dao';

connectMongoDB();

const users = new Dao(Users);

export {
    users,
}