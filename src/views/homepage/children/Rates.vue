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
    <div class="empty" v-if="rates.length<=0">没有评价信息</div>
    <Pagination :total="total" :pageSize="pageSize" emitValue="changePage" style="margin-top:20px" v-if="total>pageSize"></Pagination>
  </div>
</template>
<script>
  import Pagination from '@/components/common/Pagination';
  export default {
    props:{
      onRatesTotalChange:{type: String ,default: "onRatesTotalChange"}
    },
    components: {
      Pagination,
    },
    data() {
      return {
        uid: "",

        ratesOrg:[],
        total:0,
        pageSize:1,
      }
    },
    computed:{
      rates(){
        let arr=[];
        let _this=this;
        this.ratesOrg && this.ratesOrg.forEach(function(item) {
          arr.push({
            comment: item.comment,
            date: new Date(item.date).dateHandle("yyyy/MM/dd hh:mm:ss"),
            credit: item.credit,
            transit: {1:"差评",2:"中评",3:"好评"}[item.transit],
            icon: _this.HostUrl.http+"image/"+item.icon,
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
        this.WsProxy.send('otc','rates',{
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
    },
    destroyed(){
      this.Bus.$off('changePage');
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
    &:first-of-type
      border-top none
  .empty
    background-color #fff
    box-sizing border-box
    background-repeat no-repeat
    background-image url(/static/images/rectangle.png)
    background-size 140px 140px
    background-position center 30px
    padding-top 170px
    height 250px
    text-align center
    color #999
</style>
