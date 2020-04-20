// 博文
import { Action, State } from '../../interfaces/articale';

// actions
export const types = {
    GET: 'articleGet',
    ADD: 'articleAdd',
    DELETE: 'articleDelete',
    REVISE: 'articleRevise',
};

const initialState: State = {
    _id: '', // key
    authorId: '', // author id
    title: '',
    content: '',
    author: {
        url: '',
        bio: '',
        nickname: '',
        username: '',
    },
}

// reducer
export default function reducer(state = initialState, action: Action = {}) {
    const { payload } = action;

    switch (action.type) {
        case types.GET:
            return Object.assign({}, state, payload);
        case types.ADD:
            return state;
        case types.DELETE:
            return state;
        case types.REVISE:
            return state;
        default:
            return state;
    }
}

// Action creators
export const actions = {
    articaleGet: (articale: State) => ({type: types.GET, payload: articale}),
    articleAdd: (title: string, content: string) => ({ type: types.ADD, payload: { title, content } }),
    articleDelete: (id: string) => ({ type: types.DELETE, payload: { id } }),
    articleRevise: (id: string, content: string) => ({ type: types.REVISE, payload: { id, content } }),
}