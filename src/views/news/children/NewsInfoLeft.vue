<template>
  <div class="news-info-left">
    <div class="search-box">
      <input type="text" placeholder="查找昵称／账号"/>
      <img src="/static/images/search_gray.png"/>
    </div>
      <happy-scroll style="width:159px;height:325px" resize bigger-move-h="start">
        <div class="wrap">
          <ul class="firend-list">
            <li v-for="(content, index) in userList" :key="content.id" :class="{cur: content.id === $store.state.curChat}" @click="selectChat(content.id, index)">
              <img v-if="!content.group && !content.orderId" :src="content.icon ? `${HostUrl.http}image/${content.icon}` : `/static/images/default_avator.png`" alt="" class="head-portrait">
              <img v-if="content.group" src="/static/images/groupChat_icon.png" alt="" class="head-portrait" @click.stop="openCheckGroup">
              <img v-if="content.orderId" src="/static/images/appeal_icon.png" alt="" class="head-portrait">
              <b v-if="content.unread"></b>
              <span>{{content.length ? (content.nickName ? `${content.nickName}(${content.length})` : `群聊(${content.length})`) : (content.nickName ? content.nickName : `订单号:${content.orderId}`)}}</span>
              <img src="/static/images/close_btn.png" alt="" class="close-head" @click.stop="delUser(index, content.id)">
            </li>
          </ul>
        </div>
      </happy-scroll>
    <div class="other-item">
      <div class="img system">
        <b v-if="$store.state.systemMessage"></b>
        <img src="/static/images/notice_icon.png" @click="toSystem">
      </div>
      <div class="img phone-img">
        <img src="/static/images/phoneicon.png">
        <p>
          <img src="/static/images/QRcode.png" alt="">
          <span><i>下载APP沟通更方便</i></span>
        </p>
      </div>
    </div>
    <!-- 查看群 -->
    <GroupInfo :checkGroupShow="showCheckGroup" @offCheckGroup="openCheckGroup"></GroupInfo>
  </div>
</template>

<script>
  import GroupInfo from '@/views/news/GroupInfo' // 查看群
  import { HappyScroll } from 'vue-happy-scroll'
  export default {
    name: "new-info-left",
    data() {
      return {
        showCheckGroup: false,
        friendList: [],
        groupList: [],
      }
    },
    mounted() {
      console.log(document.querySelector('.news-info-left'))
      this.$store.commit({type: 'changeChat', data:  [
        {
          id: 1,
          group: false,
          orderId: "",
          icon: "",
          nickName: "qwert1111",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 2,
          group: true,
          length: 7,
          orderId: "",
          icon: "",
          nickName: "悦跑",
          phone: 1561321154,
          email: "1561321154@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 3,
          group: false,
          orderId: "313213213215615321312",
          icon: "",
          nickName: "",
          phone: 1561321155,
          email: "1561321155@163.com",
          unread: 6,
          messages: []
        },
        {
          id: 4,
          group: false,
          orderId: "",
          icon: "",
          nickName: "qwert1666",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 5,
          group: false,
          orderId: "",
          icon: "",
          nickName: "qwert11777",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 3,
          messages: []
        },
        {
          id: 6,
          group: true,
          length: 5,
          orderId: "",
          icon: "",
          nickName: "",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 5,
          messages: []
        },
        {
          id: 7,
          group: false,
          orderId: "",
          icon: "",
          nickName: "qwert6573",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 8,
          group: false,
          orderId: "54654645646456456467677",
          icon: "",
          nickName: "",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 9,
          group: false,
          orderId: "",
          icon: "",
          nickName: "qwert6987456",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 10,
          group: false,
          orderId: "",
          icon: "",
          nickName: "sefdgsdfrt1111",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 11,
          group: false,
          orderId: "",
          icon: "",
          nickName: "4675785t1111",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        },
        {
          id: 12,
          group: false,
          orderId: "",
          icon: "",
          nickName: "4365wfsg111",
          phone: 1561321153,
          email: "1561321153@163.com",
          unread: 0,
          messages: []
        }
      ]})
      document.querySelector('.news-info-left .happy-scroll-container').className = 'happy-scroll-container import';
      this.WsProxy.send('control', 'recent_contact', {uid: this.$store.state.userInfo.uid}).then(data => {
        console.log(88888,data)
      }).catch(error=>{
        console.log(error)
      })
    },
    computed: {
      userList() {
        return this.$store.state.chat
      } 
    },
    components: {
      GroupInfo,
      HappyScroll
    },
    methods: {
      toSystem() {
        this.$store.commit({type: 'changeCurChat', data: {id: 'system'}})
      },
      selectChat(id, index) {
        this.$store.commit({type: 'changeCurChat', data: {id, index}})
      },
      openCheckGroup(st) {
        if (st === 'false') {
          this.showCheckGroup = false
        } else {
          this.showCheckGroup = true
        }
      },
      delUser(index, id) {
        this.WsProxy.send('control', 'delete_group', {uid:this.$store.state.userInfo.uid, id: this.JsonBig.parse(id)}).then(data => {
          console.log(88888,data)
        }).catch(error=>{
          console.log(error)
        })
        this.$store.commit({type: 'delChat', data: index})
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
    
    .news-info-left
      position relative
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
      .wrap
        width 159px
        .firend-list
          background #FFF
          margin-bottom 5px
          li
            position relative
            height 42px
            line-height 42px
            cursor pointer
            &:hover, &.cur
              background-color $col6FA
              .close-head
                display block
                width 5.7px
                height 5.7px
            b
              position absolute
              left 27px
              top 7px
              width 9px
              height 9px
              background $col94C
              border-radius 50%
            img
              vertical-align middle
            .head-portrait
              width 30px
              height 30px
              background aquamarine
              border-radius 50%
              margin 0 10px 0 5px
            .close-head
              display none
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
        position absolute
        left 0
        bottom 0
        width 123px
        height 36px
        padding 8px 0 6px
        padding-left 36px
        -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
        box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
        b
          position absolute
          left 57px
          top 8px
          width 9px
          height 9px
          background $col94C
          border-radius 50%
        .img
          display inline-block
          width 30px
          height 30px
          vertical-align middle
          cursor pointer
          &.system
            margin-right 37px
        .phone-img
          position relative
          width 16px
          height 24px
          &:hover
            p
              display block
          p
            display none
            position absolute
            top -112px
            right -26px
            width 80px
            height 100px
            text-align center
            background #FFF
            box-shadow -2px -2px 8px 0 rgba(51,51,51,0.30)
            img
              display block
              margin 7px auto 1px
              width 70px
              height 70px
            span
              float left
              width 100%
              margin-left 5px
              i
                display inline-block
                width 100%
                white-space nowrap
                fz8()
                color $col333
                letter-spacing 0.09px

</style>
