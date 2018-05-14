const changeLoginForm = "changeLoginForm";
const changeLogin = "changeLogin";
const getUserInfo = "getUserInfo";
const changeChatBox = "changeChatBox";
const changeToken = "changeToken";
const changeTrustList = "changeTrustList";
const changeUnread = "changeUnread";
const changeCurChat = "changeCurChat";
const changeChat = "changeChat";
const delChat = "delChat";
const getFriendList = "getFriendList";
const getGroupList = "getGroupList";
const newChat = "newChat";
const newTrust = "newTrust";
const delTrust = "delTrust";
const updateGroupInfo = "updateGroupInfo";
const addMessages = "addMessages";
const changeMessageState = "changeMessageState";
const changeImgsrc = "changeImgsrc";
const changeMoreFlag = "changeMoreFlag";
const moreMessage = "moreMessage";
const moneyAddress = "moneyAddress";
const newSystemMes = "newSystemMes";
const beKick = 'beKick' // 新增发送消息
const beAdd = "beAdd"; // 被加入群
const chatTop = "chatTop"; // 新增发送消息
const delStranger = "delStranger"; // 加好友后删除之前陌生人对话
const initState = "initState"; // 改变登陆用户时初始化必要的state
const updateStrangerInfo = "updateStrangerInfo"; // 跟新陌生人信息
const agreeAddFriend = "agreeAddFriend";
const delFriend = "delFriend";



const evaluateOrder = "evaluateOrder"; // 订单评论结果



/**
 * 审核申述客服部分
 */
 const initServiceData = 'initServiceData'; // 初始化数据
 const getServiceNowtalk = 'getServiceNowtalk'; // 获取左侧聊天人员具体信息
 const changeServiceNowtalk = 'changeServiceNowtalk'; // 根据左边选择右边人员
 const addServiceMessages = 'addServiceMessages'; // 存储发送信息
 const changeServiceMessages = 'changeServiceMessages'; // 新增发送消息
 const transformServiceUser = 'transformServiceUser'; // 双方人员身份转换
 const changeServiceImgsrc = 'changeServiceImgsrc'; // 改变图片
 const moreServiceMessage = 'moreServiceMessage'; // 添加更多消息
 const stopTrade = 'stopTrade'; // 终止交易


export {
  changeLoginForm,
  changeLogin,
  getUserInfo,
  changeChatBox,
  changeToken,
  changeTrustList,
  changeUnread,
  changeCurChat,
  changeChat,
  delChat,
  getFriendList,
  getGroupList,
  newChat,
  newTrust,
  delTrust,
  updateGroupInfo,
  addMessages,
  changeMessageState,
  changeImgsrc,
  changeMoreFlag,
  moreMessage,
  moneyAddress,
  newSystemMes,
  beKick,// 被踢出群
  beAdd,
  chatTop,
  delStranger,
  initState,//改变登陆用户时初始化必要的state
  updateStrangerInfo,
  agreeAddFriend,
  delFriend,

  evaluateOrder,



  /**
   * 审核申述客服部分
   */
  initServiceData,
  getServiceNowtalk,
  changeServiceNowtalk,
  addServiceMessages,
  changeServiceMessages,
  transformServiceUser,
  changeServiceImgsrc, // 改变图片
  moreServiceMessage,
  stopTrade

};
