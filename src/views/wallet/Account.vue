<template>
  <div class="account">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="1"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <div class="asset">
            <p class="l0">法币账户总资产：</p>
            <p class="l1">
              <span class="big bright">{{balance.numBtc}}</span>
              <span class="small"> BTC</span>
              <span class="big">/</span>
              <span class="big bright">{{balance.numCny}}</span>
              <span class="small"> CNY</span>
            </p>
          </div>
          <div class="asset as2">
            <p class="l0">币币账户总资产：</p>
            <p class="l1">
              <span class="big bright">{{balance2.numBtc}}</span>
              <span class="small"> BTC</span>
              <span class="big">/</span>
              <span class="big bright">{{balance2.numCny}}</span>
              <span class="small"> CNY</span>
            </p>
          </div>
          <div class="filter">
            <div class="f1">
              <input type="text" placeholder="搜索币种" v-model="srchText">
              <img src="/static/images/cancel_icon.png" v-show="srchText.length>0" @click="srchText=''">
              <button @click="onSearch"></button>
            </div>
            <div class="f2" v-show="tab===0">
              <span class="checkbox r2" :class="{check:isZero}" @click="isZero=!isZero">隐藏0余额币种</span>
              <span class="checkbox r3" :class="{check:isNoWa}" @click="isNoWa=!isNoWa">隐藏非钱包币种</span>
            </div>
          </div>
          <div class="tb-tab">
            <ul>
              <li :class="{active:tab===0}" @click="tab=0">法币账户</li>
              <li :class="{active:tab===1}" @click="tab=1">币币账户</li>
            </ul>
            <button class="btn green" v-show="tab===1">币币交易</button>
          </div>
          <!--法币账户-->
          <div class="fb" v-show="tab===0">
            <!--表头-->
            <div class="thead">
              <p class="th coin">币种</p>
              <p class="th name">全称</p>
              <p class="th avail sortable" @click="fbSort=++fbSort%2">可用余额
                <i :class="{up:fbSort===0,down:fbSort===1}"></i></p>
              <p class="th frozen sortable" @click="fbSort=++fbSort%2+2">冻结中余额
                <i :class="{up:fbSort===2,down:fbSort===3}"></i></p>
              <p class="th assess sortable" @click="fbSort=++fbSort%2+4">估值
                <i :class="{up:fbSort===4,down:fbSort===5}"></i></p>
              <p class="th opera">操作</p>
            </div>
            <!--fb返回结果-->
            <div v-if="fbErr===0">
              <div v-for="(e,i) in fb">
                <div class="li" v-if="e.hasWallet">
                  <p class="coin"><img :src="e.icon">{{e.abbr}}</p>
                  <p class="name">{{e.name}}</p>
                  <p class="avail"><span v-tip>{{e.avail}}</span></p>
                  <p class="frozen"><span v-tip>{{e.frozen}}</span></p>
                  <p class="assess"><span>{{e.assess}}</span></p>
                  <p class="opera op1">
                    <a class="btn white" href="/#/wallet/charge">充币</a>
                    <a class="btn white" href="/#/wallet/withdraw">提币</a>
                    <a class="btn white" href="/#/">交易</a>
                  </p>
                </div>
                <div class="li" v-else="">
                  <p class="coin"><img :src="e.icon">{{e.abbr}}</p>
                  <p class="name">{{e.name}}</p>
                  <p class="avail">{{e.avail}}</p>
                  <p class="frozen">{{e.frozen}}</p>
                  <p class="assess">{{e.assess}}</p>
                  <p class="opera op2">
                    <button class="btn green" @click="createWallet(i)">加入钱包</button>
                    <a href="/#/coinData" target="_blank">查看币种资料</a>
                  </p>
                </div>
              </div>
              <Pagination :total="fbTotal" :pageSize="fbPageSize" :curPage="fbCurPage" onPageChange="onFbPageChange"></Pagination>
            </div>
            <div v-else-if="fbErr===1">
              <div class="err no-result">无相应的数据</div>
            </div>
            <div v-else-if="fbErr===2">
              <div class="err load-failed">网络异常</div>
            </div>
            <div v-else-if="fbErr===3">
              <div class="err net-error">服务器错误</div>
            </div>
            <div v-else-if="fbErr===4">
              <div class="err net-error">数据加载中...</div>
            </div>
            <div v-else>
              <div class="err empty">无账户数据</div>
            </div>
          </div>
          <!--币币账户-->
          <div class="bb" v-show="tab===1">
            <!--表头-->
            <div class="thead">
              <p class="th coin">币种</p>
              <p class="th name">全称</p>
              <p class="th avail">可用余额</p>
              <p class="th frozen">冻结中余额</p>
              <p class="th assess">估值</p>
              <p class="th opera">操作</p>
            </div>
            <!--bb返回结果-->
            <div v-if="bbErr===0">
              <div class="li" v-for="(e,i) in bb">
                <p class="coin">{{e.abbr}}</p>
                <p class="name">{{e.name}}</p>
                <p class="avail">{{e.avail}}</p>
                <p class="frozen">{{e.frozen}}</p>
                <p class="assess">{{e.assess}}</p>
                <p class="opera op3"><button class="btn white">资产转出</button></p>
              </div>
              <!--
              <Pagination :total="bbTotal" :pageSize="bbPageSize" :curPage="bbCurPage" onPageChange="onBbPageChange"></Pagination>
              -->
            </div>
            <div v-else-if="bbErr===1">
              <div class="err no-result">无相应的数据</div>
            </div>
            <div v-else-if="bbErr===2">
              <div class="err load-failed">网络异常</div>
            </div>
            <div v-else-if="bbErr===3">
              <div class="err net-error">服务器错误</div>
            </div>
            <div v-else-if="bbErr===4">
              <div class="err net-error">数据加载中...</div>
            </div>
            <div v-else>
              <div class="err empty">无账户数据</div>
            </div>
          </div>
        </div>
        <!--提示框-->
        <BasePopup :show="isShowAlert" :width="0" :height="0" v-on:click.native="isShowAlert=false">
          <div class="pop-alert">{{this.alert}}</div>
        </BasePopup>
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import Pagination from "../verify/component/Pagination";
  import BasePopup from "@/components/common/BasePopup";
  import timeout from "@/js/Timeout.js";
  export default {
    components: {
      BasePopup,
      Pagination,
      Notify,
      LeftBar,
    },
    data() {
      return {
        tab: 0,  //0-法币账户,1-币币账户
        srchText: "",
        isZero: false,
        isNoWa: true,

        prices:{},
        balance:{
          numBtc: 0,
          numCny: 0,
        },
        balance2:{
          numBtc: 0,
          numCny: 0,
        },

        fbSort: 1, //
        fb: [],
        fbCurPage: 1,
        fbPageSize: 20,
        fbTotal: 0,
        fbErr: -1,

        bbSort: 0, //...
        bb: [],
        bbCurPage: 1,
        bbPageSize: 20,
        bbTotal: 0,
        bbErr: -1,

        alert:"",
        isShowAlert:false,
      }
    },
    computed:{
      paramFbSort:function(){
        let sort=this.fbSort;
        switch(sort){
          case 0:sort=2;break;
          case 1:sort=1;break;
          case 2:sort=4;break;
          case 3:sort=3;break;
          case 4:sort=6;break;
          case 5:sort=5;break;
          default:sort=5;break;
        }
        return sort;
      }
    },
    watch:{
      isZero:function(){
        if(this.tab===0){
          this.loadFb();
        }else{
          this.loadBb();
        }
      },
      isNoWa:function(){
        if(this.tab===0){
          this.loadFb();
        }else{
          this.loadBb();
        }
      },
      fbSort:function(){
        this.loadFb();
      },
      bbSort:function() {
        this.loadBb();
      }
    },
    methods:{
      onSearch(){
        if(this.srchText.length<=0) return;
        if(this.tab===0){
          this.loadFb();
        }else{
          this.loadBb();
        }
      },
      async init(){
        // 查询价格
        let data=await this.Proxy.getPrice().catch((msg)=>{
          console.log(msg);
        });
        if(data && data.data && data.data.prices){
          let prices=data.data.prices;
          prices.forEach((e)=>{
            this.prices[e.currency.toLowerCase()]=e.cny;
          })
        }
        //加载账户信息
        this.loadFbBalance();
        this.loadBbBalance();
        this.loadFb();
        this.loadBb();
      },
      showAlert(txt){
        this.alert=txt;
        this.isShowAlert = true;
        timeout(()=>{
          this.isShowAlert=false;
        },3000);
      },
      createWallet(i){
        let curr=this.fb[i].abbr;
        this.WsProxy.send("wallet", "new_wallet",{currency:curr}).then((data)=> {
          this.$set(this.fb[i],"hasWallet",true);
        }).catch(()=>{
          this.showAlert("创建钱包失败");
        });
      },
      loadFbBalance(){
        this.WsProxy.send("wallet","total_assets", {}).then((data)=>{
          let numBtc=data.total_assets || 0;
          let btcPrice=this.prices["btc"] || 0;
          this.balance.numBtc=numBtc.toFixed(6);
          this.balance.numCny=(numBtc * btcPrice).toFixed(2);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadFb(){
        this.WsProxy.send("wallet","wallets_v2",{
          currency: this.srchText,
          hide_zero: this.isZero,
          hide_no_wallet: this.isNoWa,
          sort: this.paramFbSort,
          page: this.fbCurPage-1,
          count: this.fbPageSize,
        }).then((data)=>{
          if(!data||!data.wallets||data.wallets.length<=0){
            this.fbErr=1; //无数据
          }else{
            this.fbErr=0;
            this.fbTotal=data.count;
            this.parseFb(data.wallets);
          }
        }).catch((msg)=>{
          if(!msg){
            this.fbErr=2; //网络异常
          }else if(msg.ret!==0){
            this.fbErr=3; //加载异常
          }
        });
      },
      parseFb(data){
        this.fb=[];
        data.forEach((e)=>{
          let item={};
          item.hasWallet=(e.address!=null);
          item.icon=this.HostUrl.http + "/image/"+e.icon;
          item.abbr=e.currency;
          item.name=e.name;
          item.avail=item.hasWallet?"0":"-";
          if(e.balance!=null) {
            item.avail = (e.balance + "").formatFixed(6);
          }
          item.frozen=item.hasWallet?"0":"-";
          if(e.locked!=null) {
            item.frozen = (e.locked + "").formatFixed(6);
          }
          item.assess=item.hasWallet?"0":"-";
          if(e.assessment!=null && this.prices["btc"]!=null) {
            item.assess = (e.assessment * this.prices["btc"] + "").formatFixed(2);
          }
          this.fb.push(item);
        });
      },
      loadBbBalance(){

      },
      loadBb(){
        let uid=this.$store.state.userInfo.uid;
        this.Proxy.fetch({
          url: {
            host: '192.168.113.241',
            port: '5555',
            path: '/api/v3/wallet/account/'
          },
          data: {
            method: 'get',
            params:{uid:uid},
          },
        }).then((data)=> {
          if(!data||!data.objects||data.objects.length<=0){
            this.bbErr=1; //无数据
          }else{
            this.bbErr=0;
            this.bbTotal=data.count;
            this.parseBb(data.objects);
          }
        }).catch(msg => {
          this.bbErr=3;
        });
      },
      parseBb(data){
        this.bb=[];
        data.forEach((e)=>{
          this.bb.push({
            icon: "",
            abbr: e.cat,
            name: e.catalog_name || "-",
            avail: (e.avail+"").formatFixed(2),
            frozen: (e.lock+"").formatFixed(2),
            assess: (e.value+"").formatFixed(2),
          });
        });
      },
    },
    mounted(){
      this.init();
      this.Bus.$on("onFbPageChange",(p)=>{
        this.fbCurPage=p;
        this.loadFb();
      });
      this.Bus.$on("onBbPageChange",(p)=>{
        this.bbCurPage=p;
        this.loadBb();
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
  @import "./stylus/account"
</style>
