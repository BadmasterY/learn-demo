import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    roomid: null,
    room: null,
    video: null,
    isCalling: false,
    caller: null,
    otherUser: null, // 暂存，多人使用 map 存储
    producer: null,
    recvTransport: null,
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setRoom(state, data) {
      state.room = data;
    },
    setVideo(state, data) {
      state.video = data;
    },
    setCalling(state, data) {
      state.isCalling = data;
    },
    setCaller(state, data) {
      state.caller = data;
    },
    setOtherUser(state, data) {
      state.otherUser = data;
    },
    setProducer(state, data) {
      state.producer = data;
    },
    setRecvTransport(state, data) {
      state.recvTransport = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
