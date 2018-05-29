<template>
  <div class="mid-container">
    <div :style="{ 'position':'absolute',top:`${midItemAllTop}px` }">
      <div class="mid-item" :style="{ 'position':'absolute',top:`${midItemTop}px`,'left':0 }">
        <span v-for="(items, index) in exchange" class="double" :key="index">
          <i>{{items.name}}</i> :
          <em :class="(items.new_price - items.old_price) >=0 ? 'is-green' : 'is-red'">{{items.new_price ? items.new_price.format('cny') : items.new_price}}&nbsp;{{(items.new_price - items.old_price) >= 0 ? '↑' :' ↓'}}</em>
        </span>
      </div>
      <div class="mid-item" :style="{ 'position':'absolute',top:`${midItemCopyTop}px`,'left':0 }">
        <span v-for="(items, index) in exchangeCopy" class="double" :key="index">
          <i>{{items.name}}</i> :
          <em :class="(items.new_price - items.old_price) >= 0 ? 'is-green' : 'is-red'">{{items.new_price ? items.new_price.format('cny') : items.new_price}}&nbsp;{{(items.new_price - items.old_price) >= 0 ? '↑' :' ↓'}}</em>
        </span>
      </div>
    </div>
    <ul class="upper-right">
      <li><span>简体中文</span></li>
      <li><router-link tag="span" to="/helpcenter" class="line">帮助</router-link></li>
      <li v-if="isAdmin && isLogin"><router-link tag="span" to="/verify/largeTransaction" class="line">大额交易申请</router-link></li>
      <li v-if="isAdmin && isLogin"><router-link tag="span" to="/verify/identifyAuth" class="line">审核</router-link></li>
      <li v-if="isAdmin && isLogin"><router-link tag="span" to="/verify/service">申诉</router-link></li>
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
    computed: {
      isAdmin(){
        if(!this.$store.state.userInfo) return false;
        return this.$store.state.userInfo.is_admin;
      },
      isLogin(){
        return this.$store.state.isLogin
      }
    },
    methods: {
      async _initGetdata() {
        await this.Proxy.coinLoop({count: 4}).then(res => {
          // console.log('轮询1', res)
          this.exchange = res.data.Quotations
          this.$store.commit({type: 'coinLoop', data: this.exchange})
        }).catch();

        this.Loop.topCurrency.clear()
        this.Loop.topCurrencyRoll.clear()
        this.Loop.topCurrency.setDelayTime(10000)
        this.Loop.topCurrency.set(async () => {
          // let res = await fetch('http://47.74.244.196/v1/home/topCurrency').then(data => data.json())
          await await this.Proxy.coinLoop({count: 4}).then(res => {
            // console.log('轮询2', res)
            this.exchangeCopy = this.flag && res.data.Quotations || this.exchangeCopy
            this.exchange = !this.flag && res.data.Quotations || this.exchange
            this.$store.commit({type: 'coinLoop', data: this.exchange})
          }).catch();

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
@import "../../stylus/base.styl";
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
        i
          font-size 13px
          color #FFF
          letter-spacing 0.15px
        em
          margin-left 5px
        .is-green
          color $col100
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
