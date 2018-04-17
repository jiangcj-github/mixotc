const ROUTES = [
  {
    path: "/",
    name: "index",
    component: resolve => require(['@/views/transaction/Transaction'], resolve) // 交易中心
  },
  {
    path: "/transaction",
    name: "transaction",
    component: resolve => require(['@/views/transaction/Transaction'], resolve) // 交易中心
  },
  {
    path: "/transaction/order",
    name: "order",
    component: resolve => require(['@/views/transaction/Order'], resolve) // 交易中心购买BTC
  },
  {
    path: "/transaction/tradeRules",
    name: "tradeRules",
    component: resolve => require(['@/views/transaction/tradeRules'], resolve) // 交易中心
  },
  {
    path: "/homepage",
    name: "homepage",
    component: resolve => require(['@/views/homepage/Home'], resolve) // 买卖家个人中心-他的发布
  },
  {
    path: "/verify",
    name: "verify",
    redirect: "/verify/identifyAuth"  // 审核中心
  },
  {
    path: "/verify/identifyAuth",
    name: "identifyAuth",
    component: resolve => require(['@/views/verify/Idcard'], resolve) // 审核中心-身份审核
  },
  {
    path: "/verify/largeTransaction",
    name: "largeTransaction",
    component: resolve => require(['@/views/verify/LgTran'], resolve) // 审核中心-大额交易审核
  },
  {
    path: "/verify/sensitiveLexicon",
    name: "sensitiveLexicon",
    component: resolve => require(['@/views/verify/SensLex'], resolve) // 审核中心-敏感词汇
  },
  {
    path: "/verify/arbitrationRecord",
    name: "arbitrationRecord",
    component: resolve => require(['@/views/verify/ArbiRec'], resolve) // 审核中心-仲裁记录
  },
  {
    path: "/order",
    name: "MyOrder",
    component: resolve => require(['@/views/myOrder/MyOrder'], resolve) // 我的订单
  },
  {
    path: "/order/evaluate",
    name: "MyOrderEvaluate",
    component: resolve => require(['@/views/myOrder/MyOrderEvaluate'], resolve) // 我的订单评价
  }
]

export default {
  routes:ROUTES
}
