<template>
  <div>
    <BasePopup :show="true" :top="52" :width="470" :height="isnew ? 400 : 470">
      <slot>
        <div class="main">
          <img class="close-btn" src="/static/images/close_btn_tr2.png" alt="" @click="Bus.$emit(emitValue)">
          <h4>支付密码</h4>
          <p class="tip">*出于安全方面的考虑，修改密码后，你的账户将在24小时内无法提现。</p>
          <div class="password1" :class="{show: flag1}">
            <p>密码<span>密码为8--12位字符，且同时包含字母和数字</span></p>
            <input :type="type1" v-model="password1" autocomplete="new-password" maxlength="12" @blur="verifyPassword1" @keydown.enter="submit">
            <i class="hint" v-if="tip1">{{copy1}}</i>
            <img src="/static/images/visible.png" alt="" v-if="flag1" @click="()=>{flag1=false; type1='password'}">
            <img src="/static/images/invisible.png" alt="" v-else @click="()=>{flag1=true; type1='text'}">
          </div>
          <div class="password2" :class="{show: flag2}">
            <p>再输一遍</p>
            <input :type="type2" v-model="password2" autocomplete="new-password" maxlength="12" @blur="verifyPassword2" @keydown.enter="submit">
            <i class="hint" v-if="tip2">两次输入密码不一致</i>
            <img src="/static/images/visible.png" alt="" v-if="flag2" @click="()=>{flag2=false; type2='password'}">
            <img src="/static/images/invisible.png" alt="" v-else @click="()=>{flag2=true; type2='text'}">
          </div>
          <div class="verify" v-if="!isnew">
            <div class="message" v-if="type">
              <p>手机验证码</p>
              <input type="text" v-model="messageWord" maxlength="6" @focus="timeout = false" @input="dealCode" @blur="verifyCode" @keydown.enter="submit"><button @click="getCode" :disabled="!canSend" :class="{disable: !canSend}">{{codeCopy}}</button>
              <i class="hint" v-if="tip3">请输入正确的验证码</i>
              <i class="hint" v-if="!tip3 && timeout">验证码超时</i>
            </div>
            <div class="google" v-else>
              <p>谷歌验证码</p>
              <div class="input">
                <input type="text"
                  v-for="index in 6"
                  v-focus="index === inputContent"
                  v-model="inputGroup[index-1]"
                  maxlength="1"
                  @input="dealInput(index-1)"
                  :key="index"
                  @keydown="delNum(index)"
                />
              </div>
              <i class="hint" v-if="tip4">请输入正确的验证码</i>
            </div>
          </div>
          <button
            class="submit"
            @click="submit"
          >
            确定
          </button>
        </div>
      </slot>
    </BasePopup>
    <BasePopup :show="showSame" :top="46" @click.native="hidePopup" class="show-same">
      <slot>
        <p>{{popupCopy}}</p>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
 import BasePopup from '@/components/common/BasePopup';
 import encrypt from '@/js/encrypt';
  export default {
    props:['type', 'emitValue', 'isnew'],
    data(){
      return {
        password1: '',
        password2: '',
        type1:'password',
        type2: 'password',
        flag1: false,
        flag2: false,
        messageWord: '',
        showSame: false,
        popupCopy:'',
        codeCopy:'获取验证码',
        canSend:true,
        timer:null,
        timer2:null,
        time: 60,
        timeout: false,
        copy1:'',
        tip1:false,
        tip2:false,
        tip3:false,
        tip4:false,
        inputGroup: ['','','','','',''], // 记录输入框内容,
        inputContent: ''
      }
    },
    components: {
      BasePopup
    },
    mounted(){
      //let uid = this.JsonBig.stringify(this.$store.state.userInfo.uid);
      //console.log("===================",encrypt("12345678a","197154964416499712"),uid,this.$store.state.userInfo.uid)
    },
    destroyed() {
      clearInterval(this.timer);
      clearTimeout(this.timer2);
    },
    computed:{
    },
    methods: {
      hidePopup(){
        this.showSame = false;
        clearTimeout(this.timer2);
      },
      showPopup(){
        this.showSame = true;
        clearTimeout(this.timer2);
        this.timer2 = setTimeout(() => {
          this.showSame = false;
          clearTimeout(this.timer2)
        }, 3000);
      },
      verifyPassword1(){
        if(this.password2 !== '') this.verifyPassword2()
        if(this.password1.length < 8 || this.password1.length > 12) {
          this.tip1 = true;
          this.copy1 = '密码长度为8--12位'
          return;
        }
        if(!/^[0-9a-zA-Z]+$/.test(this.password1) || /^[0-9]+$/.test(this.password1) || /^[a-zA-Z]+$/.test(this.password1)){
          this.tip1 = true;
          this.copy1 = '密码应同时包含字母和数字'
          return;
        }
        this.tip1 = false;
      },
      verifyPassword2(){
        if(this.password1 !== this.password2) {
          this.tip2 = true;
          return;
        }
        this.tip2 = false;
      },
      verifyCode(){
        if(this.type && this.messageWord.length < 6) {
          this.tip3 = true;
          return;
        }
        if(!this.type && this.inputGroup.join('').length < 6){
          this.tip4 = true;
          return;
        }
        this.type && (this.tip3 = false);
        !this.type && (this.tip4 = false);
      },
      getCode(){
        this.time = 60;
        this.canSend = false;
        clearInterval(this.timer);
        this.codeCopy = `${this.time}秒后重发`
        this.timer = setInterval(() => {
          this.time--
          this.codeCopy = `${this.time}秒后重发`
          if(this.time === 0){
            this.canSend = true;
            clearInterval(this.timer);
            this.codeCopy = '获取验证码'
          }
        }, 1000);
        this.WsProxy.send('control', 'send_code', {type:1}).then(data=>{
        })
      },
      dealCode(){
        if(!(/(^[0-9]\d*$)/.test(this.messageWord))){
          this.messageWord = this.messageWord.replace(/[^0-9]/g,"");
        };
      },
      dealInput(num){
        if(!/^[0-9]\d*$/.test(this.inputGroup[num])) {
          this.inputGroup[num] = '';
          return;
        };
        if(this.inputGroup[num] === '') {
          this.inputContent = num + 1;
          return
        }
        if(this.inputGroup[num] !== '') this.inputContent = num + 2;
      },
      delNum(index) {
        let oEvent = window.event;
        if (this.inputGroup[index - 1] === '' && oEvent.keyCode === 8) {
          this.inputContent = index - 1;
          this.inputGroup[index - 2] = '';
        }
      },
      submit(){
        this.verifyPassword1();
        !this.tip2 && this.verifyPassword2();
        !this.isnew && this.verifyCode();
        if(this.tip1 || this.tip2 || this.tip3 || this.tip4) return;
        let uid = this.JsonBig.stringify(this.$store.state.userInfo.uid);
        this.WsProxy.send('control', this.isnew ? 'user_update' : 'reset_pass',
          this.isnew ? {
            newpass: encrypt(this.password1, uid)
            } : {
              code: this.type ? this.messageWord : this.inputGroup.join(''),
              pass: encrypt(this.password1, uid)
            }
        ).then(data=>{
          this.isnew && this.$store.commit({type:'updateUserInfo', data:{is_new: 0}})
          this.Bus.$emit(this.emitValue, true)
        }).catch(error=>{
          if(error.ret === 8 || error.ret === 6){
            this.type && (this.tip3 = true);
            !this.type && (this.tip4 = true);
          }
          if(error.ret === 4){
            this.timeout = true;
          }
          if(error.ret === 91){
            this.popupCopy = '新密码不能与原密码相同';
            this.showPopup()
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
.show-same
  p
    height 94px
    line-height 94px
    text-align center
.main
  box-sizing()
  width 100%
  height 100%
  padding 24px 0 0 60px
  button
    &:hover
      background-color $col350
      cursor pointer
  input
    box-sizing()
    padding-left 10px
    line-height 40px
    font-size $fz20
    letter-spacing 8px
    background $col6FA
    border-radius 2px
  .close-btn
    position absolute
    right 15px
    top 15px
    cursor pointer
  h4
    position relative
    padding-left 12px
    font-size $fz20
    letter-spacing 0.41px
    font-weight bold
    &::before
      position absolute
      top 3px
      left 0
      content ''
      width 3px
      height 20px
      background $col422
  .tip
    width 430px
    height 71px
    line-height 71px
    fz11()
    color $col94C
    letter-spacing 0.23px
  .password1,.password2
    position relative
    margin-bottom 20px
    background-color #FFF
    &.show
      input
        font-size $fz13
        letter-spacing 0.23px
    img
      position absolute
      left 315px
      bottom 10px
      width 20px
      height 20px
      cursor pointer
    .hint
      position absolute
      bottom -18px
      right 52px
      fz11()
      color $col94C
    p
      margin-bottom 6px
      span
        position relative
        top 3px
        left 15px
        display inline-block
        color $col999
        fz11()
    input
      width 350px
      height 40px
  .verify
    .message
      position relative
      .hint
        position absolute
        bottom -18px
        left 0
        fz11()
        color $col94C
      p
        margin-bottom 6px
      input
        width 250px
        height 40px
        font-size $fz14
        letter-spacing 0.33px
      button
        width 100px
        height 40px
        color #FFF
        background $col422
        border-radius 0 2px 2px 0
        &:hover
         background-color $col350
        &.disable
          background-color #CCC
    .google
      position relative
      .hint
        position absolute
        bottom -20px
        left 28px
        fz11()
        color $col94C
      p
        margin-bottom 6px
      .input
        padding-left 30px
        input
          width 40px
          height 40px
          font-size $fz14
          padding-left 16px
          margin-right 7px
          letter-spacing 0.29px
          background $col6FA
          border 1px solid $col1E1
          border-radius 2px
  .submit
    width 160px
    height 40px
    margin 40px 0 0 95px
    font-size $fz17
    color #FFF
    letter-spacing 0.35px
    background $col422
    border-radius 2px

</style>
