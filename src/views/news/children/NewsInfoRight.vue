<template>
  <div class="news-info-right">
    <ul class="title-info clearfix">
      <li class="title-info-name">lihh/130***123</li>
      <li class="title-info-select" v-clickoutside="closeSelect">
        <img src="/static/images/add_talk.png" class="add-talk-img" @click="showSeletAdd">
        <div v-show="seletAdd">
          <i></i>
          <ul>
            <li @click="openAddFriend">+好友</li>
            <li>+信任</li>
            <li @click="openAddGroup">+建群</li>
          </ul>
        </div>
      </li>
      <li class="close-btn">
        <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeTalk">
      </li>
    </ul>
    <div class="news-info-talk clearfix">
      <p class="more-info">查看更多消息</p>
      <p class="time-info">12月19日 12:12</p>
      <div class="left-people">
        <img src="" alt="">
        <p>
          <i></i>
          <span>在</span>
        </p>
      </div>
      <div class="right-people">
        <p>
          <i></i>
          <span>在的在的</span>
        </p>
        <img src="" alt="">
      </div>
    </div>
    <ol class="input-text clearfix">
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
    <!-- 添加好友弹窗 -->
    <AddFriend :addFriendShow="showAddFriend" @offAddFriend="openAddFriend"></AddFriend>
    <!-- 添加群聊弹窗 -->
    <AddGroup :addGroupShow="showAddGroup" @offAddGroup="openAddGroup"></AddGroup>
  </div>
</template>

<script>
  import AddFriend from '@/views/news/AddFriend' // 添加好友
  import AddGroup from '@/views/news/AddGroup' // 添加群

  export default {
    name: "news-info-right",
    data() {
      return {
        seletAdd: false,
        showAddFriend: false,
        showAddGroup: false

      }
    },
    components: {
      AddFriend,
      AddGroup,
    },
    methods: {
      closeTalk() {
        this.$store.commit({'type':'changeChatBox', data: false})
      },
      closeSelect() {
        this.seletAdd = false
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
      },
      openAddGroup(st) {
        if (st === 'false') {
          this.showAddGroup = false
        } else {
          this.showAddGroup = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .news-info-right
    float right
    width 400px
    height 420px
    background #F4F6FA
    .title-info
      height 40px
      line-height 40px
      background #FFF
      border-bottom 1px solid #E1E1E1
      >li
        float left
      .title-info-name
        margin-left 20px
      .title-info-select
        margin-left 205px
        img
          width 15px
          height 15px
          vertical-align middle
          cursor pointer
        div
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
      .close-btn
        img
          width 10px
          height 10px
          margin-left 22px
          vertical-align middle


    .news-info-talk
      width 399px
      height 320px
      padding-top 10px
      text-align center
      .more-info
        font-size 12px
        color #FF794C
        margin-bottom 5px
      .time-info
        width 90px
        margin 0 auto
        margin-bottom 20px
        font-size 12px
        background #E1E1E1
        border-radius 2px
        color #999
      div
        width 390px
        font-size 12px
        margin-bottom 15px
        img
          width 30px
          height 30px
          background aquamarine
          border-radius 50%
          vertical-align top
        p
          display inline-block
          position relative
          span
            display inline-block
            max-width 250px
            padding 5px
            border-radius 2px
            margin-top 2px
          i
            position absolute
            top 9px
            display block
            border-width 5px 8px
            border-style solid dashed dashed
            font-size 0
            line-height 0
      .left-people
        float left
        margin-left 10px
        text-align left
        img
          margin-right 10px
        span
          background #E1E1E1
        i
          left -16px
          border-color transparent #E1E1E1 transparent transparent
      .right-people
        float right
        margin-right 10px
        text-align right
        img
          margin-left 10px
        span
          text-align left
          background #FFB422
        i
          right -16px
          border-color transparent transparent transparent #FFB422

    .input-text
      padding 7px 0 3px
      background #FFF
      -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
      box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
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
        margin-left 5px
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
