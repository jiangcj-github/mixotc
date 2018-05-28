export default {
  showLoginForm: false,
  isLogin: false,
  userInfo: null,
  showChat: false,
  evaluateOrderResult: {}, // 订单评论结果
  transformInfo: 0, // 支付标识来源
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
  strangerInfo: {},
  editContent: {},
  editFlag: 0,
  coinLoopData: [], //顶部轮询数据
  PaymentSoreData: 0, // 用户初始支付方式
  /**
   * 审核申述客服部分
   */

  serviceData: [], // 左侧聊天内容
  serviceNow: '', // 当前客服聊天
  serviceNowOther: {}, // 对方聊天信息
  serviceUser: {}, // 聊天人员信息
  serviceMessage: {}, // 聊天信息
  stopTradeOtherInfo: ''
};
