<template>
  <div class="nothing-wrap">
    <div>
      <img src="/static/images/no_order.png">
    </div>
    <p>还没有订单，<router-link to="/transaction">去交易</router-link></p>
  </div>
</template>

<script>
  export default {
    name: "my-order-nothing"
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .nothing-wrap
    background #FFF
    height 509px
    margin -10px 0 44px
    text-align center
    overflow hidden
    div
      width 140px
      height 140px
      margin 100px auto 30px
      background rgba(216,216,216,0.69)
    p
      color #909090
      a
        color #FFB422
</style>
