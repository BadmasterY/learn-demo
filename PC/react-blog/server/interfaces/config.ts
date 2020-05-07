interface Http {
    host: string;
    port: number;
    exclusive: boolean;
    readableAll: boolean;
    writableAll: boolean;
    ipv6Only: boolean;
}

interface Server {
    jsonLimit: string;
    formLimit: string;
}

interface DBReplocaSet {
    name: string;
    members: Array<{
        host: string;
        port: string;
    }>;
}

interface DB {
    initUserName: string;
    initPassWord: string;
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

interface configSchema {
    runSetterOnQuery: boolean;
    timestamps: {
        createdAt: string;
        updateAt: string;
    }
}

export {
    Http,
    Server,
    DB,
    configSchema,
}