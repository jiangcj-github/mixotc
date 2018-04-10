<template>
  <li class="item clearfix">
    <div class="title merchant">
      <!-- <img class="whole" src="/static/images/whole_icon2.png" alt="" > -->
      <img class="avatar" @click="toHomePage(data.id)" :src="data.icon ? `http://192.168.113.26/image/${data.icon}` : `/static/images/default_avator.png`" alt="">
      <span class="nickname" @click="toHomePage(data.id)">{{data.trader}}</span>
      <span class="trust">信任</span>
    </div>
    <div class="title payment">
      <img src="/static/images/OTC_zhifubao.png" alt="" v-if="data.payments %2 === 1">
      <img src="/static/images/OTC_wechat.png" alt="" v-if="[3, 6, 7].includes(data.payments)">
      <img src="/static/images/OTC_Bankcard.png" alt="" v-if="[4, 5, 6, 7].includes(data.payments)">
    </div>
    <div class="title order-volume">{{data.trade ? data.trade : '-'}}</div>
    <div class="title deal-volume">1+BTC</div>
    <div class="title good-reputation">{{data.rate ? `${data.rate}%` : '-'}}</div>
    <div class="title trust-amount">{{data.trust ? data.trade : '-'}}</div>
    <div class="title amount">123.45</div>
    <div class="title limit-price">{{`${data.min}-${data.max}`}}</div>
    <div class="title price">{{data.price}}</div>
    <div class="title button">
      <router-link tag='button' :to="{ name: 'order', query: { id: this.JsonBig.stringify(data.sid) }}">购买</router-link>
    </div>
  </li>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    toHomePage(id) {
      this.$router.push({ name: 'homepage', query: { id: this.JsonBig.stringify(id) }})
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../../stylus/base.styl';
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
      width 190px
      padding-left 30px
      .whole
        position absolute
        top 20px
        left 30px
        _rotate(-45deg)
      .avatar
        position absolute
        top 21px
        left 30px
        width 45px
        height 45px
        border-radius 50%
        cursor pointer
      span
        position absolute
        left 85px
        width 90px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        cursor pointer
        &.nickname
          top 22px
          font-size 14px
          color $col333
          letter-spacing 0.16px
          line-height 15px
        &.trust
          bottom 22px
          width 30px
          height 14px
          fz10()
          text-align center
          color #FFA21C
          letter-spacing 0.11px
          line-height 14px
          border 1px solid #FFA21C
          border-radius 2px
    &.payment 
      width 110px
    &.order-volume 
      width 100px
    &.deal-volume 
      width 110px
    &.good-reputation 
      width 100px
    &.trust-amount 
      width 100px
    &.amount 
      width 110px
    &.limit-price 
      width 110px
    &.price 
      width 150px
      font-size 16px
      color $col100
      letter-spacing 0.18px
    &.button
      button
        width 100px
        height 30px
        margin-bottom 27px
        color #FFF
        background $col422
        border-radius 2px
        cursor pointer
        &:active
          background $col350
</style>