<template>
  <div class="wrap">
    <div class="login">
      <h2 class="title">登录/注册</h2>
      <p class="account">
        手机号/邮箱
        <input type="text">
      </p>
      <slider></slider>
      <p class="yzm">
        <input type="text" placeholder="验证码">
        <button>发送验证码</button>
      </p>
      <button class="loginbutton">登录</button>
      <div class="yhxy">
        <img :src="require(`@/assets/images/rules_checked.png`)" alt="" v-if="agree" @click="agree = false">
        <img :src="require(`@/assets/images/rules_unchecked.png`)" alt="" v-else @click="agree = true">
        <p>我已阅读并同意 <a href="">用户协议</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  import slider from './slider.vue'

  export default {
    // props: ['loginForm'],
    name: "login",
    data() {
      return{
        agree: false
      }

    },
    components: {
      slider
    },
    // methods: {
    //
    // }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .wrap
    display none
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.4)
    z-index 999
    .login
      position fixed
      top 30px
      left 50%
      width 400px
      height 342px
      margin-left -200px
      padding 40px 0
      background-color: #fff
      z-index 999

      .title
        height 20px
        padding-left 40px
        line-height 20px
        letter-spacing: 0.23px
        font-size $fz20
        font-weight bold
        color $col333
        &::before
          position relative
          top 2px
          left 0
          display inline-block
          content ''
          width 3px
          height 20px
          margin-right 10px
          background-color $col422

      .account
        margin-top 40px
        margin-left 40px
        font-size 14px
        color $col999

        input
          display inline-block
          width 320px
          height 40px
          margin 10px 0 15px
          background-color $col6FA
          border-radius 2px

      .yzm
        margin 35px 40px 15px

        input
          width 210px
          height 40px
          float left
          background-color: $col6FA
          placeholder()
          padding-left 10px

        button
          width 100px
          height 40px
          background-color: $col422
          text-align center
          line-height 40px
          color #fff

      .loginbutton
        width 350px
        height 40px
        background-color: $col999
        text-align center
        line-height 40px
        color #FFF
        margin-left 25px

      .yhxy
        width 150px
        margin 20px auto
        fz11()

        img
          padding-top 3px
        p
          float right
          color $col333
          a
            color $col100
</style>
