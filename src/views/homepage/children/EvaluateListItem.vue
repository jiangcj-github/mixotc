<template>
  <div class="li">
    <div class="p1">
      <p class="text">速度一般～～～～其实有点慢，价钱也不是很低！！！！</p>
      <p class="time">2016/03/08 23:57:03</p>
    </div>
    <div class="p2">
      <span class="judge">好评</span>
      <span class="heart-wrap">
        <img src="/static/images/evaluate_red.png" v-for="i in hearts">
      </span>
    </div>
    <div class="p3">
      <img src="" alt="">
      <span>xin2378</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      text:{type:String, default:''},
      time:{type:String, default:"2018/04/08 23:57:03"},
      judge:{type:String, default:"好评"},
      hearts:{type:Number, default:5},
    },
    data() {
      return {}
    },
    methods: {}
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
</style>
