interface List {
    id: string;
    author: string;
    content: string;
    createTime?: string;
    updatedAt?: string;
}

interface CommentState {
    list: List[]
}

interface Payload {
    id?: string;
    content?: string;
}

interface CommentAction {
    type?: string;
    payload?: Payload;
}

export type Action = CommentAction;
export type State = CommentState;