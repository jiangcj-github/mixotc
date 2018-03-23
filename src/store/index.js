import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: null
  },
  mutations: {
    changeLogin(state, {data}) {
      state.isLogin = data;
    },
    getUserInfo(state, {data}) {
      state.userInfo = data;
    }
  },
  plugins: [createLogger()]
});

export default store;
