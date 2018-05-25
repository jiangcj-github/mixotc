<template>
  <div class="wrap">
    <div class="login" v-if="showForm">
      <img src="/static/images/close_btn.png" alt="" class="close-btn" @click="hideLoginForm">
      <h2 class="title">登录/注册</h2>

      <div :class="{'hide-tip1':type,'show-tip1':!type}">请输入正确的手机号/邮箱</div>

      <div class="account">
        手机号/邮箱
        <input type="text" value="" v-model="account" @focus="accountCancel = true"  v-clickoutside="accountBlur">
        <img src="/static/images/cancel_icon.png" alt="" v-if="accountCancel" @click="account = ''">
        <ul class="account-history" v-if="accountCancel && accountSearch.length">
          <li v-for="(item, index) of accountSearch" :key="index" @click="changeAccount(item)">{{item}}</li>
        </ul>
      </div>

      <Slider :slideStatus="slideStatus"></Slider>

      <div :class="{'hide-tip2':captcha,'show-tip2':!captcha}">请输入正确的验证码</div>

      <div class="yzm">
        <span v-if="moveTip"><img src="/static/images/hint.png" alt="">&nbsp;<b>请先拖拽滑块</b></span>
        <input type="text" @focus="codeCancel = true" @blur="codeCancel = false" placeholder="验证码" value="" v-model="code" :disabled="!moveTrue || !checkAccount(account)">
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-if="codeCancel" @click="code = ''">
        <button :class="{'sendCaptcha':!isSend,'sendedCaptcha':isSend, disable: !moveTrue || !checkAccount(account)}" @click="sendCode">{{isSend ? time + '秒后重发': sendCodeText}}</button>
      </div>

      <button class="log" :class="{able: moveTrue && agree}" :disabled="!moveTrue || !agree" @click="login">登录</button>

      <div class="yhxy">
        <img src="/static/images/rules_checked.png" alt="" v-if="agree" @click="agree = false">
        <img src="/static/images/rules_unchecked.png" alt="" v-else @click="agree = true">
        <p>我已阅读并同意 <a href="/#/transaction/tradeRules?source=4" target="_blank">用户协议</a></p>
      </div>

      <span :class="{'hide-tips':agree,'yhxy-tips':!agree}"><img src="/static/images/hint.png" alt="">&nbsp;&nbsp;<b>请勾选用户协议</b></span>
    </div>
    <BasePopup class="popup" :show="loginSuccess" :top="29.17" v-on:click.native="hideLoginForm">
      <slot>
        <p>登录成功</p>
      </slot>
    </BasePopup>

  </div>
</template>

