import { types } from './actionTypes';

let nextBarrageId = 0;

let initialState = {
  isLogin: false,
  input: '',
  barrages: []
};

/**
 * reducers 
 * 指定应用状态如何变化
 * 如何响应action并发送到store
 * @param {json} state 当前的状态
 * @param {json} action 触发的动作
 */
export function reducer(state = initialState, action) {
  switch (action.type) {
    // 发送弹幕
    case types.ADD_Barrage:
      console.log(state);
      if (!state.input) return state;
      return Object.assign({}, state, {
        input: '',
        barrages: [
          ...state.barrages,
          {
            id: ++nextBarrageId,
            input: state.input
          }
        ]
      });
    // 弹幕输入框更新
    case types.updateInput:
      return Object.assign({}, state, {
        input: action.input
      });
    default: return state;
  }
}