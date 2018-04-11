<template>
  <div>
    <div class="news-wrap clearfix" @click="openBox">
      <div class="chat">
        <img src="/static/images/talk_icon.png" alt="">
        <i></i>
      </div>
      <!--<img src="/static/images/news.png">-->
      <p v-show="haveNews">您有<span>1</span>条新消息</p>
    </div>
    <NewsInfo :talkBoxShow="showTalkBox" @click="openBox"></NewsInfo>
  </div>

</template>

<script>
  import NewsInfo from '@/views/news/NewsInfo'

  export default {
    name: "news",
    data() {
      return {
        showTalkBox: false,
        haveNews: false
      }
    },
    components: {
      NewsInfo
    },
    computed: {

    },
    methods: {
      openBox(st) {
        this.$store.commit({'type':'changeChatBox', data: true})
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .news-wrap
    position fixed
    right 40px
    bottom 200px
    cursor pointer
    -webkit-box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
    box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
    .chat
      position:relative
      float right
      width:65px
      height:45px
      background linear-gradient(142deg, #FFBE00 0%, #FF5D21 100%);
      border-radius 2px
      text-align center
      img
        width 22px
        height 20px
        margin-top 13px
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
