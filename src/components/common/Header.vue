<template>
  <article class="header">
    <section class="upper">
      <div class="wrapper">
        <ul class="upper-left">
          <li><span>BitFunex:&nbsp</span><span class="yellow">$9.244.70↑</span></li>
          <li><span>Kraken:&nbsp</span><span class="grean">€7.468.30↑</span></li>
          <li><span>Bithumb:&nbsp</span><span class="grean">₩10.186.000.00↑</span></li>
          <li><span>Bitflyer:&nbsp</span><span class="grean">&yen995.759.00↑</span></li>
        </ul>
        <ul class="upper-right">
          <li><span>简体中文<div class="select-tri white"></div></span></li>
          <li><a href="">币种资料</a></li>
          <li><a href="">帮助</a></li>
          <li><a href="">大额交易申请</a></li>
        </ul>
      </div>
    </section>
    <section class="down">
      <div class="wrapper">
        <ul class="down-tag">
          <li><a href="/"><img class="top-logo" src="../../../static/img/toplogo.png" alt="MIXOTC官网"></a></li>
          <li><a href="">交易中心</a></li>
          <li><a href="">广告</a></li>
          <li><a href="">订单</a></li>
          <li><a href="">钱包</a></li>
          <li><img class="top-logo" src="../../../static/img/phoneicon.png" alt=""></li>
        </ul>
        <div class="user-info">
          <img src="../../../static/img/OTC_wechat@3x.png" alt="">
          <span class="user-name">
            zhaocx/185***555
            <div class="select-tri black"></div>
          </span>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
  export default {}
</script>

<style scoped lang="stylus">
  .wrapper
    display flex
    flex-direction row
    align-items center
    margin 0 auto
    height 100%
    width 1200px
    font-size 13px

  .select-tri
    display inline-block
    width 0
    height 0
    border-right 5px solid transparent
    border-left 5px solid transparent

  .top-logo
    margin-top 22px

  .header
    height 100px
    background-color #fff

    .upper
      height 30px
      background-color #333

      .upper-left
        flex 1

        li
          margin-right 40px
          float left
          text-align center
          vertical-align middle
          line-height 30px

          span
            color #fff

          .grean
            color #57a100

          .yellow
            color #ff794c

      .upper-right
        float right

        li
          margin-left 30px
          float right
          text-align center
          vertical-align middle
          line-height 30px

          a, span
            color #fff

            .white
              margin-left 3px
              line-height 30px
              border-top 5px solid #fff


    .down
      height 70px
      border 1px solid #E1E1E1

      .down-tag
        flex 1
        font-size 14px

        li
          margin-right 60px
          float left
          text-align center
          vertical-align middle
          line-height 70px

      .user-info
        display flex
        width 180px
        height 45px
        line-height 45px
        text-align center
        vertical-align middle

        img
          width: 35px
          height: 35px
          margin 5px 5px 0 0
          border-radius 50%

        .user-name
          font-size 14px

          .black
            margin-left 5px
            margin-bottom 4px
            border-top 5px solid #000
</style>
