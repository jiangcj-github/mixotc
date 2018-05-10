import * as types from "./mutation-types";
import JsonBig from "json-bigint";
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
  [types.evaluateOrder](state, { data }) {
    // 订单评论结果
    state.evaluateOrderResult = data;
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
    state.chat.unshift(state.chat.splice(data, 1)[0]);
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
    let target = state.chat.filter((item, index) => {
      return item.id === data.id;
    })[0];
    if (data.name) {
      target.nickName = data.name;
      return;
    }
    let obj = state.groupList.filter(item => {
      return JsonBig.stringify(item.id) === data.id;
    })[0];
    target.length = obj.members.length;
    target.nickName = obj.name;
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
    state.messages = Object.assign({}, state.messages);
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
    // data =JSON.parse(JSON.stringify(data));
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
    // 系统消息(目前只有请求添加信息)
    let idx;
    state.messages["system"].forEach((item, index) => {
      if (item.id === data.id) idx = index;
    });
    if (idx !== undefined) state.messages["system"].splice(idx, 1);
    state.messages["system"].push(data);
    if (state.curChat !== "system") state.systemMessage++;
    if (state.isLogin && !state.showChat) state.unreadNumber++;
  },

  // 同意好友请求后改变isDeal处理标志
  [types.agreeAddFriend](state, { data }) {
    let idx;
    state.messages["system"].forEach((item, index) => {
      if (item.id === data.id) idx = index;
    });
    state.messages["system"][idx].isDeal = true;
  },

  [types.beKick](state, { data }) {
    //被踢出群
    state.chat.forEach(item => {
      if (item.id === data) {
        item.exists = false;
      }
    });
  },
  //加好友后删除之前陌生人对话
  [types.delStranger](
    state,
    {
      data: { id, index }
    }
  ) {
    state.chat.splice(index, 1);
    delete state.messages[id];
    state.messages = Object.assign({}, state.messages);
  },

  [types.initState](state) {
    //改变登陆用户时初始化必要的state
    state.trustList = [];
    state.friendList = [];
    state.groupList = [];
    state.unreadNumber = 0;
    state.curChat = ""; //当前聊天
    state.systemMessage = 0; //未读系统消息
    state.token = "";
    state.chat = [];
    state.moneyAddress = [];
    state.messages = { system: [] };
    state.isLogin = false;
  },

  [types.updateStrangerInfo](state, { data:{id, icon, name} }) {
    //更新陌生人信息
    state.strangerInfo[id] = {
      icon,
      name
    }
    state.strangerInfo = Object.assign({}, state.strangerInfo);
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
    state.serviceUser = data;
  },
  // 根据左边选择右边状态（对方的信息）
  [types.changeServiceNowtalk](state, { data }) {
    // 改变当前聊天
    state.serviceNow = data.id; // 聊天入口人的id
    state.serviceNowOther = data.data; //  聊天入口对方人的信息
    state.serviceData.forEach((item, index) => {
      item.user_id === data.id && (item.unread = 0);
    });
  },
  // 双方人员置换
  [types.transformServiceUser](state, { data }) {
    state.serviceNow = data.id; // 聊天入口人的id
  },

  // 接收到消息和发送消息时的处理
  [types.addServiceMessages](state, { data }) {
    let idex;
    state.serviceData.forEach((item, index) => {
      item.user_id === data.id && (idex = index);
    });
    !state.serviceMessage[data.id] && (state.serviceMessage[data.id] = []); //对话记录不存在时创建
    state.serviceMessage[data.id].push(data.msg);
    state.serviceNow !== data.id && state.serviceData[idex].unread++;
    state.serviceMessage = Object.assign({}, state.serviceMessage);
    // 新增加消息对话列表置顶
    state.serviceData.unshift(state.serviceData.splice(idex, 1)[0]);
  },
  // 新增发送消息
  [types.changeServiceMessages](
    state,
    {
      data: { id, time, code }
    }
  ) {
    // 消息发送成功或失败
    let idx = 0;
    state.serviceMessage[id].forEach((item, index) => {
      if (time === item.time) {
        item.isLoding = false;
        code && (item.err = 1);
        idx = index;
      }
    });
    state.serviceMessage = Object.assign({}, state.serviceMessage);
  },
  // 发送图片
  [types.changeServiceImgsrc](
    state,
    {
      data: { id, time, src }
    }
  ) {
    state.serviceMessage[id].forEach((item, index) => {
      if (time === item.time) {
        item.content = src;
      }
    });
    state.serviceMessage = Object.assign({}, state.serviceMessage);
  },
  // 查看更多消息
  [types.moreServiceMessage](state, { data }) {
    !state.serviceMessage[state.serviceNow] &&
      (state.serviceMessage[state.serviceNow] = []);
    state.serviceMessage[state.serviceNow] = data
      .reverse()
      .concat(state.serviceMessage[state.serviceNow]);
    state.serviceMessage = Object.assign({}, state.serviceMessage);
  },

  // 终止交易
  [types.stopTrade](state, { data }) {
    let idex;
    state.serviceData.forEach((item, index) => {
      //item.user_id === data.appellant_id && (idex = index);
      item.user_id === data.appellee_id && (idex = index);
      state.serviceData.splice(idex, 1);
    });
    state.serviceNow = state.serviceData[0].user_id;
  }
};
