<template>
  <div>
    <BasePopup :show="orderLayer"
               :width=470
               :height=282>
      <div class="order-layer">
        <ul>
          <li class="clearfix"><span>购买单价</span><b>{{price}} CNY</b></li>
          <li class="clearfix"><span>购买数量</span><b>{{currency}} BTC</b></li>
          <li class="clearfix"><span>购买金额</span><b>{{money}} CNY</b></li>
        </ul>
        <p>提醒：请确认价格后立即下单</p>
        <p>下单后此订单的比特币将托管锁定，请放心购买</p>
        <div class="btn-group clearfix">
          <em @click="closeOrderLayer">取消</em>
          <i @click="firmOrder">确认订单</i>
        </div>
      </div>
    </BasePopup>
    <BasePopup class="remind-layer" :show="remindLayer">
      <span v-clickoutside="closeLayer">{{remindText}}</span>
    </BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "order-layer",
    props: ['orderLayerShow', 'id', 'price', 'currency', 'money'],
    data() {
      return {
        orderLayer: this.orderLayerShow,
        remindLayer: false,
        remindText: ''
      }
    },
    components: {
      BasePopup
    },
    watch: {
      orderLayerShow(state) {
        this.orderLayer = state === true ? true : false
      }
    },
    methods: {
      closeOrderLayer() {
        this.$emit('offOrderLayer', false)
      },
      firmOrder() {
        this.WsProxy.send('otc','new_order',{
          id: this.id,
          price: this.price,
          currency: this.currency * 1,
          money: this.money * 1,
          update_time: Math.floor(new Date().getTime() / 1000)
        }).then((data)=>{
          console.log('确认订单')
          this.$store.state.newOrder = true
          this.$router.push({ path: '/order', query: {id: this.JsonBig.stringify(data.id)}})
        }).catch((msg)=>{
          console.log(msg);
          this.closeOrderLayer();
          this.remindLayer = true;
          switch (msg.ret) {
            case 13:
              this.remindText = '买家(对方)有订单未完成';
              break;
            case 14:
              this.remindText = '当天取消订单超过5次';
              break;
            case 18:
              this.remindText = '买家(你自己)有订单未完成';
              break;
            case 43:
              this.remindText = '订单未完成';
              break;
            case 55:
              this.remindText = '状态不匹配';
              break;
          }
        });
      },
      closeLayer() { // 关闭提示勾选弹窗
        this.remindLayer = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .order-layer
    padding 35px 60px 0 60px
    ul
      li
        margin-bottom 15px
        span
          float left
          font-size 20px
          color #333
          letter-spacing 0.41px
        b
          float right
    p
      margin-bottom 10px
      font-size 12px
      color #FF794C
      letter-spacing 0.23px
    .btn-group
      margin-top 20px
      em, i
        display inline-block
        width 160px
        height 40px
        text-align center
        line-height 40px
        cursor pointer
      em
        float left
        border 1px solid #FFB422
        border-radius 2px
        color #FFB422
      i
        float right
        background #FFB422
        border-radius 2px
        color #FFF

  .remind-layer
    text-align center
    line-height 94px

</style>

