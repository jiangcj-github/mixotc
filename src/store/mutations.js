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
    data.id === "system" && (state.systemMessage = 0);
    data.id !== "system" &&
      state.chat.forEach(item => {
        item.id === data.id && (item.unread = 0);
      });
  },

  [types.changeChat](state, { data }) {
    // 初始化聊天部分数据
    state.chat = data;
  },
  [types.delChat](state, { data }) {
    state.curChat = "";
    // 删除聊天
    state.chat.filter((item, index) => {
      item.id === data && state.chat.splice(index, 1);
    });
  },
  [types.getFriendList](state, { data }) {
    //好友列表
    state.friendList = data;
  },
  [types.getGroupList](state, { data }) {
    //群組列表
    state.groupList = data;
  },
  [types.newChat](state, { data }) {
    // 新建聊天窗口
    state.chat.unshift(data);
    state.curChat = data.id;
  },

  [types.newTrust](state, { data }) {
    // 加信任
    !state.trustList.includes(data) && state.trustList.push(data);
  },

  [types.delTrust](state, { data }) {
    // 取消信任
    let index = state.trustList.indexOf(data);
    index !== -1 && state.trustList.splice(index, 1);
  },

  [types.updateGroupInfo](state, { data }) {
    //更新群信息
    state.curChat = data.id;
    state.chat.filter((item, index) => {
      item.id === data.id &&
        data.length !== undefined &&
        (state.chat[index].length = data.length);
      item.id === data.id &&
        data.name !== undefined &&
        (state.chat[index].nickName = data.name);
    });
  },
  //接收到消息和发送消息时的处理
  [types.addMessages](state, { data }) {
    // 取消信任
    !state.messages[data.id] && (state.messages[data.id] = []);
    state.messages[data.id].push(data.msg)
  },

  [types.changeMessageState](state, { data: {id,time,code} }) {
    // 消息发送成功或失败
      state.messages[id].forEach(item => {
        if(time === item.time){
          item.isLoding = false
          code && (item.isFail = true);
        }
      })
      // state.messages[id].splice(state.messages[id].length - 1, 1);
    // !state.messages[data.id] && (state.messages[data.id] = []);
    // state.messages[data.id].push(data.msg)
  },



  /**
   * 审核申述客服部分
   */

  // 初始化聊天部分数据
  [types.initServiceData](state, { data }) {
    state.chat = data;
  },

};
