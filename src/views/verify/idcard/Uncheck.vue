<template>
    <!--待审核-->
    <div class="uncheck">
      <div class="search-bar">
        <div class="search" >
          <input type="text" placeholder="查找昵称/帐号" v-model="srchText" v-clickoutside="clickSrchOutside" @input="fuzzyInput">
          <img src="/static/images/search_gray.png" @click="search">
          <ul class="cand" v-show="srchShowTip">
            <li v-for="(o,i) in tips" @click="srchText=o.nickname+'/'+o.phone" :key="i">{{o.nickname+"/"+o.phone}}</li>
          </ul>
        </div>
        <ul class="results">
          <li :class="{active:candSel==i}" v-for="(o,i) in cands" :key="i" @click="clickCand">{{o.nickname+"/"+o.phone}}</li>
        </ul>
        <SimplePagination :total="candNum" :pageSize="20" style="width:100%" emitValue="changePage" v-if="candNum>20"></SimplePagination>
      </div>
      <UploadInfo info="info"></UploadInfo>
    </div>
</template>
<script>
  import SimplePagination from "../component/SimplePagination";
  import UploadInfo from "./children/UploadInfo";
  export default {
    props:["numChange"],
    components: {
      UploadInfo,
      SimplePagination,
    },
    data() {
      return {

        srchText: '',
        srchShowTip: false,

        tipsOrg: [],

        candNum: 0,
        candsOrg: [],
        candSel: 0,

        infoOrg: {},

      }
    },
    computed:{
      tips(){
        let arr=[];
        this.tipsOrg && this.tipsOrg.forEach(function (e) {
          arr.push({
            id: e.id || 0,
            nickname: e.name || "-",
            phone: e.phone || "-"
          });
        });
        return arr;
      },
      cands(){
        let arr=[];
        this.candsOrg && this.candsOrg.forEach(function(e){
          arr.push({
            id: e.id || 0,
            nickname: e.name || "-",
            phone: e.phone || "-",
          });
        });
        return arr;
      },
      info(){
        let o=this.infoOrg;
        return{
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
    watch:{
      candNum:function(){
        this.Bus.$emit(this.numChange, this.candNum);
      },
      candSel:function () {
        //ws-获取审核信息

      }
    },
    methods: {
      fuzzyInput(){
        this.srchShowTip=true;
        //ws-模糊搜索
      },
      clickSrchOutside(){
        this.srchShowTip=false;
      },
      clickCand(){
        //ws-获取审核信息

      },
      search(){
        //ws-搜索-获取审核信息
        this.candSel=-1;

      }
    },
    mounted(){
      //ws-获取待审核列表
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
        min-height 477px
        >li
          line-height 20px
          padding 0 34px
          margin-top 15px
          cursor pointer
          &.active
            color #FFB422
  placeholder()
</style>
