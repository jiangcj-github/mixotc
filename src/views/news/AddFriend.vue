<template>
  <div class="add-friend-wrap" v-show="friendShow">
    <p class="wrap-title">
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeFriend">
    </p>
    <div>
      <img src="">
      <span></span>
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

</style>
