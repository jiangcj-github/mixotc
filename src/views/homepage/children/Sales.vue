<template>
  <div>
    <!--过滤条件-->
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
    <!--表头-->
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
    <!--条件渲染-->
    <div v-if="err===0">
      <!--列表项-->
      <div class="li" v-for="(e,i) in sales" :key="i">
        <div class="booth">
          <span class="time">{{e.create}}</span>
          <span class="type" :class="{buy:e.isBuy}">{{e.type}}</span>
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
          <span class="buy-to" @click="toOrder(e)" v-if="!e.isBuy"><i>向他购买</i></span>
          <span class="buy-to" @click="toOrder(e)"  v-else><i>向他出售</i></span>
        </span>
        </div>
        <div class="division"></div>
        <div class="remark">备注：{{e.info}}</div>
      </div>
    </div>
    <div class="err no-result" v-else-if="err===1">无相应的数据</div>
    <div class="err load-failed" v-else-if="err===2">网络异常</div>
    <div class="err net-error" v-else-if="err===3">加载失败</div>
    <div class="err loading" v-else-if="err===4">数据加载中...</div>
    <div class="err empty" v-else>没有评价数据</div>
    <!--提醒框-->
    <Alert ref="alert"></Alert>
  </div>
</template>
<script>
  import beforeOrder from "@/views/transaction/js/beforeOrder.js";
  import Alert from "../../common/widget/Alert";
  export default {
    components: {
      Alert,
    },
    data() {
      return {
        uid: 0,           // 用户ID

        sales:[],         // 广告列表
        err: -1,          // 广告列表请求状态

        fltTypes:[                          // 广告类型过滤下拉列表
          {text:"全部广告",value:''},
          {text:"购买",value:2},
          {text:"出售",value:1},
        ],
        fltTypeSel: 0,                     // 选中项
        fltTypeShow: false,               // 是否显示广告类型下拉列表

        fltCoins:[                          // 币种过滤下拉列表
          {text:"全部币种",value:''},
          {text:"BTC",value:"btc"},
          {text:"ETH",value:"eth"},
          {text:"LTC",value:"ltc"},
          {text:"其他",value:"other"},
        ],
        fltCoinSel: 0,                      // 选中项
        fltCoinShow: false,                // 是否显示币种下拉列表
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
      this.uid= this.JsonBig.parse(this.$route.query.uid) || 0;
      this.loadSales();
    },
    watch:{
      fltTypeSel:function () {
        this.loadSales();
      },
      fltCoinSel:function () {
        this.loadSales();
      },
    },
    methods: {
      loadSales(){
        /*
        this.WsProxy.send('otc','his_sales',{
          id: this.uid,origin:0,type:this.fltType,currency: this.fltCoin
        }).then((data)=>{
          if(!data||!data.sales||data.sales.length<=0){
            this.err=1;
          }else{
            this.err=0;
            this.Bus.$emit("onSaleTotalUpdate",data.sales.length);
            this.parseSales(data.sales);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
        */
        this.Proxy.hp_sales({
          uid: this.uid,origin:0,type:this.fltType,currency: this.fltCoin
        }).then((data)=>{
          if(!data.data||!data.data.sales||data.data.sales.length<=0){
            this.err=1;
          }else{
            this.err=0;
            this.Bus.$emit("onSaleTotalUpdate",data.data.sales.length);
            this.parseSales(data.data.sales);
          }
        }).catch((msg)=>{
          if(!msg){
            this.err=2; //网络异常
          }else if(msg.ret!==0){
            this.err=3; //加载异常
          }
        });
      },
      parseSales(data){
        this.sales=[];
        data && data.forEach((item)=>{
          this.sales.push({
            create: new Date(item.create*1000).dateHandle("yyyy/MM/dd hh:mm:ss"),
            type: {2:"购买",1:"出售"}[item.type+""],
            isBuy:{2:true,1:false}[item.type+""],
            currency: item.currency.toUpperCase(),
            price: {"CNY":"¥"}[item.money.toUpperCase()]+" "+item.price,
            minmax: item.min+"~"+item.max,
            pays: item.payments,
            dead: item.limit+"min",
            info: item.info || "无",
            id:item.id,
          });
        });
      },
      toOrder(e){
        beforeOrder(this,{
          id : e.id,
          sid : this.uid,
          currency: e.currency,
        }).then(()=>{
          this.$router.push({ name: 'order', query: { id:e.id}})
        }).catch((res)=>{
          this.$refs.alert.showAlert({content:res});
        });
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  @import "../stylus/home";
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
    padding 0 30px
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
        &.buy
          color #d66c49
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
        &.disabled
          background-color #999
          border-color #999
          pointer-events none
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
</style>
