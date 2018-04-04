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
    component: resolve => require(['@/views/transaction/Order'], resolve) // 交易中心
  },
  {
    path: "/transaction/tradeRules",
    name: "tradeRules",
    component: resolve => require(['@/views/transaction/tradeRules'], resolve) // 交易中心
  },
  {
    path: "/homepage/release",
    name: "release",
    component: resolve => require(['@/views/homepage/Release'], resolve) // 买卖家个人中心-他的发布
  }
]

export default {
  routes:ROUTES
}
