<template>
  <div class="news-info-right">
    <ul class="title-info clearfix">
      <li class="title-info-name" v-if="curChat">{{curChat === 'system' ? '系统消息' : title}}</li>
      <li class="title-info-select" v-clickoutside="closeSelect" v-if="title && !chat[index].service">
        <img v-if="!chat[index].group" src="/static/images/add_talk.png" class="add-talk-img" @click="showSeletAdd">
        <img v-else src="/static/images/groupchat.png" class="add-talk-img" @click="openGroupInfo(curChat)">
        <div v-show="seletAdd" @click="seletAdd = false">
          <i></i>
          <ul>
            <li @click="openAddFriend" v-if="!isFriend">+好友</li>
            <li @click="openBeliveLayer(chat[index].id)" v-if="!isTrust">+信任</li>
            <li @click="openAddGroup">+建群</li>
          </ul>
        </div>
      </li>
      <li class="close-btn">
        <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeTalk">
      </li>
    </ul>
    <div class="blank" v-if="!title && curChat !== 'system'"></div>
    <div class="news-info-talk clearfix" v-if="title && curChat !== 'system'">
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
    <div class="system-info" v-if="curChat === 'system'">
      <div>
        <img src="" alt="">
        <ul>
          <li>Andy</li>
          <li>我是李小蹦，想添加你为好友</li>
        </ul>
        <button>同意</button>
      </div>
    </div>

    <ol class="input-text clearfix">
      <li>
        <input type="text" :disabled="title === '' ? true : false">
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
    <AddFriend 
      v-if="showAddFriend" 
      :addFriendShow="showAddFriend" 
      @offAddFriend="openAddFriend"
      :id="curChat"
      :name="chat[index].nickName"
      :icon="chat[index].icon"
      >
    </AddFriend>
    <!-- 添加群聊弹窗 -->
    <AddGroup 
      v-if="showAddGroup" 
      :addGroupShow="showAddGroup" 
      @offAddGroup="openAddGroup"
      :curChat="curChat"
      :isNewGroup="true"
      ></AddGroup>
    <!-- 添加信任弹窗 -->
    <BasePopup class="belive-layer"
               :show="beliveLayer"
               :width=135
               :height=50
               :top=50
               :wrapStyleObject="beliveWrap">已加信任</BasePopup>
    <GroupInfo 
      v-if="showCheckGroup" 
      :id="groupId"
      :checkGroupShow="showCheckGroup" 
      @offCheckGroup="openCheckGroup"
    ></GroupInfo>
  </div>
</template>

<script>
  import AddFriend from '@/views/news/AddFriend' // 添加好友
  import AddGroup from '@/views/news/AddGroup' // 添加群
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import GroupInfo from '@/views/news/GroupInfo' // 查看群

  export default {
    name: "news-info-right",
    data() {
      return {
        groupId: '',
        isNewGroup: true,
        showCheckGroup: false,
        seletAdd: false,
        showAddFriend: false,
        showAddGroup: false,
        beliveLayer: false,
        beliveWrap: {
          width: '560px',
          height: '420px',
          right: 0,
          bottom: '100px'
        },
        timer: null
      }
    },
    components: {
      AddFriend,
      AddGroup,
      BasePopup,
      GroupInfo
    },
    mounted() {
      // this.WsProxy.send('control', 'add_friend', {
      //     ack: 0,
      //     id: this.JsonBig.parse('203309354277937152'),
      //   }).then(data => {
        
      //   }).catch(error => {
      //     console.log(error)
      //   })
    },
    computed: {
      title() {
        let result = '';
        this.$store.state.chat.forEach(item=> {
          if (item.id === this.$store.state.curChat) {
            result = item.nickName
          }
        })
        return result
      },
      curChat() {
        return this.$store.state.curChat
      },
      chat() {
        return this.$store.state.chat
      },
      index() {
        let idx = '';
        this.chat.forEach((item, index)=>{
          if (item.id === this.curChat) idx = index;
        })
        return idx
      },
      isFriend() {
        let result = false;
        this.$store.state.friendList.forEach(item => {
          this.JsonBig.stringify(item.id) === this.curChat && (result = true)
        })
        return result
      },
      isTrust() {
        return this.$store.state.trustList.includes(this.curChat)
      }
    },
    methods: {
      openGroupInfo(id) {
        this.groupId = id;
        this.showCheckGroup = true
      },
      openCheckGroup(st) {
        if (st === 'false') {
          this.showCheckGroup = false
        } else {
          this.showCheckGroup = true
        }
      },
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
      },
      openBeliveLayer(id) {
        this.WsProxy.send('otc','new_trust',{
            uid:this.$store.state.userInfo.uid, 
            id: this.JsonBig.parse(id), 
            trust:1
          }).then((data)=>{
          this.beliveLayer = true
          clearTimeout(this.timer)
          this.$store.commit({'type':'newTrust', data: id})
          this.timer = setTimeout(() => {
            this.beliveLayer = false
          }, 3000)
        }).catch((msg)=>{
          console.log(msg);
        });
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
        width 304px
        height 40px
        margin-left 20px
        font-size 14px
        color $col333
        font-weight bold
        letter-spacing 0.16px
      .title-info-select
        img
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
        float right
        margin-right 24px
        img
          width 10px
          height 10px
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
    .blank
      width 399px
      height 320px
      padding-top 10px
      text-align center
    .system-info
      width 399px
      height 320px
      padding-top 10px
      div
        display flex
        align-items center
        width 345px
        height 37px
        padding 12px 20px 11px 15px
        background #FFF
        margin 0 auto
        img
          width 37px
          height 37px
          border-radius 50%
          background aquamarine
          margin-right 16px
        button
          width 56px
          height 24px
          background #FFB422
          border-radius 2px
          color #FFF
          margin-left 80px
        ul
          li:first-child
            font-size 14px
          li:last-child
            font-size 12px
            color #999

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
  /*弹窗*/
  .belive-layer
    text-align center
    line-height 50px
    font-size 12px
</style>
