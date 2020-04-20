interface List {
    id?: string;
    author: {
        id: string;
        nickname: string;
    };
    avatar: string;
    content: string;
    datetime: string;
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