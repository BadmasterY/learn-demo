interface Content {
    id?: string;
    name?: string;
    position?: string;
}

interface UserResponse {
    error: number;
    msg?: string;
    content?: Content;
}

export type UserRes = UserResponse;