// 用户
import { Payload, Action, State } from '../../interfaces/user';

// Actions
export const types = {
    LOGIN: 'userLogin', // 登录
    LOGOUT: 'userLogout', // 登出
    UPDATE: 'userUpdate', // 更新信息
};

// state
const initialState: State = {
    id: '', // key
    bio: '',
    url: '',
    avatarUrl: '',
    nickname: '',
    username: '',
    position: '',
    isLogin: false,
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
        default:
            return state;
    }
};

// Action creaters
export const actions = {
    userLogin: (payload: Payload) => ({ type: types.LOGIN, payload }),
    userLogout: () => ({ type: types.LOGOUT }),
    userUpdate: (payload: Payload) => ({ type: types.UPDATE, payload }),
};