interface modelBase {
    _id?: string;
    createTime?: string;
    updatedAt?: string;
}

interface Users extends modelBase {
    nickname: string;
    password: string;
    position: string;
}

export {
    Users,
}