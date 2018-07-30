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
              <SearchGroup ref="sg" onSearch="onSearch" onFuzzy="onFuzzy" onFuzzyEmpty="onFuzzyEmpty" :tips="coinTips">
                <ul slot="fuzzy" class="fuzzy">
                  <li v-for="(e,i) in coinTips" :key="i" @click="searchCoin">
                    <p @mousedown="$refs.sg.srchText=e">{{e}}</p>
                  </li>
                </ul>
              </SearchGroup>
              <div class="tip">币币交易需要资产划转</div>
              <a :href="'https://www.qb.com/whome/?token='+token" target="_blank" ref="link" v-show="false"></a>
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
                  <input type="text" class="input" v-model="amount">
                  <img class="clear" src="/static/images/cancel_icon.png" v-show="amount.length!=null" @click="amount=''">
                  <a href="javascript:void(0)" class="addin btn green" @click="amount = selectedCoin.avail">全部</a>
                </div>
              </div>
              <div class="para password">
                <label>密码：</label>
                <div class="input-group">
                  <input type="password" class="input" v-model.trim="password">
                </div>
              </div>
              <div class="para code" v-show="userInfo.phone">
                <label>验证码：</label>
                <div class="input-group">
                  <input type="text" class="input" v-model.trim="code">
                  <a href="javascript:void(0)" class="addin btn green" @click="sendCode" ref="sendCodeBtn">发送验证码</a>
                </div>
              </div>
              <div class="para code" v-show="!userInfo.phone">
                  <label>谷歌验证码：</label>
                  <div class="input-group">
                    <input type="text" class="input" v-model.trim="gcode">
                  </div>
              </div>
              <div class="submit">
                <button class="btn green" :class="{disabled:!canSubmit}" @click="submit" ref="submitBtn">确认提交</button>
              </div>
            </div>
          </div>
          <!--账户互转明细-->
          <div class="list">
            <div class="title">
              <h3>资产划转明细</h3>
              <router-link tag="a" to="/transaction" class="btn white a1">去交易</router-link>
              <router-link tag="a" to="/wallet/history?type=12" class="a2">查看全部</router-link>
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
                <div class="type" :class="{in:e.isIn,out:!e.isIn}">资产划出</div>
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
import getErrorMsg from "@/js/ErrorCode";
import { Loading } from 'element-ui';

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
      coinTips:[],          // 币种搜索提示列表
      showCoins: true,    // 显示币种搜索提示
      coin: "",        // 页面选中的币种

      amount: "",
      password: '',
      code: '',
      gcode: '',

      lists: [],
      err: -1,
    };
  },
  computed:{
    token:function(){
      return this.$store.state.token;
    },
    userInfo:function(){
      return this.$store.state.userInfo;
    },
    selectedCoin(){
      if(this.coins[this.coin]){
        return this.coins[this.coin];
      }
      return {coin:"",avail:0,addr:0,exAvail:1,exAddr:0}
    },
    canSubmit(){
      if(this.userInfo.phone && !this.code){
        return false;
      }
      if(!this.userInfo.phone && !this.gcode){
        return false;
      }
      return this.selectedCoin.coin && this.password;
    }
  },
  methods: {
    searchCoin(){
      let txt=this.$refs.sg.srchText;
      let i=0;
      for(i=0;i<this.coinTips.length;i++){
        if(txt.toUpperCase()===this.coinTips[i].toUpperCase()){
          this.coin=this.coinTips[i].toUpperCase();
          break;
        }
      }
      if(i>=this.coinTips.length){
        this.coin=this.coinTips[0] || "";
      }
      this.$refs.sg.srchText=this.coin;
    },
    async init(){
      try{
        //获取otc钱包列表数据
        let uid=this.userInfo.uid;
        let data=await this.WsProxy.send("wallet","wallets", {uid:uid}).catch((msg)=>{
          console.log(msg);
        });
        //获取交易所钱包
        let data2 = await this.Proxy.hp_account({ // 币币账户
            a: "wallets",
            d:{
              userId:this.$store.state.userInfo.uid
            }
        }).then(res => res.d);

        //let data2={"wallets": [{"name": "btc", "deal": 0.0, "address": "1H8n64QLtzqbQgBJNaBChJ76LJbSrBm4VZ", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4034, "coin_id": 0}, {"name": "lsk", "deal": 0.0, "address": "15945604182327820952L", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4036, "coin_id": 2}, {"name": "bch", "deal": 0.0, "address": "bitcoincash:qrdp8zc63pekf9gpp7a4djjxg6klpp20c5623dma0t", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4037, "coin_id": 3}, {"name": "eth", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4038, "coin_id": 4}, {"name": "xas", "deal": 0.0, "address": "A4vvfDYKtfDZcgs3BR27xtf9uEeTjBDzD4", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4039, "coin_id": 5}, {"name": "iqt", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4040, "coin_id": 6}, {"name": "dash", "deal": 0.0, "address": "Xf72Qv17nUqEcLdY2E9NoEVgYAWkqkCang", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4041, "coin_id": 7}, {"name": "ltc", "deal": 0.0, "address": "LhvtWBh4jJowz41NdP2BmG7dx8VS68vuSc", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4043, "coin_id": 9}, {"name": "omg", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4044, "coin_id": 10}, {"name": "pay", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4045, "coin_id": 11}, {"name": "eos", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4046, "coin_id": 12}, {"name": "rep", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4047, "coin_id": 13}, {"name": "gnt", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4048, "coin_id": 14}, {"name": "mco", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4049, "coin_id": 15}, {"name": "bat", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4050, "coin_id": 16}, {"name": "icn", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4051, "coin_id": 17}, {"name": "gno", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4052, "coin_id": 18}, {"name": "dgd", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4053, "coin_id": 19}, {"name": "cvc", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4054, "coin_id": 20}, {"name": "zrx", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4055, "coin_id": 21}, {"name": "btg", "deal": 0.0, "address": "Gh5eRp9t8FZ6tkTpFpZiksnXadtFBm24Lw", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4056, "coin_id": 22}, {"name": "bcd", "deal": 0.0, "address": "14qDGS2dDFvwCnqmhZ7JNetUaYfBZHTBmY", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4057, "coin_id": 23}, {"name": "snt", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4058, "coin_id": 24}, {"name": "bnt", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4059, "coin_id": 25}, {"name": "fun", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4060, "coin_id": 26}, {"name": "sngls", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4061, "coin_id": 27}, {"name": "storj", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4062, "coin_id": 28}, {"name": "dnt", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4063, "coin_id": 29}, {"name": "wings", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4064, "coin_id": 30}, {"name": "bqx", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4065, "coin_id": 31}, {"name": "1st", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4066, "coin_id": 32}, {"name": "rlc", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4067, "coin_id": 33}, {"name": "ae", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4068, "coin_id": 34}, {"name": "doc", "deal": 0.0, "address": "0x52B62B69632522E0fc9F84F52205777208aBF849", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4069, "coin_id": 35}, {"name": "usdt", "deal": 0.0, "address": "14L5ifaisdmpM6WpWYzTTXqLZfzfHqBoiT", "date": 1530598371.0, "lock": 0.0, "balance": 0.0, "id": 4070, "coin_id": 36}], "user_id": "232254428780961792"}

        //判断用户是否存在
        if(!data2 || !data2.userId){
          this.$refs.alert.showAlert({
            content:"还没有币币账户，是否开通",
            autoHide:false,
            clickHide:false,
            isShowBtns:true,
            onOk:()=>{
              this.$refs.link.click();
            }
          })
        }
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
          if(obj[e.coinName.toUpperCase()]){
            result[e.coinName.toUpperCase()] = {};
            Object.assign(result[e.coinName.toUpperCase()], obj[e.coinName.toUpperCase()]);
            result[e.coinName.toUpperCase()].exAddr = e.address;
            // result[e.coinName.toUpperCase()].exAvail = e.balance.toString().formatFixed(6);
          }
        });
        //coins格式{BTC,"...",ETH:"...}
        this.coins=result;
        //初始选中第一个,
        for(let k in this.coins){
          if(this.coins.hasOwnProperty(k)){
            let coinName=this.coins[k].coin;
            this.$refs.sg.srchText=coinName.toUpperCase();
            this.coin=coinName.toUpperCase();
            break;
          }
        }
        //获取路由参数
        let coin=this.$route.query.coin;
        if(coin){
          if(this.coins[coin.toUpperCase()]){
            this.$refs.sg.srchText=coin.toUpperCase();
            this.coin=coin.toUpperCase();
          }else if(!obj[coin.toUpperCase()]){
            this.$refs.alert.showAlert({content:"无"+coin+"钱包，请先创建钱包"});
          }else{
            this.$refs.alert.showAlert({content:"币币账户无"+coin+"钱包"});
          }
        }
        // 加载资金互转列表
        this.loadLists();
        //监听事件
        this.Bus.$on("onSearch",()=>{
          this.searchCoin();
        });
        this.Bus.$on("onFuzzy",()=>{
          let srchText=this.$refs.sg.srchText;
          this.coinTips=[];
          for(let k in this.coins){
            if(!this.coins.hasOwnProperty(k)) continue;
            if(new RegExp("^"+srchText+".*$","i").test(k)){
              this.coinTips.push(k);
            }
          }
          this.$refs.sg.isShowTip=true;
        });
        this.Bus.$on("onFuzzyEmpty",()=>{
          this.coinTips=[];
          for(let k in this.coins){
            if(!this.coins.hasOwnProperty(k)) continue;
            this.coinTips.push(k);
          }
          this.$refs.sg.isShowTip=true;
        });
      }catch(e){
        console.log(e);
      }
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
      if(!this.canSubmit) return;
      //
      let $submitBtn=this.$refs.submitBtn;
      $submitBtn.innerText="正在提交...";
      $submitBtn.classList.add("loading");
      //
      let uid = this.$store.state.userInfo.uid;
      this.WsProxy.send("wallet", "withdraw", {
        uid: uid,
        currency: this.selectedCoin.coin.toLowerCase(),
        to: this.selectedCoin.exAddr,
        amount: Number(this.amount),
        pass: encrypt(this.password, this.JsonBig.stringify(uid)),
        code: this.userInfo.phone ? this.code : this.gcode,
        mode: 1,
        trader: this.$store.state.userInfo.uid
      }).then(res=>{
        location.reload();
      }).catch(msg => {
        this.$refs.alert.showAlert({content:getErrorMsg(msg.ret)});
        $submitBtn.innerText="确认提交";
        $submitBtn.classList.remove("loading");
      });
    }
  },
  created(){
    this.init();
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
