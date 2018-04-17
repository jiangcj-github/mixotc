<template>
  <div>
    <div class="li" v-for="(e,i) in rates" :key="i">
      <div class="p1">
        <p class="text">{{e.comment}}</p>
        <p class="time">{{e.date}}</p>
      </div>
      <div class="p2">
        <span class="judge">{{e.transit}}</span>
        <span class="heart-wrap">
        <img src="/static/images/evaluate_red.png" v-for="i in e.credit">
      </span>
      </div>
      <div class="p3">
        <img :src="e.icon" alt="">
        <span>{{e.name}}</span>
      </div>
    </div>
    <Pagination :total="total" :pageSize="pageSize" emitValue="changePage" style="margin-top:20px" v-if="total>0"></Pagination>
  </div>
</template>
<script>
  import Pagination from '@/components/common/Pagination';
  import WebSocketProxy from '@/api/WebSocketProxy.js';
  export default {
    props:["totalChange"],
    components: {
      Pagination,
    },
    data() {
      return {
        proxy: new WebSocketProxy(this.WebSocket),
        uid: "",

        ratesOrg:[],
        total:0,
        pageSize:1,
      }
    },
    computed:{
      rates(){
        let arr=[];
        this.ratesOrg && this.ratesOrg.forEach(function(item) {
          arr.push({
            comment: item.comment,
            date: new Date(item.date).dateHandle("yyyy/MM/dd hh:mm:ss"),
            credit: item.credit,
            transit: {1:"差评",2:"中评",3:"好评"}[item.transit],
            icon: item.icon,
            name: item.name,
          });
        });
        return arr;
      }
    },
    watch:{
      total:function(){
        this.Bus.$emit(this.totalChange, this.total);
      }
    },
    mounted() {
      this.uid= this.JsonBig.parse(this.$route.query.uid) || "";
      this.loadRates();
      this.Bus.$on('changePage',(p) => {
        this.loadRates(p);
      });
    },
    methods: {
      loadRates(p=0){
        this.proxy.send('otc','rates',{
          id:this.uid,
          origin:p
        }).then((data)=>{
          this.ratesOrg=data.rates;
          this.total=0;
          this.pageSize=data.count;
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .li
    min-height 110px
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
      .text
        color #333333
      .time
        margin-top 5px
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
        background-color #87ceeb
        border-radius 50%
      >span
        line-height 20px
        margin-top 5px
        display inline-block
</style>
