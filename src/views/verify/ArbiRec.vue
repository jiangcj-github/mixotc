<template>
  <Left :leftBar="4">
    <div class="right" slot="right">
      <div class="head">
        <div class="filter">
          <div class="f1">
              <div class="search">
                <span @click="srchUlShow=!srchUlShow" v-clickoutside="clickSrchOutside">搜索{{srchUls[srchUlSel].text}}</span>
                <ul v-show="srchUlShow">
                  <li v-for="(e,i) in srchUls" :key="i" @click="srchUlSel=i">{{e.text}}</li>
                </ul>
                <input type="text" v-model="srchInput" title="">
                <img src="/static/images/cancel_icon.png" @click="srchInput=''" v-show="srchInput.length>0">
                <a href="javascript:void(0)"></a>
              </div>
          </div>
          <div class="f2">
            <DateInterval ref="di"></DateInterval>
          </div>
          <div class="f3">
            <a href="javascript:void(0)" :class="{active:fltDays===1}" @click="fltDays=1">今天</a>
            <a href="javascript:void(0)" :class="{active:fltDays===3}" @click="fltDays=3">三天</a>
            <a href="javascript:void(0)" :class="{active:fltDays===7}" @click="fltDays=7">七天</a>
          </div>
        </div>
      </div>
      <div class="tb-head">
        <span class="tjsj sortable" @click="sortField=0;sortType=!sortType">
          提交时间<i class="sort" :class="{up:sortType,down:!sortType,field:sortField===0}"></i></span>
        <span class="ddxx">订单信息</span>
        <span class="sqr">申请人</span>
        <span class="sqdx">申请对象</span>
        <span class="zcr">仲裁人</span>
        <span class="wcsj">完成时间</span>
        <span class="ys sortable" @click="sortField=1;sortType=!sortType">
          用时<i class="sort" :class="{up:sortType,down:!sortType,field:sortField===1}"></i></span>
        <span class="jg drop">
          <a href="javascript:void(0)" v-clickoutside="clickResOutside" @click="resUlShow=!resUlShow">{{resUls[resUlSel].text}}</a>
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
            <div class="ddxx"><p>{{e.orderType}}</p><p>{{e.orderCoin}}</p></div>
            <div class="sqr">
              <router-link to="" target="_blank" tag="p" class="link">{{e.applyUser}}</router-link>
              <router-link tag="p" to="" class="contact"><img src="/static/images/talk.png">联系他</router-link>
            </div>
            <div class="sqdx">
              <router-link to="" target="_blank" tag="p" class="link">{{e.appliedUser}}</router-link>
              <router-link tag="p" to="" class="contact"><img src="/static/images/talk.png">联系他</router-link>
            </div>
            <div class="zcr"><p>{{e.dealUser}}</p></div>
            <div class="wcsj"><p>{{e.finishTime1}}</p><p>{{e.finishTime2}}</p></div>
            <div class="ys"><p>{{e.spend}}</p></div>
            <div class="jg"><p>{{e.result}}</p></div>
            <div class="zrr"><p>{{e.respUser1}}</p><p>{{e.respUser2}}</p></div>
            <div class="cz"><p><a href="javascript:void(0)" class="ck" @click="showPop(e.id)">查看</a></p></div>
          </div>
          <div class="division"></div>
          <div class="remark">备注：{{e.remark}}</div>
        </div>
        <Pagination :total="43" :pageSize="2" emitValue="onPageChange" style="width:1000px;margin-top:20px" v-show="total>pageSize"></Pagination>
        <BasePopup :show="pop" :width="746" :height="500" :top="50">
          <div class="pop">
            <h2>沟通记录：</h2>
            <div class="p-ul">
              <p class="p-li"><span class="xxsj">信息时间</span><span class="fjr">发件人</span><span class="xxnr">信息内容</span></p>
              <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
              <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
              <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
              <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
              <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
              <p class="p-li"><span class="xxsj">2018/03/09 12:12:34</span><span class="fjr">李小蹦</span><span class="xxnr">在线放币，放心购买。。。。。。</span></p>
            </div>
            <i class="close" @click="pop=false">&times;</i>
          </div>
        </BasePopup>
      </div>
      <div v-else-if="err===1">
        <div class="err no-result">无相应的用户，请重新搜索</div>
      </div>
      <div v-else-if="err===2">
        <div class="err load-failed">网络异常，请重新搜索</div>
      </div>
      <div v-else-if="err===3">
        <div class="err net-error">加载失败，请重新搜索</div>
      </div>
      <div v-else>
        <div class="err empty">没有仲裁记录</div>
      </div>
    </div>
  </Left>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DateInterval from "@/components/common/DateInterval";
  import BasePopup from "@/components/common/BasePopup";
  import SearchInput from "@/components/common/SearchInput";
  import Left from "./layout/Left";

  export default {
    components: {
      Left,
      Pagination,
      DateInterval,
      BasePopup,
      SearchInput,
    },
    data() {
      return {

        srchUls: [
          {text: "申诉人", key: ""},
          {text: "申诉对象", key: ""},
          {text: "处理人", key: ""},
          {text: "责任人", key: ""},
          {text: "订单号", key: ""},
        ],
        srchUlSel: 0,
        srchUlShow: false,
        srchInput: "",

        fltDays: 0,

        sortType: false, //true-升序,false-降序
        sortField: 0, //0-提交时间,1-用时

        resUlShow: false,
        resUlSel: 0,
        resUls:[
          {text:"全部结果",key:""},
          {text:"撤销申诉",key:""},
          {text:"终止交易",key:""},
          {text:"强制放币",key:""},
          {text:"驳回申诉",key:""},
        ],

        err: -1, //0-正常,1-无相应的用户，2-网络异常，3-加载失败
        arbisOrg: [1,2,3],
        total: 0,
        pageSize: 20,

        pop: false,  //查看-弹窗框
      }
    },
    computed:{
      arbis(){
        let arr=[];
        this.arbisOrg && this.arbisOrg.forEach(function (e) {
          arr.push({
            id: "",
            createTime1: "2016/01/01",
            createTime2: "11:11:11",
            orderType: "购买",
            orderCoin: "BTC",
            applyUser:"lilin",
            appliedUser: "linki",
            dealUser:"lindakai",
            finishTime1: "2016/01/01",
            finishTime2: "11:11:11",
            spend: "6min8s",
            result: 1,
            respUser1: "lilin",
            respUser2: "lilin",
            remark: "订单号：123456789098765432",
          });
        });
        return arr;
      }
    },
    watch:{
      fltDays:function(){
        this.$refs.di.date1=new Date(Date.now()-24*60*60*1000*this.fltDays);
        this.$refs.di.date2=new Date();
      }
    },
    mounted(){
      this.Bus.$on("onPageChange",(p) => {

      });
      this.Bus.$on("onDiInput",()=>{
        this.fltDays=-1;
      });
      this.Bus.$on("onDiChange",()=>{
        console.log("d");
      });
    },
    methods: {
      clickSrchOutside(){
        this.srchUlShow=false;
      },
      clickResOutside(){
        this.resUlShow=false;
      },
      showPop(){
        this.pop=true;
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
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
            >ul
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
      height 50px
      padding 0 30px
      span
        display inline-block
        line-height 50px
        font-size 13px
        color #999999
        letter-spacing 0.27px
        &.sortable
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
            &.field
              &.up
                &:before
                  border-bottom-color #ffb422
              &.down
                &:after
                  border-top-color #ffb422
          &:hover
            color #666
        &.drop
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
            margin-top 10px
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
      width 100px
    .ddxx
      width 80px
    .sqr
      width 80px
    .sqdx
      width 100px
    .zcr
      width 90px
    .wcsj
      width 100px
    .ys
      width 80px
    .jg
      width 90px
    .zrr
      width 80px
    .cz
      width 90px
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
