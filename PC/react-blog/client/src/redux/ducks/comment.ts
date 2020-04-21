// 评论
import { State, Action, Payload } from '../../interfaces/comment';

// actions
export const types = {
    GET: 'commentGet',
    ADD: 'commentAdd',
    DELETE: 'commentDelete',
    REVISE: 'commentRevise',
};

const initialState: State = {
    list: []
};

// reducers
export default function reducer(state = initialState, action: Action = {}) {
    const { payload } = action;

    switch (action.type) {
        case types.GET:
            return Object.assign({}, state, {list: payload});
        case types.ADD:
            const newState = Object.assign({}, state);
            if (payload) newState.list.push(payload);
            return newState;
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
    commentGet: (comments: State) => ({ type: types.GET, payload: comments }),
    commentAdd: (comment: Payload) => ({ type: types.ADD, payload: comment }),
    commentDelete: (id: string) => ({ type: types.DELETE, payload: { id } }),
    commentRevise: (id: string, content: string) => ({ type: types.REVISE, payload: { id, content } }),
};