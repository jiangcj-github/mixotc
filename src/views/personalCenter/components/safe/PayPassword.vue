<template>
  <div>
    <BasePopup :show="true" :top="52" :width="470" :height="470">
      <slot>
        <div class="main">
          <img class="close-btn" src="/static/images/close_btn_tr2.png" alt="" @click="Bus.$emit(emitValue)">
          <h4>支付密码</h4>
          <p class="tip">*出于安全方面的考虑，修改密码后，你的账户将在 24 小时内无法提现。</p>
          <div class="password1">
            <p>密码<span>密码为8--12位字符，且同时包含字符和数字</span></p>
            <input type="password" v-model="password1" maxlength="12">
            <i class="hint">密码格式错误</i>
          </div>
          <div class="password2">
            <p>再输一遍</p>
            <input type="password" v-model="password2" maxlength="12">
            <i class="hint">两次输入密码不一致</i>
          </div>
          <div class="verify">
            <!-- <div class="message">
              <p>手机验证码</p>
              <input type="text" v-model="messageWord" maxlength="6"><button>获取验证码</button>
              <i class="hint">请输入正确的验证码</i>
            </div> -->
            <div class="google">
              <p>谷歌验证码</p>
              <div class="input">
                <input type="text" maxlength="1">
                <input type="text" maxlength="1">
                <input type="text" maxlength="1">
                <input type="text" maxlength="1">
                <input type="text" maxlength="1">
                <input type="text" maxlength="1">
              </div>
              <i class="hint">请输入正确的验证码</i>
            </div>
          </div>
          <button class="submit">确定</button>
        </div>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
 import BasePopup from '@/components/common/BasePopup';
  export default {
    props:['type', 'emitValue'],
    data(){
      return {
        password1: '',
        password2: '',
        messageWord: '',
        // googleWord: ''
      }
    },
    components: {
      BasePopup
    },
    methods: {
    
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
.main
  box-sizing()
  width 100%
  height 100%
  padding 24px 0 0 60px
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
    height 71px
    line-height 71px
    fz11()
    color $col94C
    letter-spacing 0.23px
  .password1,.password2
    position relative
    margin-bottom 20px
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
    .google
      position relative
      .hint
        position absolute
        bottom -20px
        right 52px
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