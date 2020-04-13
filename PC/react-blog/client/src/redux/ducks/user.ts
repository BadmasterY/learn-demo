// 用户
import { Payload, Action, State } from '../../interfaces/user';

// Actions
export const types = {
    LOGIN: 'userLogin', // 登录
    LOGOUT: 'userLogout', // 登出
    UPDATE: 'userUpdate', // 更新信息
    COMMENT: 'comment', // 评论
    PUBLISH: 'publish', // 发布
};

// state
const initialState: State = {
    id: '', // key
    bio: '',
    url: '',
    nickname: '',
    username: '',
    position: '',
    isLogin: true,
};

// Reducer
export default function reducer(state = initialState, action: Action = {}) {
    const { payload } = action;
    switch (action.type) {
        case types.LOGIN:
            return Object.assign({}, state, payload);
        case types.LOGOUT:
            return Object.assign({}, state, initialState);
        case types.UPDATE:
            return Object.assign({}, state, payload);
        case types.COMMENT:
            return Object.assign({}, state);
        case types.PUBLISH:
            return Object.assign({}, state);
        default:
            return state;
    }
};

// Action creaters
export const actions = {
    userLogin: (payload: Payload) => ({ type: types.LOGIN, payload }),
    userLogout: () => ({ type: types.LOGOUT }),
    userUpdate: (payload: Payload) => ({ type: types.UPDATE, payload }),
    // 文章id 评论内容 content
    userComment: (payload: Payload) => ({ type: types.COMMENT, payload }),
    // 文章title 文章内容 content
    userPublish: (title: string, content: string) => ({ type: types.PUBLISH, payload: { title, content } }),
};