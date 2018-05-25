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
    path: "/advertisement/release", // 发广告
    name: "ReleaseAd",
    redirect: "/advertisement/release/buy",
    component: resolve => require(['@/views/advertisement/ReleaseAd'], resolve), // 发广告
    children: [
      // 购买广告
      {
        path: "/advertisement/release/buy",
        name: "releaseBuy",
        component: resolve => require(['@/views/advertisement/child/ReleaseAdBuy'], resolve), // 购买广告
      },
      // 出售广告
      {
        path: "/advertisement/release/sale",
        name: "releaseSale",
        component: resolve => require(['@/views/advertisement/child/ReleaseAdSale'], resolve), // 购买广告
      },
    ]
  },
  {
    path: "/advertisement", // 我的广告
    name: "MyAd",
    component: resolve => require(["@/views/advertisement/MyAd"], resolve) // 我的广告
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
      //我的评价
      {
        path: "evaluate",
        name: "personal-evaluate",
        component: resolve => require(["@/views/personalCenter/children/evaluate/Evaluate"], resolve)
      },
      //账户设置
      {
        path: "account",
        name: "personal-account",
        redirect: "/personal/account/baseInfo",
        component: resolve =>
          require(["@/views/personalCenter/children/account"], resolve),
        children: [
          {
            path: "baseInfo",
            name: "personal-baseInfo",
            component: resolve =>
              require([
                "@/views/personalCenter/children/account/BaseInfo"
              ], resolve)
          },
          {
            path: "apply",
            name: "personal-apply",
            component: resolve =>
              require([
                "@/views/personalCenter/children/account/Apply"
              ], resolve)
          },
          {
            path: "auth",
            name: "personal-auth",
            component: resolve =>
              require(["@/views/personalCenter/children/account/Auth"], resolve)
          }
        ]
      },
      //安全设置
      {
        path: "safe",
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
  },
  // 钱包
  {
    path: "/wallet",
    redirect: "/wallet/account" // 钱包
  },
  {
    path: "/wallet/account",
    component: resolve => require(["@/views/wallet/Account"], resolve) // 账户余额
  },
  {
    path: "/wallet/charge",
    component: resolve => require(["@/views/wallet/Charge"], resolve) // 充币
  },
  {
    path: "/wallet/withdraw",
    component: resolve => require(["@/views/wallet/Withdraw"], resolve) // 提币
  },
  {
    path: "/wallet/conversion",
    component: resolve => require(["@/views/wallet/Conversion"], resolve) // 资产互转
  },
  {
    path: "/wallet/history",
    component: resolve => require(["@/views/wallet/History"], resolve) // 账单明细
  },
  {
    path: "/wallet/address",
    component: resolve => require(["@/views/wallet/Address"], resolve) // 地址管理
  }
];

export default {
  routes: ROUTES
};

