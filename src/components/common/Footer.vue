<template>
  <div class="footer">
    <article class="footer-wrapper">
      <section class="foot-left">
        <img src="/static/images/footlogo.png" alt="">
      </section>
      <section class="foot-mid">
        <ul class="mid-up">
          <li>关于我们</li>
          <li>用户协议</li>
          <li>隐私政策</li>
          <li>币种资料</li>
        </ul>
        <ul class="mid-down">
          <li class="down-left">市场有风险，投资需谨慎</li>
          <li>网站备案信息</li>
        </ul>
      </section>
      <section class="foot-right">
        <img src="/static/images/QRcode.png" alt="">
        <span class="right-up">微信客服</span>
        <span class="right-down">工作时间：10:00-22:00 (周一至周五)</span>
      </section>
    </article>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped lang="stylus">
@import "../../stylus/base.styl";

  .foot-mid
    ul
      li
        float left
        margin-right 40px
        color $col999

  .footer
    height: 100px
    background-color: $col333

    .footer-wrapper
      display flex
      flex-direction row
      align-items center
      margin 0 auto
      height 100%
      width 1200px
      font-size 13px

      .foot-left
        margin-right 250px
        float left

      .foot-mid
        flex 1
        width: 408px

        .mid-up
          margin-bottom 41px

          li
            font-size 14px
            letter-spacing 0.5px
            cursor pointer

        .mid-down
          margin-left 54px
          width: 301px

          li
            fz11()
            line-height 12px
            height 12px

          .down-left
            margin-right 20px
            padding-right 20px
            color $col94C
            letter-spacing 0.23px
            border-right 1px solid $col999


      .foot-right
        width: 270px
        float right
        margin-right 48px

        img
          float left

        span
          display inline-block
          color $col999

        .right-up
          margin-top 10px
          margin-left 11px
          font-size 14px
          letter-spacing 0.5px

        .right-down
          margin-top 10px
          margin-left 11px
          fz11()
</style>
