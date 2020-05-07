import mongoose from 'mongoose';
import { Dao } from './Dao'
import { Users } from '../../interfaces/models';
import { md5 } from '../../utils/md5';

import config from 'config';

import { InitDB } from '../../interfaces/config';

const initConfig: InitDB = config.get('initDB');

/**
 * 转换为 objectId
 * @param str 需要转换的字符串或者数字
 */
function toObjectId(str: string | number) {
    return mongoose.Types.ObjectId(str);
}

/**
 * 初始化连接方法  
 * 用于创建初始账号
 * @param users 用户实例
 */
async function onConectedFn(users: Dao) {
    const result = (await users.findAll() as Users[]);
    if (result.length === 0) {
        const {
            username,
            password,
        } = initConfig;

        await users.save(Object.assign({}, initConfig, { password: md5(password) }));

        console.log(`[DB] Init username: ${username}`);
        console.log(`[DB] Init password: ${password}`);
    }
}

export {
    toObjectId,
    onConectedFn,
};