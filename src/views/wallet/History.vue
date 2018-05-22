<template>
  <div class="history">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="5"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <JsonExcel class="export" :data="excelJsonData" :fields="excelJsonField"
                     type="csv" name="MixOTC-账单明细.csv">
            <a href="javascript:void(0);" @mousedown="exportCsv"><img src="/static/images/date_icon.png">导出账单</a>
          </JsonExcel>
          <div class="filter">
            <div class="input-group">
              <p class="term" v-clickoutside="()=>isShowUl0=false" @click="isShowUl0=!isShowUl0">{{ul0[ul0Sel].text}}</p>
              <!--搜索条件-->
              <ul class="drop" v-show="isShowUl0">
                <li v-for="(e,i) in ul0" @click="ul0Sel=i">{{e.text}}</li>
              </ul>
              <input class="input" type="text" v-model="srchText"
                     v-clickoutside="()=>isShowTip=false" @focus="onFuzzyFocus" @input="onFuzzyInput">
              <img class="clear" src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <button class="addin"><img src="/static/images/search.png"></button>
              <!--模糊搜索结果-->
              <ul class="drop" v-show="isShowTip && tips.length>0">
                <li v-for="(e,i) in tips">
                  <p v-if="e.type===1">
                    <span v-if="e.isUser===1"><i>{{e.nickname}}</i><i class="gray">{{e.account}}</i></span>
                    <span v-else=""><i>{{e.addr}}</i></span>
                  </p>
                  <p v-else="">
                    <span><i>{{e.orderId}}</i></span>
                  </p>
                </li>
              </ul>
            </div>
            <div class="f2">
              <DateInterval ref="di"></DateInterval>
            </div>
            <div class="f3">
              <a href="javascript:void(0)" @click="days=1">今天</a>
              <a href="javascript:void(0)" @click="days=7">七天</a>
              <a href="javascript:void(0)" @click="days=30">三十天</a>
            </div>
          </div>
          <div class="thead">
            <div class="th time sortable" @click="sort=++sort%2">创建时间
              <i :class="{up:sort===0,down:sort===1}"></i></div>
            <div class="th type select multi" v-clickoutside="()=>isShowUl1=false">
              <p @click="isShowUl1=!isShowUl1" class="ecli">{{ul1Text}}</p>
              <ul class="drop" v-show="isShowUl1">
                <li v-for="(e,i) in ul1" @click="e.check=!e.check">
                  {{e.text}}
                  <img src="/static/images/selected.png" v-show="e.check">
                  <img src="/static/images/unselect.png" v-show="!e.check">
                </li>
              </ul>
            </div>
            <div class="th coin select">
              <p @click="isShowUl2=!isShowUl2" v-clickoutside="()=>isShowUl2=false">币种({{ul2[ul2Sel].text}})</p>
              <ul class="drop" v-show="isShowUl2">
                <li v-for="(e,i) in ul2" @click="ul2Sel=i">{{e.text}}</li>
              </ul>
            </div>
            <div class="th addr">对方/地址</div>
            <div class="th num sortable" @click="sort=++sort%2+2">数量/手续费
              <i :class="{up:sort===2,down:sort===3}"></i></div>
            <div class="th state select multi"  v-clickoutside="()=>isShowUl3=false">
              <p @click="isShowUl3=!isShowUl3">{{ul3Text}}</p>
              <ul class="drop" v-show="isShowUl3">
                <li v-for="(e,i) in ul3" @click="e.check=!e.check">
                  {{e.text}}
                  <img src="/static/images/selected.png" v-show="e.check">
                  <img src="/static/images/unselect.png" v-show="!e.check">
                </li>
              </ul>
            </div>
            <div class="th op">操作</div>
          </div>
          <div v-if="err===0">
            <div class="li" v-for="(e,i) in bills">
              <div class="booth">
                <div class="time"><p>{{e.time1}}</p><p>{{e.time2}}</p></div>
                <div class="type"><p :class="{in:!e.inOrOut,out:e.inOrOut}">{{e.type}}</p></div>
                <div class="coin"><p><img :src="e.coinIcon">{{e.coin}}</p></div>
                <div class="addr">
                  <p v-if="e.billType===0">{{e.addr}}</p>
                  <p v-if="e.billType===1">{{e.nickname}}</p>
                  <p v-if="e.billType===1">
                    <a :href="'/#/homepage?id='+e.uid" target="_blank"><img src="/static/images/talk.png">联系他</a>
                  </p>
                  <p v-if="e.billType===2">担保对方</p>
                  <p v-if="e.billType===3">红包对方</p>
                  <p v-if="e.billType===4">转账对方</p>
                </div>
                <div class="num"><p :class="{in:!e.inOrOut,out:e.inOrOut}">{{e.num}}</p><p>{{e.fee}}</p></div>
                <div class="state">
                  <p>{{e.state}}</p>
                </div>
                <div class="op"><p v-if="e.billType===1"><a href="#">查看</a></p></div>
              </div>
              <div class="bottom" v-if="e.billType===1">
                <span class="orderId">订单号：{{e.orderId}}</span>
              </div>
            </div>
            <Pagination :total="total" :pageSize="pageSize" :curPage="curPage"></Pagination>
          </div>
          <div v-else-if="err===1">
            <div class="err no-result">无相应的数据，请重新搜索</div>
          </div>
          <div v-else-if="err===2">
            <div class="err load-failed">网络异常，请重新搜索</div>
          </div>
          <div v-else-if="err===3">
            <div class="err net-error">加载失败，请重新搜索</div>
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
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import DateInterval from "@/components/common/DateInterval";
  import Pagination from "../verify/component/Pagination";
  import JsonExcel from "vue-json-excel";

  export default {
    components: {
      Notify,
      LeftBar,
      DateInterval,
      Pagination,
      JsonExcel
    },
    data() {
      return {
        srchText: "",

        isShowUl0: false,
        ul0Sel: 0,
        ul0: [
          {text:"订单号",value:0},
          {text:"对方/地址",value:1},
        ],

        isShowTip: false,
        tips: [],

        isShowUl1: false,
        ul1: [
          {text:"充币",value:0,check:1},
          {text:"提币",value:1,check:1},
          {text:"购买",value:2,check:1},
          {text:"出售",value:3,check:1},
          {text:"担保-入账",value:4,check:1},
          {text:"担保-出账",value:5,check:1},
          {text:"转账-入账",value:6,check:1},
          {text:"转账-出账",value:7,check:1},
          {text:"红包-入账",value:8,check:1},
          {text:"红包-出账",value:9,check:1},
        ],

        isShowUl2: false,
        ul2Sel: 0,
        ul2: [
          {text:"全部",value:0},
          {text:"BTC",value:1},
          {text:"ETH",value:2},
          {text:"LTC",value:3},
        ],

        isShowUl3: false,
        ul3: [
          {text:"全部状态",value:0,check:1},
          {text:"待付款",value:1,check:1},
          {text:"待确认",value:2,check:1},
          {text:"待放币",value:3,check:1},
          {text:"申诉中",value:4,check:1},
          {text:"完成",value:5,check:1},
          {text:"失败-取消",value:6,check:1},
          {text:"失败-拒收",value:7,check:1},
          {text:"失败-超时",value:8,check:1},
        ],

        sort: 0,  // 0-时间升序,1-时间降序,2-数量升序,3-数量降序
        days: 0,  // 【提交时间】筛选快捷键【1-一天,7-七天,30-三十天】

        bills: [1,2,3,4,5,6,7,8,9,10],
        curPage: 1,
        pageSize: 20,
        total: 0,
        err: 0,

        excelJsonField: {},
        excelJsonData:  [],
        excelJsonMeta:  [[{key:"charset",value:"utf-8"}]],
      }
    },
    computed:{
      ul1Text(){
        let i=0;
        this.ul1.forEach((e)=>{
          if(e.check) i++;
        });
        return i>=this.ul1.length?"类型(全部)":"类型(筛选"+i+"项)";
      },
      ul3Text(){
        let i=0;
        this.ul3.forEach((e)=>{
          if(e.check) i++;
        });
        return i>=this.ul3.length?"状态(全部)":"状态(筛选"+i+"项)";
      }
    },
    watch:{
      days:function(){
        let date2=new Date(new Date(new Date().toDateString()).getTime()+24*60*60*1000);
        this.$refs.di.date2=date2;
        this.$refs.di.date1=new Date(date2.getTime()-24*60*60*1000*this.days);
      },
      sort:function(){
        this.loadBills();
      },
      ul1Text:function(){
        this.loadBills();
      },
      ul2Sel:function(){
        this.loadBills();
      },
      ul3Text:function(){
        this.loadBills();
      }
    },
    methods: {
      onFuzzyFocus(){
        if(this.tips.length<=0) return;
        this.isShowTip=true;
      },
      onFuzzyInput(){
        if(this.srchText.length<=0) return;
        this.loadTips();
      },
      loadTips(){
        this.parseTips([1,2,3,4,5,6]);
      },
      loadBills(){
        this.err=0;
        this.total=50;
        this.parseBills([1,2,3,4,4,6,7]);
      },
      parseTips(data){
        this.tips=[];
        data && data.forEach((e)=>{
          this.tips.push({
            orderId: 111111111111,
            nickname: "user_987434223",
            account: "398017990@qq.com",
            addr: "0x046e59335aaffd964cfbb05c6c15a1238d7e3543",
            type: this.ul0[this.ul0Sel].value,      // 0-订单号,1-对方/地址
            isUser: 1,     // 0-地址,1-人
          });
        });
        this.isShowTip=true;
      },
      parseBills(data){
        this.bills=[];
        data.forEach((e)=>{
          this.bills.push({
            time1: "2016/03/09",
            time2: "13:43",
            type: "充币",
            coin: "BTC",
            coinIcon: "http://192.168.113.26//image/B012F109359B4872",
            addr: "0x046eb......d7e3543",
            nickname: "user_9823244",
            uid: "232424234",
            num: "+1.12 BTC",
            fee: "0.00004",
            state: "成功",
            orderId: "xxxxxxxxxxxxxxxxxxxxx",
            inOrOut: 0, // 进出账：0-进账,1-出账
            billType: 0,  // 账单类型：0-充提,1-交易,2-担保,3-红包,4-转账
          });
        });
      },
      exportCsv(){
        this.excelJsonField={};
        this.excelJsonField["时间"]="time";
        this.excelJsonField[this.ul1Text]="type";
        this.excelJsonField["币种("+this.ul2[this.ul2Sel].text+")"]="coin";
        this.excelJsonField["交易对方"]="user";
        this.excelJsonField["发送地址名称"]="sendAddrName";
        this.excelJsonField["发送地址"]="sendAddr";
        this.excelJsonField["接收地址名称"]="recvAddrName";
        this.excelJsonField["接收地址"]="recvAddr";
        this.excelJsonField["数量"]="num";
        this.excelJsonField["手续费"]="fee";
        this.excelJsonField[this.ul3Text]="state";
        this.excelJsonField["订单号"]="orderId";
        //
        this.excelJsonData=[];
        [1,2,3,4,5].forEach((e)=>{
          this.excelJsonData.push({
            time: "2016/08/09 12:32",
            type: "充币",
            coin: "BTC",
            user: "user_1323232",
            sendAddrName: "xxxxx",
            sendAddr: "xxxxxxxxxxxxxx",
            recvAddrName: "xxxxx",
            recvAddr: "xxxxxxxxxxxxxxxxx",
            num: "+0.1222 BTC",
            fee: "0.000001 BTC",
            state: "成功",
            orderId: "xxxxxxxxxxxxx",
          });
        });
      },
    },
    mounted(){
      this.loadBills();
      this.Bus.$on("onPageChange",(p)=>{
        this.curPage=p;
        this.loadBills();
      });
      this.Bus.$on("onDiChange",()=>{
        this.loadBills();
      });
    },
    destroyed(){
      this.Bus.$off("onDiChange");
      this.Bus.$off("onPageChange");
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/common"
  @import "./stylus/history"
</style>
