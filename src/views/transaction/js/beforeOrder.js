import JsonBig from "json-bigint";

let beforeOrder=function(param) {
  let opt = {
    ws: param.ws,   //WsSocket
    id: param.id,   //广告ID,BigInt
    sid: param.sid,   //发布人ID，BigInt
    currency: param.currency.toLowerCase(),   //广告货币,btc
    loginUid: param.loginUid,   //当前登录ID,BigInt
    isLogin: param.isLogin,     //是否登录，bool
    isVerify: param.isVerify,   //是否实名认证,bool
  };

  //是否登录
  if (!opt.isLogin) {
    return Promise.reject("未登录");
  }

  //是否实名认证
  // if(!opt.isVerify){
  //   return Promise.reject("未实名认证");
  // }

  //是否自己的广告
  if(JsonBig.stringify(opt.sid)===JsonBig.stringify(opt.loginUid)){
    return Promise.reject("不能与自己交易");
  }

  //广告是否存在
  let isExist=new Promise((resolve,reject)=>{
    opt.ws.send("otc", "sale_detail", {id:opt.id}).then(data => {
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
    opt.ws.send("wallet", "wallets", {}).then((data)=> {
      if(data.wallets){
        resolve();
      } else{
        opt.ws.send('wallet', 'new_wallet',{currency:currency}).then((data)=> {
          resolve();
        }).catch(()=>{
          reject("创建"+currency+"钱包失败");
        });
      }
    }).catch(()=>{
      reject("获取钱包失败");
    });
  });

  //是否有未完成的订单
  let hasUnfinishOrder=new Promise((resolve,reject)=>{
    opt.ws.send('otc', 'orders', {type:1, state: '1,2,3', origin: 0}).then(data => {
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
