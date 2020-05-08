interface UploadComment {
    id?: string;
    articleId: string;
    authorId: string;
    avatar: string;
    content: string;
    datetime: string;
}

interface List extends UploadComment {
    author: {
        id: string;
        avatarUrl?: string;
        nickname: string;
        bio: string;
        url: string;
    }[];
    createTime?: string;
    updatedAt?: string;
}

interface CommentState {
    list: List[]
}

interface CommentPayload extends List {}

interface CommentAction {
    type?: string;
    payload?: CommentPayload;
}

export type Action = CommentAction;
export type State = CommentState;
export type Payload = CommentPayload;
export type Comment = UploadComment;