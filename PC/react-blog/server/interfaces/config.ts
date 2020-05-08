/**
 * http 配置
 */
interface Http {
    host: string;
    port: number;
    exclusive: boolean;
    readableAll: boolean;
    writableAll: boolean;
    ipv6Only: boolean;
}

/**
 * 服务器配置
 */
interface Server {
    jsonLimit: string;
    formLimit: string;
}

/**
 * 数据库集合配置
 */
interface DBReplocaSet {
    name: string;
    members: Array<{
        host: string;
        port: string;
    }>;
}

/**
 * 初始化数据库配置
 */
interface InitDB {
    username: string;
    password: string;
    position: string;
    removed: number;
    useState: number;
}

/**
 * 数据库配置信息
 */
interface DB {
    dbname: string;
    user: string;
    pass: string;
    host: string;
    port: string;
    autoIndex: boolean;
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
    poolSize: number;
    replicaSet: DBReplocaSet;
}

/**
 * schema 配置
 */
interface configSchema {
    runSetterOnQuery: boolean;
    timestamps: {
        createdAt: string;
        updateAt: string;
    }
}

/**
 * 头像配置
 */
interface Avatar {
    dirName: string;
}

export {
    Http,
    Server,
    InitDB,
    DB,
    configSchema,
    Avatar,
}