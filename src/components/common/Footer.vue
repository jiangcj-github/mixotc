<template>
  <div class="wrap">
    <div class="faq" v-if="['/', '/transaction'].includes($route.path)">
      <div class="inner clearfix">
        <h2>常见问题</h2>
        <ul>
          <li><router-link :to="{path: '/helpcenter', query: {source: 2}}">如何购买数字币</router-link></li>
          <li><router-link :to="{path: '/helpcenter', query: {source: 3}}">如何出售数字币</router-link></li>
          <li><router-link :to="{path: '/helpcenter', query: {source: 1}}">费率说明</router-link></li>
        </ul>
        <img src="/static/images/question.png" alt="">
      </div>
    </div>
    <div class="footer">
      <article class="footer-wrapper">
        <section class="foot-left">
          <img src="/static/images/footlogo2.png" alt="">
          <span>support@mixotc.com</span>
        </section>
        <section class="foot-mid">
          <ul class="mid-up">
            <!--<li>关于我们</li>-->
            <li><router-link :to="{path: '/helpcenter', query: {source: 4}}">用户协议</router-link></li>
            <li><router-link :to="{path: '/helpcenter', query: {source: 5}}">隐私政策</router-link></li>
            <li><router-link :to="{path: '/coinData'}">币种资料</router-link></li>
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
        a
          color $col999
          &:hover
            color #FFF
  .faq
    position relative
    height 200px
    background-color #FFF
    .inner
      position relative
    h2
      float left
      height 30px
      margin-top 15px
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
    ul
      height 141px
      padding-top 59px
      margin-left 389px
      font-size $fz14
      color $col333
      letter-spacing 0.16px
      li
        position relative
        margin-bottom 20px
        line-height 14px
        a
          cursor pointer
          color $col333
          &:hover
            color $col422
          &:active
            color $col350
        &::before
          position absolute
          top 0
          left -34px
          width 14px
          height 14px
          content ''
          border-radius 50%
          background $col422
        &::after
          position absolute
          top 4px
          left -31px
          width 5px
          height 5px
          content ''
          transform rotate(-45deg)
          -ms-transform rotate(-45deg) 	/* IE 9 */
          -moz-transform rotate(-45deg) 	/* Firefox */
          -webkit-transform rotate(-45deg) /* Safari 和 Chrome */
          -o-transform rotate(-45deg) 	/* Opera */
          border 1px solid #FFF
          border-left 0
          border-top 0
    img
      position absolute
      left 650px
      top 35px

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
        margin-right 210px
        float left
        img
          width 160px
          height 35px
        span
          position relative
          top -5px
          display inline-block
          margin-top -3px
          padding-left 40px
          font-size 12px
          letter-spacing 0.23px
          color #FFF

      .foot-mid
        flex 1
        width: 408px

        .mid-up
          margin-bottom 41px
          margin-left 45px //后期可删
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
            margin-right 10px
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
          width 60px
          height 60px

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
