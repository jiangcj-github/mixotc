<template>
  <div>
    <BasePopup :show="codeLayer"
               :width=600
               :height=516
               :top=50>
      <div  class="transform-layer">
        <img class="close-btn" src="/static/images/close_btn.png" alt="" @click="closePopup">
        <h2>资金划转</h2>
        <ul>
          <li>
            <p>币种</p>
            <ChoiceBox :choiceClass="transforB"
                       :title=coinType[0]
                       :classify="coinType"
                       :emitValue="coinTypeValue"
                       :width=455
                       :widthSelect=478
                       :top=40
                       :widthWrap=480>
            </ChoiceBox>
          </li>
          <li>
            <ol>
              <li>
                <p>从</p>
                <p class="from-p">法币账户</p>
                <span>(法币账户余额为：{{fromAmount}} {{fromCoin}})</span>
              </li>
              <li>
                <img src="/static/images/transOne.png"/>
              </li>
              <li>
                <p>转至</p>
                <p class="to-p">币币账户</p>
                <span>(币币账户余额为：1.12345678 {{fromCoin}})</span>
              </li>
            </ol>
          </li>
          <li>
            <p>数量</p>
            <div class="amount-input">
              <input type="text" v-model.trim="amount" @input="checkInput"/><button @click="allCheck">全部</button>
              <span>可划转数量为：{{fromAmount}} {{fromCoin}}</span>
              <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-if="amount" @click="amount = ''">
            </div>
            <b>{{errText}}</b>
          </li>
        </ul>
        <div class="btn-group">
          <i @click="closePopup">取消</i>
          <em @click="openReleaseCoin">立即划转</em>
        </div>
      </div>
    </BasePopup>
    <ReleaseCoinLayer
      :releaseCoinShow="showReleaseCoin"
      :currency="paymentCurreny"
      :amount="paymentAmount"
      :toTitle="toPayment"
      @offRelease="openReleaseCoin">
    </ReleaseCoinLayer>
    <BasePopup :show="errTransformLayer" class="err-transform-layer" @click.native="errTransformLayer=false">
      {{errUserText}}
    </BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import ReleaseCoinLayer from '@/views/myOrder/orderLayer/ReleaseCoinLayer' // 支付弹窗

  export default {
    name: "transform-layer",
    props: ['transformShow'],
    data() {
      return {
        codeLayer: this.transformShow,
        transforB: 'transforB',
        coinType: [], // 币种下拉框
        coinValue: '',
        coinTypeValue: 'coinTypeValue',
        amount: '',
        fromAmount: 0,
        fromCoin: '',
        showReleaseCoin: false, // 支付
        errText: '',
        paymentCurreny: '',
        paymentAmount: '',
        toPayment: '',

        groundingList: [], // 上架币种数组
        otcCoinList: [],
        userFromList: [], // 法币账户数组

        errTransformLayer: false,
        errUserText: '' // 非用户错误提示
      }
    },
    components: {
      BasePopup,
      ChoiceBox,
      ReleaseCoinLayer
    },
    watch: {
      transformShow(state) {
        if (state === true) {
          this.amount = ''
          this.errText = ''
          this.codeLayer = true
        } else {
          this.codeLayer = false
        }
      }
    },
    mounted() {
      this.Bus.$on(this.coinTypeValue, (data) => { // 币种筛选
        this.coinValue = data
        console.log('333', data)
        this.initData()
      });
      this.initData()
      this.getToCoinData()
    },
    destroyed() {
      this.Bus.$off(this.coinTypeValue);
    },
    methods: {
      closePopup() {
        this.$emit('offTransform', 'false')
      },

      initData() { // 初始化弹窗数据
        this.coinType = [];
        this.WsProxy.send('wallet', 'wallets', { // 法币账户
          id: this.$store.state.userInfo.uid, // 用户id
        }).then((data)=>{
          console.log('钱包', data)
          this.userFromList = data.wallets
          data.wallets.forEach(v => {
            this.otcCoinList.push(v.currency)
          })
          console.log('法币账户', this.userFromList)
        }).catch((msg)=>{
          console.log(msg);
        });

        this.Proxy.hp_account_coin().then(res => { // 判断币币上架币种
          console.log('上架币种', res)
          let balanceArr
          this.groundingList = res.objects.filter(v => { // 取上架币种
            return v.status
          }).map(v => {
            return v.currency
          })
          this.coinType = this.groundingList.filter(v => { // 取交集币种
            return this.otcCoinList.indexOf(v) > -1
          }).map(v => {
            return v.toUpperCase()
          })
          this.coinValue = this.coinType[0]
          balanceArr = this.userFromList.filter(v => {
           return v.currency == (this.coinValue && this.coinValue.toLowerCase())
          })
          this.fromAmount = balanceArr[0] && balanceArr[0].balance.formatFixed(6)
          this.fromCoin = balanceArr[0] && balanceArr[0].currency.toUpperCase()
          console.log('交集', this.coinType, this.coinValue, balanceArr)
        }).catch(msg => {
          console.log(msg)
        })
      },
      getToCoinData() {
        this.Proxy.hp_account({ // 币币账户
          uid:this.$store.state.userInfo.uid
        }).then(res => {
          console.log('币币账户', res)
        }).catch(msg => {

        });
      },
      allCheck() { // 数量下的全部按钮
        this.amount = this.fromAmount
      },
      checkInput() { // 输入框事件
        console.log('errText', this.amount, this.fromAmount, this.amount * 1 > this.fromAmount * 1)
        this.paymentCurreny = this.coinValue
        this.paymentAmount = this.amount
        this.toPayment = this.toText
        this.errText = this.amount * 1 > this.fromAmount * 1 ? '数量应不大于可划转数量' : ''
        // this.errText = !(/^\d{n}$/.test(this.amount)) ? '请输入数字' : ''
      },
      openReleaseCoin(st, content) { // 跳转支付弹窗
        if (this.amount === '') { // 未输入内容
          this.errText = '请输入数量'
          return
        }
        if (this.amount * 1 > this.fromAmount * 1) return // 大于划转资金
        if (st === 'false') {
          this.showReleaseCoin = false
        } else {
          this.closePopup()
          this.showReleaseCoin = true
          this.$store.commit({type: 'showTransform', data: 1}) // 支付标识来源
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .transform-layer
    padding 0 60px
    .close-btn
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 516.6px
      cursor pointer
    h2
      font-size $fz20
      font-weight bold
      letter-spacing 0.41px
      color $col333
      margin 30px 0
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
    ul
      li:last-child
        position relative
        b
          display inline-block
          margin-top 10px
          position absolute
          font-size 11px
          color #FF794C
          letter-spacing 0.23px
      >li
        margin-bottom 30px
        /*input*/
          /*width 470px*/
          /*height 40px*/
          /*background #F4F6FA*/
          /*border-radius 2px*/
          /*padding-left 10px*/
        p
          font-size 14px
          letter-spacing 0.29px
          margin-bottom 10px
        div
          input
            width 400px
            height 40px
            padding-left 10px
            background #F4F6FA
            border-radius 2px 0 0 2px
          button
            width 70px
            height 40px
            color #FFF
            background #FFB422
            border-radius 0 2px 2px 0
            cursor pointer

      ol
        display flex
        align-items center
        .from-p, .to-p
          width 210px
          height 40px
          padding-left 10px
          color #333
          line-height 40px
          border-radius 2px
          background #F4F6FA
          font-size 13px
        li
          span
            display block
            margin-top 7px
            font-size 12px
            text-align right
            letter-spacing 0.12px
          img
            width 17px
            height 10px
            margin 6px 12px 0
    .amount-input
      position relative
      input
        font-size 13px
      span
        position absolute
        top -25px
        right 0
        font-size 11px
        color #333
        letter-spacing 0.12px
      img
        position absolute
        top 15px
        right 80px
        cursor pointer
    .btn-group
      text-align center
      i,em
        display inline-block
        width 160px
        height 40px
        margin-top 20px
        line-height 40px
        text-align center
        cursor pointer
      i
        color #FFB422
        background #FFF
        border 1px solid #FFB422
        border-radius 2px
        margin-right 30px
      em
        color #FFF
        background #FFB422
        border-radius 2px

.err-transform-layer
  text-align center
  line-height 94px

</style>
