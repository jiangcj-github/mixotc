<template>
  <li class="item clearfix">
    <div class="merchant">
      <img src="" alt="">
      <span class="nickname">xin2378</span>
      <span class="trust">信任</span>
    </div>
    <div class="payment">
      <img src="/static/images/OTC_zhifubao.png" alt="">
      <img src="/static/images/OTC_wechat.png" alt="">
      <img src="/static/images/OTC_Bankcard.png" alt="">
    </div>
    <div class="order-volume">178</div>
    <div class="deal-volume">1.00+BTC</div>
    <div class="good-reputation">100%</div>
    <div class="trust-amount">150</div>
    <div class="amount">123.45</div>
    <div class="limit-price">200-100000</div>
    <div class="price">70000.0</div>
    <div class="button">
      <button>
        购买
      </button>
    </div>
  </li>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus">
@import '../../../stylus/base.styl';
.item
  div
    position relative
    float left
    height 85px
    font-size 14px
    color $col333
    letter-spacing 0.16px
    line-height 85px
    &.merchant 
      width 160px
      padding-left 30px
      img
        position absolute
        top 21px
        left 30px
        width 45px
        height 45px
        background-color skyblue
        border-radius 50%
      span
        position absolute
        left 85px
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