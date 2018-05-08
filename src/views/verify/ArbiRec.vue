<template>
  <div class="verify inner">
    <h2>mixOTC-审核</h2>
    <div class="main">
      <!--左侧菜单栏-->
      <Left :leftBar="4"></Left>
      <!--右侧-->
      <div class="right">
        <div class="filter">
          <div class="f1">
            <div class="search">
              <span @click="srchUlShow=!srchUlShow" v-clickoutside="()=>{srchUlShow=false}">搜索{{srchUls[srchUlSel].text}}</span>
              <ul v-show="srchUlShow">
                <li v-for="(e,i) in srchUls" :key="i" @click="srchUlSel=i">{{e.text}}</li>
              </ul>
              <input type="text" v-model="srchText" title="" v-clickoutside="()=>{srchTipShow=false}" @input="fuzzyInput">
              <img src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
              <a href="javascript:void(0)" @click="search"></a>
              <ul v-show="srchTipShow && tips.length>0">
                <li v-for="(e,i) in tips" :key="i" @click="search">
                  <div v-if="e.resType===0" @mousedown="srchText=e.nickname">
                    <span>{{e.nickname}}</span><span class="gray">{{e.account}}</span>
                  </div>
                  <div v-else="" @mousedown="srchText=e.orderId">
                    <span>{{e.orderId}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="f2">
            <DateInterval ref="di" onDiChange="onDiChange"></DateInterval>
          </div>
          <div class="f3">
            <a href="javascript:void(0)" :class="{active:days===1}" @click="days=1">今天</a>
            <a href="javascript:void(0)" :class="{active:days===3}" @click="days=3">三天</a>
            <a href="javascript:void(0)" :class="{active:days===7}" @click="days=7">七天</a>
          </div>
        </div>
        <div class="tb-head">
          <span class="tjsj sortable" @click="sort=(sort+1)%2">提交时间<i class="sort" :class="{up:sort===0,down:sort===1}"></i></span>
          <span class="ddxx">订单信息</span>
          <span class="sqr">申诉人</span>
          <span class="sqdx">被申诉人</span>
          <span class="zcr">处理人</span>
          <span class="wcsj">完成时间</span>
          <span class="ys sortable" @click="sort=(sort+1)%2+2">用时<i class="sort" :class="{up:sort===2,down:sort===3}"></i></span>
          <span class="jg drop">
            <a href="javascript:void(0)" v-clickoutside="()=>{resUlShow=false}" @click="resUlShow=!resUlShow">{{resUls[resUlSel].text}}</a>
            <ul v-show="resUlShow">
              <li @click="resUlSel=i" v-for="(e,i) in resUls" :key="i">{{e.text}}</li>
            </ul>
          </span>
          <span class="zrr">责任人</span>
          <span class="cz">操作</span>
        </div>
        <div v-if="err===0">
          <div class="li" v-for="(e,i) in arbis" :key="i">
            <div class="booth">
              <div class="tjsj"><p>{{e.createTime1}}</p><p>{{e.createTime2}}</p></div>
              <div class="ddxx"><p>{{e.orderType}}{{e.orderCoin}}</p></div>
              <div class="sqr">
                <p><a :href="'#/homepage?uid='+e.applyUid" target="_blank" class="link">{{e.applyU}}</a></p>
                <p v-if="!e.resultFlag"><a :href="'#/verify/service?uid='+e.applyUid" target="_blank" class="contact"><img src="/static/images/talk.png">联系他</a></p>
              </div>
              <div class="sqdx">
                <p><a :href="'#/homepage?uid='+e.appliedUid" target="_blank" class="link">{{e.appliedU}}</a></p>
                <p v-if="!e.resultFlag"><a :href="'#/verify/service?uid='+e.appliedUid" target="_blank" class="contact"><img src="/static/images/talk.png">联系他</a></p>
              </div>
              <div class="zcr"><p>{{e.dealU}}</p></div>
              <div class="wcsj"><p>{{e.finishTime1}}</p><p>{{e.finishTime2}}</p></div>
              <div class="ys"><p>{{e.spend}}</p></div>
              <div class="jg"><p>{{e.result}}</p></div>
              <div class="zrr"><p>{{e.respU1}}</p><p>{{e.respU2}}</p></div>
              <div class="cz"><p><a href="javascript:void(0)" class="ck disabled" @click="">沟通记录</a></p></div>
            </div>
            <div class="division"></div>
            <div class="bottom">
              <span class="orderId">订单号：{{e.orderId}}</span>
              <span class="remark">备注：{{e.remark}}</span>
            </div>
          </div>
          <Pagination :total="total" :pageSize="pageSize" :curPage="curPage"></Pagination>
        </div>
        <div v-else-if="err===1">
          <div class="err no-result">没有对应的数据</div>
        </div>
        <div v-else-if="err===2">
          <div class="err load-failed">网络异常，请重新搜索</div>
        </div>
        <div v-else-if="err===3">
          <div class="err net-error">加载失败，请重新搜索</div>
        </div>
        <div v-else-if="err===4">
          <div class="err net-error">数据加载中...</div>
        </div>
        <div v-else>
          <div class="err empty">没有申诉数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import DateInterval from "@/components/common/DateInterval";
  import Left from "./layout/Left";
  import Pagination from "./component/Pagination";
  export default {
    components: {
      Left,
      Pagination,
      DateInterval,
    },

      data() {
      return {

        srchUls: [
          {text: "申诉人", key:0,},
          {text: "被申诉人",key:1},
          {text: "处理人",key:2},
          {text: "责任人",key:3},
          {text: "订单号",key:4},
        ],
        srchUlSel: 0,
        srchUlShow: false,
        srchTipShow: false,
        srchText: "",

        tips: [],
        tipsCount: 10,

        days: 0,

        sort: 1, //0-提交时间升序，1-提交时间降序，2-用时升序，3-用时降序

        resUlShow: false,
        resUlSel: 0,
        resUls:[
          {text:"全部结果",key:0},
          {text:"申诉中",key:1},
          {text:"撤销申诉",key:2},
          {text:"终止交易",key:5},
          {text:"强制放币",key:4},
          {text:"驳回申诉",key:3},
        ],

        err: -1, //0-正常,1-无相应的用户，2-网络异常，3-加载失败,4-加载中
        arbis: [],
        pageSize: 20,
        curPage: 1,
        total: 0,
      }
    },
    watch:{
      days:function(){
        this.$refs.di.date1=new Date(Date.now()-24*60*60*1000*this.days);
        this.$refs.di.date2=new Date();
      },
      resUlSel:function(){
        this.loadArbiLists();
      },
      sort:function(){
        this.loadArbiLists();
      },
    },
    mounted(){
      this.loadArbiLists();
      this.Bus.$on("onPageChange",(p) => {
        this.curPage=p;
        this.loadArbiLists(p-1);
      });
      this.Bus.$on("onDiChange",()=>{
        this.loadArbiLists();
      });
    },
    methods: {
      fuzzyInput(){
        if(this.srchText.length<=0){
          this.srchTipShow=false;
        }else{
          this.srchTipShow=true;
          this.loadTips();
        }
      },
      search(){
        this.loadArbiLists();
      },
      loadArbiLists(p=0){
        //
        let srchKey1=null;  //申诉人
        let srchKey2=null;  //被申诉人
        let srchKey3=null;  //受理人
        let srchKey4=null;  //责任人
        let srchKey5=null;  //订单ID
        switch(this.srchUls[this.srchUlSel].key){
          case 0:srchKey1=this.srchText;break;
          case 1:srchKey2=this.srchText;break;
          case 2:srchKey3=this.srchText;break;
          case 3:srchKey4=this.srchText;break;
          case 4:srchKey5=this.srchText;break;
        }
        let result=this.resUls[this.resUlSel].key;
        let start= this.$refs.di.date1;
        let end= this.$refs.di.date2;
        start=start?Math.floor(new Date(this.$refs.di.date1).getTime()/1000):null;
        end=end?Math.floor(new Date(this.$refs.di.date2).getTime()/1000):null;
        let sortByDuration=null;
        let sortByCreate=null;
        switch(this.sort){
          case 0: sortByCreate=2;break;
          case 1: sortByCreate=1;break;
          case 2: sortByDuration=2;break;
          case 3: sortByDuration=1;break;
        }
        //获取总数
        this.loadArbiTotal();
        //获取列表
        this.WsProxy.send("control","a_get_appeal_list",{
          sid: srchKey5,
          appellant: srchKey1,
          appellee: srchKey2,
          handler: srchKey3,
          responsible: srchKey4,
          type: 0,
          result: result,
          start: start,
          end: end,
          duration: sortByDuration,
          create: sortByCreate,
          origin: p,
          count: this.pageSize,
        }).then((data)=>{
          if(!data||!data.appeals||data.appeals.length<=0){
            this.err=1; //无数据
          }else{
            this.err=0;
            this.parseArbis(data.appeals);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
      },
      loadArbiTotal(){
        this.WsProxy.send("control","a_get_appeal_list",{
          sid: null,
          appellant: null,
          appellee: null,
          handler: null,
          responsible: null,
          type: 0,
          result: 0,
          start: null,
          end: null,
          duration: null,
          create: null,
          origin: -1,
          count: this.pageSize,
        }).then((data)=>{
          this.total=data.origin*this.pageSize+data.appeals.length;
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadTips(){
        let srchKey=this.srchText;
        let key=this.srchUls[this.srchUlSel].key;
        let action="";
        if(key===4){
          action="a_fuzzy_search_trade_id";
        }else{
          action="a_fuzzy_search_appeal_tips";
        }
        let type=null;
        switch(key){
          case 0:type=1;break;
          case 1:type=2;break;
          case 2:type=4;break;
          case 3:type=3;break;
        }
        //
        this.WsProxy.send("control",action,{
          keyword:srchKey,
          type: type,
          count:this.tipsCount
        }).then((data)=>{
          if(key===4){
            this.parseTips(data.ids,1);
          }else{
            this.parseTips(data.tips,0);
          }
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      parseTips(data,resType){    //resType: 0-用户,1-订单ID
        this.tips=[];
        data && data.forEach((e)=>{
          this.tips.push({
            uid: e.id || 0,
            nickname: e.name || "-",
            account:e.phone || e.email || "-",
            orderId: e.Id && e.Id.toString() || 0,
            resType:resType,
          });
        });
      },
      parseArbis(data){
        this.arbis=[];
        data && data.forEach((e)=>{
          this.arbis.push({
            id: e.id,
            orderId: e.sid && e.sid.toString(),
            createTime: new Date(e.create*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            createTime1: new Date(e.create*1000).dateHandle("yyyy/MM/dd"),
            createTime2: new Date(e.create*1000).dateHandle("HH:mm:ss"),
            orderType: e.type && ["出售","购买","担保"][e.type-1],
            orderCoin: e.currency || "-",
            applyU: e.appellant_name || "-",
            applyUid: e.appellant_id,
            applyUid_str: this.JsonBig.stringify(e.appellant_id),
            appliedU: e.appellee_name || "-",
            appliedUid: e.appellee_id,
            appliedUid_str: this.JsonBig.stringify(e.appellee_id),
            dealU: e.handler_name || "-",
            dealUid: e.handler_id,
            dealUid_str: this.JsonBig.stringify(e.handler_id),
            finishTime: (e.result===1?"-":new Date(e.update*1000).dateHandle("yyyy/MM/dd HH:mm:ss")),
            finishTime1: (e.result===1?"-":new Date(e.update*1000).dateHandle("yyyy/MM/dd")),
            finishTime2: (e.result===1?"":new Date(e.update*1000).dateHandle("HH:mm:ss")),
            spend: (e.result===1?"-":(e.update-e.create).formatSecord()),
            result: e.result && ["申诉中","撤回申诉","驳回申诉","强制放币","终止交易"][e.result-1],
            resultFlag: e.result-1,
            respU1: e.responsible_name || "-",
            respU2: e.responsible_account || "",
            respUid: e.responsible_id,
            respUid_str: this.JsonBig.stringify(e.responsible_id),
            remark: e.info||"无",
          });
        });
      }
    },
    destroyed(){
      this.Bus.$off("onPageChange");
      this.Bus.$off("onLastPage");
      this.Bus.$off("onDiChange");
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/verify";
  @import "./stylus/arbirec";
</style>
