<template>
    <!--待审核-->
    <div class="uncheck">
      <!--左边栏-->
      <div class="srch">
        <!--搜索框-->
        <div class="head" >
          <input type="text" placeholder="查找昵称/帐号" v-model="srchText" @input="fuzzyInput">
          <img src="/static/images/search_gray.png" @click="search">
        </div>
        <!--搜索结果列表-->
        <ul>
          <li :class="{active:candSel===i}" v-for="(o,i) in cands" :key="i" @click="clickCand(o,i)">
            <p>{{o.nickname}}</p><p class="account">{{o.account}}</p>
          </li>
        </ul>
        <!--简单翻页-->
        <SimplePagination :total="total" :pageSize="pageSize" :curPage="curPage"></SimplePagination>
      </div>
      <!--右边表单-->
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
        srchText: "",   // 搜索内容

        curPage: 1,     // 当前页数
        total: 0,       // 记录总数
        pageSize: 20,   // 每页记录数
        cands: [],      // 待审核数据列表
        candSel: 0,     // 当前选中项

        infos: {},      // 待审核数据
        infoErr: -1,    // 待审核数据加载状态【0-正常,1-无相应的数据,2-网络异常,3-加载出错,4-加载中,other-无数据】
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
        this.loadUncheckList();
      },
      //
      loadUncheckList(p=0){
        let srchKey=this.srchText;
        //
        this.WsProxy.send("control","a_get_waiting_identity_user_list",{
          type:1,
          keyword:srchKey,
          page:p,
          count:this.pageSize
        }).then((data)=>{
          this.total=data.amount;
          this.parseCands(data.users);
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
        //默认选择
        if(this.cands.length>0){
          this.candSel=0;
          this.loadUncheckByUid(this.cands[0].uid);
        }else{
          this.candSel=-1;
          this.infoErr=-1;
        }
      },
      parseInfos(data){
        //返回结果时间降序
        this.infos.his=[];
        data && data.forEach((e)=>{
          this.infos.his.push({
            id: e.id || 0,
            uid: e.uid || 0,
            name: e.name || "-",
            submitTime: new Date(e.create*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            idcard: e.number || "-",
            img1: this.HostUrl.http+"image/"+e.image1,
            img2: this.HostUrl.http+"image/"+e.image2,
            img3: this.HostUrl.http+"image/"+e.image3,
            remark: e.info,
            flag: e.state,  //1:待审核,2:审核通过,3:审核未通过,4:恶意上传
          });
        });
        this.infos.his.sort((a,b)=>{
          return a.submitTime<b.submitTime?1:-1;
        });
      },
    },
    mounted(){
      this.loadUncheckList();
      this.Bus.$on("onPageChange",(p)=>{
        this.curPage=p;
        this.loadUncheckList(p-1);
      });
    },
    destroyed(){
      this.Bus.$off("onPageChange");
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  @import "../stylus/uncheck";
</style>
