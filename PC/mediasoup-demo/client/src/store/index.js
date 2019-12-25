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
    }
  },
  actions: {
  },
  modules: {
  }
})
