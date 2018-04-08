<template>
  <div class="li">
    <div class="p1">
      <p class="text">速度一般～～～～其实有点慢，价钱也不是很低！！！！</p>
      <p class="time">2016/03/08 23:57:03</p>
    </div>
    <div class="p2">
      <span class="heart-wrap"><span class="heart" :style="{width:150-heart*30+'px'}"></span></span>
      <span class="judge">好评</span>
    </div>
    <div class="p3">
      <img src="" alt="">
      <span>xin2378</span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        heart:3
      }
    },
    methods: {

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
    .p1
      min-width 300px
      flex-grow 1
      line-height 21px
      .text
        color #333333
      .time
        margin-top 5px
        color #999999
    .p2
      display inline-flex
      align-items center
      width 400px
      .heart-wrap
        width 150px
        display inline-block
        height 30px
        background-image url(/static/images/heart.png)
        .heart
          height 30px
          display inline-block
          background #fff
      .judge
        line-height 30px
        margin-left:30px
    .p3
      width 100px
      display inline-flex
      flex-direction column
      align-items flex-start
      justify-content center
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
