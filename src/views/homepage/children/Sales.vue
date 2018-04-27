<template>
  <!--发布列表-->
  <div>
    <div class="filter">
      <a href="javascript:void(0)" class="drop-down" @click="fltTypeShow=!fltTypeShow" @blur="fltTypeShow=false">
        <span>{{fltTypes[fltTypeSel].text}}</span>
        <ul class="drop" v-show="fltTypeShow">
          <li v-for="(e,i) in fltTypes" :key="i" @click="fltTypeSel=i">{{e.text}}</li>
        </ul>
      </a>
      <a href="javascript:void(0)" class="drop-down" @click="fltCoinShow=!fltCoinShow" @blur="fltCoinShow=false">
        <span>{{fltCoins[fltCoinSel].text}}</span>
        <ul class="drop" v-show="fltCoinShow">
          <li v-for="(e,i) in fltCoins" :key="i" @click="fltCoinSel=i">{{e.text}}</li>
        </ul>
      </a>
    </div>
    <ul class="head">
      <li class="time"></li>
      <li class="type">广告类型</li>
      <li class="coin">币种</li>
      <li class="price">报价</li>
      <li class="limit">订单限额</li>
      <li class="pay-method">支付方式</li>
      <li class="pay-time">订单期限</li>
      <li class="operation">操作</li>
    </ul>
    <div class="li" v-for="(e,i) in sales" :key="i">
      <div class="booth">
        <span class="time">{{e.create}}</span>
        <span class="type">{{e.type}}</span>
        <span class="coin">{{e.currency}}</span>
        <span class="price">{{e.price}}</span>
        <span class="limit">{{e.minmax}}</span>
        <span class="pay-method">
            <img src="/static/images/OTC_zhifubao.png" alt="" v-if="e.pays %2 === 1">
            <img src="/static/images/OTC_wechat.png" alt="" v-if="[3, 6, 7].includes(e.pays)">
            <img src="/static/images/OTC_Bankcard.png" alt="" v-if="[4, 5, 6, 7].includes(e.pays)">
          </span>
        <span class="pay-time">{{e.dead}}</span>
        <span class="operation">
             <router-link class="buy-to" :to="'/transaction/order?id='+e.id" tag="span" v-if="e.type==='出售'"><i>向他购买</i></router-link>
             <span class="buy-to" v-else-if="e.type==='购买'"><i>向他出售</i></span>
          </span>
      </div>
      <div class="division"></div>
      <div class="remark">备注：{{e.info}}</div>
    </div>
    <div class="empty" v-if="sales.length<=0">没有发布信息</div>
    <Pagination :total="total" :pageSize="pageSize" emitValue="changePage" v-show="total>pageSize"></Pagination>
  </div>
</template>
<script>
  import Pagination from '@/components/common/Pagination';
  export default {
    components: {
      Pagination,
    },
    data() {
      return {
        uid: "",

        sales:[],
        total:0,
        pageSize:1,

        fltTypes:[
          {text:"全部广告",value:null},
          {text:"购买",value:0},
          {text:"出售",value:1},
        ],
        fltTypeSel: 0,
        fltTypeShow: false,

        fltCoins:[
          {text:"全部币种",value:null},
          {text:"BTC",value:"btc"},
          {text:"ETH",value:"eth"},
          {text:"LTC",value:"ltc"},
          {text:"其他",value:"other"},
        ],
        fltCoinSel: 0,
        fltCoinShow: false,
      }
    },
    computed:{
      fltType(){
        return this.fltTypes[this.fltTypeSel].value;
      },
      fltCoin(){
        return this.fltCoins[this.fltCoinSel].value;
      },
    },
    mounted() {
      this.uid= this.JsonBig.parse(this.$route.query.uid) || "";
      this.loadSales();
      this.Bus.$on('changePage',(p) => {
        this.loadSales(p);
      });
    },
    watch:{
      fltTypeSel:function () {
        this.loadSales();
      },
      fltCoinSel:function () {
        this.loadSales();
      }
    },
    methods: {
      loadSales(p=0){
        this.WsProxy.send('otc','his_sales',{
          id: this.uid,origin: 0,type: this.fltType,currency: this.fltCoin
        }).then((data)=>{
          this.parseSales(data.sales);
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      parseSales(data){
        this.sales=[];
        data && data.forEach((item)=>{
          this.sales.push({
            create: new Date(item.create).dateHandle("yyyy/MM/dd hh:mm:ss"),
            type: {1:"购买",2:"出售"}[item.type+""],
            currency: item.currency.toUpperCase(),
            price: {"CNY":"¥"}[item.money.toUpperCase()]+" "+item.price,
            minmax: item.min+"~"+item.max,
            pays: item.payments,
            dead: item.limit+"min",
            info: item.info,
            id:item.id,
          });
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
    .head
      height 50px
      line-height 50px
      font-size 13px
      letter-spacing 0.27px
      padding 0 30px
      >li
        display inline-block
        color #999
    .filter
      margin-top 1px
      height 50px
      background-color #FFF
      padding-left 30px
      >a
        display inline-block
        line-height 50px
        font-size 13px
        letter-spacing 0.27px
        width 65px
        text-align center
        &.drop-down
          position relative
          margin-right 45px
          cursor pointer
          &::after
            content ''
            display block
            width 0
            height 0
            border-top 5px solid #333333
            border-left 5px solid transparent
            border-right 5px solid transparent
            position absolute
            right -15px
            top 50%
            margin-top -3px
          &:hover .drop
            display block
          .drop
            position absolute
            top 40px
            left 0
            background #FFFFFF
            border 1px solid #E1E1E1
            width 80px
            z-index 1000
            >li
              float none
              text-align center
              height 30px
              line-height 30px
              &:hover
                background #FFF3EB
    .time
      width 200px
    .type
      width 100px
    .coin
      width 100px
    .price
      width 100px
    .limit
      width 200px
    .pay-method
      width 150px
    .pay-time
      width 100px
    .operation
      width 150px
    .li
      padding 20px 30px 0 30px
      background #fff
      border 1px solid #E1E1E1
      margin-bottom 10px
      span
        display inline-block
      .booth
        font-size 13px
        color #333333
        letter-spacing 0.27px
        height 67px
        line-height 67px
        .type
          color #57A100
        .pay-method img
          vertical-align -4px
        .operation .buy-to
          width 100px
          height 25px
          line-height 25px
          background #FFB422
          border 1px solid #FFB422
          border-radius 2px
          font-size 13px
          color #FFFFFF
          letter-spacing 0.27px
          text-align center
          cursor pointer
          &:hover
            background-color #fea350
      .division
        height 1px
        background: #E1E1E1;
      .remark
        height 50px
        line-height 50px
        font-size 13px
        color #999999
        letter-spacing 0.23px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
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
