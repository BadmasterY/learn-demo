import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    roomid: null,
    room: null,
    roomUsers: [],
    video: {},
    selfVideo: null,
    isCalling: false,
    isCalled: false,
    caller: null,
    otherUser: null, // 暂存，多人使用 map 存储
    producer: null, // 本地生产者
    consumer: null, // 本地消费者
    recvTransport: null,
    stream: null,
    isPaused: false,
    isPausedVideo: false,
    isPausedAudio: false,
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setRoom(state, data) {
      state.room = data;
    },
    setRoomUsers(state, data) {
      state.roomUsers = data;
    },
    setVideo(state, data) {
      const videos = state.video;
      videos[data.userid] = data;
      state.video = videos;
    },
    setSelfVideo(state, data) {
      state.selfVideo = data;
    },
    setCalling(state, data) {
      state.isCalling = data;
    },
    setCalled(state, data) {
      state.isCalled = data;
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
    setConsumer(state, data) {
      state.consumer = data;
    },
    setRecvTransport(state, data) {
      state.recvTransport = data;
    },
    setStream(state, data) {
      state.stream = data;
    },
    setPaused(state, data) {
      state.isPaused = data;
    },
    setPausedVideo(state, data) {
      state.isPausedVideo = data;
    },
    setPausedAudio(state, data) {
      state.isPausedAudio = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
