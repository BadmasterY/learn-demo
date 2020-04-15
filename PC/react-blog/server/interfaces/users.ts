import { Users } from './models';
import { type } from 'os';

interface UserList {
    id?: string;
    nickname?: string;
    username?: string;
    position?: string;
    useState?: number;
}

interface GetUsersRequest {
    page: number;
    pageSize: number;
    query: object;
}

interface RegisterUserRequest {
    username: string;
    nickname: string;
    password: string;
}

interface ResetpassUserRequest {
    id: string;
    oldpass: string;
    newpass: string;
}

interface DeleteUserRequest {
    id: string;
}

interface UpdateUserRequest {
    id: string;
    updateUserData: Users;
}

export type List = UserList;
export type GetRequest = GetUsersRequest;
export type DeleteRequest = DeleteUserRequest;
export type UpdateRequest = UpdateUserRequest;
export type RegisterRequest = RegisterUserRequest;
export type ResetpassRequest = ResetpassUserRequest;