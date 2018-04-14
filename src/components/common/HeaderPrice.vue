<template>
  <div class="mid-container">
    <div :style="{ 'position':'absolute',top:`${midItemAllTop}px` }">
      <div class="mid-item" :style="{ 'position':'absolute',top:`${midItemTop}px`,'left':0 }">
            <span v-for="(items, index) in exchange" class="double" :key="index">
              <router-link :to="{path: `/currency/info/${items.id}`}">{{items.name}}</router-link> :
              <em :class="(items.changePercent*100).toFixed(2)>=0?'is-green':'is-red'">{{items.price.cny.format('cny')}}&nbsp;{{items.changePercent >= 0 ? '↑' :' ↓'}}</em>
            </span>
      </div>
      <div class="mid-item" :style="{ 'position':'absolute',top:`${midItemCopyTop}px`,'left':0 }">
            <span v-for="(items, index) in exchangeCopy" class="double" :key="index">
              <router-link :to="{path: `/currency/info/${items.id}`}">{{items.name}}</router-link> :
              <em :class="(items.changePercent*100).toFixed(2)>=0?'is-green':'is-red'">{{items.price.cny.format('cny')}}&nbsp;{{items.changePercent >= 0 ? '↑' :' ↓'}}</em>
            </span>
      </div>
    </div>
    <ul class="upper-right">
      <li><span>简体中文</span></li>
      <li><span class="line">帮助</span></li>
      <li><span class="line">大额交易申请</span></li>
      <li><span class="line">审核</span></li>
      <li><span>仲裁</span></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "headerPrice",
    data() {
      return {
        exchange: [],
        exchangeCopy: [],
        midItemAllTop: 0,
        midItemTop: 0,
        midItemCopyTop: 30,
        flag: 1
      }
    },
    created() {

    },
    mounted() {
      this._initGetdata()
    },
    methods: {
      async _initGetdata() {
        let res =await fetch('http://47.74.244.40:8081/v1/home/topCurrency').then(data => data.json())
        
        this.exchange = res.data
        // // this.exchange = [{"id":"5acf80024aef0e2828293cb2","name":"BTC","changePercent":0.90,"price":{"cny":5590.129083652126,"usd":698.2312039247622,"btc":0.09471957971460038,"eth":1.5738048012975354}},{"id":"5acf7dc64aef0e28282939a3","name":"ETC","changePercent":-0.85,"price":{"cny":23370.82907642308,"usd":456.593021713392,"btc":0.06185059878756389,"eth":1.0291733227415678}},{"id":"5acf805c4aef0e2828293d1d","name":"ADA","changePercent":0,"price":{"cny":47957.79091382944,"usd":7627.480096047534,"btc":1.031551994874608,"eth":17.152018009082067}}]

        this.Loop.topCurrency.clear()
        this.Loop.topCurrencyRoll.clear()
        this.Loop.topCurrency.setDelayTime(10000)
        this.Loop.topCurrency.set(async () => {
          let res = await fetch('http://47.74.244.40:8081/v1/home/topCurrency').then(data => data.json())
          this.exchangeCopy = this.flag && res.data || this.exchangeCopy
          this.exchange = !this.flag && res.data || this.exchange
          // console.log(this.exchange)
          this.Loop.topCurrencyRoll.start()
        }, 10000)
        this.Loop.topCurrencyRoll.set(async () => {
          this.midItemTop = this.midItemTop - 5
          this.midItemCopyTop = this.midItemCopyTop - 5
          if (this.midItemTop === -30 || this.midItemTop === 0) {
            this.Loop.topCurrencyRoll.stop()
            if (this.midItemTop === -30) {
              this.midItemTop = 30
              this.flag = 0
              return
            }
            this.midItemCopyTop = 30
            this.flag = 1
          }
        }, 100)
        this.Loop.topCurrency.start()
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">

  .mid-container
    height 100%
    width 1200px
    float left
    position relative
    overflow hidden
    .mid-item
      height 100%
      width 1000px
      line-height 30px
      .double
        color #FFF
        letter-spacing 0.12px
        height 30px
        margin-right 43px
        display block
        float left
        a
          font-size 13px
          color #FFF
          letter-spacing 0.15px
        em
          margin-left 5px
        .is-green
          color green
          position relative
          &:after
            display: block;
            background url('/static/icon/shuaxin_up@3x.png') no-repeat center center / 12px 13px
            width: 12px;
            height: 13px;
            content: '';
            position absolute
            top 2px
            right -13px
        .is-red
          color red
          position relative
          &:after
            display: block;
            background url('/static/icon/shuaxin_down@3x.png') no-repeat center center / 12px 13px
            width: 12px;
            height: 13px;
            content: '';
            position absolute
            top 2px
            right -13px
    .upper-right
        float right
        li
          float right
          margin-left 30px
          text-align center
          vertical-align middle
          line-height 30px
          span
            display inline-block
            position relative
            font-size 13px
            color #FFF
            letter-spacing 0.15px
            cursor pointer
            &.line::after
              position absolute
              top 10px
              right -15px
              content ""
              width 1px
              height 10px
              background #FFF
</style>
