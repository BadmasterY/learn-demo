interface BaseResponse {
    error: number;
    msg?: string;
}

interface Content {
    id?: string;
    url?: string;
    bio?: string;
    nickname?: string;
    username?: string;
    position?: string;
}

interface UserResponse extends BaseResponse {
    content?: Content;
}

export type Response = BaseResponse;
export type UserRes = UserResponse;