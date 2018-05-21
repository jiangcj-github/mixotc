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
            <p class="l1">
              <span class="big">总资产约：</span>
              <span class="big bright">{{balance.numBtc}}</span>
              <span class="small">BTC</span>
              <span class="big">/</span>
              <span class="big bright">{{balance.numCny}}</span>
              <span class="small">CNY</span>
            </p>
            <p class="l2">
              <span class="quota">24h提币额度：{{balance.quota}} BTC</span>
              <span class="used">已用：{{balance.usedQuota}} BTC</span>
            </p>
          </div>
          <div class="filter">
            <div class="f1">
              <input type="text" placeholder="搜索币种" v-model="srchText">
              <img src="/static/images/cancel_icon.png" v-show="srchText.length>0" @click="srchText=''">
              <button @click=""></button>
            </div>
            <div class="f2">
              <span class="radio r1" :class="{check:isPZ===0}" @click="isPZ=0">隐藏小额资产</span>
              <span class="radio r2" :class="{check:isPZ===1}" @click="isPZ=1">隐藏0余额币种</span>
              <span class="checkbox r3" :class="{check:isNoWa}" @click="isNoWa=!isNoWa">隐藏非钱包币种</span>
            </div>
          </div>
          <div class="tb-tab">
            <ul>
              <li :class="{active:tab===0}" @click="tab=0">mixOTC法币账户</li>
              <li :class="{active:tab===1}" @click="tab=1">币币账户</li>
            </ul>
            <button class="btn green" v-show="tab===1">币币交易</button>
          </div>
          <!--法币账户-->
          <div class="fb" v-show="tab===0">
            <!--表头-->
            <div class="thead">
              <p class="coin sortable" @click="fbSort=++fbSort%2+10">币种
                <i class="sort" :class="{up:fbSort===10,down:fbSort===11}"></i></p>
              <p class="name sortable" @click="fbSort=++fbSort%2+12">全称
                <i class="sort" :class="{up:fbSort===12,down:fbSort===13}"></i></p>
              <p class="avail sortable" @click="fbSort=++fbSort%2">可用余额
                <i class="sort" :class="{up:fbSort===0,down:fbSort===1}"></i></p>
              <p class="frozen sortable" @click="fbSort=++fbSort%2+2">冻结中余额
                <i class="sort" :class="{up:fbSort===2,down:fbSort===3}"></i></p>
              <p class="confirm sortable" @click="fbSort=++fbSort%2+4">确认中余额
                <i class="sort" :class="{up:fbSort===4,down:fbSort===5}"></i></p>
              <p class="total sortable" @click="fbSort=++fbSort%2+6">总额
                <i class="sort" :class="{up:fbSort===6,down:fbSort===7}"></i></p>
              <p class="assess sortable" @click="fbSort=++fbSort%2+8">估值
                <i class="sort" :class="{up:fbSort===8,down:fbSort===9}"></i></p>
              <p class="opera">操作</p>
            </div>
            <!--fb返回结果-->
            <div v-if="fbErr===0">
              <div v-for="(e,i) in fb">
                <div class="li" v-if="e.hasWallet">
                  <p class="coin"><img :src="e.icon">{{e.abbr}}</p>
                  <p class="name">{{e.name}}</p>
                  <p class="avail">{{e.avail}}</p>
                  <p class="frozen">{{e.frozen}}</p>
                  <p class="confirm">{{e.confirm}}</p>
                  <p class="total">{{e.total}}</p>
                  <p class="assess">{{e.assess}}</p>
                  <p class="opera op1">
                    <button class="btn white">充币</button>
                    <button class="btn white">提币</button>
                    <button class="btn white">交易</button>
                  </p>
                </div>
                <div class="li" v-else="">
                  <p class="coin"><img :src="e.icon">{{e.abbr}}</p>
                  <p class="name">{{e.name}}</p>
                  <p class="avail">{{e.avail}}</p>
                  <p class="frozen">{{e.frozen}}</p>
                  <p class="confirm">{{e.confirm}}</p>
                  <p class="total">{{e.total}}</p>
                  <p class="assess">{{e.assess}}</p>
                  <p class="opera op2">
                    <button class="btn green">加入钱包</button>
                    <a href="#">查看币种资料</a>
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
              <div class="err net-error">加载失败</div>
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
              <p class="coin sortable" @click="bbSort=++bbSort%2+10">币种
                <i class="sort" :class="{up:bbSort===10,down:bbSort===11}"></i></p>
              <p class="name sortable" @click="bbSort=++bbSort%2+12">全称
                <i class="sort" :class="{up:bbSort===12,down:bbSort===13}"></i></p>
              <p class="avail sortable" @click="bbSort=++bbSort%2">可用余额
                <i class="sort" :class="{up:bbSort===0,down:bbSort===1}"></i></p>
              <p class="frozen sortable" @click="bbSort=++bbSort%2+2">冻结中余额
                <i class="sort" :class="{up:bbSort===2,down:bbSort===3}"></i></p>
              <p class="confirm sortable" @click="bbSort=++bbSort%2+4">确认中余额
                <i class="sort" :class="{up:bbSort===4,down:bbSort===5}"></i></p>
              <p class="total sortable" @click="bbSort=++bbSort%2+6">总额
                <i class="sort" :class="{up:bbSort===6,down:bbSort===7}"></i></p>
              <p class="assess sortable" @click="bbSort=++bbSort%2+8">估值
                <i class="sort" :class="{up:bbSort===8,down:bbSort===9}"></i></p>
              <p class="opera">操作</p>
            </div>
            <!--bb返回结果-->
            <div v-if="bbErr===0">
              <div class="li" v-for="(e,i) in bb">
                <p class="coin"><img :src="e.icon">{{e.abbr}}</p>
                <p class="name">{{e.name}}</p>
                <p class="avail">{{e.avail}}</p>
                <p class="frozen">{{e.frozen}}</p>
                <p class="confirm">{{e.confirm}}</p>
                <p class="total">{{e.total}}</p>
                <p class="assess">{{e.assess}}</p>
                <p class="opera op3"><button class="btn white">资产转出</button></p>
              </div>
              <Pagination :total="bbTotal" :pageSize="bbPageSize" :curPage="bbCurPage" onPageChange="onBbPageChange"></Pagination>
            </div>
            <div v-else-if="bbErr===1">
              <div class="err no-result">无相应的数据</div>
            </div>
            <div v-else-if="bbErr===2">
              <div class="err load-failed">网络异常</div>
            </div>
            <div v-else-if="bbErr===3">
              <div class="err net-error">加载失败</div>
            </div>
            <div v-else-if="bbErr===4">
              <div class="err net-error">数据加载中...</div>
            </div>
            <div v-else>
              <div class="err empty">无账户数据</div>
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
  export default {
    components: {
      Pagination,
      Notify,
      LeftBar,
    },
    data() {
      return {
        tab: 0,  //0-法币账户,1-币币账户
        srchText: "",
        isPZ: -1,
        isNoWa: true,

        balance:{},

        fbSort: -1, //
        fb: [],
        fbCurPage: 1,
        fbPageSize: 20,
        fbTotal: 0,
        fbErr: 0,

        bbSort: -1, //...
        bb: [],
        bbCurPage: 1,
        bbPageSize: 20,
        bbTotal: 0,
        bbErr: 0,
      }
    },
    methods:{
      loadBalance(){
        this.parseBalance();
      },
      parseBalance(data){
        this.balance={
          numBtc: 1,
          numCny: 66666,
          quota: 20,
          usedQuota: 0,
        }
      },
      loadFb(){
        this.fbErr=0;
        this.parseFb([1,2,3,4,5]);
      },
      parseFb(data){
        this.fb=[];
        data.forEach((e)=>{
          this.fb.push({
            icon: "http://192.168.113.26//image/B012F109359B4872",
            abbr: "BTC",
            name: "Bitcoin",
            avail: 0.0001+"BTC",
            frozen: 0.0001+"BTC",
            confirm: 0.0001+"BTC",
            total: 0.0003+"BTC",
            assess: 12000+"CNY",
            hasWallet: Math.random()>0.5,
          });
        });
      },
      loadBb(){
        this.bbErr=0;
        this.parseBb([1,2,3,4,5]);
      },
      parseBb(data){
        this.bb=[];
        data.forEach((e)=>{
          this.bb.push({
            icon: "http://192.168.113.26//image/B012F109359B4872",
            abbr: "BTC",
            name: "Bitcoin",
            avail: 0.0001+"BTC",
            frozen: 0.0001+"BTC",
            confirm: 0.0001+"BTC",
            total: 0.0003+"BTC",
            assess: 12000+"CNY",
            hasWallet: Math.random()>0.5,
          });
        });
      },
    },
    mounted(){
      this.loadBalance();
      this.loadFb();
      this.loadBb();
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
