import mongoose from 'mongoose';

/**
 * 转换为 objectId
 * @param str 需要转换的字符串或者数字
 */
function toObjectId(str: string | number) {
    return mongoose.Types.ObjectId(str);
}

export {
    toObjectId,
};