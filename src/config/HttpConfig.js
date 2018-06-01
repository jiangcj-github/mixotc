/**
 * 使用方法
 *  1.在ProxyConfig配置好相关参数
 *  2.直接this.Proxy.XXX生成链接，返回promise
 *      注：若需要参数，this.Proxy.XXX（params）
 */

import httpAfterHandler from "../js/afterHandler/HttpAfterHandler"; // 这里引入http请求后的处理器，没有可以不引入
import httpPreHandler from "../js/preHandler/HttpPreHandler"; // 这里引入http请求前的处理器，没有可以不引入

export default {
  useHttp: true, // 是否开启http
  /**
   * name:请求标识
   * data:请求数据
   *  url:路径
   *  method:请求方式
   *  。。。
   * 注：其他fetch可以传入的参数，也在data里面传入
   */
  // httpPreHandler,
  // httpAfterHandler,
  httpList: [
    //test
    { name: "sales", data: { url: "/otc/sales/:page", method: "get" } }, // 获取交易中心广告列表内容
    { name: "getPrice", data: { url: "/otc/prices/", method: "get" } }, // 获取购买下单cny和数字货币价格
    { name: "userSearch", data: { url: "/otc/search/user/", method: "get" } }, // 获取交易中心用户模糊筛选下拉框
    { name: "coinSearch", data: { url: "/otc/search/coin/", method: "get" } }, // 获取交易中心币种模糊筛选下拉框
    { name: "getCoinData", data: {url: "/otc/coins/", method: "get"}},  // 获取币种资料
    { name: "coinLoop", data: {url: "/otc/quotation/", method: "get"}},  // 获取顶部最新市场行情接口
    // {
    //   name: "upLoad",
    //   data: {
    //     url: "/image/",
    //     method: "post",
    //   }
    // },
    {name: 'searchTips', data: {url: '/v1/home/searchTips', method: 'get'}}, //币种资料模糊搜索
    {name: 'getCoinDataAll', data: {url: '/v1/currency/detail', method: 'get'}}, // 获取币种资料

    { name: "hp_tradeInfo", data: { url: "/otc/traderinfo/", method: "get" } }, // 个人中心-获取个人信息
    { name: "hp_rates", data: { url: "/otc/traderrates/", method: "get" } }, // 获取发布信息
    { name: "hp_sales", data: { url: "/otc/tradersales/", method: "get" } }, // 获取评价

    { name: "hp_account", data: { url: "/api/v3/wallet/account/", method: "get" } }, // 获取币币账户列表

    { name: "hp_account_coin", data: { url: "/account/coinstatus/", method: "get" } } // 获取交易所上架钱包


  ]
};
