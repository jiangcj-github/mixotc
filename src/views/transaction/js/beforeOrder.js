import JsonBig from "json-bigint";

let beforeOrder=async function(vue,param) {
  let opt = {
    id: param.id,   //广告ID,BigInt
    sid: param.sid,   //发布人ID，BigInt
    currency: param.currency.toLowerCase(),   //广告货币,btc
    type: param.type
  };

  //是否登录
  if (!vue.$store.state.isLogin) {
    return Promise.reject("未登录");
  }

  let ws = vue.WsProxy;
  let isVerify = vue.$store.state.userInfo.verify;
  let loginUid = vue.$store.state.userInfo.uid;
  let fundPass = vue.$store.state.userInfo.is_new

  //是否实名认证
  // if(!isVerify){
  //   return Promise.reject("未实名认证");
  // }

  // 是否设置资金密码
  // if (opt.type == 2 && fundPass === 1) { // 提醒设置支付密码
  //   return Promise.reject("请设置资金密码");
  // }

  //是否自己的广告
  if(JsonBig.stringify(opt.sid)===JsonBig.stringify(loginUid)){
    return Promise.reject("不能与自己交易");
  }

  //广告是否存在
  let isExist=new Promise((resolve,reject)=>{
    ws.send("otc", "sale_detail", {id:opt.id}).then(data => {
      if(data.state === 2 ) {
        reject("广告不存在");
      }else{
        resolve();
      }
    }).catch(()=>{
      reject("获取广告失败");
    });
  });

  //钱包
  let hasWallet=new Promise((resolve,reject)=>{
    ws.send("wallet", "wallets", {}).then((data)=> {
      if(data.wallets){
        resolve();
      } else{
        ws.send('wallet', 'new_wallet',{currency: opt.currency}).then((data)=> {
          resolve();
        }).catch(()=>{
          reject("创建" + opt.currency + "钱包失败");
        });
      }
    }).catch(()=>{
      reject("获取钱包失败");
    });
  });

  //是否有未完成的订单
  let hasUnfinishOrder=new Promise((resolve,reject)=>{
    ws.send('otc', 'orders', {type:1, state: '1,2,3', origin: 0}).then(data => {
      if(data.orders){
        reject("有未完成的订单");
      }else{
        resolve();
      }
    }).catch(()=>{
      reject("获取订单失败");
    });
  });

  return Promise.all([
    isExist,
    hasWallet,
    hasUnfinishOrder,
  ]);
};

export default beforeOrder;
