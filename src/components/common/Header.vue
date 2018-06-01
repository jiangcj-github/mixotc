<template>
  <article class="header" :style="{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000}">
    <section class="upper">
      <div class="wrapper">
        <HeaderPrice class="upper-left"></HeaderPrice>
      </div>
    </section>
    <section class="down" :style="{borderRight: 0}">
      <div class="wrapper">
        <ul class="down-tag">
          <li><img class="top-logo logoImg" src="/static/images/toplogo2.png" alt="MIXOTC官网"></li>
          <router-link to="/transaction" tag="li" class="tag transaction tag-hover" active-class="selected" :class="{selected: path === '/'}">交易中心</router-link>
          <!--|| $store.state.isLogin && $store.state.userInfo.verify !== 2 && (realLayer = true)-->
          <li class="tag ad"
              @mouseenter="adChild = true"
              @mouseleave="adChild = false"
              @click="!$store.state.isLogin && changeLoginForm(true)"
              :class="{active: $route.path=='/advertisement/release/buy' || $route.path=='/advertisement/release/sale' || $route.path=='/advertisement'}">
            <span v-if="$route.path=='/advertisement'">我的广告</span>
            <span v-else>发广告</span>
            <!--$store.state.userInfo.verify == 2 && -->
            <ol v-show="$store.state.isLogin && adChild">
              <li @click="releaseAd()">发广告</li>
              <li @click="goMyAd()">我的广告</li>
            </ol>
          </li>
          <router-link to="/order" tag="li" class="tag order tag-hover" v-if="this.$store.state.isLogin" active-class="selected">订单<span v-if="newOrder"><i>{{newOrder}}</i></span></router-link>
          <router-link to="/wallet" tag="li" class="tag order tag-hover" v-if="this.$store.state.isLogin" active-class="selected">钱包</router-link>
          <li class="itag" @mouseenter="showQr" @mouseleave="hideQr">
            <img class="top-logo" src="/static/images/phoneicon.png" alt="">
            <div class="show-qr" v-show="isHover">
              <QrcodeVue class="qrcode" :value="HostUrl.download" :size="60"></QrcodeVue>
              <span>扫码下载APP</span>
            </div>
          </li>

        </ul>
        <span class="log" @click="changeLoginForm(true)" v-if="!this.$store.state.isLogin">登录/注册</span>
        <div class="info" v-else>
          <img class="avator" :src="icon ? `${HostUrl.http}image/${icon}` : `/static/images/default_avator.png`" alt="">
          <div class="name" @click="showMenu = !showMenu" >
            <span class="login" >{{name}}</span>
            <img class="select-icon" src='/static/images/triangle_black.png' v-if="!showMenu" alt="">
            <img class="select-icon" src='/static/images/triangle_black_up.png' v-else alt="">
            <ul v-if="showMenu" v-clickoutside="hideShowMenu">
              <router-link to="/personal" tag="li" active-class="selected" class="center">个人中心</router-link>
              <router-link :to="{name:'safe'}" tag="li" active-class="selected" class="safe">安全设置</router-link>
              <router-link :to="{name:'personal-auth'}" tag="li" active-class="selected" class="auth">实名认证</router-link>
              <li class="logout" @click="logout">退出</li>
            </ul>
          </div>
        </div>
        <Login v-if="showLoginForm"/>
      </div>
    </section>
    <BasePopup :show="realLayer"
               class="real-layer">
      <span v-clickoutside="closeLayer">
        请先进行<router-link to="/personal/account/auth">实名认证</router-link>
      </span>
    </BasePopup>
  </article>
</template>

