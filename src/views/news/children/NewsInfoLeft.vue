<template>
  <div class="news-info-left">
    <div class="search-box">
      <input type="text" placeholder="查找昵称／账号"/>
      <img src="/static/images/search_gray.png"/>
    </div>

    <!--<EasyScrollbar :barOption="changeBar">-->
      <ul class="firend-list">
        <li v-for="(content, index) in userList">
          <img src="" alt="" class="head-portrait" @click="openCheckGroup">
          <span>{{content.name}}/130***123</span>
          <img src="/static/images/close_btn.png" alt="" class="close-head" @click="delUser(index)">
        </li>
      </ul>
    <!--</EasyScrollbar>-->

    <p class="other-item">
      <img src="/static/images/notice_icon.png">
      <img src="/static/images/service_icon.png" class="service-img">
      <img src="/static/images/phoneicon.png" class="phone-img">
    </p>
    <!-- 查看群 -->
    <GroupInfo :checkGroupShow="showCheckGroup" @offCheckGroup="openCheckGroup"></GroupInfo>
  </div>
</template>

<script>
  import GroupInfo from '@/views/news/GroupInfo' // 查看群

  export default {
    name: "new-info-left",
    data() {
      return {
        showCheckGroup: false,
        changeBar: {
          barColor:"#959595",   //滚动条颜色
          barWidth:3,           //滚动条宽度
          railColor:"#eee",     //导轨颜色
        },
        userList: [
          {name: 'liiihhh'},
          {name: '群聊'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
          {name: 'liiihhh'},
        ]
      }
    },
    components: {
      GroupInfo
    },
    methods: {
      openCheckGroup(st) {
        if (st === 'false') {
          this.showCheckGroup = false
        } else {
          this.showCheckGroup = true
        }
      },
      delUser(index) {
        this.userList.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
    .news-info-left
      float left
      width 159px
      height 420px
      background #FFF
      border-right 1px solid #E1E1E1
      .search-box
        position relative
        height 40px
        line-height 40px
        border-bottom 1px solid #E1E1E1
        input
          width 140px
          height 30px
          padding-left 10px
          background #F4F6FA
          border-radius 2px 2px 2px 0
          margin-left 5px
        img
          position absolute
          top 12px
          right 15px
          width 18px
          height 18px
      .firend-list
        height 325px
        background #FFF
        overflow auto
        margin-bottom 5px
        li
          position relative
          height 42px
          line-height 42px
          img
            vertical-align middle
          .head-portrait
            width 30px
            height 30px
            background aquamarine
            border-radius 50%
            margin 0 10px 0 5px
          .close-head
            position absolute
            top 18px
            right 8px
            width 5px
            height 5px
            cursor pointer
          span
            display inline-block
            width 90px
            font-size 12px
            margin-right 5px
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            vertical-align middle
      .other-item
        width 140px
        padding 8px 0 6px
        padding-left 20px
        -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
        box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
        img
          width 30px
          height 30px
          vertical-align middle
        .service-img
          margin 0 20px
        .phone-img
          width 16px
          height 24px

</style>
