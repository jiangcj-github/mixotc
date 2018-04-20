<template>
  <div class="coin-data inner">
    <h1>
      <router-link to="/transaction">mixOTC</router-link> -
      <router-link to="">币种资料</router-link> -
      <span>BTC</span>
    </h1>
    <div class="search-box">
      <p><input type="text"><span></span></p>
      <ul v-show="false"><li></li></ul>
    </div>
    <div></div>
  </div>
</template>

<script>
  export default {
    name: "coin-data"
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .coin-data
    margin-top 40px
    margin-bottom 40px
    h1
      font-size $fz20
      font-weight bold
      color $col333
      margin-bottom 30px
      &:before
        display inline-block
        width 3px
        height 20px
        position relative
        top 2px
        left 0
        content ''
        margin-right 9px
        background-color $col422

</style>
