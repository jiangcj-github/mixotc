<template>
  <div class="release-ad-wrap">
    <p class="title">
      <span>mixOTC</span>-<span>发广告</span>
      <b>提示：离线或退出时，在订单盘的排序会靠后，订单延时，可能会有投诉，影响订单，建议下载APP，保持随时在线</b>
    </p>
    <div class="inner release-ad-box clearfix">
      <ul>
        <li class="buy-ad" :class="{active: $route.path=='/advertisement/release/buy'}" @click="buyAd">购买广告</li>
        <li class="sale-ad" :class="{active: $route.path=='/advertisement/release/sale'}" @click="saleAd">出售广告</li>
        <!--{{buyObj}}-->
      </ul>
      <div class="release-ad-content">
        <h1>余额超过0.05BTC才能在交易中心展示广告</h1>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "releaseAd",
    data() {
      return {
        buyObj: {},
        saleObj: {}
      }
    },
    components: {

    },
    computed: {

    },
    created() {

    },
    mounted() {
      this.Bus.$on('buyInfo', data => {
        console.log('购买父组件接收', data)
        this.buyObj = data
      })
    },
    destroyed() {
      this.Bus.$off('buyInfo');
    },
    methods: {
      buyAd() {
        this.Bus.$emit('buyRelease', this.buyObj)
        this.$router.push({path: '/advertisement/release/buy'})

      },
      saleAd(){
        this.Bus.$emit('saleRelease', this.saleObj)
        this.$router.push({path: '/advertisement/release/sale'})

      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  @import "../advertisement/css/release.styl"

</style>