<script>
  import Slider from './Slider'
  import BasePopup from './BasePopup'
  import sendConfig from '@/api/SendConfig.js'
  import getExplorerInfo from '@/js/Browser.js'
  import detectOS from '@/js/Os.js'

  export default {
    name: "login",
    data() {
      return {
        showForm: true,
        moveTrue: false,
        slideStatus: 'slideStatuss',
        agree: true,
        account: '',
        accountCancel: false,
        accountHistory: [],
        code: '',
        codeCancel: false,
        type: true,
        accType: '',
        captcha: true,
        isSend: false,
        moveTip: false,
        loginSuccess: false,
        time:'',
        interval: null,
        timer: null,
        sendCodeText: '发送验证码',
        href: ''
      }

    },
    components: {
      Slider,
      BasePopup
    },
    computed: {
      accountSearch() {
        return this.accountHistory.filter(item => {
          return item.includes(this.account)
        })
      }
    },
    methods: {
      hidePopup() {
        this.loginSuccess = false
        this.hideLoginForm();
      },
      checkAccount(account) {
        return /^1[34578]\d{9}$/.test(account) ? 'phone' : (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(account) ? 'email' : false)
      },
      changeAccount(account) {
        this.account = account;
      },
      //保存登录账号最多5个
      saveAccount(account) {
        let storage = this.Storage.otcAccount;
        let list = storage.get();
        if (!list) {
          storage.set([account])
          return;
        }
        if (list) {
          let index = list.indexOf(account);
          if (index !== -1) {
            list.splice(index,1) && list.unshift(account)
            storage.set(list);
            return;
          }
          list.length < 5 && list.unshift(account)
          list.length >= 5 && list.splice(4,1) && list.unshift(account)
          storage.set(list)
        }
      },
      accountBlur() {
        this.accountCancel = false
        this.type = this.checkAccount(this.account)
      },
      checkCaptcha(code) {
        return /^\d{6}$/.test(code);
      },
      sendCode(){
        if (this.isSend){
          return
        };
       this.type = this.checkAccount(this.account);
        let accType = this.checkAccount(this.account);
        if (!this.type) return;
        if (!this.moveTrue) {
          this.moveTip = true;
          return;
        }
        this.accType = this.type;
        const $ = 60;
        if(!this.interval){
          this.time = $;
          this.isSend = true;
          clearInterval(this.interval);
          this.interval = setInterval(() =>{
            if(this.time > 0 && this.time <= $){
              this.time--;
            } else {
              this.isSend = false;
              clearInterval(this.interval);
              this.interval = null;
              this.sendCodeText = '重新发送验证码'
            }
          },1000);
        }
        let ws = this.WebSocket;
        ws.start(this.HostUrl.ws);
        let seq = ws.seq;
        ws.onOpen[seq]= () =>{
          ws.send(sendConfig('send_code',{
            seq: seq,
            body:{
              action: 'send_code',
              phone: this.accType === "phone" ? this.account : "",
              email: this.accType === "email" ? this.account : "",
              os: 3
            }
          }))
        }

      },
      login(){
        this.type = this.checkAccount(this.account);
        this.captcha = this.checkCaptcha(this.code);
        this.accType = this.type;
        if(!this.type || !this.captcha) return;
        let ws =this.WebSocket;
        ws.start(this.HostUrl.ws);
        let seq = ws.seq;
        ws.onMessage[seq] = {
          callback: (data)=>{
            if(!data || data.body.ret !== 0 && data.body.ret !== 8) return;
            if(data.body.ret === 8) {
              this.captcha = false;
              return;
            }
            this.showForm = false;
            this.loginSuccess = true;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.hidePopup();
            },3000)
            if(data.body && this.$store.state.userInfo && this.JsonBig.stringify(this.$store.state.userInfo.uid) !== this.JsonBig.stringify(data.body.uid)) {
              this.$store.commit({ type: 'initState'})
            }
            this.$store.commit({
              type: 'getUserInfo',
              data: data.body
            });
            this.saveAccount(this.account)
            data.body.token && this.$store.commit({ type: 'changeToken', data: data.body.token })
            data.body.token && localStorage.setItem('getToken', data.body.token);
            this.$store.commit({ type: 'changeLogin', data: true });
            this.Storage.loginTime.set(new Date() - 0)
            localStorage.removeItem('getToken')

          },
          date:new Date()
        };
        ws.onOpen[seq]= () =>{
          ws.send(sendConfig('login',{
            seq: seq,
            body:{
              action: 'login',
              phone: this.accType === "phone" ? this.account : "",
              email: this.accType === "email" ? this.account : "",
              code: this.code,
              country: 'CN',
              version: 1,
              mode: 0,
              device: `${detectOS()}/${getExplorerInfo()}`,
              os: 3,
            }
          }))
        }
      },
      hideLoginForm() {
        this.$store.commit({type: 'changeLoginForm', data: false});
      }
    },
    mounted() {
      let otcAccount = this.Storage.otcAccount.get()
      if (otcAccount) {
        this.accountHistory = otcAccount;
        this.account = otcAccount[0]
      }
      this.Bus.$on(this.slideStatus, (status) => {
        this.moveTrue = status;
        this.moveTip = false;
        // console.log(this.moveTrue)
        this.sendCode()
      })
    },
    destroyed() {
      this.Bus.$off(this.slideStatus);
      clearInterval(this.interval);
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .wrap
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.4)
    z-index 999
    noselect()
    .login
      position fixed
      top 50%
      left 50%
      width 400px
      height 342px
      margin-left -200px
      margin-top -210px
      padding 40px 0
      background-color: #fff
      z-index 999
      .close-btn
        position absolute
        right 20px
        top 20px
        width 10px
        height 10px
        cursor pointer
      .show-tip1, .show-tip2
        position absolute
        padding 0 9px
        height 28px
        background-color $col1E1
        text-align center
        line-height 30px
        font-size 12px
        border-radius 2px
        box-shadow 0 2px 4px 0 $col999
        &::after
          border solid 3px
          border-color $col1E1 $col1E1 transparent transparent
          position absolute
          content ''
          width 1px
          height 1px
          bottom -3px
          left 50%
          margin-left -10px
          overflow hidden
          pointer-events none
          transform rotate(135deg)
          box-shadow 2px -2px 2px $col999
      .show-tip1
        top 22%
        left 30%
      .hide-tip1
        display none
      .show-tip2
        top 53.5%
        left 34%
      .hide-tip2
        display none
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
        position relative
        margin-top 40px
        margin-left 40px
        font-size 14px
        color $col999
        img
          position absolute
          right 55px
          bottom 28px
          cursor pointer
        input
          box-sizing()
          display inline-block
          width 320px
          height 40px
          padding-left 10px
          margin 10px 0 15px
          font-size $fz14
          color $col333
          letter-spacing 0.16px
          background-color $col6FA
          border-radius 2px
          &:focus
            border 1px solid $col422
        .account-history
          position absolute
          left 0
          top 69px
          width 318px
          background #FFF
          border 1px solid $col1E1
          z-index 9
          li
            box-sizing()
            padding-left 10px
            height 30px
            line-height 30px
            cursor pointer
            &:hover
              background $col3EB;
      .yzm
        position relative
        margin 35px 40px 15px
        span
          position absolute
          top -25px
          left 0
          b
            display inline-block
            color $col94C
            text-align center
            fz11()
        .cancel
          position absolute
          top 15px
          right 124px
          cursor pointer
        input
          box-sizing()
          width 210px
          height 40px
          float left
          background-color: $col6FA
          placeholder()
          padding-left 10px
          &:focus
            border 1px solid $col422
        button
          width 100px
          height 40px
          margin 0
          text-align center
          font-size 14px
          line-height 40px
          color #fff
          cursor pointer
          &.sendCaptcha
            background-color $col422
          &.sendedCaptcha
            background-color $col999
            cursor default
          &.disable
            background-color $col999
            cursor default
      .log
        width 350px
        height 40px
        margin-left 25px
        background-color: $col999
        text-align center
        line-height 40px
        color #FFF
        border-radius 2px
        &:focus
          outline 0
        &.able
          background $col422
          &:active
            background $col350
      .yhxy
        height: 12px
        line-height 12px
        margin 20px 0 10px 125px

        img
          margin-right 5px
          cursor pointer
        p
          display inline-block
          letter-spacing 0.23px
          fz11()

          a
            color $col100
            fz11()

      .hide-tips
        display none
      .yhxy-tips
        display inline-block
        margin-left 150px
        color $col94C
        text-align center
        line-height 12px
        b
          display inline-block
          color $col94C
          fz11()
    .popup
      p
        height 94px
        line-height 94px
        text-align center
        font-size $fz14
        color $col333
        letter-spacing: 0.29px
</style>
