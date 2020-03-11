// 链接层
const mongoose = require('mongoose');
// 获取数据库相关配置信息
// 配置信息位于 config 下
const {
    name,
    host,
    port,
    user,
    pass, 
    autoIndex, 
    replicaSet, 
    serverSelectionTimeoutMS, 
    socketTimeoutMS, 
    useNewUrlParser, 
    useUnifiedTopology, 
    poolSize
} = require('config').get('db');

// 替换 mongoose promise
mongoose.Promise = global.Promise;

/**
 * 获取数据库配置
 * @returns {Object} 配置信息
 */
function getMongoDBOptions() {
    // 初始配置
    const options = {
        useNewUrlParser, // 允许发生错误时, 退回到旧解析器
        useUnifiedTopology, // 默认为 false
        autoIndex, // 是否自动建立索引, 在大型开发时, 并不推荐启用
        serverSelectionTimeoutMS, // 超时
        socketTimeoutMS, // socket 超时
        poolSize, // 保持的最大sokect连接数
        reconnectTries: Number.MAX_VALUE,
    };

    if (user) options.user = user; // 管理员账号
    if (pass) options.pass = pass; // 管理员密码

    return options;

}

/**
 * 获取数据库 uri
 * @returns {string} uri
 */
function getMongoDBUri() {
    let mongoUri = 'mongodb://';

    // 检查是否配置有 repliceaSet 信息
    // 单个链接时, 无需使用
    // 配置文件仅供测试, 并非最佳实践
    if (replicaSet.name) {
        const members = replicaSet.members;
        for (const member of members) {
            const { host, port } = member;
            mongoUri += `${host}:${port},`; // 拼接, 注意结尾逗号
        }

        mongoUri = mongoUri.slice(0, -1); // 去除最后的逗号
    } else {
        mongoUri += `${host}:${port}`; // 单个
    }

    mongoUri += `/${name}`; // 记得添加数据库名

    return mongoUri;
}

// 创建链接池, 使用 connect 创建
// 同时由于 mongoose 存在操作缓存, 不需要等待链接成功就可以使用
// 当然这样也不会造成错误, 因为 mongoose 会等到链接成功时再执行
mongoose.connect(getMongoDBUri(), getMongoDBOptions());

const db = mongoose.connection;

// 链接成功时触发
db.on('connected', function () {
    console.log(`[DB] Mongoose connected to ${getMongoDBUri()}`);
});

// 发生异常时触发
db.on('error', function (err) {
    console.log(`[DB] Mongoose connection error: ${err}`);
});

// 关闭时触发
db.on('disconnected', function () {
    console.log('[DB] Mongoose disconnected...');
});

/**
 * 结束链接
 * @returns {undefined}
 */
function closeMongoDB() {
    mongoClient.close(err => {
        console.log(`[DB] Mongoose close error: ${err}`);
    });
}

module.exports = {
    closeMongoDB,
};
