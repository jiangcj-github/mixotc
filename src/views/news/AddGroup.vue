<template>
  <div class="add-group-wrap" v-show="groupShow">
    <p class="wrap-title">
      <span>添加群成员</span>
      <i>确定</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <div class="contacts">
      <img src="" alt="">
      <img src="" alt="">
      <img src="" alt="">
      <img src="" alt="">
      <img src="" alt="">
      <input type="text" placeholder="查找联系人"/>
    </div>
    <ul>
      <li v-for="(content, index) in groupList">
        <img class="user-portrait" src="" alt="">
        <span>{{content.name}}</span>
        <i @click="checkContact">
          <b class="no-select" v-if="noContact === index + 1"></b>
          <img class="have-select" src="/static/images/slideOk.png" v-show="!noContact">
        </i>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "add-group",
    props: ['addGroupShow'],
    data() {
      return {
        groupShow: this.addGroupShow,
        noContact: false,
        groupList: [
          {name: 'lihh / 130***123'},
          {name: 'lihh / 130***123'}
        ]
      }
    },
    watch: {
      addGroupShow(state) {
        if (state === true ) {
          this.groupShow = true
        } else  {
          this.groupShow = false
        }
      }
    },
    methods: {
      closeGroup() {
        this.$emit('offAddGroup', 'false')
      },
      checkContact() {
        this.noContact = !this.noContact
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .add-group-wrap
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
    .contacts
      height 40px
      background #FFF
      line-height 40px
      margin-bottom 5px
      img
        width 30px
        height 30px
        border-radius 50%
        background aquamarine
        vertical-align middle
        margin-left 5px
      img:first-child
        margin-left 10px
      input
        max-width 60px
        margin-left 10px
    ul
      background #FFF
      height 335px
      overflow-y auto
      li
        height 40px
        line-height 40px
        .user-portrait
          width 30px
          height 30px
          border-radius 50%
          background aquamarine
          vertical-align middle
          margin-left 10px
          margin-right 10px
        span
          font-size 12px
          letter-spacing 0.14px
          margin-right 120px
        b
          display inline-block
          width 10px
          height 10px
          border 1px solid #999
          border-radius 50%
        .have-select
          width 12px
          height 12px
</style>

