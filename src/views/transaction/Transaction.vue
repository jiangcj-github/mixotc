<template>
  <div class="transacation inner">
    <div class="header clearfix">
      <h2>购买BTC</h2>
      <p>
        <input type="text">
        <span>搜索更多币种</span>
      </p>
      <button></button>
      <ul class="clearfix">
        <li class="tuijian" style="background-color:#FF914C;color:#FFF">ETH</li>
        <li class="tuijian" style="background-color:#FFB422;color:#FFF">BTC</li>
        <li class="tuijian" style="background-color:#FFCE16;color:#FFF">ADA</li>
        <li>BAT</li>
        <li>ETH</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped lang="stylus">
@import "../../stylus/base.styl";
  .transacation
    margin-top 40px
    margin-bottom 40px
    .header
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
            border-top 5px solid $col422
            border-left 5.5px solid #FFF
            border-right 5.5px solid #FFF 
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
        width 72px
        height 30px
        margin-right 125px
        background $col422
        border-radius 0 2px 2px 0
        border 0
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
          box-shadow 0 2px 4px 0 $col1E1
          border-radius 2px
          &.tuijian::before
            position absolute
            left 10px
            top 10px
            content ''
            width 6px
            height 9px
            background url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAJCAYAAAFmnW0LAAAAAXNSR0IArs4c6QAAAHZJREFUCB1VjTEKgDAUQ3+l4KqLgtBD6F29jDh4Aq/h6KCLKNSXYgc/JE3S39RijI1BkygUZtY6VEScKRIpZpQziygvpQuZkJTZ9VuTOUAB/m/U2TuGc1bBjfBfST4ebSkcQfdB2uf/d8wKNAOoc0WF2UAJpO0FXoZRzv5wsvkAAAAASUVORK5CYII=') no-repeat



</style>
