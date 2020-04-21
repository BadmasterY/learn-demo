import { Schema } from 'mongoose';

interface GetCommentsRequset {
    page: number;
    pageSize: number;
    query: object;
}

interface GetCommentsResponse {
    id?: string;
    author: {
        id: Schema.Types.ObjectId;
        nickname: string;
    };
    content: string;
    createTime?: string;
    updatedAt?: string;
}

interface DeleteCommentRequest {
    id: string;
}

export {
    GetCommentsRequset,
    GetCommentsResponse,
    DeleteCommentRequest,
}