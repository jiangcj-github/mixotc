import { Loading } from 'element-ui';
let unique;
const spinRoute = {
  show() {
    let opt = {body: true, text: 'Loading...'};
    if(!unique) unique = Loading.service(opt);
  },
  resolve(resolve) {
    return function (component) {
      if (unique) {
        unique.close();
        unique = null;
      }
      resolve(component)
    }
  }
}

const ROUTES = [
  {
    path: "/",
    name: "index",
    component: resolve => {
      spinRoute.show();
      require(["@/views/transaction/Transaction"], spinRoute.resolve(resolve))
    }, // 交易中心
    meta: {
      title: "交易中心"
    }
  },
  {
    path: "/transaction",
    name: "transaction",
    component: resolve => {
      spinRoute.show();
      require(["@/views/transaction/Transaction"], spinRoute.resolve(resolve))
    }, // 交易中心
    meta: {
      title: "交易中心"
    }
  },
  {
    path: "/transaction/order",
    name: "order",
    component: resolve => {
      spinRoute.show();
      require(["@/views/transaction/Order"], spinRoute.resolve(resolve))
    }, // 交易中心购买BTC
    meta: {
      title: "订单"
    }
  },
  {
    path: "/helpcenter",
    name: "helpCenter",
    component: resolve => {
      spinRoute.show();
      require(["@/views/transaction/HelpCenter"], spinRoute.resolve(resolve))
    }, // 帮助中心
    meta: {
      title: "帮助中心"
    }
  },
  {
    path: "/coinData",
    name: "coinData",
    component: resolve => {
      spinRoute.show();
      require(["@/views/transaction/CoinData"], spinRoute.resolve(resolve))
    }, // 币种资料
    meta: {
      title: "币种资料"
    }
  },
  {
    path: "/order",
    name: "MyOrder",
    component: resolve => {
      spinRoute.show();
      require(["@/views/myOrder/MyOrder"], spinRoute.resolve(resolve))
    }, // 我的订单
    meta: {
      title: "我的订单"
    }
  },
  {
    path: "/order/evaluate",
    name: "MyOrderEvaluate",
    component: resolve => {
      spinRoute.show();
      require(["@/views/myOrder/MyOrderEvaluate"], spinRoute.resolve(resolve))
    }, // 我的订单评价
    meta: {
      title: "我的订单"
    }
  },
  {
    path: "/homepage", //?uid=xxx
    name: "homepage",
    component: resolve => {
      spinRoute.show();
      require(["@/views/homepage/Home"], spinRoute.resolve(resolve))
    }, // 买卖家个人中心-他的发布
    meta: {
      title: "个人中心"
    }
  },
  {
    path: "/advertisement/release", // 发广告
    name: "ReleaseAd",
    redirect: "/advertisement/release/buy",
    component: resolve => {
      spinRoute.show();
      require(["@/views/advertisement/ReleaseAd"], spinRoute.resolve(resolve))
    }, // 发广告
    meta: {
      title: "发广告"
    },
    children: [
      // 购买广告
      {
        path: "/advertisement/release/buy",
        name: "releaseBuy",
        component: resolve => {
          spinRoute.show();
            require(["@/views/advertisement/child/ReleaseAdBuy"], spinRoute.resolve(resolve))
          }, // 购买广告
        meta: {
          title: "发广告"
        }
      },
      // 出售广告
      {
        path: "/advertisement/release/sale",
        name: "releaseSale",
        component: resolve => {
          spinRoute.show();
            require(["@/views/advertisement/child/ReleaseAdSale"], spinRoute.resolve(resolve))
          }, // 购买广告
        meta: {
          title: "发广告"
        }
      }
    ]
  },
  {
    path: "/advertisement", // 我的广告
    name: "MyAd",
    component: resolve => {
      spinRoute.show();
      require(["@/views/advertisement/MyAd"], spinRoute.resolve(resolve))
    }, // 我的广告
    meta: {
      title: "我的广告"
    }
  },
  {
    path: "/verify",
    name: "verify",
    redirect: "/verify/identifyAuth", // 审核中心
    meta: {
      title: "我的广告"
    }
  },
  {
    path: "/personal",
    name: "personal",
    redirect: "/personal/account",
    component: resolve => {
      spinRoute.show();
        require(["@/views/personalCenter/personalCenter"], spinRoute.resolve(resolve))
      }, // 个人中心
    meta: {
      title: "个人中心"
    },
    children: [
      //我的评价
      {
        path: "evaluate",
        name: "personal-evaluate",
        component: resolve => {
          spinRoute.show();
            require([
            "@/views/personalCenter/children/evaluate/Evaluate"
          ], spinRoute.resolve(resolve))
        },
        meta: {
          title: "个人中心"
        }
      },
      //账户设置
      {
        path: "account",
        name: "personal-account",
        redirect: "/personal/account/baseInfo",
        component: resolve => {
          spinRoute.show();
            require(["@/views/personalCenter/children/account"], spinRoute.resolve(resolve))
          },
        meta: {
          title: "个人中心"
        },
        children: [
          {
            path: "baseInfo",
            name: "personal-baseInfo",
            component: resolve => {
              spinRoute.show();
                require([
                "@/views/personalCenter/children/account/BaseInfo"
              ], spinRoute.resolve(resolve))
            },
            meta: {
              title: "个人中心"
            }
          },
          {
            path: "apply",
            name: "personal-apply",
            component: resolve => {
              spinRoute.show();
                require([
                "@/views/personalCenter/children/account/Apply"
              ], spinRoute.resolve(resolve))
            },
            meta: {
              title: "个人中心"
            }
          },
          {
            path: "auth",
            name: "personal-auth",
            component: resolve => {
              spinRoute.show();
                require([
                "@/views/personalCenter/children/account/Auth"
              ], spinRoute.resolve(resolve))
            },
            meta: {
              title: "个人中心"
            }
          }
        ]
      },
      //安全设置
      {
        path: "safe",
        name: "safe",
        component: resolve => {
          spinRoute.show();
            require(["@/views/personalCenter/children/safe"], spinRoute.resolve(resolve))
          },
        meta: {
          title: "个人中心"
        }
      }
    ]
  },
  {
    path: "/verify/identifyAuth",
    name: "identifyAuth",
    component: resolve => {
      spinRoute.show();
      require(["@/views/verify/Idcard"], spinRoute.resolve(resolve))
    }, // 审核中心-身份审核
    meta: {
      title: "审核中心"
    }
  },
  {
    path: "/verify/largeTransaction",
    name: "largeTransaction",
    component: resolve => {
      spinRoute.show();
      require(["@/views/verify/LgTran"], spinRoute.resolve(resolve))
    }, // 审核中心-大额交易审核
    meta: {
      title: "审核中心"
    }
  },
  {
    path: "/verify/arbitrationRecord",
    name: "arbitrationRecord",
    component: resolve => {
      spinRoute.show();
      require(["@/views/verify/ArbiRec"], spinRoute.resolve(resolve))
    }, // 审核中心-仲裁记录
    meta: {
      title: "审核中心"
    }
  },
  {
    path: "/verify/service",
    name: "Service",
    component: resolve => {
      spinRoute.show();
      require(["@/views/kefu/Dialog"], spinRoute.resolve(resolve))
    }, // 客服交易对话框
    meta: {
      title: "对话"
    }
  },
  // 钱包
  {
    path: "/wallet",
    redirect: "/wallet/account" // 钱包
  },
  {
    path: "/wallet/account",
    component: resolve => {
      spinRoute.show();
      require(["@/views/wallet/Account"], spinRoute.resolve(resolve))
    }, // 账户余额
    meta: {
      title: "钱包"
    }
  },
  {
    path: "/wallet/charge",
    component: resolve => {
      spinRoute.show();
      require(["@/views/wallet/Charge"], spinRoute.resolve(resolve))
    }, // 充币
    meta: {
      title: "钱包"
    }
  },
  {
    path: "/wallet/withdraw",
    component: resolve => {
      spinRoute.show();
      require(["@/views/wallet/Withdraw"], spinRoute.resolve(resolve))
    }, // 提币
    meta: {
      title: "钱包"
    }
  },
  {
    path: "/wallet/conversion",
    component: resolve => {
      spinRoute.show();
      require(["@/views/wallet/Conversion"], spinRoute.resolve(resolve))
    }, // 资产互转
    meta: {
      title: "钱包"
    }
  },
  {
    path: "/wallet/history",
    component: resolve => {
      spinRoute.show();
      require(["@/views/wallet/History"], spinRoute.resolve(resolve))
    }, // 账单明细
    meta: {
      title: "钱包"
    }
  },
  {
    path: "/wallet/address",
    component: resolve => {
      spinRoute.show();
      require(["@/views/wallet/Address"], spinRoute.resolve(resolve))
    }, // 地址管理
    meta: {
      title: "钱包"
    }
  }
];

export default {
  routes: ROUTES
};

