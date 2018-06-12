<template>
  <div class="wrap">
    <div class="login" v-if="showForm" >
      <img src="/static/images/close_btn_tr2.png" alt="" class="close-btn" @click="hideLoginForm">
      <h2 class="title">登录/注册</h2>
      <div class="account">
        <div class="show-tip1" v-show="showTip1">请输入正确的手机号/邮箱</div>
        <span>手机号/邮箱</span>
        <input type="text" value="" v-model.trim="account" @focus="onAccountFocus" @blur="onAccountBlur">
        <img src="/static/images/cancel_icon.png" alt="" v-if="account.length>0" @click="account = ''">
        <ul class="account-history" v-if="showAccountHistory && accountHistory.length">
          <li v-for="(item, index) of accountHistory" :key="index" @mousedown="account=item">{{item}}</li>
        </ul>
      </div>
      <Slider onSliderOk="onSliderOk" ref="slider"></Slider>
      <div class="yzm">
        <div class="show-tip2" v-show="showTip2">请输入正确的验证码</div>
        <span v-show="moveTip"><img src="/static/images/hint.png" alt="">&nbsp;<b>请先拖拽滑块</b></span>
        <p>
          <input type="text" placeholder="验证码" @keydown.enter="login" v-model.trim="code" :disabled="!canInputCode" @focus="onCodeFocus" @blur="onCodeBlur">
          <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="code.length>0" @click="code = ''">
        </p>
        <button :class="{able:canSendCode}" @click="sendCode">{{isSend ? time + '秒后重发': sendCodeText}}</button>
      </div>

      <button class="log" :class="{able:canLogin}" @click="login">登录</button>

      <div class="yhxy">
        <img src="/static/images/rules_checked.png" alt="" v-if="agree" @click="agree = false">
        <img src="/static/images/rules_unchecked.png" alt="" v-else @click="agree = true">
        <p>我已阅读并同意 <a href="/#/helpcenter?source=4" target="_blank">用户协议</a></p>
      </div>

      <span :class="{'hide-tips':agree,'yhxy-tips':!agree}"><img src="/static/images/hint.png" alt="">&nbsp;&nbsp;<b>请勾选用户协议</b></span>
    </div>
    <BasePopup class="popup" :show="loginSuccess" :top="29.17" v-on:click.native="hideLoginForm">
      <slot>
        <p>登录成功</p>
      </slot>
    </BasePopup>
    <Alert ref="alert"></Alert>
  </div>
</template>

