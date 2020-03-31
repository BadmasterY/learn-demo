interface UserState {
    id: string;
    name: string;
    position: string;
    isLogin: boolean;
}

interface Payload {
    id?: string;
    name?: string;
    position?: string;
    isLogin?: boolean;
    content?: string;
}

interface UserAction {
    type?: string;
    payload?: Payload;
}

export type Action = UserAction;
export type State = UserState;