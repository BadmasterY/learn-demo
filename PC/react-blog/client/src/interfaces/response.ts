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

interface ArticleBlocksItem {
    key: string;
    text: string;
    type: string;
    depth: number;
    inlineStyleRanges: {
        offset: number;
        length: number;
        style: string;
    }[];
    entityRanges: {
        offset: number;
        length: number;
        key: number;
    }[];
}

interface ArticleEntityMap {
    [key: number]: {
        type: string;
        mutability: string;
        data: {
            url: string;
            name: string;
            type: string;
            link?: string;
            link_target?: string;
            width?: string;
            height?: string;
            meta?: string;
        }
    }
}

interface ArticleContentItem {
    blocks: ArticleBlocksItem[];
    entityMap: ArticleEntityMap;
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
    content: ArticleContentItem;
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
export type ArticleCon = ArticleContentItem;