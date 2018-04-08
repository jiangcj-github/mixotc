<template>
  <div class="header clearfix">
    <h2>购买BTC</h2>
    <p>
      <input type="text">
      <span>搜索更多币种</span>
    </p>
    <button>
      <img src="/static/images/search_icon.png" alt="">
    </button>
    <ul class="clearfix">
      <li class="tuijian" style="background-color:#FF914C;color:#FFF">ETH</li>
      <li class="tuijian" style="background-color:#FFB422;color:#FFF">BTC</li>
      <li class="tuijian" style="background-color:#FFCE16;color:#FFF">ADA</li>
      <li>BAT</li>
      <li>ETH</li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus">
@import "../../../stylus/base.styl";
    .header
      margin-bottom 40px
      h2
        float left
        height 30px
        margin-right 40px
        line-height 30px
        letter-spacing 0.23px
        font-size $fz20
        font-weight bold
        color $col333
        &::before
          position relative
          top 2px
          left 0
          display inline-block
          content ''
          width 3px
          height 20px
          margin-right 10px
          background-color $col422
      p
        height 30px
        float left
        position relative
        span
          position absolute
          left 10px
          top 0
          padding-right 16px
          line-height 30px
          font-size 13px
          color #999
          letter-spacing 0
          &::after
            position absolute
            top 13px
            right 0
            content ''
            triangle_down($col422)
        input
          box-sizing() 
          width 354px
          height 30px
          padding-left 110px
          background $colFFF
          border 1px solid $col422
          border-radius 2px 0 0 0
          &:focus
            outline 0 
      button
        position relative
        width 72px
        height 30px
        margin-right 125px
        background $col422
        border-radius 0 2px 2px 0
        border 0
        cursor pointer
        &:active
          background $col350
        img
          position absolute
          top 50%
          left 50%
          margin -8px 0 0 -8px
          width 16px
          height 16px
      ul
        display inline-block
        li
          position relative
          float left
          width 80px
          height 30px
          margin-right 21px
          text-align center
          line-height 30px
          font-size 13px
          color $col422
          letter-spacing 0.15px
          background-color #FFF
          box-shadow 0 2px 4px 0 $col1E1
          border-radius 2px
          cursor pointer
          &.tuijian::before
            position absolute
            left 10px
            top 10px
            content ''
            width 6px
            height 9px
            background url('/static/images/recommend_.png') no-repeat
</style>