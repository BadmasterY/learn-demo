import { types } from './actionTypes';

export const actions = {
    // 发送弹幕
    addBarrage: () => ({
        type: types.ADD_Barrage
    }),
    // 弹幕输入框更新
    updateInput: (input) => ({
        type: types.updateInput,
        input
    })
};