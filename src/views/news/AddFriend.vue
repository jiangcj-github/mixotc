<template>
  <div class="add-friend-wrap" v-show="friendShow">
    <p class="wrap-title">
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeFriend">
    </p>
    <div class="user-name">
      <img :src="addIcon" alt="">
      <span>{{addName}}</span>
    </div>
    <textarea placeholder="请填写认证信息" v-model="text" maxlength="20"></textarea>
    <button @click="openFirendLayer">添加好友</button>
    <!-- 添加好友弹窗 -->
    <BasePopup class="firend-layer"
               :show="firendLayer"
               :width=135
               :height=50
               :top=50
               :wrapStyleObject="firendWrap"
               @click.native="closeFriend"
    >已发送，等待对方同意</BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "add-friend",
    props: ['addFriendShow', 'id', 'name', 'icon'],
    data() {
      return {
        addId: this.id,
        addIcon: this.icon,
        addName: this.name,
        text: `我是${this.$store.state.userInfo.name}`,
        friendShow: this.addFriendShow,
        firendLayer: false,
        firendWrap: {
          width: '560px',
          height: '420px',
          right: 0,
          bottom: 0
        },
        timer: null
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      }
    },
    components: {
      BasePopup
    },
    watch: {
      addFriendShow(state) {
        if (state === true ) {
          this.friendShow = true
        } else  {
          this.friendShow = false
        }
      }
    },
    methods: {
      closeFriend() {
        clearTimeout(this.timer);
        this.$emit('offAddFriend', 'false')
      },
      openFirendLayer() {
        this.WsProxy.send('control', 'request_friend', {
          uid: this.userInfo.uid,
          id: this.JsonBig.parse(this.addId),
          icon: '',
          info: this.text
        }).then(data => {
          this.firendLayer = true
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.firendLayer = false
            this.$emit('offAddFriend', 'false')
          }, 3000)
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .add-friend-wrap
    position absolute
    right 125px
    bottom 0px
    width 300px
    height 420px
    background #F4F6FA
    -webkit-box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    .wrap-title
      position relative
      height 40px
      border-bottom 1px solid #E1E1E1
      background #FFF
      img
        position absolute
        right 12px
        top 15px
        width 10px
        height 10px
    .user-name
      height 60px
      background #FFF
      line-height 60px
      margin-bottom 10px
      img
        width 37px
        height 37px
        // background aquamarine
        border-radius 50%
        margin-left 10px
        margin-right 20px
        vertical-align middle
    textarea
      width 290px
      height 80px
      resize none
      border none
      padding 10px 0 0 10px
      margin-bottom 30px
    button
      width 200px
      height 40px
      background #FFB422
      border-radius 2px
      color #FFF
      letter-spacing 0.16px
      margin-left 60px
  .firend-layer
    font-size 12px
    text-align center
    line-height 50px
</style>
