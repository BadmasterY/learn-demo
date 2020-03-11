// 模型
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { mongoClient } = require('./Mongo');

// schema 相关配置
// 详细查看 https://mongoosejs.com/docs/guide.html#options
const schemaOptions = require('config').get('schema');

/**
 * 创建所有数据库对应模型
 * 必须: Schame 和 Model
 */

 // 创建 schema
const testSchema = new Schema({
    name: String,
    nickname: String
}, schemaOptions);

// 创建 model
const Tests = mongoose.model('tests', testSchema);

module.exports = {
    Tests,
};