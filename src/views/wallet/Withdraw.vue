<template>
  <div class="withdraw">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="3"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <!--账号信息-->
          <div class="form">
            <div class="p1">
              <label>币种：</label>
              <div class="input-group">
                <p class="input" @click="isShowCoinUl=!isShowCoinUl" v-clickoutside="()=>isShowCoinUl=false">{{coins[coinSel]}}</p>
                <i class="drop-trangle"></i>
                <ul class="drop" v-show="isShowCoinUl">
                  <li v-for="(e,i) in coins" @click="coinSel=i">{{e}}</li>
                </ul>
              </div>
            </div>
            <div class="p2">
              <span>总额：0.67899765 BTC</span>
              <span>可用余额：0.67899765 BTC</span>
              <span>冻结中：0.67899765 BTC</span>
            </div>
            <div class="card">
              <div class="warn">
                <label><img src="/static/images/hint.png">注意：</label>
                <p>最小提现数量为:0.002 BTC</p>
                <p>请勿直接提现至众筹或ICO地址.我们不会处理未来代币的发放</p>
              </div>
              <div class="input1">
                <label>BTC提现地址：</label>
                <input type="input" placeholder="可自行填写"><img src="/static/images/cancel_icon.png"><i></i>
                <a href="#">保存地址</a>
                <ul class="drop" v-show="0">
                  <li>morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</li>
                  <li>morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</li>
                  <li>morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</li>
                </ul>
              </div>
              <div class="input2">
                <label>提币数量：</label>
                <p class="i2p1"><span class="s1">可用余额：0.00000000</span><span class="s2">24H提现额度：50ETH</span></p>
                <p class="i2p2 active">
                  <input type="text"><img src="/static/images/cancel_icon.png"><i>BTC</i>
                </p>
                <p class="i2p3">实际到账：0.00000000ETH</p>
                <p class="i2p4">矿工费0.1</p>
              </div>
              <div class="input3">
                <button class="btn green disabled">确认提交</button>
              </div>
            </div>
          </div>
          <!--充值动态-->
          <div class="list">
            <div class="title">
              <h3>提币记录</h3>
              <a href="/#/transaction" class="btn white a1">去交易</a>
              <a href="/#/wallet/history?type=2&coin=btc" class="a2">查看全部</a>
            </div>
            <div class="thead">
              <p class="th time">提币时间</p>
              <p class="th coin">币种</p>
              <p class="th num">提币数量</p>
              <p class="th actual">实际到账</p>
              <p class="th addrName">地址名称</p>
              <p class="th addr">提币地址</p>
            </div>
            <div v-if="err===0">
              <div class="li" v-for="(e,i) in lists">
                <div class="time">
                  <p>{{e.time1}}</p>
                  <p>{{e.time2}}</p>
                </div>
                <div class="coin">{{e.coin}}</div>
                <div class="num">- {{e.num}}</div>
                <div class="actual">{{e.actual}}</div>
                <div class="addrName">{{e.addrName}}</div>
                <div class="addr">{{e.addr}}</div>
              </div>
            </div>
            <div v-else-if="err===1">
              <div class="err no-result">无充值记录</div>
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
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import Pagination from "../verify/component/Pagination";
  import BasePopup from "../../components/common/BasePopup";
  export default {
    components: {
      BasePopup,
      Pagination,
      Notify,
      LeftBar,
    },
    data() {
      return {
        coins:["BTC","LTC","ETH","NEO"],
        coinSel: 0,
        isShowCoinUl: false,

        lists: [],
        err: -1,
      }
    },
    methods:{
      async init(){
        //加载账单
        this.loadLists();
      },
      loadLists(){
        let coin=this.coins[this.coinSel];
        this.WsProxy.send("wallet","bills_v2",{
          currency: coin,
          type: 1,
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
          this.bills.push({
            time1: new Date(e.date*1000).dateHandle("yyyy/MM/dd"),
            time2: new Date(e.date*1000).dateHandle("HH:mm:ss"),
            coin: e.currency && e.currency.toUpperCase(),
            num: e.amount,
            actual: e.amount-e.fee,
            addr: e.to && e.to.formatAddr(),
            addrName: e.to_name || "-",
          });
        });
      },
    },
    mounted(){
      this.Bus.$on("onFbPageChange",(p)=>{
        this.fbCurPage=p;
      });
      this.Bus.$on("onBbPageChange",(p)=>{
        this.bbCurPage=p;
      });
    },
    destroyed(){
      this.Bus.$off("onFbPageChange");
      this.Bus.$off("onBbPageChange");
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/common"
  @import "./stylus/withdraw"
</style>
