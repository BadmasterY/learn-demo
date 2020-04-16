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

export {
    UserList as List,
    GetUsersRequest as GetRequest,
    DeleteUserRequest as DeleteRequest,
    UpdateUserRequest as  UpdateRequest,
    RegisterUserRequest as RegisterRequest,
    ResetpassUserRequest as ResetpassRequest,
}