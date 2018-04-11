<template>
  <div class="group-info-wrap" v-show="groupInfoShow">
    <p class="wrap-title">
      <span>群信息</span>
      <i>退出该群</i>
      <img src="/static/images/close_btn.png" class="close-btn-img" @click="closeGroup">
    </p>
    <ol>
      <li>
        <span>群名称</span>
        <input type="text" placeholder="编辑群名称"/>
      </li>
      <li>
        <span>群主</span>
        <img src="" alt="">
        <b>lihh / 130***123</b>
      </li>
    </ol>
    <h1>群成员(10)</h1>
    <div class="operation">
      <img src="/static/images/add_user.png" alt="">
      <img src="/static/images/del_user.png" alt="" @click="openDelGroup">
    </div>
    <ul class="clearfix">
      <li>
        <img src="" alt="">
        <p>李小蹦</p>
      </li>
      <li>
        <img src="" alt="">
        <p>李小蹦</p>
      </li>

    </ul>
    <!-- 删除群成员 -->
    <DeletGroup :delGroupShow="showDelGroup" @offDelGroup="openDelGroup"></DeletGroup>
  </div>
</template>

<script>
  import DeletGroup from '@/views/news/DeletGroup' // 删除群成员

  export default {
    name: "group-info",
    props: ['checkGroupShow'],
    data() {
      return {
        groupInfoShow: this.checkGroupShow,
        showDelGroup: false
      }
    },
    components: {
      DeletGroup
    },
    watch: {
      checkGroupShow(state) {
        if (state === true ) {
          this.groupInfoShow = true
        } else  {
          this.groupInfoShow = false
        }
      }
    },
    methods: {
      closeGroup() {
        this.$emit('offCheckGroup', 'false')
      },
      openDelGroup(st) {
        if (st === 'false') {
          this.showDelGroup = false
        } else {
          this.showDelGroup = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .group-info-wrap
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
        color #FF794C
      img
        position absolute
        right 12px
        top 15px
        width 10px
        height 10px
        cursor pointer
    ol
      background: #FFF
      li
        height 50px
        line-height 50px
        span
          margin-left 10px
          margin-right 10px
          font-size 12px
      li:first-child
        border-bottom 1px solid #E1E1E1
        input
          width 223px
          height 30px
          background #F4F6FA
          padding-left 10px
          border-radius 2px
        ::-webkit-input-placeholder
          color #999
        :-moz-placeholder
          color #999
        ::-moz-placeholder
          color #999
        :-ms-input-placeholder
          color #999
      li:last-child
        span
          margin-right 22px
        img
          width 30px
          height 30px
          margin-right 10px
          background aquamarine
          border-radius 50%
          vertical-align middle
    h1
      font-size 12px
      margin 10px 0 5px 10px
    .operation
      height 40px
      line-height 40px
      background #FFF
      img
        width 30px
        height 30px
        vertical-align middle
      img:first-child
        margin-left 10px
        margin-right 18px
    ul
      margin 10px
      li:nth-child(5n)
        margin-right 0
      li
        float left
        width 40px
        text-align center
        margin-right 20px
        margin-bottom 20px
        img
          width 30px
          height 30px
          background aquamarine
          border-radius 50%
          vertical-align middle
          margin-bottom 5px
        p
          margin 0 auto
          width 37px
          font-size 12px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis



</style>


