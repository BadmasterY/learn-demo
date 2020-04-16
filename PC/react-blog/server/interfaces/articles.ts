import { Users, Articles } from './models';

interface PublishArticleRequest {
    authorId: string;
    title: string;
    content: string;
}

interface GetArticleRequest {
    page: number;
    pageSize: number;
    query: object;
}

interface GetArticleResult extends Articles {
    author: Users[]
}

interface GetArticleRespone extends Articles {
    author: {
        bio: string;
        url: string;
        nickname: string;
        username: string;
    }
}

export {
    PublishArticleRequest as PublishRequest,
    GetArticleRequest as GetRequest,
    GetArticleResult as GetResult,
    GetArticleRespone as GetResponse,
}