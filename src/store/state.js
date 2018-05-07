export default {
  showLoginForm: false,
  isLogin: false,
  userInfo: null,
  showChat: false,
  evaluateOrderResult: {}, // 订单评论结果
  newOrder: false,
  trustList: [],
  friendList: [],
  groupList: [],
  unreadNumber: 0,
  curChat: '', //当前聊天
  systemMessage: 0, //未读系统消息
  token: "",
  chat: [],
  moneyAddress: [],
  messages: {
    system:[]
  },

  /**
   * 审核申述客服部分
   */

  serviceData: [], // 左侧聊天内容
  serviceNow: '', // 当前客服聊天
  serviceNowOther: {}, // 对方聊天信息
  serviceUser: {}, // 聊天人员信息
  serviceMessage: {} // 聊天信息
};
