<template>
  <div class="release-ad-wrap">
    <div class="title">
      <p class="inner">
        <router-link to="/transaction">mixOTC</router-link>-<router-link to="/advertisement/release/buy">发广告</router-link>
        <b>提示：离线或退出时，在订单盘的排序会靠后，订单延时，可能会有投诉，影响订单，建议下载APP，保持随时在线</b>
      </p>
    </div>
    <div class="inner release-ad-box clearfix">
      <ul>
        <li class="buy-ad" :class="{active: $route.path=='/advertisement/release/buy', 'is-disabled': !buyCanClick}" @click="buyCanClick && buyAd()">购买广告</li>
        <li class="sale-ad" :class="{active: $route.path=='/advertisement/release/sale', 'is-disabled': !saleCanClick}" @click="saleCanClick && saleAd()">出售广告</li>
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
      <router-link to="/personal/safe" v-clickoutside="closeLayer">请先设置支付密码</router-link>
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
          "currency": 'btc', // 电子货币
          "money": 'cny', // 法币
          "mode": 1, // 出售类型: 1 固定; 2 溢价
          "premium": 0, // 溢价
          "price": '', // 固定价格/最低价格
          "min": '200', // 每笔交易的最小限额
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
          "currency": 'btc', // 电子货币
          "money": 'cny', // 法币
          "mode": 1, // 出售类型: 1 固定; 2 溢价
          "premium": 0, // 溢价
          "price": '', // 固定价格/最低价格
          "min": '200', // 每笔交易的最小限额
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
      }
    },
    components: {
      BasePopup
    },
    computed: {
      saleCanClick() {
        if (this.$store.state.editFlag == 2) { // 购买过来
          return false
        }
        return true
      },
      buyCanClick() {
        if (this.$store.state.editFlag == 1) { // 出售过来
          return false
        }
        return true
      }
    },
    created() {
      this.Bus.$on('saleSlideLength', data => {
        console.log('saleSlideLength', data)
        this.saleObj.length = data * 1
        this.saleObj.tradeable = this.saleObj.tradeable ? this.saleObj.tradeable : data * 1
        // this.saleObj.tradeable = data * 1
      }),
      this.Bus.$on('buyInfo', data => {
        this.buyObj = data
      }),
      this.Bus.$on('saleInfo', data => {
        this.saleObj = data
      })
      this.$store.state.editFlag !== 2 && this.$store.state.editFlag !== 1 && this.initPayment()
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
        //   return
        // }
        this.$router.push({name:'releaseSale', params: {'saleCon': this.saleObj}})
      },
      buyAd() {
        this.$router.push({name:'releaseBuy', params: {'buyCon': this.buyObj}})
      },
      closeLayer() {
        this.adRemindLayer = false
      },
      async initPayment() { // 获取用户钱包支付方式
        await this.WsProxy.send('wallet', 'my_accounts', {
          uid: this.$store.state.userInfo.uid,
          origin: 0
        }).then((data)=>{
          let paymentList = [], filterList = [], sum = 0
          data.accounts.forEach(v => { // 取得原始数组
            paymentList.push(v.type)
          })
          paymentList.forEach(v => { // 数组去重
            if (filterList.indexOf(v) < 0) {
              filterList.push(v)
            }
          })
          filterList.forEach(v => { // 数组求和
            sum = sum + v;``
            return sum
          });
          this.buyObj.payment = sum
          this.saleObj.payment = sum
          console.log('请求回来的数据', sum)
          this.$store.commit({type: 'initPaymentSore', data: sum})
          this.Bus.$emit('paymentNum', sum)
          console.log('我的支付', paymentList, filterList, sum, this.buyObj.payment)
        }).catch((msg)=>{
          console.log(msg)
        });
      },
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
