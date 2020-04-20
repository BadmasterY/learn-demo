interface ArticaleState {
    _id: string;
    authorId: string;
    title: string;
    content: string; // TODO => json
    author: {
        url: string;
        bio: string;
        nickname: string;
        username: string;
    };
    desc?: string;
    createTime?: string;
    updatedAt?: string;
}

interface Payload {
    id?: string;
    title?: string;
    content?: string;
}

interface ArticaleAction {
    type?: string;
    payload?: Payload;
}

export type Action = ArticaleAction;
export type State = ArticaleState;