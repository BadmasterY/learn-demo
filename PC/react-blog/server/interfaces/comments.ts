import { Schema } from 'mongoose';
import { Users, Comments } from './models';

interface GetCommentsRequset {
    page: number;
    pageSize: number;
    query: object;
}

interface GetCommentsResult extends Comments {
    author: Users[];
}

interface GetCommentsResponse extends Comments {
    author: {
        id: Schema.Types.ObjectId;
        nickname: string;
    };
}

interface DeleteCommentRequest {
    id: string;
}

export {
    GetCommentsRequset,
    GetCommentsResult,
    GetCommentsResponse,
    DeleteCommentRequest,
}