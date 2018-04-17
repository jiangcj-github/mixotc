<template>
  <BasePopup :show="codeLayer"
             class="code-layer"
             :width=396
             :height=234>
    <img src="/static/images/close_btn.png" alt="" @click="closePopup">
    <h2>{{id}}</h2>
    <p>{{info}}</p>
    <button @click="markPay">标记已付款</button>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import sendConfig from '@/api/SendConfig.js'// 引入websocket发送包

  export default {
    name: "marked-payment-layer",
    props: ['paymentShow', 'id', 'info'],
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
        state === true ? this.codeLayer = true : this.codeLayer = false
      }
    },
    mounted() {

    },
    methods: {
      closePopup() {
        this.$emit('offPayment', 'false')
      },
      markPay() { // 标记已付款
        let ws = this.WebSocket; // 创建websocket连接
        let seq = ws.seq;
        // console.log('标记', this.id, this.info)
        ws.onMessage[seq] = { // 监听
          callback: (data) => {
            if(!data || data.body.ret !== 0) return;
            console.log('payment', data.body.data)
          },
          date:new Date()
        };

        ws.send(sendConfig('otc', { // 发包
          seq: seq,
          body:{
            "action": "update_order",
            data: {
              "id": this.id, // 1 买; 2 卖; 3 全部  <-state=0
              "state": 2, // 1 等待买家付款; 2 卖家确认收款／等待卖家发货; 3申诉中; 4 已取消; 5 已超时; 6交易完成; 7 买家评价; 8 卖家评价; 9 双方已评
              "info": this.info
            }
          }
        }))
        window.location.reload()
        // this.$emit('offPayment', 'false')
        this.Bus.$emit('offTime', false)
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
