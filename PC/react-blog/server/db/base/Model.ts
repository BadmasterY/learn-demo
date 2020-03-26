// 模型
import mongoose from 'mongoose';
import config from 'config';

import { configSchema } from '../../interfaces/config';

const { Schema } = mongoose;

// schema 相关配置
// 详细查看 https://mongoosejs.com/docs/guide.html#options
const schemaOptions: configSchema = config.get('schema');

/**
 * 创建 model
 * @param name model名
 * @param opts schema definition
 */
function createModel(name: string, opts: mongoose.SchemaDefinition) {
    // 创建 schema
    const schema = new Schema(opts, schemaOptions);
    // 创建 model
    const model = mongoose.model(name, schema);

    return model;
}

export {
    createModel,
}