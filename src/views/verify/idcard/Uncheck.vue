<template>
    <!--待审核-->
    <div class="uncheck">
      <div class="search-bar">
        <div class="search" >
          <input type="text" placeholder="查找昵称/帐号" v-model="srchText" v-clickoutside="clickSrchOutside" @input="fuzzyInput">
          <img src="/static/images/search_gray.png" @click="search">
          <ul class="cand" v-show="srchShowTip">
            <li v-for="(o,i) in tips" @mousedown="srchText=o.nickname+'/'+o.account"
                @click="search" :key="i">{{o.nickname+"/"+o.account}}</li>
          </ul>
        </div>
        <ul class="results">
          <li :class="{active:candSel==i}" v-for="(o,i) in cands" :key="i"
              @mousedown="candSel=i" @click="clickCand">{{o.nickname+"/"+o.account}}</li>
        </ul>
        <SimplePagination :total="candTotal" :pageSize="candPageSize" style="width:100%" emitValue="changePage" v-if="candTotal>candPageSize"></SimplePagination>
      </div>
      <UploadInfo infos="infos" err="infoErr"></UploadInfo>
    </div>
</template>
<script>
  import SimplePagination from "../component/SimplePagination";
  import UploadInfo from "./children/UploadInfo";
  export default {
    components: {
      UploadInfo,
      SimplePagination,
    },
    data() {
      return {
        srchText: "",

        srchShowTip: false,
        tips: [],

        candTotal: 0,
        candPageSize: 20,
        cands: [],
        candSel: 0,

        infos: {},
        infoErr: -1,
      }
    },
    methods: {
      fuzzyInput(){
        this.srchShowTip=true;
        //ws-模糊搜索
        this.loadSrchTips(this.srchText);
      },
      clickSrchOutside(){
        this.srchShowTip=false;
      },
      clickCand(id){
        //ws-获取审核信息
        this.loadUncheckByUid(id);
      },
      search(){
        //ws-搜索-获取审核信息
        this.candSel=-1;
        this.loadUncheckList(this.srchText);
      },
      loadUncheckList(srchKey,p=0){
        this.WsProxy.send("control","a_get_waiting_identify_list",{
          type:1,
          keyword:srchKey,
          page:p,
          count:this.candPageSize
        }).then((data)=>{
          this.candTotal=data.amount;
          this.parseCands(data.users);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadSrchTips(srchKey){
        this.WsProxy.send("control","a_get_identity_tips",{
          type:1,
          state:1,
          keyword: srchKey,
          count: 10
        }).then((data)=>{
          this.parseTips(data);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadUncheckByUid(id){
        this.WsProxy.send("control","a_get_user_identity",{
          type: 1,
          uid: id,
        }).then((data)=>{
          if(!data||!data.identities||data.identities.length<=0){
            this.infoErr=1; //无相应的用户
          }else{
            this.infos.nickname=data.name || "-";
            this.infos.acount=data.phone || data.email || "-";
            this.parseInfos(data.identities);
          }
        }).catch((msg)=>{
          if(!msg){
            this.infoErr=2; //网络异常
          }else if(msg.ret!==0){
            this.infoErr=3; //加载异常
          }
        });
      },
      parseTips(data){
        this.tips=[];
        data && data.forEach((e)=>{
          this.tips.push({
            uid: e.uid || 0,
            nickname: e.name || "-",
            acount:e.phone || e.email || "-",
          });
        });
        return arr;
      },
      parseCands(data){
        this.cands=[];
        data && data.forEach((e)=>{
          this.cands.push({
            uid: e.id || 0,
            nickname: e.name || "-",
            acount:e.phone || e.email || "-",
          });
        });
      },
      parseInfos(data){
        //返回结果时间降序
        this.infos.his=[];
        data && data.forEach((e)=>{
          this.infos.his.unshift({
            id: e.id || 0,
            uid: e.uid || 0,
            name: e.name || "-",
            submitTime: new Date(e.create*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            idcard: e.number || "-",
            img1: e.image1 || "",
            img2: e.image2 || "",
            img3: e.image3 || "",
            remark: e.info,
            flag: e.state,  //1:待审核,2:审核通过,3:审核未通过,4:恶意上传
          });
        });
      },
    },
    mounted(){
      //ws-获取待审核列表
      this.loadUncheckList();
      this.Bus.$on("changePage",(p)=>{
        this.loadUncheckList(this.srchText,p);
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
