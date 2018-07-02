<template>
  <div class="conversion">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="4"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <!--账号信息-->
          <div class="form">
            <div class="p1">
              <label>币种：</label>
              <SearchGroup ref="sg" onSearch="onSearch" onFuzzy="onFuzzy" :tips="coinTips">
                <ul slot="fuzzy" class="fuzzy">
                  <li v-for="(e,i) in coinTips" :key="i" @click="searchCoin">
                    <p @mousedown="$refs.sg.srchText=e">{{e}}</p>
                  </li>
                </ul>
              </SearchGroup>
              <div class="tip">币币交易需要资产互转</div>
            </div>
            <div class="card">
              <div class="warn">
                <label><img src="/static/images/hint.png">温馨提示：</label>
                <p>请务必确认电脑及浏览器安全，防止信息被篡改或者泄漏。</p>
              </div>
              <!--
              <div class="para">
                <label>从：</label>
                <p>法币账户余额为：{{selectedCoin.avail}} {{selectedCoin.coin}}</p>
                <div class="input-group">
                  <p class="input">法币账户</p>
                  <a href="#" class="drop-trangle"></a>
                </div>
              </div>
              <div class="para">
                <label>转至：</label>
                <p>币币账户余额为：{{selectedCoin.exAvail}} {{selectedCoin.coin}}</p>
                <div class="input-group">
                  <p class="input">法币账户</p>
                  <a href="#" class="drop-trangle"></a>
                </div>
              </div>
              -->
              <div class="para">
                <label>数量：</label>
                <p>可划转数量：{{selectedCoin.avail}} {{selectedCoin.coin}}</p>
                <div class="input-group">
                  <input type="text" class="input" v-model.trim="amount">
                  <img class="clear" src="/static/images/cancel_icon.png">
                  <a href="javascript:void(0)" class="addin btn green" @click="amount = selectedCoin.avail">全部</a>
                </div>
                <label>密码：</label>
                <div class="input-group password">
                  <input type="password" class="input" v-model.trim="password">
                </div>
                <label>验证码：</label>
                <div class="input-group code">
                  <input type="text" class="input" v-model.trim="code">
                  <a href="javascript:void(0)" class="addin btn green" @click="sendCode" ref="sendCodeBtn">发送验证码</a>
                </div>
              </div>
              <div class="submit">
                <button class="btn green" :class="{disabled:!canSubmit}" @click="submit">确认提交</button>
              </div>
            </div>
          </div>
          <!--账户互转明细-->
          <div class="list">
            <div class="title">
              <h3>账户互转明细</h3>
              <a href="#" class="btn white a1">去交易</a>
              <a href="#" class="a2">查看全部</a>
            </div>
            <div class="thead">
              <p class="th time">时间</p>
              <p class="th type">类型</p>
              <p class="th coin">币种</p>
              <p class="th num">数量</p>
              <p class="th recvAddr">对方账户</p>
            </div>
            <div v-if="err===0">
              <div class="li" v-for="(e,i) in lists" :key="i">
                <div class="time">
                  <p>{{e.time1}}</p>
                  <p>{{e.time2}}</p>
                </div>
                <div class="type" :class="{in:e.isIn,out:!e.isIn}">转账转入</div>
                <div class="coin">{{e.coin}}</div>
                <div class="num" :class="{in:e.isIn,out:!e.isIn}">{{e.num}}</div>
                <div class="recvAddr">{{e.recvAddr}}</div>
              </div>
            </div>
            <div v-else-if="err===1">
              <div class="err no-result">无资产互转记录</div>
            </div>
            <div v-else-if="err===2">
              <div class="err load-failed">网络异常</div>
            </div>
            <div v-else-if="err===3">
              <div class="err net-error">加载失败</div>
            </div>
            <div v-else-if="err===4">
              <div class="err loading">加载中...</div>
            </div>
            <div v-else>
              <div class="err empty">无数据</div>
            </div>
          </div>
        </div>
        <!--提示-->
        <Alert ref="alert"></Alert>
      </div>
    </div>
  </div>
</template>
<script>
import Notify from "./layout/Notify";
import LeftBar from "./layout/LeftBar";
import encrypt from '@/js/encrypt';
import SearchGroup from "../common/widget/SearchGroup";
import Alert from "../common/widget/Alert";
import timeout from "@/js/Timeout";