<script>
  import Login from '@/components/common/Login'
  import HeaderPrice from '@/components/common/HeaderPrice'
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import QrcodeVue from 'qrcode.vue'

  export default {
    data() {
      return {
        isHover: false,
        showMenu: false,
        adChild: false,
        newOrder: 0,
        realLayer: false
      }
    },
    components: {
      Login,
      HeaderPrice,
      BasePopup,
      QrcodeVue
    },
    mounted() {
      // console.log('header')
      let ws = this.WebSocket;
      ws.onMessage['upd_ord_top'] = {
        callback: (data) => {
          data && data.body &&  data.body.type === 'upd_ord' && this.path !== '/order' && this.newOrder++
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
        localStorage.setItem("removeSessionStorage", Date.now());
        this.$store.commit({type: 'changeToken', data: ''});
        this.$store.commit({type: 'changeLogin', data: false});
        this.WebSocket.reConnectFlag = false;
        this.WebSocket.close();
        if (["/transaction", "/", "/homepage", "/helpcenter", "/coinData"].includes(this.$route.path)) {
            return;
        }
        this.$router.push('transaction')
      },
      hideShowMenu() {
        if (!this.showMenu) return;
        this.showMenu = false
      },
      releaseAd() { // 发广告操作
        if (this.$store.state.userInfo.verify !== 2) {
          this.realLayer = true
          setTimeout(() => {
            this.realLayer = false
          }, 3000)
          return
        }
        this.adChild = false
        this.$router.push({path:'/advertisement/release'})
        if (this.$store.state.editFlag == 2 || this.$store.state.editFlag == 1) {
          window.location.reload()
        }
        this.$store.commit({type: 'releaseAd', data:{flag: 0}})
      },
      goMyAd() { // 我的广告操作
        if (this.$store.state.userInfo.verify !== 2) {
          this.realLayer = true
          setTimeout(() => {
            this.realLayer = false
          }, 3000)
          return
        }
        this.adChild = false
        this.$router.push({path:'/advertisement'})
      },
      closeLayer() {
        this.realLayer = false
      }
    },
    computed: {
      icon() {
        return this.$store.state.userInfo.icon
      },
      name() {
        return this.$store.state.userInfo.name ? this.$store.state.userInfo.name : (this.$store.state.userInfo.phone ? this.$store.state.userInfo.phone.showOther() : this.$store.state.userInfo.email.showEmail())
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
          curVal === '/personal/account/auth' && (this.realLayer = false)
          // curVal === '/advertisement/release/buy' && (this.realLayer = false)
          // curVal === '/advertisement/release/sale' && (this.realLayer = false)
          // curVal === '/advertisement' && (this.realLayer = false)
          // if (["/verify", "/verify/identifyAuth", "/verify/largeTransaction", "/verify/arbitrationRecord", "/verify/service"].includes(this.$route.path) && this.$store.state.userInfo && !this.$store.state.userInfo.is_admin) {
          //   console.log(9999)
          //   this.$router.push('/transaction');
          // }
         },
        //  immediate: true
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

  .logoImg
    width 120px
    height 26.9px

  .header
    height 100px
    background-color #fff

    .upper
      height 30px
      background-color #333

    .down
      height 70px
      border 1px solid #E1E1E1
      background #FFF
      .down-tag
        height 70px
        flex 1
        font-size 14px
        >li
          height 68px
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
          &.ad
            width 70px
            ol
              position absolute
              top 70px
              width 70px
              background #FFF
              box-shadow 0 2px 4px 0 #E1E1E1
              font-size 13px
              cursor pointer
              li
                width 70px
                height 40px
                text-align center
                line-height 40px
                &:hover
                  background: #FFF3EB
          &.selected
            border-bottom 2px solid $col422
          &.active
            border-bottom 2px solid $col422
        .itag
          line-height 60px
          padding 0 41.5px
        .tag, .itag
          &:hover
            border-bottom 2px solid $col422
          .show-qr
            position absolute
            left 0
            top 72px
            width 100px
            height 100px
            background-color #FFF
            z-index 9
            .qrcode
              margin-top 10px
            span
              position absolute
              left 3px
              bottom 15px
              width 100%
              height 12px
              line-height 12px
              fz11()
        .tag-hover
          &:hover
            background #FFF3EB
      .log
        font-size 14px
        color $col422
        cursor pointer
      .info
        position relative
        height 100%
        .avator
          float left
          width 45px
          height 45px
          border-radius 50%
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
  .real-layer
    text-align center
    line-height 94px
    span
      a
        text-decoration underline
        color #FFB422

</style>
