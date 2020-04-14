interface BaseResponse {
    error: number;
    msg?: string;
}

interface UserContent {
    id?: string;
    url?: string;
    bio?: string;
    nickname?: string;
    username?: string;
    position?: string;
}

interface UserResponse extends BaseResponse {
    content?: UserContent;
}

interface UserListItem {
    key?: string;
    id?: string;
    nickname?: string;
    username?: string;
    position?: string;
    useState?: number;
}

interface UserListContent {
    maxLength?: number;
    users?: UserListItem[];
}

interface UserListResponse extends BaseResponse {
    content?: UserListContent;
}

export type Response = BaseResponse;
export type UserRes = UserResponse;
export type UserList = UserListResponse;
export type ListContent = UserListItem;