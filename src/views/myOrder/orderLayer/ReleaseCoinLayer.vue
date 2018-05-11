<template>
  <div>
    <!-- 释放币 -->
    <BasePopup class="buy-layer"
               :show="buyLayer"
               :width=470
               :height=250>
      <img src="/static/images/close_btn.png" alt="" @click="closePopup">
      <div class="buy-layer-content">
        <h1>请输入支付密码</h1>
        <input type="password" v-model="PaymentValue"/>
        <div>
          <em @click="closePopup">取消</em>
          <i @click="buyNext">下一步</i>
        </div>
      </div>
    </BasePopup>
    <!-- 输入短信验证码 -->
    <BasePopup class="info-layer"
               :show="verifyLayer"
               :width=470
               :height=250
               v-if="$store.state.userInfo && $store.state.userInfo.phone">
      <img src="/static/images/close_btn.png" alt="" @click="offVerify">
      <div class="buy-layer-content">
        <h1>请输入短信验证码</h1>
        <p class="err-wrap">
          <input type="text" v-model="messageVerify" @input="onInput"/><span @click="sendVerify" :class="{offBg: showOffBg}">{{verifyCode}}</span>
          <b class="errortext" v-if="errorShow">{{errText}}</b>
        </p>
        <div>
          <em @click="offVerify">取消</em>
          <i @click="succPopup">确定</i>
        </div>
      </div>
    </BasePopup>
    <!-- 输入谷歌验证码 -->
    <BasePopup class="geogle-layer"
               :show="verifyLayer"
               :width=470
               :height=250
               v-if="$store.state.userInfo && $store.state.userInfo.email">
      <img src="/static/images/close_btn.png" alt="" @click="offVerify">
      <div class="buy-layer-content">
        <h1>请输入谷歌验证码</h1>
        <input type="text"
               v-for="index in 6"
               v-focus="index === inputContent"
               v-model="inputGroup[index-1]"
               maxlength="1"
               @keyup="getNum(index)"
               @keydown="delNum(index)"/>
        <b class="errortext" v-if="errorShow">请输入正确的验证码</b>
        <div>
          <em @click="offVerify">取消</em>
          <i @click="succPopup">确定</i>
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  // import md5 from 'md5'

  export default {
    name: "release-coin-layer",
    props: ['releaseCoinShow', 'uid', 'id'],
    data() {
      return {
        buyLayer: this.releaseCoinShow,
        PaymentValue: '', // 支付密码
        verifyLayer: false, // 输入短信、邮箱密码
        verifyCode: '发送验证码', // 改变倒计时状态
        messageVerify: '', // 短信验证码
        flag: true, // 开启倒计时后禁止点击
        showOffBg: false, // 开启倒计时后状态
        count: 60, // 记录倒计时时间
        // disInputs:[{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}],
        // realInput:'',
        inputContent: '', // 聚焦谷歌输入框内容
        inputGroup: [], // 记录输入框内容,
        errorShow: false,
        errText: ''
      }
    },
    components: {
      BasePopup
    },
    watch: {
      releaseCoinShow(state) {
        if (state === true) {
          this.buyLayer = true
          this.PaymentValue = ''
        } else {
          this.buyLayer = false
        }
      },
      inputGroup(newValue, oldValue) {
        // console.log(newValue, oldValue, newValue[newValue.length - 1].length)
        // if (newValue[newValue.length - 1].length) {
        //   this.inputContent =  newValue.length + 1
        // }
      }
    },
    methods: {
      closePopup() {
        this.$emit('offRelease', 'false')
      },
      buyNext() { // 点击下一步
        if (this.PaymentValue === '') return
        this.$emit('offRelease', 'false');
        this.messageVerify = '';
        this.errText = '';
        this.verifyLayer = true;
        // this.PaymentValue = this.getSafePass(this.PaymentValue)
        // console.log('this.PaymentValue', this.PaymentValue)
        if (this.$store.state.userInfo.email) {
          this.WsProxy.send('control','send_code',{ // 获取验证码
            type: 2, // 0 登录; 1 修改密码; 2 支付
            uid: this.id,
          }).then((data)=>{
            console.log('获取验证码', data)
          }).catch((msg)=>{
            console.log(msg);
          });
        }
      },
      offVerify() {
        this.verifyLayer = false;
      },
      sendVerify() {
        if (this.flag) {
          this.flag = false;
          this.count = 60;
          let _this = this;
          let verifyFn = function () {
            _this.count--;
            _this.verifyCode = `${_this.count}秒后重发`;
            _this.showOffBg = true;
            if (_this.count <= 0) {
              _this.verifyCode = '发送验证码';
              _this.flag = true;
              _this.showOffBg = false;
              clearInterval(timer)
            }
          };
          verifyFn();
          let timer = setInterval(verifyFn, 1000)
          this.WsProxy.send('control','send_code',{ // 获取验证码
            type: 2, // 0 登录; 1 修改密码; 2 支付
            uid: this.id,
          }).then((data)=>{
            console.log('获取验证码', data)
          }).catch((msg)=>{
            console.log(msg);
          });
        }
      },
      onInput() { // 聚焦输入框
        this.errText = ''
      },
      getNum(index) {
        let oEvent = window.event;
        if (oEvent.keyCode === 8) return;
        // console.log('canUp', this.canUp )
        // console.log('keyup', this.inputContent, this.inputGroup)
        this.inputContent = index + 1
      },
      delNum(index) {
        let oEvent = window.event;
        if (oEvent.keyCode === 8) {
          this.inputContent = index - 1
        }
      },
      getSafePass(plainPass) { // 加密算法
        // let reader = new FileReader(),
        //     uid = this.JsonBig.stringify(this.$store.state.userInfo.uid)
        // reader.onload = (callback) => {
        //   let md5 = rstr2hex(binl2rstr(binl_md5(reader.result, reader.result.length)));
        // }
        // plainPass = md5;
      },
      succPopup() { // 点击确定
        console.log('uid', this.uid, this.id)
        //console.log('md5', this.PaymentValue)
        this.WsProxy.send('otc','send_order',{
          uid: this.uid,
          id: this.id,
          pass: this.PaymentValue,
          code: this.messageVerify
        }).then((data)=>{
          console.log('确定', data)
        }).catch((msg)=>{
          msg.ret !== 0 && (this.errorShow = true)
          switch (msg.ret) {
            case 7:
              this.errText = '密码错误'
              break;
          }
          // console.log('this.errorShow', this.errorShow)
          console.log('你错了', msg.ret);
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .buy-layer, .info-layer, .geogle-layer
    .err-wrap
      position relative
    .errortext
      position absolute
      display block
      font-size 12px
      color #ff794c

    h1
      font-size $fz20
      font-weight bold
      color $col333
      margin-bottom 30px
      &:before
        display inline-block
        width 3px
        height 20px
        position relative
        top 2px
        left 0
        content ''
        margin-right 9px
        background-color $col422
    img
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 442.6px
      cursor pointer
    .buy-layer-content
      margin-top 32.4px
      margin-left 60px
      input
        width 340px
        height 40px
        padding-left 10px
        background #F4F6FA
        border-radius 2px
      div
        margin-top 25px
        em, i
          display inline-block
          width 160px
          height 40px
          text-align center
          line-height 40px
          cursor pointer
        em
          color #FFB422
          background #FFF
          border 1px solid #FFB422
          border-radius 2px
          margin-right 30px
        i
          color #FFF
          background #FFB422
          border-radius 2px

  .info-layer
    .buy-layer-content
      p
        input
          width 250px
          vertical-align top
        span
          display inline-block
          width 100px
          height 40px
          text-align center
          line-height 40px
          color #FFF
          background #FFB422
          border-radius 0 2px 2px 0
          cursor pointer
        .offBg
          background #999

  .geogle-layer
    .buy-layer-content
      input
        width 40px
        height 40px
        margin-right 20px
        padding 0
        text-align center
        line-height 40px


</style>

