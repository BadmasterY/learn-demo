// 博文
import { Action, State } from '../../interfaces/articale';

// actions
export const types = {
    ADD: 'articleAdd',
    DELETE: 'articleDelete',
    REVISE: 'articleRevise',
};

const initialState: State = {
    id: '', // key
    author: '', // author id
    title: '',
    content: '',
}

// reducer
export default function (state = initialState, action: Action = {}) {
    switch (action.type) {
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
    articleAdd: (title: string, content: string) => ({ type: types.ADD, payload: { title, content } }),
    articleDelete: (id: string) => ({ type: types.DELETE, payload: { id } }),
    articleRevise: (id: string, content: string) => ({ type: types.REVISE, payload: { id, content } }),
}