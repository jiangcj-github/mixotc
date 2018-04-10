<template>
  <div class="add-friend-wrap" v-show="friendShow">
    <p class="wrap-title">
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeFriend">
    </p>
    <div class="user-name">
      <img src="">
      <span>lihh / 130***123</span>
    </div>
    <textarea placeholder="请填写认证信息"></textarea>
    <button>添加好友</button>
  </div>
</template>

<script>
  export default {
    name: "add-friend",
    props: ['addFriendShow'],
    data() {
      return {
        friendShow: this.addFriendShow
      }
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
        this.$emit('offAddFriend', 'false')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .add-friend-wrap
    position fixed
    right 125px
    bottom 100px
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
        background aquamarine
        border-radius 50%
        margin-left 10px
        vertical-align middle
</style>
