import * as types from "./mutation-types";

// 同步改变状态时
export default {
  [types.changeLoginForm](state, { data }) {
    //登录框展示隐藏
    state.showLoginForm = data;
  },
  [types.changeLogin](state, { data }) {
    //登录状态
    state.isLogin = data;
  },
  [types.getUserInfo](state, { data }) {
    //存入用户登陆后返回的信息
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
    // 未读信息条数
    state.unreadNumber = data;
  },
  [types.changeCurChat](state, { data }) {
    // 改变当前聊天
    state.curChat = data.id;
    data.id === "system" && (state.systemMessage = 0)
    data.index && (state.chat[data.index].unread = 0);
  },
  [types.changeChat](state, { data }) {
    // 初始化聊天部分数据
    state.chat = data;
  },
  [types.delChat](state, { data }) {
    state.curChat =''
      // 删除聊天
    state.chat.splice(data, 1);
  }
};
