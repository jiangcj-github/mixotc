<template>
  <div class="nothing-wrap">
    <div>
      <img src="/static/images/no_order.png">
    </div>
    <p>您暂时没有广告，<router-link to="/advertisement/release">去发布</router-link></p>
  </div>
</template>

<script>
  export default {
    name: "ad-nothing"
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .nothing-wrap
    background #FFF
    height 570px
    text-align center
    overflow hidden
    div
      width 140px
      height 140px
      margin 100px auto 30px
    /*background rgba(216,216,216,0.69)*/
    p
      color #909090
      a
        color #FFB422
</style>
