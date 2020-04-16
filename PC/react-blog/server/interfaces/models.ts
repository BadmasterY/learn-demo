import { Schema } from 'mongoose';

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
    removed: number;
    useState: number;
}

interface Articles extends modelBase {
    authorId: Schema.Types.ObjectId;
    title: string;
    content: string;
    removed: number;
}

export {
    Users,
    Articles,
}