let beforeOrder=function(param) {

  let id=opt.id;
  let sid=opt.sid;
  //let btverify=opt.btverify
  let currency=opt.currency;

  let opt={
    ws: param.ws,
    id :param.id,   //广告ID,字符串
    sid :param.sid,   //发布人ID，字符串
    currency: param.currency,   //广告货币,btc
    loginUid: param.loginUid,   //当前登录ID,字符串
    isLogin :param.isLogin,     //是否登录，bool
    isVerify: param.isVerify,   //是否实名认证,bool
  };

  //是否登录
  if(!opt.isLogin) return "未登录";

  //是否实名认证
  if(!opt.isVerify) return "未实名认证";

  //是否自己的广告
  if(opt.id===opt.loginUid) return "不能与自己交易";

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
  let hasUnfinishOrder=new Promise(()=>{
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

  Promise.all([
    isExist,
    hasWallet,
    hasUnfinishOrder,
  ]).then(()=>{
    return "";
  }).catch((err)=>{
    return err;
  });

  //未登录
  let flag = 0;
  if (!this.$store.state.isLogin) {
    this.$store.commit({type: 'changeLoginForm', data: true});
    return;
  }
  // 未实名认证
  // if (!this.$store.state.userInfo.verify) {
  //   //未实名认证
  //   this.Bus.$emit(this.emitValue, 1)
  //   return;
  // }



  // 广告是否存在
  await this.WsProxy.send('otc', 'sale_detail', {id}).then(data => {
    // console.log('1111',data)
    if (data.state === 2 ) { // 广告不存在
      flag = 3
    }
  })
  //广告不存在
  if (flag === 3) {
    this.Bus.$emit(this.emitValue, 3)
    return
  };

  // 是否有钱包(创建成功5，创建失败4)
  await this.WsProxy.send('wallet', 'wallets', {}).then(data => {
    !data.wallets && (flag = 4)
    data.wallets && data.wallets.filter(item => {
      return currency === item.currency
    }).length > 0 ? (flag = 5) : (flag = 4)
  })
  if (flag === 4) {
    // 创建钱包
    await this.WsProxy.send('wallet', 'new_wallet', {currency}).then(data => {
      flag = 5
    }).catch(error => {
      console.log(error)
    })
  }
  //创建钱包失败
  if (flag === 4) {
    this.Bus.$emit(this.emitValue, 4)
    return
  }

  // if (this.$store.state.userInfo.btverify < btverify) {
  // //  大额交易权限判断（权限不符6）
  //   this.Bus.$emit(this.emitValue, 6)
  //   return
  // }

  // 是否有未完成订单（有7）
  await this.WsProxy.send('otc', 'orders', {type:1, state: '1,2,3', origin: 0}).then(data => {
    if(data.orders) flag = 7;
  })
  if (flag === 7) {
    this.Bus.$emit(this.emitValue, 7)
    return
  }

  this.$router.push({ name: 'order', query: { id: this.JsonBig.stringify(id) }})
};



export default beforeOrder;
