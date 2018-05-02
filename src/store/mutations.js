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
    if (data) state.unreadNumber = 0;
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

  [types.chatTop](state, { data }) {
    // 聊天置顶
    state.chat.unshift(state.chat.splice(data)[0]);
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
    let idex = false,
      flag = false;
    state.chat.forEach((item, index) => {
      item.id === data.id && (idex = index);
    });
    !state.messages[data.id] && (state.messages[data.id] = []); //对话记录不存在时创建
    state.messages[data.id].push(data.msg);
    data.id === "system" && state.curChat !== "system" && state.systemMessage++;
    data.id !== "system" &&
      state.curChat !== data.id &&
      idex !== false &&
      state.chat[idex].unread++;
    state.isLogin && !state.showChat && state.unreadNumber++;
    // 有新增加消息进来，将对话列表置顶
    state.chat.unshift(state.chat.splice(idex, 1)[0]);
  },

  [types.changeMessageState](
    state,
    {
      data: { id, time, code }
    }
  ) {
    // 消息发送成功或失败
    let idx = 0;
    state.messages[id].forEach((item, index) => {
      if (time === item.time) {
        item.isLoding = false;
        code && (item.isFail = true);
        idx = index;
      }
    });
    state.messages = Object.assign({}, state.messages);
  },

  [types.changeImgsrc](
    state,
    {
      data: { id, time, src }
    }
  ) {
    let idx = 0;
    state.messages[id].forEach((item, index) => {
      if (time === item.time) {
        item.msg.content = src;
      }
    });
    state.messages = Object.assign({}, state.messages);
  },

  [types.changeMoreFlag](
    state,
    {
      data: { id, flag }
    }
  ) {
    // 改变更多消息的标志
    let idx = 0;
    state.chat.forEach((item, index) => {
      if (item.id === id) {
        item.moreFlag = flag;
      }
    });
  },

  [types.moreMessage](state, { data }) {
    // 查看更多消息
    !state.messages[state.curChat] && (state.messages[state.curChat] = []);
    state.messages[state.curChat] = data
      .reverse()
      .concat(state.messages[state.curChat]);
    state.messages = Object.assign({}, state.messages);
  },

  [types.moneyAddress](state, { data }) {
    // 收款地址
    state.moneyAddress = data;
  },

  [types.newSystemMes](state, { data }) {
    // 收款地址
    state.messages["system"].push(data);
    if (state.curChat !== "system") state.systemMessage++;
    if (state.isLogin && !state.showChat) state.unreadNumber++;
  },

  [types.beKick](state, { data }) {
    //被踢出群
    state.chat.forEach(item => {
      if (item.id === data) {
        item.exists = false;
      }
    });
  },


  /**
   * 审核申述客服部分
   */

  // 初始化聊天部分数据 （自己的信息）
  [types.initServiceData](state, { data }) {
    state.serviceData = data;
  },
  // 获取左侧聊天人员具体信息
  [types.getServiceNowtalk](state, { data }) {
    state.serviceUser = data
  },
  // 根据左边选择右边状态（对方的信息）
  [types.changeServiceNowtalk](state, { data }) {
    // 改变当前聊天
    state.serviceNow = data.id; // 聊天入口人的id
    state.serviceNowOther = data.data //  聊天入口对方人的信息
  },
  // 双方人员置换
  [types.transformServiceUser](state, { data }) {
    state.serviceData.unshift(data)
  },

  // 接收到消息和发送消息时的处理
  [types.addServiceMessages](state, { data }) {
    let idex = false;
    state.serviceData.forEach((item, index) => {
      item.id === data.id && (idex = index);
    });
    !state.serviceMessage[data.id] && (state.serviceMessage[data.id] = []); //对话记录不存在时创建
    state.serviceMessage[data.id].push(data.msg);
    // state.isLogin && !state.showChat && state.unreadNum++;
  },
  // 新增发送消息
  [types.changeServiceMessages](state, {data: { id, time, code }}) {
    // 消息发送成功或失败
    let idx = 0;
    state.serviceMessage[id].forEach((item, index) => {
      if (time === item.time) {
        item.isLoding = false;
        code && (item.err = true);
        idx = index;
      }
    });
    state.serviceMessage = Object.assign({}, state.serviceMessage);
  },
  [types.changeServiceImgsrc](state, {data: {id, time, src}}) {
    state.serviceMessage[id].forEach((item, index) => {
      if (time === item.time) {
        item.content = src;
      }
    });
    state.serviceMessage = Object.assign({}, state.serviceMessage);
  },

};
