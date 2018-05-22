<template>
  <div class="release-ad-wrap">
    <p class="title">
      <span>mixOTC</span>-<span>发广告</span>
      <b>提示：离线或退出时，在订单盘的排序会靠后，订单延时，可能会有投诉，影响订单，建议下载APP，保持随时在线</b>
    </p>
    <div class="inner release-ad-box clearfix">
      <ul>
        <router-link :to="{name:'releaseBuy', params: {buyObj}}" tag="li" class="buy-ad" :class="{active: $route.path=='/advertisement/release/buy'}">购买广告</router-link>
        <li class="sale-ad" :class="{active: $route.path=='/advertisement/release/sale'}" @click="saleAd">出售广告</li>
        <!--{{buyObj}}-->
        <!--{{saleObj}}-->
      </ul>
      <div class="release-ad-content">
        <!--<h1>余额超过0.05BTC才能在交易中心展示广告</h1>-->
        <router-view></router-view>
      </div>
    </div>
    <BasePopup :show="adRemindLayer"
               class="ad-remind-layer">
      <router-link to="/personal/account/baseInfo" v-clickoutside="closeLayer">{{adRemindContent}}</router-link>
    </BasePopup>
  </div>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "releaseAd",
    data() {
      return {
        buyObj: {
          "uid": '', // 用户id
          "currency": '', // 电子货币
          "money": '', // 法币
          "mode": 1, // 出售类型: 1 固定; 2 溢价
          "premium": 0, // 溢价
          "price": '', // 固定价格/最低价格
          "min": '', // 每笔交易的最小限额
          "max": '', // 每笔交易的最大限额
          "payment": 0, // 1支付宝;2微信;4银行卡
          "type": 2, // 1 出售; 2 购买
          "limit": 10, // 付款期限, 分钟
          "info": '', // 描述信息
          "vary": 1, // 余额随动标志 1 不随动 2 随动
          "tradeable": '' // 可交易量
        },
        saleObj: {
          "uid": '', // 用户id
          "currency": '', // 电子货币
          "money": '', // 法币
          "mode": 1, // 出售类型: 1 固定; 2 溢价
          "premium": 0, // 溢价
          "price": '', // 固定价格/最低价格
          "min": '', // 每笔交易的最小限额
          "max": '', // 每笔交易的最大限额
          "payment": 0, // 1支付宝;2微信;4银行卡
          "type": 1, // 1 出售; 2 购买
          "limit": 10, // 付款期限, 分钟
          "info": '', // 描述信息
          "vary": 1, // 余额随动标志 1 不随动 2 随动
          "tradeable": 0, // 可交易量
          "length": 0
        },
        adRemindLayer: false,
        adRemindContent: ''
      }
    },
    components: {
      BasePopup
    },
    computed: {

    },
    created() {
      this.Bus.$on('saleSlideLength', data => {
        this.saleObj.length = data * 1
        this.saleObj.tradeable = this.saleObj.tradeable ? this.saleObj.tradeable : data * 1
      }),
      this.Bus.$on('buyInfo', data => {
        console.log('购买父组件接收', data)
        this.buyObj = data
      }),
      this.Bus.$on('saleInfo', data => {
        console.log('出售父组件接收', data)
        this.saleObj = data
      })
    },
    mounted() {

    },
    destroyed() {
      this.Bus.$off('buyInfo');
      this.Bus.$off('saleInfo');
      this.Bus.$off('saleSlideLength');
    },
    methods: {
      saleAd() {
        // if (this.$store.state.userInfo.is_new === 1) { // 提醒设置支付密码
        //   this.adRemindLayer = true
        //   this.adRemindContent = '请先设置支付密码'
        //   return
        // }
        this.$router.push({name:'releaseSale', params: {'saleCon': this.saleObj}})
      },
      closeLayer() {
        this.adRemindLayer = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  @import "../advertisement/css/release.styl"
  .ad-remind-layer
    text-align center
    line-height 94px
</style>
