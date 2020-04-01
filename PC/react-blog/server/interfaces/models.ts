interface modelBase {
    id?: string;
    _id?: string;
    createTime?: string;
    updatedAt?: string;
}

interface Users extends modelBase {
    url: string;
    bio: string;
    nickname: string;
    username: string;
    password: string;
    position: string;
}

export {
    Users,
}