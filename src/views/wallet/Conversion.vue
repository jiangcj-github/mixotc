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
              <div class="input-group" v-clickoutside="()=>isShowCoinUl=false" @click="()=>{isShowCoinUl=true}">
                <input class="input" type="text" v-model="srchCoin" >
                <img class="clear" src="/static/images/cancel_icon.png">
                <a class="drop-trangle" href="javascript:void(0);"></a>
                <ul class="drop" v-show="isShowCoinUl">
                  <li v-for="(e,i) in Object.keys(currencyList)" @click.stop="()=>{ srchCoin = e; isShowCoinUl=false}" :key="i">{{e.toUpperCase()}}</li>
                </ul>
              </div>
              <div class="tip">币币交易需要资产互转</div>
            </div>
            <div class="card">
              <div class="warn">
                <label><img src="/static/images/hint.png">温馨提示：</label>
                <p>请务必确认电脑及浏览器安全，防止信息被篡改或者泄漏。</p>
              </div>
              <!-- <div class="para">
                <label>从：</label>
                <p>法币账户余额为：0.00001235 ETH</p>
                <div class="input-group">
                  <p class="input"></p>
                  <a href="#" class="drop-trangle"></a>
                  <ul class="drop" v-show="0">
                    <li>法币账户</li>
                    <li>币币账户</li>
                  </ul>
                </div>
              </div>
              <div class="para">
                <label>转至：</label>
                <p>币币账户余额为：0.00001235 ETH</p>
                <div class="input-group">
                  <p class="input"></p>
                  <a href="#" class="drop-trangle"></a>
                  <ul class="drop" v-show="0">
                    <li>币币账户</li>
                    <li>法币账户</li>
                  </ul>
                </div>
              </div> -->
              <div class="para">
                <label>数量：</label>
                <p>可划转数量：{{currencyList[srchCoin] && currencyList[srchCoin].balance}} {{srchCoin.toUpperCase()}}</p>
                <div class="input-group">
                  <input type="text" class="input" v-model.trim="amount">
                  <img class="clear" src="/static/images/cancel_icon.png">
                  <a href="#" class="addin btn green" @click="()=>{amount = currencyList[srchCoin] && currencyList[srchCoin].balance || ''}">全部</a>
                </div>
                <label>密码：</label>
                <div class="input-group password">
                  <input type="password" class="input" v-model.trim="password">
                </div>
                 <label>验证码：</label>
                <div class="input-group code">
                  <input type="text" class="input" v-model.trim="code">
                  <a href="#" class="addin btn green" @click="sendCode">获取验证码</a>
                </div>
              </div>
              <div class="submit">
                <button class="btn green" @click="submit">确认提交</button>
              </div>
            </div>
          </div>
          <!--账户互转明细-->
          <!-- <div class="list">
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
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type out">转账转出</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num out">-12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Notify from "./layout/Notify";
import LeftBar from "./layout/LeftBar";
import Pagination from "../verify/component/Pagination";
import BasePopup from "../../components/common/BasePopup";
import encrypt from '@/js/encrypt';
export default {
  components: {
    BasePopup,
    Pagination,
    Notify,
    LeftBar
  },
  data() {
    return {
      srchCoin: "",
      otcList: [],
      tradeList: [],
      tips: ["BTC", "LTC", "ETH", "NEO"],
      coinSel: "",
      amount: "",
      password: '',
      code: '',
      isShowCoinUl: false,
      isShowQrCode: false
    };
  },
  computed: {
    currencyList() {
      let obj = {};
      this.otcList.forEach(v => {
        obj[v.currency] = {
          otcAddress: v.address,
          balance: v.balance
        };
      });
      let result = {};
      this.tradeList.forEach(v => {
        if (obj[v.name]) {
          result[v.name.toUpperCase()] = Object.assign({}, obj[v.name]);
          result[v.name.toUpperCase()].tradeAddress = v.address;
        }
      });
      return result;
    }
  },
  methods: {
    loadFb() {},
    parseFb() {},
    loadBb() {},
    parseBb() {},
    sendCode(){
      this.WsProxy.send('control', 'send_code',{
        type: 2
      })
    },
    submit() {
      if(this.srchCoin=== '' || this.password=== "" || this.code === '' ) return;
      let uid = this.$store.state.userInfo.uid;
      this.WsProxy.send("wallet", "withdraw", {
        uid: uid,
        currency: this.srchCoin.toLowerCase(),
        to: this.currencyList[this.srchCoin].tradeAddress,
        amount: Number(this.amount),
        pass: encrypt(this.password, this.JsonBig.stringify(uid)),
        code: this.code,
        mode: 1,
        trader: this.$store.state.userInfo.uid
      }).then(res=>{
        console.log(99)
        alert('转账成功');
        this.amount= '';this.password= ""; this.code = '';
      }).catch(msg => {
        console.log(msg);
      });
    }
  },
  async mounted() {
    let uid = this.$store.state.userInfo.uid;
    let data = await this.WsProxy.send("wallet", "wallets", { uid: uid }).catch(
      msg => {
        console.log(msg);
      }
    );
    this.otcList = data.wallets;
    console.log(this.otcList);
    let result = await fetch(
      "http://192.168.113.26/api/v3/wallet/wallets/?user_id=" +
        this.JsonBig.stringify(uid)
    ).then(res => res.json());
    this.tradeList = result.wallets;
    this.Bus.$on("onFbPageChange", p => {
      this.fbCurPage = p;
    });
    this.Bus.$on("onBbPageChange", p => {
      this.bbCurPage = p;
    });
  },
  destroyed() {
    this.Bus.$off("onFbPageChange");
    this.Bus.$off("onBbPageChange");
  }
};
</script>
<style scoped lang="stylus">
@import '../../stylus/base';
@import '../common/stylus/common';
@import './stylus/common';
@import './stylus/conversion';
</style>
