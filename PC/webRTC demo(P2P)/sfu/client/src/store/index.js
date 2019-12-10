import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 用户
    room: null, // 房间
    peer: null, // peer
    isCalling: false, // 正在呼叫
    caller: null, // 呼叫方
    stream: null, // stream
    video: null,
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
    setStream(state, data) {
      state.stream = data;
    },
    setVideo(state, data) {
      state.video = data;
    },
    setOtherUser(state, data) {
      state.room.users.push(data);
    },
  },
  actions: {
  },
  modules: {
  }
})
