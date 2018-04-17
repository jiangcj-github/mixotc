<template>
    <!--待审核-->
    <div class="uncheck">
      <div class="search-bar">
        <div class="search" >
          <input type="text" placeholder="查找昵称/帐号" v-model="srchText" v-clickoutside="clickSrchOutside" @input="fuzzyInput">
          <img src="/static/images/search_gray.png">
          <ul class="cand" v-show="srchShowCand">
            <li v-for="(o,i) of srchCands" @click="srchText=o" :key="i">{{o}}</li>
          </ul>
        </div>
        <ul class="results">
          <li :class="{active:candSel==i}" v-for="i of 20" :key="i" @click="clickResLi(i)">lihh / 130***123</li>
        </ul>
        <SimplePagination :total="100" :pageSize="15" style="width:100%" emitValue="changePage" v-if=""></SimplePagination>
      </div>
      <UploadInfo :info="info"></UploadInfo>
    </div>
</template>
<script>
  import WebSocketProxy from '@/api/WebSocketProxy.js';
  import SimplePagination from "../component/SimplePagination";
  import UploadInfo from "./children/UploadInfo";
  export default {
    components: {
      UploadInfo,
      SimplePagination,
    },
    data() {
      return {
        proxy: new WebSocketProxy(this.WebSocket),

        srchText: '',
        srchShowCand: false,
        srchCands: ["dd","dd"],

        candSel: -1,

        info: {},

      }
    },
    methods: {
      fuzzyInput(){
        this.srchShowCand=true;
      },
      clickSrchOutside(){
        this.srchShowCand=false;
      },
      clickResLi(i){
        this.candSel=i;
        this.info={
          type: 0,    //0-正常,1-无用户,2-加载失败,3-网络异常
          nickname: "lihh",
          phone: "130***123",
          submit_time: "2018/03/09 23:30:42   ",
          name: "李小蹦",
          idcard: "189099087656567890",
          img1: "",
          img2: "",
          img3: "",
          can_check: true,
        };
      },
    },
    mounted(){
      this.Bus.$on("changePage",(p)=>{

      });
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .uncheck
    position relative
    &::after
      clear both
      content ''
      display block
    .search-bar
      width 230px
      background #fff
      float left
      .search
        padding 10px 30px
        border-bottom 1px solid #E1E1E1
        display flex
        align-items center
        position relative
        input
          background #F4F6FA
          border-radius 2px
          padding 5px 30px 5px 10px
          font-size 13px
          line-height 20px
          width 100%
          min-width 0
          box-sizing border-box
          border 1px solid #e1e1e1
        img
          margin-left -24px
          cursor pointer
        ul.cand
          position absolute
          top 100%
          margin-top -10px
          width 170px
          background #fff
          z-index 1000
          border 1px solid #e1e1e1
          border-top none
          box-sizing border-box
          max-height 301px
          overflow-y auto
          li
            line-height 30px
            padding 0 10px
            cursor pointer
            font-size 13px
            &:hover
              background #fff3eb
      .results
        margin-top 2px
        font-size 14px
        color #FFB422
        letter-spacing 0.16px
        padding-bottom 15px
        >li
          line-height 20px
          padding 0 34px
          margin-top 15px
          cursor pointer
          &.active
            color #FFB422
  placeholder()
</style>
