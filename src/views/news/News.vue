<template>
  <div class="news-wrap clearfix">
    <div class="chat">
      <img src="" alt="">
      <i></i>
    </div>
    <!--<img src="/static/images/news.png">-->
    <p>您有<span>1</span>条新消息</p>
  </div>
</template>

<script>
  export default {
    name: "news"
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .news-wrap
    position fixed
    right 40px
    bottom 200px

    -webkit-box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
    box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
    .chat
      position:relative
      float right
      width:65px
      height:45px
      background linear-gradient(142deg, #FFBE00 0%, #FF5D21 100%);
      border-radius 2px
      i
        position:absolute
        top:44px
        left:25px
        display:block
        border-width:8px
        border-style solid dashed dashed;
        border-color: #FF5D21 transparent transparent
        font-size:0
        line-height:0
    p
      position relative
      z-index 10
      float left
      width 145px
      height 45px
      margin-right -2px
      line-height 45px
      background #FFF
      text-align center
      letter-spacing 0.29px
      span
        color #FFB422
</style>
