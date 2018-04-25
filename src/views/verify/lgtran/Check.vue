<template>
  <!--已审核-->
  <div class="check">
    <div class="filter">
      <div class="f1">
        <input type="text" placeholder="搜索商家昵称/账号" v-model="srchText" v-clickoutside="clickOutside" @input="fuzzyInput">
        <img src="/static/images/cancel_icon.png" @click="srchText=''" v-show="srchText.length>0">
        <a href="javascript:void(0)" @click="search"></a>
        <ul v-show="srchShowTip" class="ft-cand">
          <li v-for="(o,i) in tips" :key="i" @mousedown="srchText=o.nickname+'/'+o.phone" @click="search">{{o.nickname+'/'+o.phone}}</li>
        </ul>
      </div>
      <div class="f2">
        <DateInterval ref="di"></DateInterval>
      </div>
      <div class="f3">
        <a href="javascript:void(0)" :class="{active:days===1}" @click="days=1">今天</a>
        <a href="javascript:void(0)" :class="{active:days===3}" @click="days=3">三天</a>
        <a href="javascript:void(0)" :class="{active:days===7}" @click="days=7">七天</a>
      </div>
    </div>
    <div class="tb-head">
      <span class="tjsj">提交时间</span>
      <span class="yh">用户</span>
      <span class="shr">审批人</span>
      <span class="shsj sortable" @click="sortField=0;sortType=!sortType">
          审核时间<i class="sort" :class="{up:sortType,down:!sortType,field:sortField===0}"></i>
        </span>
      <span class="ys sortable" @click="sortField=1;sortType=!sortType">
          用时<i class="sort" :class="{up:sortType,down:!sortType,field:sortField===1}"></i>
        </span>
      <span class="zt drop">
          <a href="javascript:void(0)" v-clickoutside="clickStatusOutside" @click="statusDropShow=!statusDropShow">{{status[statusDropSel].text}}</a>
          <ul v-show="statusDropShow">
            <li @click="statusDropSel=i" v-for="(e,i) in status" :key="i">{{e.text}}</li>
          </ul>
        </span>
      <span class="cz">操作</span>
    </div>
    <div v-if="err===0">
      <div class="li" v-for="(e,i) in list" :key="i">
        <div class="booth">
          <span class="tjsj">{{e.submitTime}}</span>
          <span class="yh">{{e.nickname}}/{{e.account}}</span>
          <span class="shr">{{e.nicknameCk}}/{{e.accountCk}}</span>
          <span class="shsj">{{e.checkTime}}</span>
          <span class="ys">{{e.spend}}</span>
          <span class="zt">{{e.checkResult}}</span>
          <span class="cz"><a href="javascript:void(0)" class="ck" @click="showPop(e.id)">查看</a></span>
        </div>
        <div class="division"></div>
        <div class="remark">备注：{{e.checkRemark}}</div>
      </div>
      <Pagination :total="total" :pageSize="pageSize" emitValue="changePage"
                  style="width:100%;margin-top:20px" v-show="total>pageSize"></Pagination>
      <BasePopup :show="pop" :width="764" :height="382" :top="50">
        <div class="pop">
          <p class="inf-li"><label>提交时间</label><span>{{list[popSel].submitTime}}</span></p>
          <p class="inf-li"><label>姓名</label><span>{{list[popSel].name}}</span></p>
          <p class="inf-li"><label>身份证号</label><span>{{list[popSel].idcard}}</span></p>
          <p class="inf-li"><label>银行卡号</label><span>{{list[popSel].bankcard}}</span></p>
          <p class="inf-li"><label>开户行</label><span>{{list[popSel].bank}}</span></p>
          <p class="check-img">
            <img :src="list[popSel].img1">
            <img :src="list[popSel].img2">
            <img :src="list[popSel].img3">
          </p>
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
      <div class="err empty">没有已审核数据</div>
    </div>
  </div>
</template>
<script>
  import DateInterval from "@/components/common/DateInterval";
  import BasePopup from "@/components/common/BasePopup";
  export default {
    components: {
      BasePopup,
      DateInterval,
    },
    data() {
      return {
        srchText: "",
        srchShowTip: false,
        tips: [],

        days: 1,

        sortField: -1, //0-审核时间,1-用时
        sortType: false, //true-升序,false-降序

        statusDropShow: false,
        statusDropSel: 0,
        status:[
          {text:"全部状态",value:0},
          {text:"通过",value:1},
          {text:"不通过",value:2},
        ],

        err: -1, //0-正常,1-无相应的用户，2-网络异常，3-加载失败
        list: [],
        total: 0,
        pageSize:15,

        popSel: 0,
        pop: false,  //弹窗-查看
      }
    },
    watch:{
      statusDropSel:()=>{
        //ws-状态过滤
      },
      sortFiled:()=> {
        //ws-排序
      },
      sortType:()=>{
        //ws-排序
      },
      days:function(){
        this.$refs.di.date1=new Date(Date.now()-24*60*60*1000*this.days);
        this.$refs.di.date2=new Date();
      },
    },
    methods: {
      fuzzyInput(){
        this.srchShowTip=true;
      },
      clickOutside(){
        this.srchShowTip=false;
      },
      clickStatusOutside(){
        this.statusDropShow=false;
      },
      search(){

      },
      showPop(id){
        this.popSel=id;
        this.pop=true;
      },
      loadCheckList(srchKey,start,end,result,sort,p){
        this.WsProxy.send("control","a_get_identity_list",{
          type:2,
          result: result,
          sort: sort,
          keyword:srchKey,
          start: start,
          end: end,
          page:p,
          count:this.candPageSize
        }).then((data)=>{
          if(!data||!data.identities||data.identities.length<=0){
            this.err=1; //无相应的用户
          }else{
            this.total=data.amount;
            this.parseList(data.identities);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
      },
      parseList(data){
        this.list=[];
        data && data.forEach((e,i)=>{
          this.list.push({
            id: i,
            submitTime: new Date(e.create*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            nickname: e.nick || "-",
            acount:e.phone || e.email || "-",
            nicknameCk: e.verify_name || "-",
            accountCk: e.verify_phone || e.verify_email || "-",
            checkTime: new Date(e.update*1000).dateHandle("yyyy/MM/dd HH:mm:ss"),
            spend: (e.used && e.used.formatSecord()) || "-",
            checkResult: (e.state && ["待审核","通过","未通过","恶意上传"][e.state-1]) || "-",
            checkRemark: e.info || "-",
            name: e.name || "-",
            idcard: e.number || "-",
            bank: e.bank_name || "-",
            bankcard: e.bank_number || "-",
            img1: e.image1 || "",
            img2: e.image2 || "",
            img3: e.image3 || "",
          });
        });
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
      user-select none
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
    .pop
      padding 60px 80px
      position relative
      .inf-li
        font-size 14px
        letter-spacing 0.16px
        line-height 20px
        margin-bottom 10px
        label
          color #999
          width 150px
          display inline-block
        span
          color #333
          display inline-block
      .check-img
        height 180px
        display flex
        align-items center
        >img
          width 180px
          height 120px
          border 1px solid #EEEEEE
          border-radius 2px
          margin-right 20px
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
    .li
      padding 0 30px
      background #fff
      border 1px solid #E1E1E1
      margin-bottom 10px
      span
        display inline-block
      .booth
        font-size 14px
        color #333333
        letter-spacing 0.16px
        height 67px
        line-height 67px
        .yh
          color #ffb422
        .cz
          .ck
            color #ffb422
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
  placeholder()
</style>
