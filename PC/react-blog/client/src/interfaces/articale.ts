interface ArticaleState {
    id: string;
    author: string;
    title: string;
    desc?: string;
    content: string;
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