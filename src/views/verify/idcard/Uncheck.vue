<template>
    <!--待审核-->
    <div class="uncheck">
      <div class="srch">
        <div class="head" >
          <input type="text" placeholder="查找昵称/帐号" v-model="srchText" @input="fuzzyInput">
          <img src="/static/images/search_gray.png" @click="search">
        </div>
        <ul>
          <li :class="{active:candSel===i}" v-for="(o,i) in cands" :key="i" @click="clickCand(o,i)">
            <p>{{o.nickname}}</p><p class="account">{{o.account}}</p>
          </li>
        </ul>
        <SimplePagination :total="total" :pageSize="pageSize" :curPage="curPage"></SimplePagination>
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

        curPage: 1,
        total: 0,
        pageSize: 15,
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
          type:1,
          keyword:srchKey,
          page:p,
          count:this.pageSize
        }).then((data)=>{
          this.total=data.amount;
          this.candSel=-1;
          this.parseCands(data.users);
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
      },
      loadUncheckByUid(id){
        this.infoErr=4;
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
      //ws-获取待审核列表
      this.loadUncheckList();
      this.Bus.$on("onPageChange",(p)=>{
        this.curPage=p;
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
  @import "../../../stylus/base";
  @import "../stylus/uncheck";
</style>
