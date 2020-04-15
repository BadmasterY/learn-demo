interface PublishArticleRequest {
    author: string;
    title: string;
    content: string;
}

interface GetArticleRequest {
    page: number;
    pageSize: number;
    query: object;
}

export {
    PublishArticleRequest as PublishRequest,
    GetArticleRequest as GetRequest,
}