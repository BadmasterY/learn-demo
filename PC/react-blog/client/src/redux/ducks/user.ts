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
    isLogin: false,
};

// Reducer
export default function reducer(state = Object.assign({}, initialState), action: Action = {}) {
    const { payload } = action;
    switch (action.type) {
        case types.LOGIN:
            if (payload) {
                const { id, url, bio, nickname, username, position, isLogin } = payload;
                if (id)
                    state.id = id;
                if (url)
                    state.url = url;
                if (bio)
                    state.bio = bio;
                if (nickname)
                    state.nickname = nickname;
                if (username)
                    state.username = username;
                if (position)
                    state.position = position;
                if (typeof isLogin === 'boolean')
                    state.isLogin = isLogin;
            }
            return state;
        case types.LOGOUT:
            state = Object.assign({}, initialState);
            return state;
        case types.UPDATE:
            if (payload) {
                const { url, bio, nickname } = payload;
                if (url)
                    state.url = url;
                if (bio)
                    state.bio = bio;
                if (nickname)
                    state.nickname = nickname;
            }
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
    userLogin: (payload: Payload) => ({ type: types.LOGIN, payload }),
    userLogout: () => ({ type: types.LOGOUT }),
    userUpdate: (payload: Payload) => ({ type: types.UPDATE, payload }),
    // 文章id 评论内容 content
    userComment: (id: string, content: string) => ({ type: types.COMMENT, payload: { id, content } }),
    // 文章title 文章内容 content
    userPublish: (title: string, content: string) => ({ type: types.PUBLISH, payload: { title, content } }),
};