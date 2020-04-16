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

interface ArticleListItem {
    _id: string;
    authorId: string;
    author: {
        bio: string;
        url: string;
        nickname: string;
        username: string;
    };
    title: string;
    content: string;
    removed: number;
    createTime: string;
    updatedAt: string;
}

interface ArticleContent {
    maxLength: number;
    articles?: ArticleListItem[];
}

interface ArticleResponse extends BaseResponse {
    content?: ArticleContent;
}

export type Response = BaseResponse;
export type UserRes = UserResponse;
export type UserList = UserListResponse;
export type ListContent = UserListItem;
export type ArticleRes = ArticleResponse;
export type ArticleItem = ArticleListItem;