export default {
  components: {
    Notify,
    LeftBar,
    SearchGroup,
    Alert
  },
  data() {
    return {
      coins:{"BTC":{avail:1,addr:0,exAvail:1,exAddr:0}},
      coinTips:["BTC","ETH"],          // 币种搜索提示列表
      showCoins: true,    // 显示币种搜索提示
      coin: "",        // 页面选中的币种

      amount: "",
      password: '',
      code: '',

      lists: [],
      err: -1,

    };
  },
  computed:{
    selectedCoin(){
      if(this.coins[this.coin]){
        return this.coins[this.coin];
      }
      return {coin:"",avail:0,addr:0,exAvail:1,exAddr:0}
    },
    canSubmit(){
      return this.selectedCoin.coin && this.password && this.code;
    }
  },
  methods: {
    searchCoin(){
      let txt=this.$refs.sg.serchText;
      let i=0;
      for(i=0;i<this.coinTips.length;i++){
        if(txt.toUpperCase()===this.coinTips[i].toUpperCase()){
          this.coin=this.coinTips[i].toUpperCase();
          break;
        }
      }
      if(i>=this.coinTips.length){
        this.coin="";
      }
      this.$refs.sg.srchText=this.coin;
    },
    async init(){
      //获取otc钱包列表数据
      let uid=this.$store.state.userInfo.uid;
      let data=await this.WsProxy.send("wallet","wallets", {uid:uid}).catch((msg)=>{
        console.log(msg);
      });
      //获取交易所钱包
      let data2 = await fetch(
        this.HostUrl.http+"api/v3/wallet/wallets/?user_id=" + this.JsonBig.stringify(uid)
      ).then(res => res.json());
      //计算可划转的币种
      let obj = {};
      data && data.wallets && data.wallets.forEach(e=>{
        obj[e.currency.toUpperCase()] = {
          coin: e.currency.toUpperCase(),
          addr: e.address,
          avail: e.balance.toString().formatFixed(6),
        };
      });
      let result={};
      data2 && data2.wallets && data2.wallets.forEach(e=>{
        if(obj[e.name.toUpperCase()]){
          result[e.name.toUpperCase()] = Object.assign({}, obj[v.name]);
          result[e.name.toUpperCase()].exAddr = e.address;
          result[e.name.toUpperCase()].exAvail = e.address;
        }
      });
      this.coins=result;
      //获取路由参数
      let coin=this.$route.query.coin || "btc";
      if(this.coins[coin.toUpperCase()]){
        this.$refs.sg.srchText=coin.toUpperCase();
        this.coin=coin.toUpperCase();
      }
      // 加载资金互转列表
      this.loadLists();
    },
    loadLists(){
      this.WsProxy.send("wallet","bills_v2",{
        type: "11,12",
        state: "0,1,2,3,4,5,6",
        page: 0,
        count: 10,
        sort: 0,
      }).then((data)=>{
        if(!data||!data.bills||data.bills.length<=0){
          this.err=1; //无数据
        }else{
          this.err=0;
          this.parseLists(data.bills);
        }
      }).catch((msg)=>{
        if(!msg){
          this.err=2; //网络异常
        }else if(msg.ret!==0){
          this.err=3; //加载异常
        }
      });
    },
    parseLists(data){
      this.lists=[];
      data.forEach((e)=>{
        let item={
          time1: new Date(e.date*1000).dateHandle("yyyy/MM/dd"),
          time2: new Date(e.date*1000).dateHandle("HH:mm:ss"),
          isIn: [1,3,5,7,9,11].indexOf(e.type)>=0, // 进出账：true-进账,false-出账
          coin: e.currency && e.currency.toUpperCase(),
          num: e.amount.toString().formatFixed(6),
        };
        item.num=(item.isIn ? "+" : "-") + item.num;
        item.recvAddr=item.isIn ? "币币账户" : "法币账户";
        this.lists.push(item);
      });
    },
    sendCodeTimer(time){
      let $sendCodeBtn=this.$refs.sendCodeBtn;
      if(time<=0){
        $sendCodeBtn.innerText="发送验证码";
        $sendCodeBtn.classList.remove("sended");
        return;
      }
      time--;
      $sendCodeBtn.innerText=time+"s后重发";
      $sendCodeBtn.classList.add("sended");
      timeout(()=>{
        this.sendCodeTimer(time);
      },1000,"timer_code");
    },
    sendCode(){
      let user=this.$store.state.userInfo;
      this.WsProxy.send('control', 'send_code',{
        type: 2
      }).then(data=>{
        this.sendCodeTimer(60);
      }).catch(msg=>{
        this.$refs.alert.showAlert({content:"发送失败"});
      });
    },
    submit() {
      if(!this.selectedCoin || !this.password || !this.code) return;
      let uid = this.$store.state.userInfo.uid;
      this.WsProxy.send("wallet", "withdraw", {
        uid: uid,
        currency: this.selectedCoin.coin.toLowerCase(),
        to: this.selectedCoin.exAddr,
        amount: Number(this.amount),
        pass: encrypt(this.password, this.JsonBig.stringify(uid)),
        code: this.code,
        mode: 1,
        trader: this.$store.state.userInfo.uid
      }).then(res=>{
        this.$refs.alert.showAlert({content:'转账成功'});
        this.amount= '';
        this.password= "";
        this.code = '';
      }).catch(msg => {
        this.$refs.alert.showAlert({content:'转账失败'});
      });
    }
  },
  mounted(){
    this.init();
    this.Bus.$on("onSearch",()=>{
      this.searchCoin();
    });
    //模糊搜索
    this.Bus.$on("onFuzzy",()=>{
      let srchText=this.$refs.sg.srchText;
      this.coinTips=[];
      for(let k in this.coins){
        if(!this.coins.hasOwnProperty(k)) continue;
        if(new RegExp("^"+srchText+".*$").test(k)){
          this.coinTips.push(k);
        }
      }
      this.$refs.sg.isShowTip=true;
    });
  },
  destroyed(){
    this.Bus.$off();
  }
};
</script>
<style scoped lang="stylus">
@import '../../stylus/base';
@import '../common/stylus/common';
@import './stylus/common';
@import './stylus/conversion';
</style>
