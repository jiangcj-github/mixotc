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
        <input type="password"/>
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
               v-if="this.$store.state.userInfo&&this.$store.state.userInfo.phone">
      <img src="/static/images/close_btn.png" alt="" @click="offVerify">
      <div class="buy-layer-content">
        <h1>请输入短信验证码</h1>
        <p>
          <input type="text"/><span @click="sendVerify" :class="{offBg: showOffBg}">{{verifyCode}}</span>
        </p>
        <div>
          <em @click="closePopup">取消</em>
          <i>确定</i>
        </div>
      </div>
    </BasePopup>
    <!-- 输入谷歌验证码 -->
    <BasePopup class="geogle-layer"
               :show="verifyLayer"
               :width=470
               :height=250
               v-if="this.$store.state.userInfo&&this.$store.state.userInfo.email">
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
        <!--<input type="tel" maxlength="6" class="realInput" v-model="realInput"  @keyup="getNum()" @keydown="delNum()">-->
        <!--<ul class="clearfix">-->
        <!--<li v-for="(disInput, index) in disInputs"><input type="tel" maxlength="1"  v-model="disInput.value" v-focus="index"></li>-->
        <!--</ul>-->
        <div>
          <em @click="closePopup">取消</em>
          <i>确定</i>
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "release-coin-layer",
    props: ['releaseCoinShow'],
    data() {
      return {
        buyLayer: this.releaseCoinShow,
        verifyLayer: false, // 输入短信、邮箱密码
        verifyCode: '发送验证码', // 改变倒计时状态
        flag: true, // 开启倒计时后禁止点击
        showOffBg: false, // 开启倒计时后状态
        count: 60, // 记录倒计时时间
        // disInputs:[{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}],
        // realInput:'',
        inputContent: '', // 聚焦谷歌输入框内容
        inputGroup: [] // 记录输入框内容,
      }
    },
    components: {
      BasePopup
    },
    watch: {
      releaseCoinShow(state) {
        state === true ? this.buyLayer = true : this.buyLayer = false
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
      buyNext() {
        this.$emit('offRelease', 'false');
        this.verifyLayer = true;
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
        }
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
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .buy-layer, .info-layer, .geogle-layer
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
        margin-bottom 40px
        background #F4F6FA
        border-radius 2px
      div
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
  /*.realInput
    position: absolute
    padding 0
    background: none
    text-indent: -5em;
  ul
    margin-bottom 40px
    li
      float left
      width 40px
      height 40px
      margin-right 20px
      input
        width 40px
        height 40px
        text-align center
        line-height 40px
        padding 0
    li:last-child
      margin-right 0*/


</style>

