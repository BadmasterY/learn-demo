import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    room: null,
    peer: null,
    anwser: null,
    offer: null,
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
    }
  },
  actions: {
  },
  modules: {
  }
})