<script>
  import Slider from './Slider'
  import BasePopup from './BasePopup'
  import sendConfig from '@/api/SendConfig.js'
  import getExplorerInfo from '@/js/Browser.js'
  import detectOS from '@/js/Os.js'
  import Alert from "@/views/common/widget/Alert"
  import timeout from "@/js/Timeout.js"

  export default {
    name: "login",
    data() {
      return {
        showForm: true,
        moveTrue: false,
        agree: true,
        account: '',
        showAccountHistory: false,
        accountHistory: [],
        code: '',
        type: true,
        accType: '',
        captcha: true,
        isSend: false,
        moveTip: false,
        loginSuccess: false,
        time:'',
        timer: null,
        sendCodeText: '发送验证码',

        showTip1: false,
        showTip2: false,
        loginErr: 0,    //登录状态标识，0-正常，1-登录中
      }

    },
    components: {
      Slider,
      BasePopup,
      Alert,
    },
    computed:{
      canInputCode:function(){
        return this.moveTrue && this.checkAccount();
      },
      canSendCode:function(){
        return this.moveTrue && this.checkAccount() && !this.isSend;
      },
      canLogin:function () {
        return this.moveTrue && this.agree && this.checkAccount() && this.checkCaptcha() && this.loginErr===0;
      },
    },
    watch:{
      account:function(){
        //账号改变，重置验证码状态
        this.isSend=false;
        this.sendCodeText="发送验证码";
        this.moveTrue=false;
        this.$refs.slider.reset();
        timeout(null,0,"timer_code");
      }
    },
    methods: {
      hidePopup() {
        this.loginSuccess = false
        this.hideLoginForm();
      },
      checkAccount() {
        let account=this.account;
        if(/^1[34578]\d{9}$/.test(account)){
          return "phone";
        }else if(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(account)){
          return "email";
        }
        return false;
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
      onAccountFocus(){
        this.showAccountHistory=true;
        this.showTip1=false;
      },
      onAccountBlur() {
        this.type = this.checkAccount();
        this.showAccountHistory=false;
        this.showTip1=!this.checkAccount();
      },
      onCodeFocus(){
        this.showTip2=false;
      },
      onCodeBlur(){
        this.showTip2=!this.checkCaptcha();
      },
      checkCaptcha() {
        return /^\d{6}$/.test(this.code);
      },
      sendCodeTimer(time){
        if(time<=0){
          this.isSend = false;
          this.sendCodeText = '重新发送';
          return;
        }
        time--;
        this.isSend = true;
        this.time=time;
        timeout(()=>{
          this.sendCodeTimer(time)
        },1000,"timer_code");
      },
      sendCode(){
        if(this.isSend) return;
        this.type = this.checkAccount();
        this.accType = this.type;
        if (!this.type) return;
        if (!this.moveTrue) {
          this.moveTip = true;
          return;
        }
        //发送验证码
        let ws =this.WebSocket;
        ws.start(this.HostUrl.ws);
        let seq = ws.seq;
        ws.onMessage[seq] = {
          callback: (data)=>{
            this.loginErr=0;    //正常
            let msg=data.body;
            if(msg && msg.ret===0){
              //60秒倒计时
              this.sendCodeTimer(60);
            }else if(msg && msg.ret===201){
              let time=msg.rest_time;
              let restTime=Math.ceil(time/60);
              this.$refs.alert.showAlert({content:"本账号操作频繁，请"+restTime+"分钟后再登录"});
            }else if(msg && msg.ret===3){
              this.$refs.alert.showAlert({content:"已发送过验证码"});
            }else{
              this.$refs.alert.showAlert({content:"发送失败"});
            }
          },
          date:new Date()
        };
        ws.onOpen[seq]= () =>{
          this.loginErr=1;        //登录中...
          ws.send(sendConfig("send_code",{
            seq: seq,
            body:{
              action:"send_code",
              phone: this.accType === "phone" ? this.account : "",
              email: this.accType === "email" ? this.account : "",
              os: 3
            }
          }))
        };
      },
      login(){
        this.type = this.checkAccount();
        this.captcha = this.checkCaptcha();
        this.accType = this.type;
        if(!this.type || !this.captcha) return;
        let ws =this.WebSocket;
        ws.start(this.HostUrl.ws);
        let seq = ws.seq;
        ws.onMessage[seq] = {
          callback: (data)=>{
            if(!data||!data.body||data.body.ret===1){
              this.$refs.alert.showAlert({content:"登录失败"});
              return;
            }
            if(data.body.ret===2){
              this.$refs.alert.showAlert({content:"验证超时"});
              return;
            }else if(data.body.ret===3){
              this.$refs.alert.showAlert({content:"验证码失效"});
              return;
            }else if(data.body.ret===8){
              this.$refs.alert.showAlert({content:"验证码错误"});
              return;
            }else if(data.body.ret!==0){
              this.$refs.alert.showAlert({content:"登录失败"});
              return;
            }
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
            data.body['code'] = this.code;
            this.$store.commit({
              type: 'getUserInfo',
              data: data.body
            });
            this.saveAccount(this.account)
            data.body.token && this.$store.commit({ type: 'changeToken', data: data.body.token })
            data.body.token && localStorage.setItem('getToken', JSON.stringify({
              phone:data.body.phone,
              email:data.body.email,
              token: data.body.token,
              code: data.body.code
            }));
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
      let otcAccount = this.Storage.otcAccount.get();
      if (otcAccount) {
        this.accountHistory = otcAccount;
        this.account = otcAccount[0]
      }
      this.Bus.$on("onSliderOk", () => {
        this.moveTrue = true;
        this.moveTip = false;
        this.canSendCode && this.sendCode();
      })
    },
    destroyed() {
      this.Bus.$off("onSliderOk");
      timeout(null,0,"timer_code");
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
      height 441px
      margin-left -200px
      margin-top -220px
      padding 40px
      background-color: #fff
      z-index 999
      box-sizing border-box
      border-radius 2px
      .close-btn
        position absolute
        right 20px
        top 20px
        width 10px
        height 10px
        cursor pointer
      .show-tip1, .show-tip2
        position absolute
        left 50%
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
          margin-left -4px
          overflow hidden
          pointer-events none
          transform rotate(135deg)
          box-shadow 2px -2px 2px $col999
      .show-tip1
        top -4px
        transform translate(-50%,0)
      .show-tip2
        top -32px
        transform translate(-50%,0)
      .title
        height 20px
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
        font-size 14px
        color $col999
        img
          position absolute
          right 10px
          bottom 28px
          cursor pointer
          width 12px
        input
          box-sizing()
          display inline-block
          width 320px
          height 40px
          padding:0 30px 0 10px
          margin 10px 0 15px
          font-size $fz14
          color $col333
          letter-spacing 0.16px
          background-color $col6FA
          border-radius 2px
          border 1px solid $col6FA
          &:focus
            border-color $col422
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
            font-size 13px
            &:hover
              background $col3EB;
      .yzm
        position relative
        margin 35px 0 20px 0
        span
          position absolute
          top -25px
          left 0
          img
            vertical-align -1px
            margin-right 1px
          b
            display inline-block
            color $col94C
            text-align center
            fz11()
        p
          .cancel
            position absolute
            top 15px
            right 110px
            cursor pointer
            width 12px
          input
            float left
            box-sizing()
            width 220px
            height 40px
            font-size $fz14
            background-color: $col6FA
            placeholder()
            padding-left 10px
            padding-right 30px
            border 1px solid $col6FA
            border-right none
            border-radius 2px 0 0 2px
            &:focus
              border-color $col422
        button
          width 100px
          height 40px
          margin 0
          text-align center
          font-size 14px
          line-height 40px
          color #fff
          cursor pointer
          border-radius 0 2px 2px 0
          background-color #999
          pointer-events none
          &.able
            background-color #ffb422
            pointer-events all
            &:hover
              background-color fea350
      .log
        width 320px
        height 40px
        font-size $fz14
        background-color: $col999
        text-align center
        line-height 40px
        color #FFF
        border-radius 2px
        outline none
        cursor default
        pointer-events none
        &.able
          cursor pointer
          background #ffb422
          pointer-events all
          &:hover
            background #fea350
      .yhxy
        height: 12px
        line-height 12px
        width 320px
        text-align center
        margin-top 20px
        img
          margin-right 5px
          vertical-align -1px
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
        margin-top 10px
        display inline-block
        color $col94C
        text-align center
        line-height 12px
        width 320px
        >img
          height 12px
          width 12px
          vertical-align -1px
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
