<template>
  <div class="verify inner">
    <h2>mixOTC-审核</h2>
    <div class="main">
      <!--左侧菜单栏-->
      <Left :leftBar="4"></Left>
      <!--右侧-->
      <div class="right">
        <div class="head">
          <div class="filter">
            <div class="f1">
              <div class="search">
                <span @click="srchUlShow=!srchUlShow" v-clickoutside="()=>{srchUlShow=false}">搜索{{srchUls[srchUlSel].text}}</span>
                <ul v-show="srchUlShow" class="srch-ul">
                  <li v-for="(e,i) in srchUls" :key="i" @click="srchUlSel=i">{{e.text}}</li>
                </ul>
                <input type="text" v-model="srchText" title="" v-clickoutside="()=>{srchTipShow=false}" @input="fuzzyInput">
                <img src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
                <a href="javascript:void(0)" @click="search"></a>
                <ul v-show="srchTipShow && tips.length>0" class="tip-ul">
                  <li v-for="(e,i) in tips" :key="i" @click="search">
                    <div v-if="e.resType===0" @mousedown="srchText=e.nickname">
                      <span class="sp1">{{e.nickname}}</span><span class="sp2">{{e.account}}</span>
                    </div>
                    <div class="" v-else="" @mousedown="srchText=e.orderId">
                      <span class="sp1">{{e.orderId}}</span>
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
        </div>
        <div class="tb-head">
        <span class="tjsj sortable" @click="sort=(sort+1)%2">
          提交时间<i class="sort" :class="{up:sort===0,down:sort===1}"></i>
        </span>
          <span class="ddxx">订单信息</span>
          <span class="sqr">申诉人</span>
          <span class="sqdx">被申诉人</span>
          <span class="zcr">仲裁人</span>
          <span class="wcsj">完成时间</span>
          <span class="ys sortable" @click="sort=(sort+1)%2+2">
          用时<i class="sort" :class="{up:sort===2,down:sort===3}"></i>
        </span>
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
                <router-link :to="'/homepage?uid='+e.applyUid" tag="p" class="link">{{e.applyU}}</router-link>
                <router-link tag="p" to="" class="contact"><img src="/static/images/talk.png">联系他</router-link>
              </div>
              <div class="sqdx">
                <router-link :to="'/homepage?uid='+e.appliedUid" tag="p" class="link">{{e.appliedU}}</router-link>
                <router-link tag="p" to="" class="contact"><img src="/static/images/talk.png">联系他</router-link>
              </div>
              <div class="zcr"><p>{{e.dealU}}</p></div>
              <div class="wcsj"><p>{{e.finishTime1}}</p><p>{{e.finishTime2}}</p></div>
              <div class="ys"><p>{{e.spend}}</p></div>
              <div class="jg"><p>{{e.result}}</p></div>
              <div class="zrr"><p>{{e.respU1}}</p><p>{{e.respU2}}</p></div>
              <div class="cz"><p><a href="javascript:void(0)" class="ck" @click="">查看</a></p></div>
            </div>
            <div class="division"></div>
            <div class="remark">备注：{{e.remark}}</div>
          </div>
          <Pagination :total="arbiTotal" :pageSize="arbiPageSize"
                      emitValue="onPageChange" style="width:1000px;margin-top:20px" v-show="arbiTotal>arbiPageSize"></Pagination>
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
          <div class="err empty">没有仲裁数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DateInterval from "@/components/common/DateInterval";
  import Left from "./layout/Left";
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
          {text: "申诉对象",key:1},
          {text: "处理人",key:2},
          {text: "责任人",key:3},
          {text: "订单号",key:4},
        ],
        srchUlSel: 0,
        srchUlShow: false,
        srchTipShow: false,
        srchText: "",

        tips: [1,3,4,5,5,5,5],
        tipsCount: 10,

        days: 0,

        sort: 0, //0-提交时间升序，1-提交时间降序，2-用时升序，3-用时降序

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
        arbiTotal: 0,
        arbiPageSize: 15,
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
        this.loadArbiLists(p-1);
      });
      this.Bus.$on("onDiChange",()=>{
        this.loadArbiLists();
      });
    },
    methods: {
      fuzzyInput(){
        this.srchTipShow=true;
        this.loadTips();
      },
      search(){
        this.loadArbiLists();
      },
      loadArbiLists(p){
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
        //
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
          count: this.arbiPageSize,
        }).then((data)=>{
          if(!data||!data.appeals||data.appeals.length<=0){
            this.err=1; //无数据
          }else{
            this.err=0;
            //this.arbiTotal=data.amount;
            this.parseArbis(data.appeals);
          }
        }).catch((msg)=>{console.log(msg);
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
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
          case 2:type=3;break;
          case 3:type=4;break;
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
            createTime: new Date(e.create*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            createTime1: new Date(e.create*1000).dateHandle("yyyy/MM/dd"),
            createTime2: new Date(e.create*1000).dateHandle("HH:mm"),
            orderType: e.type && ["出售","购买","担保"][e.type-1],
            orderCoin: e.currency || "-",
            applyU: e.appellant_name || "-",
            applyUid: e.appellant_id,
            appliedU: e.appellee_name || "-",
            appliedUid: e.appellee_id,
            dealU: e.handler_name || "-",
            dealUid: e.handler_id,
            finishTime: new Date(e.update*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            finishTime1: new Date(e.update*1000).dateHandle("yyyy/MM/dd"),
            finishTime2: new Date(e.update*1000).dateHandle("HH:mm"),
            spend: (e.update-e.create).formatSecord() || "-",
            result: e.result && ["申诉中","撤回申诉","驳回申诉","强制放币","终止交易"][e.result-1],
            respU1: e.responsible_name || "-",
            respU2: e.responsible_account || "-",
            respUid: e.responsible_id,
            remark: e.info,
          });
        });
      }
    },
    destroyed(){
      this.Bus.$off("onPageChange");
      this.Bus.$off("onDiChange");
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  @import "./stylus/verify.styl";
  .right
    width 1000px
    margin-left 200px
    min-height 500px
    .head
      background #fff
      .filter
        height 50px
        padding 0 30px
        display flex
        align-items center
        .f1
          flex-grow 1
          height 30px
          .search
            width 456px
            height 30px
            box-sizing border-box
            border 1px solid #E1E1E1
            border-radius 2px
            display inline-flex
            position relative
            >span
              font-size 13px
              color #999
              letter-spacing 0
              line-height 28px
              padding 0 15px 0 10px
              display inline-block
              position relative
              cursor pointer
              outline none
              &:after
                content ""
                border 5px solid transparent
                border-top-color #ffb422
                position absolute
                top 13px
                right 0
            ul
              position absolute
              left -1px
              right -1px
              top 29px
              background #fff
              border 1px solid #e1e1e1
              z-index 100
              >li
                padding 0 10px
                line-height 30px
                cursor pointer
                color #333
                font-size 13px
                &:hover
                  background #fff3eb
            ul.tip-ul>li
              .sp1
                display inline-block
              .sp2
                margin-left 15px
                color #999
                font-size 12px
            >img
              align-self center
              margin-right 10px
              &:hover
                cursor pointer
                opacity 0.8
            >input
              padding 0 10px
              flex-grow 1
            >a
              display inline-block
              flex-shrink 0
              width 72px
              background url(/static/images/search.png) no-repeat center center
              background-color #e1e1e1
              &:hover
                background-color #dcd5d5
        .f2
          display inline-flex
          align-items center
          margin-right 20px
          .data-icon
            margin-right 10px
          .to
            width 15px
            text-align center
        .f3
          font-size 13px
          letter-spacing 0.27px
          background #FFF3EB
          border 1px solid #FFF3EB
          border-radius 2px
          display inline-flex
          align-items center
          height 30px
          box-sizing border-box
          padding 0 1px
          >a
            width 50px
            line-height 26px
            display inline-block
            text-align center
            color #999
            &.active
              background #FFFFFF
              border-radius 2px
              color #FFB422
    .tb-head
      user-select none
      height 50px
      padding 0 30px
      >span
        display inline-block
        line-height 50px
        font-size 13px
        color #999999
        letter-spacing 0.27px
      >span.sortable
        cursor pointer
        .sort
          position relative
          margin-left 3px
          &:before
            content ''
            border-left 5px solid transparent
            border-right 5px solid transparent
            border-bottom:5px solid #999
            position absolute
            right -15px
            top 50%
            margin-top -6px
          &:after
            content ''
            border-left 5px solid transparent
            border-right 5px solid transparent
            border-top 5px solid #999
            position absolute
            right -15px
            top 50%
            margin-top 1px
        .sort.up
          &:before
            border-bottom-color #ffb422
        .sort.down
          &:after
            border-top-color #ffb422
        &:hover
          color #666
      >span.drop
        position relative
        >a
          color #999
          display inline-block
          width 100%
          &:hover
            color #666
          &:after
            display inline-block
            width 0
            height 0
            content ""
            border 5px solid transparent
            border-top 5px solid #999
            border-bottom-width 2px
            margin-left 7px
        >ul
          position absolute
          margin-top -10px
          margin-left -10px
          background #fff
          border 1px solid #e1e1e1
          width 100%
          >li
            line-height 30px
            cursor pointer
            padding 0 10px
            &:hover
              background #fff3eb
    .li
      padding 0 30px
      background #fff
      border 1px solid #E1E1E1
      margin-bottom 10px
      span
        display inline-block
      .booth
        padding 15px 0
        box-sizing border-box
        font-size 13px
        color #333
        letter-spacing 0.27px
        >div
          display inline-block
          vertical-align top
          >p
            line-height 20px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            &:not(:first-of-type)
              margin-top 3px
            &.contact
              font-size 11px
              color #FFB422
              letter-spacing 0.23px
              cursor pointer
              img
                width 18px
                height auto
                margin-right 10px
                vertical-align -4px
              &:hover
                color #dca02a
        p.link
          cursor pointer
          &:hover
            color #fea350
        .ddxx p
          color #57A100
        .jg p
          color #FF794C
        .cz p a
          color #FFB422
          &:hover
            color #dca02a
      .division
        height 1px
        background: #E1E1E1;
      .remark
        height 50px
        line-height 50px
        font-size: 13px;
        color: #999999;
        letter-spacing: 0.23px;
    .tjsj
      width 90px
    .ddxx
      width 80px
    .sqr
      width 100px
    .sqdx
      width 100px
    .zcr
      width 100px
    .wcsj
      width 90px
    .ys
      width 80px
    .jg
      width 90px
    .zrr
      width 100px
    .cz
      width 70px
    .pop
      padding 40px 10px 40px 60px
      position relative
      width 746px
      height 500px
      box-sizing border-box
      h2
        height 30px
        padding-left 5px
        line-height 30px
        font-size $fz20
        font-weight bold
        color $col333
        letter-spacing 0.41px
        margin-bottom 30px
        &::before
          display inline-block
          position relative
          top 2px
          left 0
          content ''
          width 3px
          height 20px
          margin-right 10px
          background-color $col422
      .p-ul
        overflow-y auto
        height 360px
        .p-li
          font-size 14px
          letter-spacing 0.16px
          line-height 20px
          margin-bottom 20px
          padding-left 5px
          span
            color #333
            display inline-block
          .xxsj
            width 180px
          .xxnr
            width 350px
          .fjr
            width 90px
      .close
        position absolute
        top 10px
        right 10px
        font-size 20px
        cursor pointer
        display inline-block
        line-height 24px
        width 24px
        text-align center
    .err
      background-repeat no-repeat
      background-position  center 102px
      background-size 140px 140px
      height 500px
      background-color #fff
      padding-top 270px
      text-align center
      font-size 14px
      color #999
      letter-spacing 0.36px
      box-sizing border-box
      &.no-result
        background-image url(/static/images/verify/err_no_result.png)
      &.load-failed
        background-image url(/static/images/verify/err_load_failed.png)
      &.net-error
        background-image url(/static/images/verify/err_net_error.png)
      &.empty
        background-image url(/static/images/rectangle.png)
</style>
