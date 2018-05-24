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
        <p class="err-wrap">
          <input type="text" v-model.trim="PaymentValue" class="passInput" @input="errText = ''"/>
          <b class="errortext" v-if="errorShow">{{errText}}</b>
        </p>
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
          <input type="text" v-model.trim="messageVerify" @input="errText = ''"/><span @click="sendVerify" :class="{offBg: showOffBg}">{{verifyCode}}</span>
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
        <b class="errortext" v-if="errorShow">{{errText}}</b>
        <div>
          <em @click="offVerify">取消</em>
          <i @click="succPopup">确定</i>
        </div>
      </div>
    </BasePopup>
    <!-- 资金互转成功 -->
    <BasePopup class="remind-layer" :show="remindLayer">
      <p v-clickoutside="closeLayer"><span>{{amount}}{{currency}}</span>成功转到{{toTitle}}</p>
    </BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import crypto from 'crypto'

  export default {
    name: "release-coin-layer",
    props: ['releaseCoinShow', 'uid', 'id', 'currency', 'amount', 'toTitle'],
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
        errText: '',
        remindLayer: false,
        remindText: '3456789',
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
          this.errText = ''
        } else {
          this.buyLayer = false
        }
      },
      inputGroup(newValue, oldValue) {
        // console.log('1111', newValue, oldValue, newValue[newValue.length - 1].length)
        // if (newValue[newValue.length - 1].length) {
        //   this.inputContent =  newValue.length + 1
        // }
        this.errText = '';
        this.messageVerify = this.inputGroup.join('')
      }
    },
    methods: {
      closePopup() {
        this.$emit('offRelease', 'false')
      },
      buyNext() { // 点击下一步
        if (this.PaymentValue === '') return
        this.errText = '';
        this.messageVerify = '';
        this.inputGroup = [];
        this.WsProxy.send('control', 'verify_paypass', { // 获取验证码
          pass: this.getSafePass(this.PaymentValue), // 0 登录; 1 修改密码; 2 支付
        }).then((data)=>{
          this.$emit('offRelease', 'false');
          this.verifyLayer = true;
          if (this.$store.state.userInfo.email) { // 邮箱获取验证码
            this.WsProxy.send('control','send_code',{
              type: 2, // 0 登录; 1 修改密码; 2 支付
              uid: this.$store.state.transformInfo === 1 ? this.$store.state.userInfo.uid : this.id,
            }).then((data)=>{
              console.log('获取验证码', data)
            }).catch((msg)=>{
              switch (msg.ret) {
                case 3:
                  this.errText = '刚发过确认码，还未超时'
                  break;
              }
              console.log('获取验证码错误', msg);
            });
          }
        }).catch((msg)=>{
          msg.ret !== 0 && (this.errorShow = true)
          this.errText = '密码错误'
          console.log('错误', msg)
        });
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
            uid: this.$store.state.transformInfo === 1 ? this.$store.state.userInfo.uid : this.id,
          }).then((data)=>{
            console.log('获取验证码', data)
          }).catch((msg)=>{
            switch (msg.ret) {
              case 3:
                this.errText = '刚发过确认码，还未超时'
                break;
            }
            console.log('获取验证码错误', msg);
          });
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
      },
      succPopup() { // 点击确定
        this.WsProxy.send(this.$store.state.transformInfo === 1 ? 'wallet' : 'otc', this.$store.state.transformInfo === 1 ? 'transfer_stock' : 'send_order',{
          uid: this.$store.state.transformInfo === 1 ? this.$store.state.userInfo.uid : this.uid,
          id: this.$store.state.transformInfo === 1 ? 0 : this.id,
          currency:  this.$store.state.transformInfo === 1 ? this.currency.toLowerCase() : '',
          amount: this.$store.state.transformInfo === 1 ? this.amount * 1 : '',
          pass: this.getSafePass(this.PaymentValue),
          code: this.messageVerify
        }).then((data) => {
          console.log('确定', data)
          this.verifyLayer = false
          this.$store.state.transformInfo === 1 ? this.remindLayer = true : window.location.reload()
        }).catch((msg)=>{
          msg.ret !== 0 && (this.errorShow = true)
          switch (msg.ret) {
            case 6:
              this.errText = '谷歌验证失败'
              break;
            case 8:
              this.errText = '验证码错误'
              break;
            case 31:
            case 32:
              this.errText = '钱包金额不足'
              break;
          }
          console.log('你错了', msg.ret);
        })
      },
      stringToBytes ( str ) {
        var ch, st, re = [];
        for (var i = 0; i < str.length; i++ ) {
          ch = str.charCodeAt(i);  // get char
          st = [];                 // set up "stack"
          do {
            st.push( ch & 0xFF );  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
          }
          while (ch);
          // add stack contents to result
          // done because chars have "wrong" endianness
          re = re.concat( st.reverse() );
        }
        // return an array of bytes
        return re;
      },
      closeLayer() {
        this.remindLayer = false
      },
      getSafePass(plainPass) {
        // '197102307060486144'
        let uid = this.JsonBig.stringify(this.$store.state.userInfo.uid), // 用户id
            uidArr = [], // id数组
            sum = 0, // id 求和
            halfPass = "", // 转换密码
            sha1 = crypto.createHash('sha1'), // 创建并返回一个Hash可用于使用给定生成哈希摘要的对象algorithm
            endData = "";
        for (let j = 0; j < uid.length; j++) { // 字符串变数组
          uidArr.push(uid[j] * 1)
        }
        // console.log('getSafePass 0', uidArr)
        uidArr.forEach(v => { // 数组求和
          sum = sum + v;
          return sum
        });
        // console.log('getSafePass 1', uidArr, sum, sum%3, plainPass)
        for (let i = 0; i < plainPass.length; i ++) { // 生成新密码
          if (i % 3 !== sum % 3) {
            //console.log('getSafePass 2',halfPass)
            halfPass += plainPass.substring(i, i + 1);
          }
        }
        halfPass += uid;
        // console.log('getSafePass 3', sha1, halfPass, typeof halfPass, stringToBytes(halfPass))
        sha1.update(this.stringToBytes(halfPass)); // 更新散列内容
        endData = sha1.digest(); //计算传递给散列的所有数据的摘要
        // console.log('getSafePass 4','plainPass',plainPass, sha1, halfPass, 'salt',endData,plainPass.split('').map(v=>v.charCodeAt()))
        let salt = endData,
            iter = 1005,
            encryptResult = crypto.pbkdf2Sync(plainPass.split('').map(v => v.charCodeAt()), salt, iter, 32, 'sha1');//bit bytes
        // console.log('getSafePass 5',encryptResult,encryptResult.slice(0, 32).toString('base64'), encryptResult.toString('base64'))
        return encryptResult.toString('base64');  // Base64加密再 encode;
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
      .passInput
        letter-spacing 5px
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

  .remind-layer
    text-align center
    line-height 94px
    span
      color #FFB422


</style>

