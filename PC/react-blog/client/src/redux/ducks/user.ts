// 用户
import { Action, State } from '../../interfaces/user';

// Actions
export const types = {
    LOGIN: 'userLogin', // 登录
    LOGOUT: 'userLogout', // 登出
    COMMENT: 'comment', // 评论
    PUBLISH: 'publish', // 发布
};

// state
const initialState: State = {
    id: '', // key
    name: '',
    position: '',
    isLogin: false,
};

// Reducer
export default function reducer(state = initialState, action: Action = {}) {
    const { payload } = action;
    switch (action.type) {
        case types.LOGIN:
            if (payload) {
                const { id, name, position, isLogin } = payload;
                if (id)
                    state.id = id;
                if (name)
                    state.name = name;
                if (position)
                    state.position = position;
                if (typeof isLogin === 'boolean')
                    state.isLogin = isLogin;
            }
            return state;
        case types.LOGOUT:
            return state;
        case types.COMMENT:
            return state;
        case types.PUBLISH:
            return state;
        default:
            return state;
    }
};

// Action creaters
export const actions = {
    userLogin: () => ({ type: types.LOGIN }),
    userLogout: () => ({ type: types.LOGOUT }),
    // 文章id 评论内容 content
    userComment: (id: string, content: string) => ({ type: types.COMMENT, payload: { id, content } }),
    // 文章title 文章内容 content
    userPublish: (title: string, content: string) => ({ type: types.PUBLISH, payload: { title, content } }),
};