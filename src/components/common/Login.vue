<template>
  <div class="wrap">
    <div class="login" v-clickoutside="hideLoginForm">
      <h2 class="title">登录/注册</h2>
      <div :class="{'hide-tip1':type,'show-tip1':!type}">请输入正确的手机号/邮箱</div>
      <p class="account">
        手机号/邮箱
        <input type="text" value="" v-model="account">
      </p>
      <Slider :slideStatus="slideStatus"></Slider>
      <div :class="{'hide-tip2':captcha,'show-tip2':!captcha}">请输入正确的验证码</div>
      <p class="yzm">
        <input type="text" placeholder="验证码" value="" v-model="code">
        <button :class="{'sendCaptcha':!isSend,'sendedCaptcha':isSend}" @click="sendCode">{{isSend ? time + '秒后重发': sendText}}</button>
      </p>
      <button :class="{able:!slideStatus && agree}" :disabled="slideStatus || !agree" @click="login">登录</button>
      <div class="yhxy">
        <img src="/static/images/rules_checked.png" alt="" v-if="agree" @click="agree = false">
        <img src="/static/images/rules_unchecked.png" alt="" v-else @click="agree = true">
        <p>我已阅读并同意 <a href="">用户协议</a></p>
      </div>
      <span :class="{'hide-tips':agree,'yhxy-tips':!agree}"><i>!</i>&nbsp;&nbsp;请勾选用户协议</span>
    </div>
  </div>
</template>

<script>
  import Slider from './Slider.vue'
  import sendConfig from '@/api/SendConfig.js'

  export default {
    props: ['loginForm'],
    name: "login",
    data() {
      return {
        slideStatus: 'slideStatuss',
        agree: true,
        account: '',
        code: '',
        type: true,
        accType: '',
        captcha: true,
        isSend: false,
        time:'',
        sendText: '发送验证码',
        interval: null
      }

    },
    components: {
      Slider
    },
    methods: {
      checkAccount(account) {
        return /^1[34578]\d{9}$/.test(account) ? 'phone' : (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(account) ? 'email' : false)
      },
      checkCaptcha(code) {
        return /^\d{6}$/.test(code);
      },
      sendCode(){
        let type = this.checkAccount(this.account);
        let accType = this.checkAccount(this.account);
        if(!type) return;
        this.accType = accType;
        const $ = 60;
        if(!this.interval){
          this.time = $;
          this.isSend = true;
          this.interval = setInterval(() =>{
            if(this.time > 0 && this.time <= $){
              this.time--;
            }else{
              this.isSend = false;
              clearInterval(this.interval);
              this.interval = null;
            }
          },1000);
        }
        let ws = this.WebSocket;
        ws.start('ws://39.106.157.67:8090/sub');
        let seq = ws.seq;
        ws.onOpen[seq]= () =>{
          ws.send(sendConfig('send_code',{
            seq: seq,
            body:{
              action: 'send_code',
              phone: this.accType === "phone" ? this.account : "",
              email: this.accType === "email" ? this.account : ""
            }
          }))
        }

      },
      login(){
        this.type = this.checkAccount(this.account);
        this.captcha = this.checkCaptcha(this.code);
        if(!this.type || !this.captcha) return;
        let ws =this.WebSocket;
        ws.start('ws://39.106.157.67:8090/sub');
        let seq = ws.seq;
        ws.onMessage[seq]= {
          callback:(data)=>{
            if(!data || data.body.ret !== 0) return;
            this.$store.commit({
              type: 'getUserInfo',
              data: data.body
            });
            data.body.msg && this.Storage.otcToken.set(data.body.msg);
            this.$store.commit({ type: 'changeLogin', data: true });
            console.log('login', this);
            this.hideLoginForm();
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
              device: '',
              os: 1
            }
          }))
        }
      },
      hideLoginForm() {
        if (!this.loginForm) return;
        this.$emit('update:loginForm', false);
      }

    },
    mounted(){
      this.Bus.$on(this.slideStatus,(status) => {
        this.slideStatus = status
      })
    },
    destroyed(){
      this.Bus.$off(this.slideStatus);
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

        .sendCaptcha
          width 100px
          height 40px
          margin 0
          background-color: $col422
          text-align center
          line-height 40px
          color #fff
          cursor pointer
        .sendedCaptcha
          width 100px
          height 40px
          margin 0
          background-color: $col999
          text-align center
          line-height 40px
          color #fff
          pointer-events none
          cursor default

      button
        width 350px
        height 40px
        background-color: $col999
        text-align center
        line-height 40px
        color #FFF
        margin-left 25px
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
        fz11()
        i
          display inline-block
          width 12px
          height 12px
          background-color: $col94C
          border 1px solid $col94C
          border-radius 28px
          text-align center
          vertical-align middle
          line-height 12px
          color #fff
          fz11()
</style>
