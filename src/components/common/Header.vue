<template>
  <article class="header" :style="{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 999}">
    <section class="upper">
      <div class="wrapper">
        <HeaderPrice class="upper-left"></HeaderPrice>
      </div>
    </section>
    <section class="down" :style="{borderRight: 0}">
      <div class="wrapper">
        <ul class="down-tag">
          <li><a href="/"><img class="top-logo" src="/static/images/toplogo.png" alt="MIXOTC官网"></a></li>
          <router-link to="/transaction" tag="li" class="tag transaction" active-class="selected" :class="{selected: path === '/'}">交易中心</router-link>
          <!--<li><a href="">广告</a></li>-->
          <router-link to="/order"  tag="li" class="tag order" v-if="this.$store.state.isLogin" active-class="selected">订单<span v-if="newOrder"><i>{{newOrder}}</i></span></router-link>
          <!--<li><a href="">钱包</a></li>-->
          <li class="itag" @mouseenter="showQr" @mouseleave="hideQr">
            <img class="top-logo" src="/static/images/phoneicon.png" alt="">
            <div class="show-qr" v-show="isHover">
              <img src="/static/images/QRcode.png" alt="">
              <span>APP安卓端下载</span>
            </div>
          </li>
          
        </ul>
        <span class="log" @click="changeLoginForm(true)" v-if="!this.$store.state.isLogin">登录/注册</span>
        <div class="info" v-else>
          <img class="avator" :src="icon ? `http://192.168.113.26/image/${icon}` : `/static/images/default_avator.png`" alt="">
          <div class="name" @click="showMenu = !showMenu" >
            <span class="login" >{{name}}</span>
            <img class="select-icon" src='/static/images/triangle_black.png' v-if="!showMenu" alt="">
            <img class="select-icon" src='/static/images/triangle_black_up.png' v-else alt="">
            <ul v-if="showMenu" v-clickoutside="hideShowMenu">
              <!-- <li class="center">个人中心</li>
              <li class="safe">安全设置</li>
              <li class="auth">身份认证</li> -->
              <li class="logout" @click="logout">退出</li>
            </ul>
          </div>
        </div>
        <Login v-if="showLoginForm"/>
      </div>
    </section>
  </article>
</template>

<script>
  import Login from '@/components/common/Login'
  import HeaderPrice from '@/components/common/HeaderPrice'

  export default {
    data() {
      return {
        isHover: false,
        showMenu: false,
        newOrder: 0,
        items: [
          {title: 'BitFunex', value: '$9.244.70↑'}, {title: 'Kraken', value: '€7.468.30↑'}, {title: 'Bithumb', value: '₩10.186.000.00↑'}, {title: 'Bitflyer', value: '￥995.759.00↑'}
        ]
      }
    },
    components: {
      Login,
      HeaderPrice
    },
    mounted() {
      let ws = this.WebSocket;
      ws.onMessage['rmd_ord_top'] = {
        callback: (data) => {
          data && data.body.type && data.body.type === 'rmd_ord' && this.path !== '/order' && this.newOrder++
        }
      }
    },
    methods: {
      changeLoginForm(state) {
        this.$store.commit({type: 'changeLoginForm', data: state});
      },
      showQr() {
        this.isHover = true;
      },
      hideQr() {
        this.isHover = false;
      },
      logout() {
        sessionStorage.removeItem('otcToken');
        localStorage.setItem("removeSessionStorage", Date.now());
        this.$store.commit({type: 'changeLogin', data: false});
        this.WebSocket.reConnectFlag = false;
        this.WebSocket.close();
        if (this.path !== '/' && this.path !== 'transaction' && this.path !== 'homepage') {
          this.$router.push('transaction')
        }
      },
      hideShowMenu() {
        if (!this.showMenu) return;
        this.showMenu = false
      }
    },
    computed: {
      icon() {
        return this.$store.state.userInfo.icon
      },
      name() {
        return this.$store.state.userInfo.name
      },
      path() {
        return this.$route.path
      },
      showLoginForm() {
        return this.$store.state.showLoginForm
      }
    },
    watch: {
      path: {
         handler(curVal, oldValue) {
           curVal === '/order' && (this.newOrder = 0);
         }
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
      
    .down
      height 70px
      border 1px solid #E1E1E1

      .down-tag
        flex 1
        font-size 14px

        li
          position relative
          float left
          margin-right 50px
          text-align center
          vertical-align middle
          line-height 71px
        .tag
          cursor pointer 
          &.order
            position relative
            width 70px
            span
              position absolute
              top 24px
              right 3px
              width 14px
              height 14px
              text-align left
              line-height 14px
              border-radius 50%
              background $col94C
              i
                position absolute
                top 0.6px
                left 3.7px
                display inline-block
                fz11()
                color #FFF
                letter-spacing 0.12px
          &.transaction
            width 80px
          &.selected
            border-bottom 2px solid $col422
        .itag
          line-height 60px
          padding 0 41.5px
        .tag, .itag
          &:hover
            border-bottom 2px solid $col422

          .show-qr
            position absolute
            left 1px
            top 75px
            width 100px
            height 100px
            background-color #FFF
            z-index 9
            img
              width 60px
              height 60px
              margin 10px 20px 5px
            span
              position absolute
              left 3px
              bottom 15px
              width 100%
              height 12px
              line-height 12px
              fz11()
      .log
        font-size 14px
        color $col422
        cursor pointer
      .info
        position relative
        height 100%
        .avator
          float left
          margin 12.5px 13px 0 0
        .name
          position relative
          float left
          width 120px
          cursor pointer
          &:hover::after
            position absolute
            left 0
            bottom 0
            content ''
            width 100%
            height 2px
            background $col422 
          .login
            float left
            position relative
            overflow hidden
            width 104px
            height 70px
            margin-right 5px
            white-space nowrap
            text-overflow ellipsis
            line-height 70px
          .select-icon
            position absolute
            top 50%
            right 0 
            margin-top -2.5px
          ul
            position absolute
            top 68px
            left 0
            background #FFF
            border-top 2px solid $col422
            box-shadow: 0 2px 4px 0 $col1E1;
            z-index 9
            li
              box-sizing()
              position relative
              width 120px
              height 40px
              padding-left 40px
              line-height 40px
              &:hover
                background $col3EB
              &::before
                position absolute
                top 11px
                left 11px
                content ''
                width 20px
                height 20px
              &.center::before
                background url('/static/images/center.png')
              &.auth::before
                background url('/static/images/auth.png')
              &.safe::before
                background url('/static/images/safe.png')
              &.logout::before
                background url('/static/images/logout.png')

</style>
