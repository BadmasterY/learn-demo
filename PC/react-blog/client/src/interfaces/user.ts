interface UserState {
    id: string;
    bio: string;
    url: string;
    avatarUrl?: string;
    nickname: string;
    username: string;
    position: string;
    isLogin: boolean;
}

interface UserPayload {
    id?: string;
    bio?: string;
    url?: string;
    nickname?: string;
    username?: string;
    position?: string;
    isLogin?: boolean;
    content?: string;
}

interface UserAction {
    type?: string;
    payload?: UserPayload;
}

export type Payload = UserPayload;
export type Action = UserAction;
export type State = UserState;