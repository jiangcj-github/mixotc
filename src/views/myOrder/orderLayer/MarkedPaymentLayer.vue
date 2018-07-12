<template>
  <BasePopup :show="codeLayer"
             class="code-layer"
             :width=396
             :height=234>
    <img src="/static/images/close_btn.png" alt="" @click="closePopup">
    <h2>{{tradeCode}}</h2>
    <p>付款的时候请备注“资金码”,以便对方收款</p>
    <button @click="closePopup">我知道了</button>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "marked-payment-layer",
    props: ['paymentShow', 'tradeCode'],
    data() {
      return {
        codeLayer: this.paymentShow
      }
    },
    components: {
      BasePopup
    },
    watch: {
      paymentShow(state) {
        this.codeLayer = state === true ?  true : false
      }
    },
    mounted() {

    },
    methods: {
      closePopup() {
        this.$emit('offPayment', 'false')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .code-layer
    text-align center
    img
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 368.6px
      cursor pointer
    h2
      font-size 20px
      color #FFB422
      letter-spacing 0.41px
      margin 32.4px 0 20px
    p
      margin-bottom 55px
    button
      width 160px
      height 40px
      background #FFB422
      color #FFF
      cursor pointer
</style>
