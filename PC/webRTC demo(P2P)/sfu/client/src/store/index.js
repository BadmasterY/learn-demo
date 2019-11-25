import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 用户
    room: null, // 房间
    peer: null, // peer
    anwser: null,
    offer: null,
    isCalling: false, // 正在呼叫
    caller: null, // 呼叫方
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setRoom(state, data) {
      state.room = data;
    },
    setPeer(state, data) {
      state.peer = data;
    },
    setCalling(state, data) {
      state.isCalling = data;
    },
    setCaller(state, data) {
      state.caller = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
