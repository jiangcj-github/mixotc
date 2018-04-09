<template>
  <div class="news-info-wrap" v-show="boxShow">
    <div class="news-info-top clearfix">
      <div>
        <input type="text" placeholder="查找昵称／账号"/>
        <img src="/static/images/search_icon.png"/>
      </div>
      <div>
        <span>lihh/130***123</span>
        <img src="/static/images/add_talk.png" class="add-talk-img" @click="showSeletAdd">
        <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeTalk">
      </div>
      <div v-show="seletAdd">
        <i></i>
        <ul>
          <li @click="openAddFriend">+好友</li>
          <li>+信任</li>
          <li>+建群</li>
        </ul>
      </div>
    </div>
    <div class="news-info-content clearfix">
      <ul>
        <li>
          <img src="">
          <span>lihh/130***123</span>
          <img src="">
        </li>
      </ul>
      <div></div>
    </div>
    <div class="news-info-bottom clearfix">
      <p>
        <img src="/static/images/notice_icon.png">
        <img src="/static/images/service_icon.png" class="service-img">
        <img src="/static/images/phoneicon.png" class="phone-img">
      </p>
      <ol class="clearfix">
        <li>
          <input type="text">
        </li>
        <li>
          <img src="/static/images/picture_icon.png">
          <span>图片</span>
        </li>
        <li>
          <img src="/static/images/address_icon.png">
          <span>收款地址</span>
        </li>
      </ol>
    </div>
    <!-- 添加好友弹窗 -->
    <AddFriend :addFriendShow="showAddFriend" @offAddFriend="openAddFriend"></AddFriend>
  </div>
</template>

<script>
  import AddFriend from '@/views/news/AddFriend'

  export default {
    name: "news-info",
    props:['talkBoxShow'],
    data() {
      return {
        boxShow: this.talkBoxShow,
        seletAdd: false,
        showAddFriend: false
      }
    },
    components: {
      AddFriend
    },
    watch: {
      talkBoxShow(state) {
        if (state === true ) {
          this.boxShow = true
        } else  {
          this.boxShow = false
        }
      }
    },
    methods: {
      closeTalk() {
        this.$emit('offTalk', 'false')
      },
      showSeletAdd() {
        this.seletAdd = !this.seletAdd
      },
      openAddFriend(st) {
        if (st === 'false') {
          this.showAddFriend = false
        } else {
          this.showAddFriend = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .news-info-wrap
    box-sizing border-box
    position fixed
    bottom 100px
    right 0
    width 560px
    height  420px
    background #FFF
    -webkit-box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
    box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)

    .news-info-top
      position relative
      height 40px
      border-bottom 1px solid #E1E1E1
      div:first-child
        position relative
        float left
        width 160px
        border-right 1px solid #E1E1E1
        text-align center
        line-height 40px
        input
          width 140px
          height 30px
          padding-left 10px
          background #F4F6FA
          border-radius 2px 2px 2px 0
        img
          position absolute
          top 12px
          right 15px
          width 18px
          height 18px
      div:nth-child(2)
        float left
        line-height 40px
        span
          margin-left 20px
          letter-spacing 0.16px
        img
          vertical-align middle
          cursor pointer
        .add-talk-img
          width 15px
          height:15px
          margin-left 196px
        .close-btn-img
          width 10px
          height:10px
          margin-left 22px
      div:nth-child(3)
        position absolute
        top 40px
        right 0
        width 80px
        background #333
        border-radius 2px
        i
          position absolute
          top -10px
          left 7px
          display block
          border-width 5px 3px
          border-style solid dashed dashed
          border-color transparent transparent #333
          font-size 0
          line-height 0
        ul
          li
            position relative
            height 25px
            padding-left 34px
            line-height 25px
            font-size 12px
            color #FFF
            cursor pointer
          li:hover
            background #474747
          li:nth-child(1):before
            position absolute
            top 6px
            left 10px
            width 13px
            height 13px
            background url("/static/images/add_friend.png")
            background-size 13px 13px
            content ''
          li:nth-child(2):before
            position absolute
            top 6px
            left 10px
            width 12px
            height 13px
            background url("/static/images/trust.png")
            background-size 12px 13px
            content ''
          li:nth-child(3):before
            position absolute
            top 6px
            left 10px
            width 13px
            height 14px
            background url("/static/images/creat_group.png")
            background-size 13px 14px
            content ''

    .news-info-content
      height 335px
      background #F4F6FA
      ul
        float left
        width 157px
        height 330px
        background #FFF
      div
        float right
        width 399px
        height 335px
        border-left 1px solid #E1E1E1

    .news-info-bottom
      border-top  1px solid #E1E1E1
      -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
      box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
      p
        float left
        width 140px
        padding 8px 0 6px
        padding-left 20px
        border-right 1px solid #E1E1E1
        img
          width 30px
          height 30px
          vertical-align middle
        .service-img
          margin 0 20px
        .phone-img
          width 16px
          height 24px
      ol
        float left
        margin-left 5px
        padding 5px 0
        li
          float left
          text-align center
          span
            display block
            margin-top -3px
            color #999
            letter-spacing 0.09px
            transform scale(0.55)
        li:nth-child(1)
          margin-right 15px
          input
            width 284px
            height 33px
            border 1px solid #FFB422
        li:nth-child(2)
          width 30px
          img
            width 20px
            height 18px
        li:nth-child(3)
          width 60px
          img
            width 19.4px
            height 19px
</style>
