<template>
  <!--待审核-->
  <div class="uncheck">
    <div class="search-bar">
      <div class="search" >
        <input type="text" placeholder="查找昵称/帐号" v-model="srchText" @input="fuzzyInput">
        <img src="/static/images/search_gray.png" @click="search">
      </div>
      <ul class="results">
        <li :class="{active:candSel===i}" v-for="(o,i) in cands" :key="i" @click="clickCand(o,i)">
          <p class="nick">{{o.nickname}}</p><p class="account">{{o.account}}</p>
        </li>
      </ul>
      <SimplePagination :total="candTotal" :pageSize="candPageSize" v-if="candTotal>candPageSize"></SimplePagination>
    </div>
    <UploadInfo :infos="infos" :err="infoErr"></UploadInfo>
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

        candTotal: 0,
        candPageSize: 15,
        cands: [],
        candSel: 0,

        infos: {},
        infoErr: -1,
      }
    },
    methods: {
      fuzzyInput(){
        this.loadUncheckList();
      },
      clickCand(item,i){
        if(this.candSel===i) return;
        this.candSel=i;
        this.loadUncheckByUid(item.uid);
      },
      search(){
        this.candSel=-1;
        this.loadUncheckList();
      },
      loadUncheckList(p=0){
        let srchKey=this.srchText;
        this.WsProxy.send("control","a_get_waiting_identity_user_list",{
          type:2,
          keyword:srchKey,
          page:p,
          count:this.candPageSize
        }).then((data)=>{
          this.candTotal=data.amount;
          this.candSel=-1;
          this.parseCands(data.users);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadUncheckByUid(id){
        this.infoErr=4;
        this.WsProxy.send("control","a_get_user_identity",{
          type: 2,
          uid: id,
        }).then((data)=>{
          if(!data||!data.identities||data.identities.length<=0){
            this.infoErr=1; //无相应的用户
          }else{
            this.infoErr=0;
            this.infos={};
            this.infos.nickname=data.name || "-";
            this.infos.account=data.phone || data.email || "-";
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
      parseCands(data){
        this.cands=[];
        data && data.forEach((e)=>{
          this.cands.push({
            uid: e.id || 0,
            nickname: e.name || "-",
            account:e.phone || e.email || "-",
          });
        });
      },
      parseInfos(data){
        //返回结果时间降序
        this.infos.his=[];
        data && data.forEach((e)=>{
          this.infos.his.unshift({
            id: e.id && e.id || 0,
            uid: e.uid && e.uid || 0,
            name: e.name || "-",
            submitTime: new Date(e.create*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            bankcard: e.number || "-",
            bank: e.bank_name || "-",
            img1: this.HostUrl.http+"image/"+e.image1,
            img2: this.HostUrl.http+"image/"+e.image2,
            img3: this.HostUrl.http+"image/"+e.image3,
            remark: e.info,
            flag: e.state,  //1:待审核,2:审核通过,3:审核未通过,4:恶意上传
          });
        });
      },
    },
    mounted(){
      //ws-获取待审核列表
      this.loadUncheckList();
      this.Bus.$on("onPageChange",(p)=>{
        this.loadUncheckList(p-1);
      });
      this.Bus.$on("onSubmit",(info)=>{
        this.Bus.$emit("onSubmit2",info);
        this.infoErr=-1;
        this.candSel=-1;
        this.loadUncheckList();
      });
    },
    destroyed(){
      this.Bus.$off("onPageChange");
      this.Bus.$off("onSubmit");
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
            text-overflow ellipsis
            overflow hidden
            white-space nowrap
            &:hover
              background #fff3eb
      .results
        font-size 14px
        color #FFB422
        letter-spacing 0.16px
        min-height 477px
        box-sizing border-box
        >li
          line-height 20px
          padding 8px 34px
          cursor pointer
          &:hover
            background #fcfcfc
          &.active
            background #f9f0f0
          >p
            display block
            &.nick
              color #333
            &.account
              color #999
              font-size 12px
  placeholder()
</style>
