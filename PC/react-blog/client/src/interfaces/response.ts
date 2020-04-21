import { State as CommentState } from './comment';

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

interface ArticleListContent {
    maxLength: number;
    articles?: ArticleListItem[];
}

interface ArticleListResponse extends BaseResponse {
    content?: ArticleListContent;
}

interface ArticleItemContent extends ArticleListItem {
    comments: CommentState;
}

interface ArticleResponse extends BaseResponse {
    content?: ArticleItemContent;
}

interface ArticlesItem {
    id: string;
    title: string;
    author: string;
    createTime: string;
    updatedAt: string;
}

interface ArticlesResponse extends BaseResponse {
    content?: {
        maxLength: number;
        articles: ArticlesItem[];
    };
}

interface CommentsItem {
    id: string;
    author: {
        id: string;
        nickname: string;
    };
    content: string;
    createTime: string;
    updatedAt: string;
}

interface CommentsResponse extends BaseResponse {
    content?: {
        maxLength: number;
        comments: CommentsItem[];
    }
}

interface GetUserInfoResult extends BaseResponse {
    content?: {
        articles: number;
        comments: number;
    }
}

export type Response = BaseResponse;
export type UserRes = UserResponse;
export type UserList = UserListResponse;
export type ListContent = UserListItem;
export type ArticleListRes = ArticleListResponse;
export type ArticleItem = ArticleListItem;
export type ArticleRes = ArticleResponse;
export type Articles = ArticlesItem;
export type ArticlesRes = ArticlesResponse;
export type Comments = CommentsItem;
export type CommentsRes = CommentsResponse;
export type UserInfoResult = GetUserInfoResult;