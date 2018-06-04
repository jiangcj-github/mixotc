<template>
  <div>
    <BasePopup :show="true" :top="52" :width="1006" :height="444">
      <slot>
        <div class="main">
          <h4>开启谷歌验证</h4>
          <img class="close-btn" src="/static/images/close_btn_tr2.png" alt="" @click="Bus.$emit(emitValue)">
          <ul class="section clearfix">
            <li class="first">
              <img src="/static/images/personal/google_1.png" alt="" width="32px" height="32px">
              <div class="details">
                <p>安装双重验证程序：Google Authenticator</p>
                <a href="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8" target="_blank" class="store">
                  APP Store
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" class="play">
                  Google.play
                </a>
                <a href="https://support.google.com/accounts/answer/1066447?hl=en" target="_blank" class="auth">
                  Google Authenticator on other devices
                </a>
              </div>
            </li>
            <li class="second">
              <img src="/static/images/personal/google_2.png" alt="" width="32px" height="32px">
              <p class="tip">在“Google Authenticator(身份验证器)”应用程序中,点击“添加账户”扫描下方二维码</p>
              <QrcodeVue class="qrcode" :value="secretKey" :size="90"></QrcodeVue>
              <p class="key">
                如果您无法扫描成功上图的条形码，您可以手动添加账户，输入如下密钥：
                <span>{{secretKey}}</span>
              </p>
            </li>
            <li class="third">
              <img src="/static/images/personal/google_3.png" alt="" width="32px" height="32px">
              <div class="warn">
                <p class="title">警告：</p>
                <p class="remember">
                  请您务必将密钥记录下来:
                  <span>{{secretKey}}</span>
                </p>
                <p class="mistake">如果误删或是更换手机，手动输入密钥是您唯一恢复的方式。</p>
              </div>
              <div class="google">
                <p>请输入显示的验证码，开启验证功能</p>
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
                <i class="hint" v-if="showTip">请输入正确的验证码</i>
              </div>
              <button @click="submit">确认提交</button>
            </li>
          </ul>
        </div>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
import BasePopup from '@/components/common/BasePopup';
// import QrcodeVue from 'qrcode.vue';
  export default {
    props:['emitValue'],
    data(){
      return {
        showTip:false,
        inputGroup: ['','','','','',''], // 记录输入框内容,
        inputContent: '',
        secretKey:''
      }
    },
    components: {
      BasePopup,
      QrcodeVue
    },
    created(){
      this.WsProxy.send('control', 'get_secret').then(({secret}) => {
        this.secretKey = secret
      })
    },
    methods: {
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
        if(this.inputGroup.join('').length < 6){
          this.showTip = true;
          return;
        }
        this.showTip = false;
        this.WsProxy.send('control', 'verify_secret', {
          code: Number(this.inputGroup.join(''))
        }).then(data=>{
          this.Bus.$emit(this.emitValue, true)
          this.$store.commit({type:'updateUserInfo', data:{auth: 2}})
        }).catch(error=>{
          this.showTip = true;
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
  .main
    box-sizing()
    position relative
    width 100%
    height 100%
    padding 20px 0 0 60px
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
    .section
      padding-top 40px
      li
        float left
        width 300px
        &.first
          p
            height 58px
            line-height 58px  
            font-size $fz13
            color $col94C
            letter-spacing 0.05px
          .store,.play
            display block
            width 92px
            height 40px
            padding-left 38px
            margin-bottom 10px
            line-height 40px
            color #FFF
            letter-spacing 0
            background url('/static/images/personal/app_store.png') no-repeat 10px 10px $col422
            background-size 18px 18px
            border-radius 2px
          .play
            margin-bottom 30px
            background-image url('/static/images/personal/google_play.png')
          .auth
            font-size 13px
            color $colEE5
            letter-spacing 0.05px
            text-decoration underline
        &.second
          p
            width 270px
            line-height 18px
            margin-bottom 20px
            font-size $fz13
            letter-spacing 0.05px
            &.tip
              margin-top 20px
            span
              color $col94C
          .qrcode
            width 90px
            height 90px
            padding 5px
            margin-bottom 10px
            border 1px solid $colA8A
        &.third
          font-size $fz13
          button
            width 160px
            height 40px
            margin-left 57px
            font-size $fz17
            color #FFF
            letter-spacing 0.35px
            background $col422
            border-radius 2px
            cursor pointer
            &:hover
              background $col350
          .warn
            margin-top 20px
            p
              position relative
              line-height 18px
              padding-left 17px
              &.title
                margin-bottom 8px
              &.remember
                margin-bottom 8px
                span
                  color $col94C
              &.mistake
                margin-bottom 25px
              &.title::before, &.mistake::before
                position absolute
                left 0
                top 2px
                content ''
                width 12px
                height 12px
                background url('/static/images/hint.png') no-repeat center center
              &.mistake::before
                width 16px
                height 16px
                top 0
                background url('/static/images/personal/tixing.png') no-repeat center center
                background-size 16px 16px
          .google
            position relative
            .hint
              position absolute
              bottom -20px
              left 0
              fz11()
              color $col94C
            p
              margin-bottom 6px
            .input
              margin-bottom 20px
              input
                box-sizing()
                width 40px
                height 40px
                font-size $fz14
                padding-left 16px
                margin-right 6px
                letter-spacing 0.29px
                background $col6FA
                border 1px solid $col1E1
                border-radius 2px



</style>