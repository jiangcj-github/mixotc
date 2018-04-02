<template>
  <div class="footer">
    <article class="footer-wrapper">
      <section class="foot-left">
        <img :src="require(`@/assets/images/footlogo.png`)" alt="">
      </section>
      <section class="foot-mid">
        <ul class="mid-up">
          <a href=""><li>关于我们</li></a>
          <a href=""><li>用户协议</li></a>
          <a href=""><li>隐私政策</li></a>
          <a href=""><li>帮助中心</li></a>
        </ul>
        <ul class="mid-down">
          <li class="down-left">市场有风险，投资需谨慎</li>
          <li>网站备案信息</li>
        </ul>
      </section>
      <section class="foot-right">
        <img :src="require(`@/assets/images/QRcode.png`)" alt="">
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
  .foot-mid
    ul
      li
        float left
        margin-right 40px
        color #999

  .footer
    height: 100px
    background-color: #333

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


        .mid-down
          margin-left 54px
          width: 301px

          li
            font-size 11px

          .down-left
            margin-right 20px
            padding-right 20px
            border-right 1px solid #999


      .foot-right
        width: 270px
        float right
        margin-right 48px

        img
          float left

        span
          display inline-block
          color #999

        .right-up
          margin-top 10px
          margin-left 11px
          font-size 14px
          letter-spacing 0.5px

        .right-down
          margin-top 10px
          margin-left 11px
          font-size 12px
          -webkit-transform-origin-x 0
          -webkit-transform scale(0.916666666)
</style>
