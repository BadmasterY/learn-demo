interface GetUsersRequset {
    page: number;
    pageSize: number;
    query: object;
}

interface DeleteUserRequset {
    id: string;
}

export type GetRequset = GetUsersRequset;
export type DeleteRequset = DeleteUserRequset;