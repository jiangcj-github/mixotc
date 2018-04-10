<template>
  <article class="header">
    <section class="upper">
      <div class="wrapper">
        <ul class="upper-left">
          <li v-for="(item, index) of items" :key="index"><span>{{item.title}}:&nbsp;</span><span>{{item.value}}</span></li>
        </ul>
        <ul class="upper-right">
          <li><span>简体中文</span></li>
          <li><a href="">币种资料</a></li>
          <li><a href="">帮助</a></li>
          <li><a href="">大额交易申请</a></li>
        </ul>
      </div>
    </section>
    <section class="down">
      <div class="wrapper">
        <ul class="down-tag">
          <li><a href="/"><img class="top-logo" src="/static/images/toplogo.png" alt="MIXOTC官网"></a></li>
          <li class="tag">
            <router-link to="/transaction">交易中心</router-link>
          </li>
          <!--<li><a href="">广告</a></li>-->
          <li class="tag order">
            <router-link to="/order" v-if="this.$store.state.isLogin">订单</router-link>
          </li>
          <!--<li><a href="">钱包</a></li>-->
          <li class="itag" @mouseenter="showQr" @mouseleave="hideQr">
            <img class="top-logo" src="/static/images/phoneicon.png" alt="">
            <div class="show-qr" v-show="isHover">
              <img src="/static/images/QRcode.png" alt="">
              <span>APP安卓端下载</span>
            </div>
          </li>
          
        </ul>
        <span class="log" @click="show_loginform" v-if="!this.$store.state.isLogin">登录/注册</span>
        <span class="login" v-else @mouseenter="showXl" @mouseleave="hideXl">{{this.$store.state.userInfo.name}}</span>
        <ul :class="{'show-xl' : hovered , 'hide-xl' : !hovered}">
          <li><img src="/static/images/logoutIcon.png" alt=""><span>退出</span></li>
        </ul>
        <Login v-if="loginForm" :loginForm.sync="loginForm"/>
      </div>
    </section>
  </article>
</template>

<script>
  import Login from '@/components/common/Login'

  export default {
    data() {
      return {
        isHover: false,
        hovered: false,
        loginForm: false,
        items: [
          {title: 'BitFunex', value: '$9.244.70↑'}, {title: 'Kraken', value: '€7.468.30↑'}, {title: 'Bithumb', value: '₩10.186.000.00↑'}, {title: 'Bitflyer', value: '￥995.759.00↑'}
        ]
      }
    },
    components: {
      Login
    },
    methods: {
      show_loginform() {
        if (this.loginForm) return;
        this.loginForm = true;
      },
      hideLoginForm() {
        if (!this.loginForm) return;
        this.loginForm = false;
      },
      loginOut() {
        this.storage.removeLocal('otcToken');
        location.reload();
      },
      showQr() {
        this.isHover = true;
      },
      hideQr() {
        this.isHover = false;
      },
      showXl() {
        this.hovered = true;
      },
      hideXl() {
        this.hovered = false;
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .wrapper
    display flex
    flex-direction row
    align-items center
    margin 0 auto
    height 100%
    width 1200px
    font-size 13px

  .select-tri
    display inline-block
    width 0
    height 0
    border-right 5px solid transparent
    border-left 5px solid transparent

  .top-logo
    margin-top 22px

  .header
    height 100px
    background-color #fff

    .upper
      height 30px
      background-color #333

      .upper-left
        flex 1

        li
          margin-right 40px
          float left
          text-align center
          vertical-align middle
          line-height 30px

          span
            color #fff

          span + span
            color #57a100
      /*.grean*/
      /*color #57a100*/

      /*.yellow*/
      /*color #ff794c*/

      .upper-right
        float right

        li
          margin-left 30px
          float right
          text-align center
          vertical-align middle
          line-height 30px

          a, span
            color #fff

            .white
              margin-left 3px
              line-height 30px
              border-top 5px solid #fff

    .down
      height 70px
      border 1px solid #E1E1E1

      .down-tag
        flex 1
        font-size 14px

        li
          position relative
          float left
          text-align center
          margin-right 48px
          vertical-align middle
          line-height 71px
        .tag
          padding 0 12px
          &.order
            width 70px
        .itag
          line-height 60px
          padding 0 46px
        .tag, .itag
          &:hover,&.active
            border-bottom 2px solid $col422

          .show-qr
            position absolute
            left 1px
            top 75px
            width 108px
            height 108px
            background-color #FFF
            z-index 9
            img
              width 60px
              height 60px
              margin 10px 24px 5px
            span
              position absolute
              left 3px
              bottom 15px
              width 100%
              height 12px
              line-height 12px
              fz11()
      .log, .login
        font-size 14px
        cursor pointer
      .log
        color $col422
      .login
        color $col333
      .show-xl

      .user-info
        display flex
        width 180px
        height 45px
        line-height 45px
        text-align center
        vertical-align middle

        img
          width: 35px
          height: 35px
          margin 5px 5px 0 0
          border-radius 50%

        .user-name
          font-size 14px

          .black
            margin-left 5px
            margin-bottom 4px
            border-top 5px solid #000
</style>
