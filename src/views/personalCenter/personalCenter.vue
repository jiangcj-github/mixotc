<template>
  <div class="personal inner">
    <h3>mixsOTC-个人中心</h3>
    <div class="nav">
      <ul>
        <router-link to="/personal/evaluate" tag="li" active-class="selected" class="evaluate">我的评价</router-link>
        <!--<li class="trust">信任</li>-->
        <!--<li class="address">通讯录</li>-->
        <router-link to="/personal/account" tag="li" active-class="selected" class="account">账户设置</router-link>
        <router-link to="/personal/safe" tag="li" active-class="selected" class="safe">安全设置</router-link>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base"
  .personal
    h3
      padding 10px 0 20px 0
      font-size $fz12
      color $col333
      letter-spacing 0.25px
    .nav
      float left
      width 180px
      margin-right 20px
      background-color #FFF
      ul
        li
          box-sizing()
          height 60px
          padding 0 20px 0 30px
          line-height 60px
          font-size $fz14
          color $col333
          letter-spacing 0.16px
          cursor pointer
          &::after
            content ''
            width 20px
            height 60px
            float right
            background url('/static/images/personal/personal_evaluate.png') no-repeat center center;
            background-size 20px 20px
          &.selected, &:hover
            border-bottom 2px solid $col422
            background-color $col3EB
          &.trust
            &::after
              background-image url('/static/images/personal/personal_trust.png')
          &.address
            &::after
              background-image url('/static/images/personal/personal_address.png')
          &.account
            &::after
              background-image url('/static/images/personal/personal_account.png')
          &.safe
            &::after
              background-image url('/static/images/personal/personal_safe.png')
    .content
      float left
      position relative

</style>
