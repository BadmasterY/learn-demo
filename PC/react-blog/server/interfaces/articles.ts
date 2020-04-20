import { Users, Articles } from './models';

/**
 * Publish article
 */
interface PublishArticleRequest {
    authorId: string;
    title: string;
    content: ArticleContentItem;
}

/**
 * Get article list
 */
interface GetArticleListRequest {
    page: number;
    pageSize: number;
    query: object;
}

/**
 * Get article list result.
 * Use 'articles.aggregate' result
 */
interface GetArticleListResult extends Articles {
    author: Users[]
}

/**
 * Article list response
 */
interface GetArticleListResponse extends Articles {
    author: {
        bio: string;
        url: string;
        nickname: string;
        username: string;
    }
}

/**
 * Blocks
 */
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

/**
 * EntityMap
 */
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

/**
 * If publish json,
 * use this interface
 */
interface ArticleContentItem {
    blocks: ArticleBlocksItem[];
    entityMap: ArticleEntityMap;
}

/**
 * Get a article request
 */
interface GetArticleRequest {
    id: string;
}

export {
    PublishArticleRequest as PublishRequest,
    GetArticleListRequest as GetListRequest,
    GetArticleListResult as GetResult,
    GetArticleListResponse as GetResponse,
    ArticleContentItem as ArticleContent,
    GetArticleRequest as GetRequest,
}