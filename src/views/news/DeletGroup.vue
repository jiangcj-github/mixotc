<template>
  <div class="delet-group-wrap" v-show="groupShow">
    <p class="wrap-title">
      <span>删除群成员</span>
      <i>确定</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <div class="search_user">
      <input type="text" placeholder="查找昵称／账号"/>
      <img src="/static/images/search_gray.png" alt="">
    </div>
    <ul class="clearfix">
      <li>
        <img src="" alt="" class="head-portrait">
        <img src="/static/images/del_user_icon.png" class="del-head" alt="">
        <p>李小蹦</p>
      </li>
      <li>
        <img src="" alt="" class="head-portrait">
        <img src="/static/images/del_user_icon.png" class="del-head" alt="">
        <p>李小蹦</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "delet-group",
    props: ['delGroupShow'],
    data() {
      return {
        groupShow: this.delGroupShow,
      }
    },
    watch: {
      delGroupShow(state) {
        if (state === true ) {
          this.groupShow = true
        } else  {
          this.groupShow = false
        }
      }
    },
    methods: {
      closeGroup() {
        this.$emit('offDelGroup', 'false')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .delet-group-wrap
    position fixed
    right 125px
    bottom 100px
    width 300px
    height 420px
    background #FFF
    -webkit-box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    box-shadow: -2px -2px 8px 0 rgba(51,51,51,0.30)
    .wrap-title
      position relative
      height 40px
      border-bottom 1px solid #E1E1E1
      background  #F4F6FA
      line-height 40px
      span
        margin-left 10px
        margin-right 144px
      i
        color #FFB422
      img
        position absolute
        right 12px
        top 15px
        width 10px
        height 10px
        cursor pointer
    .search_user
      text-align center
      margin-top 12px
      position relative
      input
        width 270px
        height 30px
        padding-left 10px
        background  #F4F6FA
        border-radius 2px
      img
        position absolute
        top 7px
        right 18px
        width 18px
        height 18px
    ul
      margin 20px
      li:nth-child(5n)
        margin-right 0
      li
        position relative
        float left
        width 40px
        text-align center
        margin-right 20px
        margin-bottom 20px
        .head-portrait
          width 30px
          height 30px
          background aquamarine
          border-radius 50%
          vertical-align middle
          margin-bottom 5px
        .del-head
          position absolute
          top 0
          right 2px
          width 12px
          height 12px
        p
          margin 0 auto
          width 37px
          font-size 12px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis

</style>


