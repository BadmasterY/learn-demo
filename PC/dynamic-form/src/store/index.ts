import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [], // 表单内容数组
    focusIndex: null, // 被选中控件的下标
    dragger: '', // 正在拖拽的对象(放入)
    atrribute: null, // 选中对象的属性
  },
  mutations: {
    setList(state, data) {
      state.list = data;
    },
    setIndex(state, index) {
      state.focusIndex = index;
    },
    setDrag(state, data) {
      state.dragger = data;
    },
    setAtrribute(state, data) {
      state.atrribute = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
