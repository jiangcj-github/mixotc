<template>
  <li class="item clearfix">
    <div class="title merchant">
      <p class="avatar">
        <img class="largeTran" v-if="data.isLargeTran" src="/static/images/whole_icon2.png" title="已大额认证">
        <img class="headimg" @click="toHomePage(data.sid)" :src="data.headimg" alt="">
      </p>
      <p class="userInfo">
        <span class="nickname" @click="toHomePage(data.sid)">{{data.nickname}}</span>
        <span class="tag">
          <i class="trust" v-if="trustArray.includes(JsonBig.stringify(data.sid))" title="已信任">信任</i>
        </span>
      </p>
    </div>
    <div class="title deal-volume">{{data.dealVolume}}</div>
    <div class="title order-volume">{{data.orderVolume}}</div>
    <div class="title good-reputation">{{data.rate}}</div>
    <div class="title limit-price">{{data.priceMin}}-{{data.priceMax}}</div>
    <div class="title payment">
      <img src="/static/images/OTC_zhifubao.png" alt="" v-if="data.pay_zfb">
      <img src="/static/images/OTC_wechat.png" alt="" v-if="data.pay_wx">
      <img src="/static/images/OTC_Bankcard.png" alt="" v-if="data.pay_yhk">
    </div>
    <div class="title amount">{{data.amount}}</div>
    <div class="title price">{{data.price}}</div>
    <div class="title button">
      <button @click.stop="_toOrder(data)">购买</button>
    </div>
  </li>
</template>

<script>
import beforeOrder from "../js/beforeOrder.js";
export default {
  props: ['data','onOrderFail','trustArray'],
  methods: {
    toHomePage(sid) {
      this.$router.push({ name: 'homepage', query: { uid: this.JsonBig.stringify(sid) }})
    },
    _toOrder(data){
      let res=beforeOrder({
        ws: this.WsProxy,
        id :data.id,
        sid :data.sid,
        currency: data.currency,
        loginUid: this.$store.state.userInfo.uid,
        isLogin: this.$store.state.isLogin,
        isVerify: this.$store.state.userInfo.verify,
      });
      if(!res){
        this.$router.push({ name: 'order', query: { id: data.id}})
      }else if(res==="未登录") {
        this.$store.commit({type: 'changeLoginForm', data: true});
      }else{
        this.Bus.$emit(this.onOrderFail,res);
      }
    },
  },
};
</script>

<style scoped lang="stylus">
@import '../../../stylus/base.styl';
@import "../stylus/transaction"
.item
  div
    position relative
    float left
    overflow hidden
    height 85px
    font-size 14px
    color $col333
    letter-spacing 0.16px
    line-height 85px
    &.title
      box-sizing()
      padding-right 10px
      white-space nowrap
      text-overflow ellipsis
    &.merchant
      width 200px
      padding-left 30px
    &.payment
      width 120px
    &.order-volume
      width 110px
    &.deal-volume
      width 120px
    &.good-reputation
      width 110px
    &.amount
      width 140px
    &.limit-price
      width 140px
    &.price
      width 130px
      font-size 16px
      color $col100
      letter-spacing 0.18px
    &.button
      button
        width 100px
        height 30px
        font-size $fz14
        margin-bottom 27px
        color #FFF
        background $col422
        border-radius 2px
        cursor pointer
        &:hover
          background $col350
</style>
