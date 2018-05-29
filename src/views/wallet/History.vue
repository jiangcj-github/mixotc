<template>
  <div class="history">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="5"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <div class="export">
            <a href="javascript:void(0);" @click="exportCsv"><img src="/static/images/wallet/export.png">导出账单</a>
          </div>
          <div class="filter">
            <div class="input-group">
              <p class="term" v-clickoutside="()=>isShowUl0=false" @click="isShowUl0=!isShowUl0">{{ul0[ul0Sel].text}}</p>
              <!--搜索条件-->
              <ul class="drop" v-show="isShowUl0">
                <li v-for="(e,i) in ul0" @click="ul0Sel=i">{{e.text}}</li>
              </ul>
              <input class="input" type="text" v-model="srchText"
                     v-clickoutside="()=>isShowTip=false" @input="onFuzzyInput">
              <img class="clear" src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <button class="addin" @click="loadBills"><img src="/static/images/search.png"></button>
              <!--模糊搜索结果-->
              <ul class="drop" v-show="isShowTip">
                <li v-for="(e,i) in tips" @click="loadBills">
                  <p v-if="e.type===2 && e.isUser===1" @mousedown="srchText=e.nickname">
                    <span>{{e.nickname}}</span><span class="fz-gray">{{e.account}}</span>
                  </p>
                  <p v-if="e.type===2 && e.isUser===0" @mousedown="srchText=e.addr" class="fz-addr">{{e.addr}}</p>
                  <p v-if="e.type===1" @mousedown="srchText=e.orderId">{{e.orderId}}</p>
                </li>
                <li v-show="tips.length<=0" class="empty">无搜索结果</li>
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
              <p @click="isShowUl1=!isShowUl1"><i>{{ul1Text}}</i></p>
              <ul class="drop" v-show="isShowUl1">
                <li v-for="(e,i) in ul1" @click="onClickMultiUl(ul1,e)">
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
              <p @click="isShowUl3=!isShowUl3"><i>{{ul3Text}}</i></p>
              <ul class="drop" v-show="isShowUl3">
                <li v-for="(e,i) in ul3" @click="onClickMultiUl(ul3,e)">
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
                <div class="type"><p :class="{in:!e.isIn,out:e.isIn}">{{e.type}}</p></div>
                <div class="coin"><p><img :src="e.coinIcon">{{e.coin}}</p></div>
                <div class="addr">
                  <p v-if="e.billType===0">{{e.addr}}</p>
                  <p v-if="e.billType===1"> <a :href="'/#/homepage?uid='+e.uid" target="_blank">{{e.nickname}}</a></p>
                  <p v-if="e.billType===1">
                    <a href="javascript:void(0);" @click="Bus.$emit('contactSomeone',{id:e.uidStr})"><img src="/static/images/talk.png">联系他</a>
                  </p>
                  <p v-if="e.billType===2">{{e.nickname}}</p>
                  <p v-if="e.billType===3">{{e.nickname}}</p>
                  <p v-if="e.billType===4">{{e.addr}}</p>
                  <p v-if="e.billType===5">{{e.isIn?"法币账户":"币币账户"}}</p>
                </div>
                <div class="num"><p :class="{in:!e.isIn,out:e.isIn}">{{e.num}}</p><p>{{e.fee}} {{e.coin}}</p></div>
                <div class="state">
                  <p>{{e.state}}</p>
                </div>
                <div class="op"><p v-if="e.billType===1"><a :href="'/#/order?oid='+e.orderId+'&classify='+e.orderType">查看</a></p></div>
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
  import JsonExcel from "./js/JsonExcel.js";
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
          {text:"对方/地址",value:2},
          {text:"订单号",value:1},
        ],

        isShowTip: false,
        tips: [],
        tipCount: 10,

        isShowUl1: false,
        ul1: [
          {text:"全部类型",value:-1,check:1},
          {text:"充币",value:1,check:1},
          {text:"提币",value:2,check:1},
          {text:"购买",value:3,check:1},
          {text:"出售",value:4,check:1},
          {text:"担保-入账",value:7,check:1},
          {text:"担保-出账",value:8,check:1},
          {text:"转账-入账",value:5,check:1},
          {text:"转账-出账",value:6,check:1},
          {text:"红包-入账",value:9,check:1},
          {text:"红包-出账",value:10,check:1},
          {text:"资金互转-转入",value:11,check:1},
          {text:"资金互转-转出",value:12,check:1},
        ],

        isShowUl2: false,
        ul2Sel: 0,
        ul2: [
          {text:"全部",value:null},
        ],

        isShowUl3: false,
        ul3: [
          {text:"全部状态",check:1,value:-1},
          {text:"已完成",check:1,value:0},
          {text:"进行中",check:1,value:1},
          {text:"取消",check:1,value:2},
          {text:"超时",check:1,value:3},
          {text:"申诉中",check:1,value:4},
          {text:"强制放币",check:1,value:5},
          {text:"终止交易",check:1,value:6},
        ],

        sort: 0,  // 0-时间升序,1-时间降序,2-数量升序,3-数量降序
        days: 0,  // 【提交时间】筛选快捷键【1-一天,7-七天,30-三十天】

        bills: [],
        curPage: 1,
        pageSize: 20,
        total: 0,
        err: -1,
      }
    },
    computed:{
      ul1Text(){
        if(this.ul1[0].check) return this.ul1[0].text;
        let str="";
        for(let i=1;i<this.ul1.length;i++){
          let e=this.ul1[i];
          if(e.check){
            str+=","+e.text;
          }
        }
        return str.substr(1) || "未选择类型";
      },
      ul3Text(){
        if(this.ul3[0].check) return this.ul3[0].text;
        let str="";
        for(let i=1;i<this.ul3.length;i++){
          let e=this.ul3[i];
          if(e.check){
            str+=","+e.text;
          }
        }
        return str.substr(1) || "未选择状态";
      },
      paramSort(){
        let sort=this.sort;
        switch(sort){
          case 0:sort=1;break;
          case 1:sort=0;break;
          case 2:sort=3;break;
          case 3:sort=2;break;
          default:sort=0;break;
        }
        return sort;
      },
      paramCoin(){
        return this.ul2[this.ul2Sel].value;
      },
      paramSrchType(){
        return this.ul0[this.ul0Sel].value;
      },
      paramType(){
        let type="";
        for(let i=1;i<this.ul1.length;i++){
          let e=this.ul1[i];
          if(e.check){
            type+=","+e.value;
          }
        }
        return type.substr(1);
      },
      paramState(){
        let state="";
        for(let i=1;i<this.ul3.length;i++){
          let e=this.ul3[i];
          if(e.check){
            state+=","+e.value;
          }
        }
        return state.substr(1);
      },
      paramStart(){
        let start= this.$refs.di.date1;
        start=start?Math.floor(new Date(this.$refs.di.date1).getTime()/1000):null;
        return start;
      },
      paramEnd(){
        let end= this.$refs.di.date2;
        end=end?Math.floor(new Date(this.$refs.di.date2).getTime()/1000):null;
        return end;
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
      },

    },
    methods: {
      async init(){
        //加载币种列表
        let data=await this.WsProxy.send("wallet","bill_currency_list", {}).catch((msg)=>{
          console.log(msg);
        });
        data && data.forEach((e)=>{
          this.ul2.push({text:e.toUpperCase(),value:e.toLowerCase()});
        });
        // 获取URL传入参数
        let type=this.$route.query.type;        // type
        if(type){
          this.ul1.forEach((e)=>{
            e.check=(e.value==type?1:0);
          });
        }
        let coin=this.$route.query.coin;        // coin
        if(coin){
          coin=coin.toUpperCase();
          let exist=0;
          for(let i=0;i<this.ul2.length;i++){
            if(this.ul2[i].text==coin){
              exist++;
              this.ul2Sel=i;
            }
          }
          if(exist<=0){
            this.ul2.push({text:coin.toUpperCase(),value:e.toLowerCase()});
            this.ul2Sel=this.ul2.length-1;
          }
        }
        //加载账单
        this.loadBills();
      },
      onClickMultiUl(ul,e){
        e.check=!e.check;
        //多选下拉框，状态联动
        if(e.value===-1){
          for(let i=1;i<ul.length;i++){
            ul[i].check=e.check;
          }
        }else{
          let c=0;
          for(let i=1;i<ul.length;i++){
            c+=ul[i].check;
          }
          ul[0].check= (c>=ul.length-1);
        }
      },
      onFuzzyInput(){
        if(this.srchText.length<=0){
          this.isShowTip=false;
          return;
        }
        this.loadTips();
      },
      loadTips(){
        let srchType=this.ul0[this.ul0Sel].value;
        let srchText=this.srchText;
        this.WsProxy.send("wallet","bill_tips", {
          keyword_type: srchType,
          keyword: srchText,
          count: this.tipCount,
        }).then((data)=>{
          this.parseTips(data);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      parseTips(data){
        this.tips=[];
        data && data.forEach((e)=>{
          this.tips.push({
            orderId: e.bill_id && e.bill_id.toString() || "-",
            nickname: e.name || "-",
            account: e.phone || e.email || "-",
            addr: e.address || "-",
            type: this.ul0[this.ul0Sel].value,      // 0-订单号,1-对方/地址
            isUser: e.address?0:1,     // 0-地址,1-人
          });
        });
        this.isShowTip=true;
      },
      loadBills(){
        this.WsProxy.send("wallet","bills_v2",{
          keyword_type: this.paramSrchType,
          keyword: this.srchText,
          currency: this.paramCoin,
          type: this.paramType,
          state: this.paramState,
          start: this.paramStart,
          end: this.paramEnd,
          page: this.curPage-1,
          count: this.pageSize,
          sort: this.paramSort,
        }).then((data)=>{
          if(!data||!data.bills||data.bills.length<=0){
            this.err=1; //无数据
          }else{
            this.err=0;
            this.total=data.count;
            this.parseBills(data.bills);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
      },
      parseBills(data){
        this.bills=[];
        data.forEach((e)=>{
          let item={
            time1: new Date(e.date*1000).dateHandle("yyyy/MM/dd"),
            time2: new Date(e.date*1000).dateHandle("HH:mm:ss"),
            type: ["充币","提币","购买","出售","转账-入账","转账-出账","担保-入账","担保-出账",
              "红包-入账","红包-出账","资产划出","资产划入"][e.type-1],
            coin: e.currency && e.currency.toUpperCase(),
            coinIcon: "http://192.168.113.26//image/B012F109359B4872",
            nickname: e.trader_name || "-",
            uid: e.trader_id,
            uidStr: this.JsonBig.stringify(e.trader_id),
            num: e.amount.formatFixed(6),
            fee: e.fee.formatFixed(6),
            stateStr: ["已完成","进行中","取消","超时","申诉中","强制放币","终止交易"][e.state],
            state: e.state,
            orderId: e.type_id,
            isIn: [1,3,5,7,9,11].indexOf(e.type)>=0, // 进出账：true-进账,false-出账
            billType: Math.ceil(e.type/2)-1,  // 账单类型：0-充提,1-交易,2-担保,3-红包,4-转账,5-资金互转
          };
          if(item.isIn){
            item.addr=e.from && e.from.formatAddr();
            item.addrName=e.from_name || "-";
            item.num="+"+item.num+" "+item.coin;
          }else{
            item.addr=e.to && e.to.formatAddr();
            item.addrName=e.to_name || "-";
            item.num="-"+item.num+" "+item.coin;
          }
          //订单类型：0-进行中，1-已完成
          if(item.state===0){
            item.orderType=1;
          }else if(item.state===1){
            item.orderType=0;
          }
          this.bills.push(item);
        });
      },
      exportCsv(){
        let jsonField={};
        jsonField["序号"]="index";
        jsonField["时间"]="time";
        jsonField[this.ul1Text]="type";
        jsonField["币种("+this.ul2[this.ul2Sel].text+")"]="coin";
        jsonField["交易对方"]="user";
        jsonField["发送地址名称"]="sendAddrName";
        jsonField["发送地址"]="sendAddr";
        jsonField["接收地址名称"]="recvAddrName";
        jsonField["接收地址"]="recvAddr";
        jsonField["数量"]="num";
        jsonField["手续费"]="fee";
        jsonField[this.ul3Text]="state";
        jsonField["订单号"]="orderId";
        //
        let jsonData=[];
        this.WsProxy.send("wallet","bills_v2",{
          keyword_type: this.paramSrchType,
          keyword: this.srchText,
          currency: this.paramCoin,
          type: this.paramType,
          state: this.paramState,
          start: this.paramStart,
          end: this.paramEnd,
          count: 0,
        }).then((data)=> {
          data && data.bills && data.bills.forEach((e,i) => {
            let item={
              index: i+1,
              time: new Date(e.date*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
              type: ["充币","提币","购买","出售","转账-入账","转账-出账","担保-入账","担保-出账",
                "红包-入账","红包-出账","资产划出","资产划入"][e.type-1],
              coin: e.currency && e.currency.toUpperCase(),
              user: e.trader_name,
              sendAddrName: e.from_name,
              sendAddr: e.from,
              recvAddrName: e.to_name,
              recvAddr: e.to,
              num: e.amount,
              fee: e.fee,
              state: ["已完成","进行中","取消","超时","申诉中","强制放币","终止交易"][e.state],
              orderId: e.type_id.toString(),
              isIn: [1,3,5,7,9,11].indexOf(e.type)>=0, // 进出账：true-进账,false-出账
              billType: Math.ceil(e.type/2)-1,  // 账单类型：0-充提,1-交易,2-担保,3-红包,4-转账,5-资金互转
            };
            if(item.isIn){
              item.num="+"+item.num+" "+item.coin;
            }else{
              item.num="-"+item.num+" "+item.coin;
            }
            item.fee=item.fee+item.coin;
            //资金划转
            if(item.billType===5){
              item.user=item.isIn?"法币账户":"币币账户";
            }
            jsonData.push(item);
          });
          JsonExcel.data=jsonData;
          JsonExcel.fields=jsonField;
          JsonExcel.name="MixOTC-账单.xls";
          JsonExcel.generate();
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
      },
    },
    mounted(){
      this.init();
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
  @import "../common/stylus/common"
  @import "./stylus/common"
  @import "./stylus/history"
</style>
