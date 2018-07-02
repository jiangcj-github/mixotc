import JsonBig from "json-bigint";

let beforeOrder=async function(vue,param) {
  let opt = {
    id: param.id,   //广告ID,BigInt
    sid: param.sid,   //发布人ID，BigInt
    currency: param.currency.toLowerCase(),   //广告货币,btc
    type: param.type      //订单类型:1-出售(我买)，2-购买(我卖)
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
  if(isVerify !== 2){
    return Promise.reject('请先进行<a href="#/personal/account/auth" style="text-decoration: underline; color: #FFB422">实名认证</a>');
  }

  // 是否设置资金密码
  if (opt.type === 2 && fundPass === 1) { // 提醒设置支付密码
    return Promise.reject('请先设置<a href="#/personal/safe" style="text-decoration: underline; color: #FFB422">支付密码</a>');
  }

  //是否自己的广告
  if(JsonBig.stringify(opt.sid)===JsonBig.stringify(loginUid)){
    return Promise.reject("不能与自己交易");
  }

  //广告是否存在
  let isExist=new Promise((resolve,reject)=>{
    ws.send("otc", "sale_detail", {id:opt.id}).then(data => {
      if(data.state === 2 ) {
        reject("广告已下架");
      }else{
        resolve();
      }
    }).catch(()=>{
      reject("获取广告失败");
    });
  });

  //钱包
  let hasWallet=new Promise((resolve,reject)=>{
    ws.send("wallet", "wallets", {uid: loginUid}).then((data)=>{
      let walletList = [], useBalace;
      data.wallets.forEach(v => {
        walletList.push(v.currency)
      });
      if(walletList.indexOf(opt.currency) < 0) {
        reject('请先<a href="#/wallet/account" style="text-decoration: underline; color: #FFB422">创建钱包</a>');
        return
      }
      useBalace = data.wallets.filter(v => {
        return v.currency === opt.currency
      });
      if(opt.type === 2 && useBalace[0].balance === 0) {
        reject(`可用余额不足，<a href="#/wallet/charge?coin=${opt.currency}" style="text-decoration: underline; color: #FFB422">去充币</a>`)
        return
      }
      resolve();
    }).catch((msg)=>{
      reject("获取钱包失败");
    });
  });

  //是否有未完成的订单
  let hasUnfinishOrder=new Promise((resolve,reject)=>{
    ws.send('otc', 'orders', {type:1, state: '1,2,3', origin: 0}).then(data => {
      if(data.orders){
        reject('有未完成的订单，<a href="#/order" style="text-decoration: underline; color: #FFB422">我的订单</a>');
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
