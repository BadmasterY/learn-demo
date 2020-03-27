// 评论
import { State, Action } from '../../interfaces/comment';

// actions
export const types = {
    ADD: 'commentAdd',
    DELETE: 'commentDelete',
    REVISE: 'commentRevise',
};

const initialState: State = {
    list: []
};

// reducers
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
};

// Action creators
export const actions = {
    commentAdd: (content: string) => ({ type: types.ADD, payload: { content } }),
    commentDelete: (id: string) => ({ type: types.DELETE, payload: { id } }),
    commentRevise: (id: string, content: string) => ({ type: types.REVISE, payload: { id, content } }),
};