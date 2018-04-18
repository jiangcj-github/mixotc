import * as types from "./mutation-types";

// 同步改变状态时
export default {
  [types.changeLoginForm](state, { data }) {
    state.showLoginForm = data;
  },
  [types.changeLogin](state, { data }) {
    state.isLogin = data;
  },
  [types.getUserInfo](state, { data }) {
    state.userInfo = data;
  },
  [types.changeChatBox](state, { data }) {
    // 控制右下方消息框显示
    state.showChat = data;
  },
  [types.changeToken](state, { data }) {
    // 控制右下方消息框显示
    state.token = data;
  },
  [types.changeTrustList](state, { data }) {
    // 用户信任人员列表
    state.trustList = data;
  },
  [types.changeUnread](state, { data }) {
    // 用户信任人员列表
    state.unreadNumber = data;
  }
};
