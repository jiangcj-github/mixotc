<template>
    <!--已审核-->
    <div class="check">
      <div class="filter">
        <div class="f1">
          <input type="text" placeholder="搜索商家昵称/账号" v-model="srchText" v-clickoutside="clickOutside" @input="fuzzyInput">
          <img src="/static/images/cancel_icon.png" @click="srchText=''" :class="{show:srchText.length>0}">
          <a href="javascript:void(0)" @click="search"></a>
          <ul v-show="srchShowCand" class="ft-cand">
            <li v-for="(o,i) in srchCands" :key="i" @click="srchText=o">{{o}}</li>
          </ul>
        </div>
        <div class="f2">
          <DateInterval ref="di"></DateInterval>
        </div>
        <div class="f3">
          <a href="javascript:void(0)" :class="{active:days==1}" @click="days=1">今天</a>
          <a href="javascript:void(0)" :class="{active:days==3}" @click="days=3">三天</a>
          <a href="javascript:void(0)" :class="{active:days==7}" @click="days=7">七天</a>
        </div>
      </div>
      <div class="tb-head">
        <span class="tjsj">提交时间</span>
        <span class="yh">用户</span>
        <span class="shr">审批人</span>
        <span class="shsj sortable">审核时间<i class="sort"></i></span>
        <span class="ys sortable">用时<i class="sort"></i> </span>
        <span class="zt drop">
          <a href="javascript:void(0)" v-clickoutside="clickStatusOutside" @click="statusDropShow=!statusDropShow">{{status[statusDropSel].text}}</a>
          <ul v-show="statusDropShow">
            <li @click="statusDropSel=i" v-for="(e,i) in status" :key="i">{{status[i].text}}</li>
          </ul>
        </span>
        <span class="cz">操作</span>
      </div>
      <CheckList list="list"></CheckList>
    </div>
</template>
<script>
  import WebSocketProxy from '@/api/WebSocketProxy.js';
  import DateInterval from "@/components/common/DateInterval";
  import CheckList from "./children/CheckList";
  export default {
    components: {
      CheckList,
      DateInterval,
    },
    data() {
      return {
        proxy: new WebSocketProxy(this.WebSocket),

        srchText: "",
        srchShowCand: false,
        srchCands: ["dd","dd"],

        days: 1,

        statusDropShow: false,
        statusDropSel: 0,
        status:[
          {text:"全部状态",value:0},
          {text:"通过",value:1},
          {text:"不通过",value:2},
        ],

        list: [],
      }
    },
    methods: {
      fuzzyInput(){
        this.srchShowCand=true;
      },
      clickOutside(){
        this.srchShowCand=false;
      },
      clickStatusOutside(){
        this.statusDropShow=false;
      },
      search(){

      }
    },
    mounted(){
      this.Bus.$on("changePage",(p)=>{

      });
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .check
    border-top 1px solid #E1E1E1
    margin-top -20px
    .filter
      padding 10px 30px
      display flex
      background #fff
      .f1
        flex-grow 1
        margin-right 70px
        border 1px solid #E1E1E1
        border-radius 2px 2px 2px 0
        display inline-flex
        position relative
        >input
          padding 0 10px
          flex-grow 1
        >img
          align-self center
          margin-right 10px
          display none
          &:hover
            cursor pointer
            opacity 0.8
          &.show
            display inline-block
        >a
          display inline-block
          flex-shrink 0
          width 72px
          background url(/static/images/search.png) no-repeat center center
          background-color #e1e1e1
          &:hover
            background-color #dcd5d5
        ul.ft-cand
          border 1px solid #e1e1e1
          border-top none
          background #fff
          position absolute
          top 29px
          left -1px
          right 71px
          >li
            padding 0 10px
            line-height 30px
            cursor pointer
            &:hover
              background #fff3eb
      .f2
        margin-right 20px
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
      padding 0 32px
      font-size 13px
      color #999999
      letter-spacing 0.27px
      span
        display inline-block
        line-height 50px
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
            &.sort-up
              &:before
                border-bottom-color #ffb422
            &.sort-down
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
      .tjsj
        width 160px
      .yh
        width 140px
      .shr
        width 140px
      .cz
        width 100px
      .shsj
        width 160px
      .ys
        width 100px
      .zt
        width 100px
    .tjsj
      width 160px
    .yh
      width 140px
    .shr
      width 140px
    .cz
      width 100px
    .shsj
      width 160px
    .ys
      width 100px
    .zt
      width 100px
  placeholder()
</style>
