<template>
  <div class="charge">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="2"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <!--账号信息-->
          <div class="form">
            <div class="p1">
              <label>币种：</label>
              <div class="input-group">
                <p class="input" @click="isShowCoinUl=!isShowCoinUl" v-clickoutside="()=>isShowCoinUl=false">{{coins[coinSel].coin}}</p>
                <i class="drop-trangle"></i>
                <ul class="drop" v-show="isShowCoinUl">
                  <li v-for="(e,i) in coins" @click="coinSel=i">{{e.coin}}</li>
                </ul>
              </div>
            </div>
            <div class="p2">
              <span>总额：{{coins[coinSel].total}} BTC</span>
              <span>可用余额：{{coins[coinSel].avail}} BTC</span>
              <span>确认中：{{coins[coinSel].confirm}} BTC</span>
            </div>
            <div class="card">
              <p class="warning">
                <img src="/static/images/hint.png">
                注意：禁止向{{coins[coinSel].coin}}地址充值除{{coins[coinSel].coin}}之外的资产，任何充入{{coins[coinSel].coin}}地址的非{{coins[coinSel].coin}}资产将不可找回。
              </p>
              <p class="addr">
                <label>{{coins[coinSel].coin}}充值地址：</label>
                <span>{{coins[coinSel].addr}}</span>
              </p>
              <p class="link">
                <a href="javascript:void(0);" @click="isShowQrCode=true">展示二维码</a>
                <a href="javascript:void(0);" v-clipboard:copy="coins[coinSel].addr"
                   v-clipboard:success="onClipSuccess" v-clipboard:error="onClipError">复制到剪贴板</a>
              </p>
            </div>
            <div class="tip">
              <h5>温馨提示</h5>
              <ul>
                <li>使用{{coins[coinSel].coin}}地址充值需要{{coins[coinSel].checkNum}}个网络确认才能到账</li>
                <li>充值完成后，你可以进入<a :href="'/#/wallet/history?type=1&coin='+coins[coinSel].coin">资产记录</a>页面跟踪进度</li>
              </ul>
            </div>
          </div>
          <!--充值记录-->
          <div class="list">
            <div class="title">
              <h3>充值记录</h3>
              <a href="/#/transaction" class="btn white a1">去交易</a>
              <a href="/#/wallet/history?type=1" class="a2">查看全部</a>
            </div>
            <div class="thead">
              <p class="th time">时间</p>
              <p class="th coin">币种</p>
              <p class="th chargeNum">充值数量</p>
              <p class="th sendAddr">发送地址</p>
              <p class="th recvAddr">接收地址</p>
              <p class="th confirm">状态</p>
            </div>
            <div v-if="err===0">
              <div class="li" v-for="(e,i) in lists">
                <div class="time">
                  <p>{{e.time1}}</p>
                  <p>{{e.time2}}</p>
                </div>
                <div class="coin">{{e.coin}}</div>
                <div class="chargeNum">+{{e.num}} {{e.coin}}</div>
                <div class="sendAddr">{{e.addr1}}</div>
                <div class="recvAddr">{{e.addr2}}</div>
                <div class="confirm">{{e.state}}</div>
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
        <!--二维码弹框-->
        <BasePopup :show="isShowQrCode" ref="pop">
          <div class="qr-pop">
            <div class="close"><i @click="isShowQrCode=false">&times;</i></div>
            <h3>充值地址</h3>
            <qrcode-vue :value="coins[coinSel].addr" :size="200" class="qrcode"></qrcode-vue>
            <p>{{coins[coinSel].addr}}</p>
          </div>
        </BasePopup>
        <!--提示框-->
        <Alert ref="alert"></Alert>
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import Pagination from "../verify/component/Pagination";
  import BasePopup from "../../components/common/BasePopup";
  import QrcodeVue from "qrcode.vue";
  import Alert from "../common/widget/Alert";

  export default {
    components: {
      BasePopup,
      Pagination,
      Notify,
      LeftBar,
      QrcodeVue,
      Alert
    },
    data() {
      return {
        coins:[{coin:"BTC",avail:0,total:0,addr:"-",confirm:0,checkNum:0}],
        coinSel: 0,
        isShowCoinUl: false,

        lists: [],
        err: -1,

        isShowQrCode: false,
      }
    },
    methods:{
      async init(){
        //获取钱包列表数据
        let uid=this.$store.state.userInfo.uid;
        let data=await this.WsProxy.send("wallet","wallets", {uid:uid}).catch((msg)=>{
          console.log(msg);
        });
        if(data && data.wallets){
          let wallets=data.wallets;
          this.coins=[];
          wallets.forEach((e)=>{
            this.coins.push({
              coin: e.currency.toUpperCase(),
              avail: e.balance.formatFixed(6),
              total: (e.balance+e.locked).formatFixed(6),
              addr: e.address || "-",
              confirm: 0,
              checkNum: 0,
            });
          });
        }
        //排序
        this.coins.sort(function(a,b){
          return a.coin<b.coin?-1:1;
        });
        //获取币种资料
        this.Proxy.coinSearch().then((data)=>{
          if(data && data.data && data.data.coins) {
            let coins = data.data.coins;
            coins.forEach((e) => {
              this.coins.forEach((item) => {
                if (e.currency.toUpperCase() === item.coin) {
                  item.checkNum = e.check_num || "0";
                }
              });
            })
          }
        }).catch((msg)=>{
          console.log(msg);
        });
        //获取确认中金额
        this.coins.forEach((e)=>{
          this.WsProxy.send("wallet","get_checking_amount",{currency:e.coin}).then((data)=>{
            if(data) {
              e.confirm = data.amount.formatFixed(6);
            }
          }).catch((msg)=>{
            console.log(msg);
          });
        });
        //获取路由参数
        let coin=this.$route.query.coin || "btc";
        this.coins.forEach((e,i)=>{
          if(e.coin===coin.toUpperCase()){
            this.coinSel=i;
          }
        });
        //加载账单
        this.loadLists();
      },
      loadLists(){
        let coin=this.coins[this.coinSel];
        this.WsProxy.send("wallet","bills_v2",{
          type: "1",
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
          this.lists.push({
            time1: new Date(e.date*1000).dateHandle("yyyy/MM/dd"),
            time2: new Date(e.date*1000).dateHandle("HH:mm:ss"),
            coin: e.currency && e.currency.toUpperCase(),
            num: e.amount.formatFixed(6),
            state: ["已完成","进行中","取消","超时","申诉中","强制放币","终止交易"][e.state],
            addr1: e.from && e.from.formatAddr(),
            addr1Name: e.from_name || "-",
            addr2: e.to && e.to.formatAddr(),
            addr2Name: e.to_name || "-",
          });
        });
      },
      onClipSuccess(){
        this.$refs.alert.showAlert({content:"复制成功"});
      },
      onClipError(){
        this.$refs.alert.showAlert({content:"复制失败"});
      },
    },
    mounted(){
      this.init();
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
  @import "../common/stylus/common"
  @import "./stylus/common"
  @import "./stylus/charge"
</style>
