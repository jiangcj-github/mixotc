<template>
  <!--条件渲染-->
  <div v-if="err===0">
    <!--评价列表-->
    <div class="li" v-for="(e,i) in rates">
      <div class="p1">
        <p class="text">{{e.comment}}</p>
        <p class="time">{{e.date}}</p>
      </div>
      <div class="p2">
        <span class="judge">{{e.credit_str}}</span>
        <span class="heart-wrap">
        <img src="/static/images/evaluate_red.png" v-for="i in e.credit">
      </span>
      </div>
      <div class="p3">
        <img :src="e.icon" alt="">
        <span>{{e.name}}</span>
      </div>
    </div>
    <!--翻页-->
    <Pagination :total="total" :pageSize="pageSize" :curPage="curPage"></Pagination>
  </div>
  <div class="err no-result" v-else-if="err===1">无相应的数据</div>
  <div class="err load-failed" v-else-if="err===2">网络异常</div>
  <div class="err net-error" v-else-if="err===3">加载失败</div>
  <div class="err loading" v-else-if="err===4">数据加载中...</div>
  <div class="err empty" v-else>没有评价数据</div>
</template>
<script>
  import Pagination from "../../verify/component/Pagination";
  export default {
    components:{Pagination},
    data() {
      return {
        uid: "",        // 用户ID

        rates:[],        // 评价列表
        pageSize:10,    // 每页记录数
        curPage: 1,     // 当前页数
        total: 1,       // 记录总数
        err: -1,        // 评价列表请求状态，【0-正常,1-无相应数据,2-网络异常,3-加载失败,4-加载中,other-无数据】
      }
    },
    mounted() {
      this.uid= this.JsonBig.parse(this.$route.query.uid) || "";
      this.loadRates();
      this.Bus.$on("onPageChange",(p)=>{
        this.curPage=p;
        this.loadRates(p-1);
      });
    },
    destroyed(){
      this.Bus.$off("onPageChange");
    },
    methods: {
      loadRates(p=0){
        //获取列表
        this.Proxy.hp_rates({
          id:this.uid,
          origin: p,
        }).then((data)=>{
          if(!data.data||!data.data.rates||data.data.rates.length<=0){
            this.err=1;
          }else{
            this.err=0;
            this.total=data.data.amount;
            this.Bus.$emit("onRateTotalUpdate",this.total);
            this.parseRates(data.data.rates);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
      },
      parseRates(data){
        this.rates=[];
        data && data.forEach((item)=>{
          this.rates.push({
            comment: item.comment || "暂无评价内容",
            date: new Date(item.date*1000).dateHandle("yyyy/MM/dd hh:mm:ss"),
            credit: item.credit || 0,
            credit_str: ["差评","差评","中评","好评","好评"][item.credit-1] || "-",
            icon: item.icon && this.HostUrl.http+"image/"+item.icon+"?size=thumb" || "/static/images/default_avator.png",
            name: item.name || "-",
          });
        });
      },
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  @import "../stylus/home";
  .li
    min-height 100px
    display flex
    align-items center
    padding 0 30px
    font-size 14px
    letter-spacing 0.16px
    color #333333
    background #fff
    border-top 1px solid #E1E1E1
    .p1
      min-width 300px
      flex-grow 1
      line-height 21px
      margin-right 20px
      >p
        min-height 22px
        line-height 22px
      .text
        color #333333
      .time
        margin-top 3px
        color #999999
    .p2
      display inline-flex
      align-items center
      width 400px
      flex-shrink 0
      .heart-wrap
        width 300px
        display inline-flex
        height 30px
        align-items center
        img
          margin-right 20px
      .judge
        line-height 30px
        margin-right:30px
    .p3
      width 120px
      display inline-flex
      flex-direction column
      align-items center
      justify-content center
      flex-shrink 0
      >img
        width 45px
        height 45px
        border-radius 50%
      >span
        line-height 20px
        margin-top 5px
        display inline-block
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
    &:first-of-type
      border-top none
</style>
