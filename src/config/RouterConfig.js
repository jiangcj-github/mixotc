const ROUTES = [
  {
    path: "/",
    name: "index",
    component: resolve => require(["@/views/transaction/Transaction"], resolve) // 交易中心
  },
  {
    path: "/transaction",
    name: "transaction",
    component: resolve => require(["@/views/transaction/Transaction"], resolve) // 交易中心
  },
  {
    path: "/transaction/order",
    name: "order",
    component: resolve => require(["@/views/transaction/Order"], resolve) // 交易中心购买BTC
  },
  {
    path: "/transaction/tradeRules",
    name: "tradeRules",
    component: resolve => require(["@/views/transaction/tradeRules"], resolve) // 交易中心帮助中心
  },
  {
    path: "/coinData",
    name: "coinData",
    component: resolve => require(["@/views/transaction/CoinData"], resolve) // 币种资料
  },
  {
    path: "/order",
    name: "MyOrder",
    component: resolve => require(["@/views/myOrder/MyOrder"], resolve) // 我的订单
  },
  {
    path: "/order/evaluate",
    name: "MyOrderEvaluate",
    component: resolve => require(["@/views/myOrder/MyOrderEvaluate"], resolve) // 我的订单评价
  },
  {
    path: "/homepage", //?uid=xxx
    name: "homepage",
    component: resolve => require(["@/views/homepage/Home"], resolve) // 买卖家个人中心-他的发布
  },
  {
    path: "/verify",
    name: "verify",
    redirect: "/verify/identifyAuth" // 审核中心
  },
  {
    path: "/personal",
    name: "personal",
    redirect: "/personal/account",
    component: resolve =>
      require(["@/views/personalCenter/personalCenter"], resolve), // 个人中心
    children: [
      //账户设置
      {
        path: "/personal/account",
        name: "account",
        component: resolve =>
          require(["@/views/personalCenter/children/Account"], resolve)
      },
      //安全设置
      {
        path: "/personal/safe",
        name: "safe",
        component: resolve =>
          require(["@/views/personalCenter/children/safe"], resolve)
      }
    ]
  },
  {
    path: "/verify/identifyAuth",
    name: "identifyAuth",
    component: resolve => require(["@/views/verify/Idcard"], resolve) // 审核中心-身份审核
  },
  {
    path: "/verify/largeTransaction",
    name: "largeTransaction",
    component: resolve => require(["@/views/verify/LgTran"], resolve) // 审核中心-大额交易审核
  },
  {
    path: "/verify/arbitrationRecord",
    name: "arbitrationRecord",
    component: resolve => require(["@/views/verify/ArbiRec"], resolve) // 审核中心-仲裁记录
  },
  {
    path: "/verify/service",
    name: "Service",
    component: resolve => require(["@/views/kefu/Dialog"], resolve) // 客服交易对话框
  }
];

export default {
  routes: ROUTES
};

