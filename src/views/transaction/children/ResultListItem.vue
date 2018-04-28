<template>
  <li class="item clearfix">
    <div class="title merchant">
      <!-- <img class="whole" src="/static/images/whole_icon2.png" alt="" > -->
      <img class="avatar" @click="toHomePage(data.sid)" :src="data.icon ? `${HostUrl.http}image/${data.icon}` : `/static/images/default_avator.png`" alt="">
      <span class="nickname" @click="toHomePage(data.sid)">{{data.trader}}</span>
      <span class="trust" v-if="trustArray.includes(JsonBig.stringify(data.sid))">信任</span>
    </div>
    <div class="title deal-volume">1+BTC</div>
    <div class="title order-volume">{{data.trade ? data.trade : '-'}}</div>
    <div class="title good-reputation">{{data.rate ? `${data.rate}%` : '-'}}</div>
    <div class="title limit-price">{{`${data.min}-${data.max}`}}</div>
    <div class="title payment">
      <img src="/static/images/OTC_zhifubao.png" alt="" v-if="data.payments %2 === 1">
      <img src="/static/images/OTC_wechat.png" alt="" v-if="[3, 6, 7].includes(data.payments)">
      <img src="/static/images/OTC_Bankcard.png" alt="" v-if="[4, 5, 6, 7].includes(data.payments)">
    </div>
    <div class="title amount">{{data.tradeable}}</div>
    <div class="title price">{{data.price}}</div>
    <div class="title button">
      <button @click="_toOrder(data)">购买</button>
    </div>
  </li>
</template>

<script>
export default {
  props: ['data','emitValue','trustArray'],
  mounted() {
    // console.log(this.trustArray);
  },
  methods: {
    toHomePage(sid) {
      this.$router.push({ name: 'homepage', query: { uid: this.JsonBig.stringify(sid) }})
    },
    async _toOrder({id, sid, btverify, currency}) {
      //未登录
      let flag = 0;
      if (!this.$store.state.isLogin) {
        this.$store.commit({type: 'changeLoginForm', data: true});
        return;
      }
      // 未实名认证
      // if (!this.$store.state.userInfo.verify) {
      //   //未实名认证
      //   this.Bus.$emit(this.emitValue, 1)
      //   return;
      // }

      // 是否是自己的广告
      if (this.JsonBig.stringify(this.$store.state.userInfo.uid) === this.JsonBig.stringify(sid)) {
       //自己的广告
        this.Bus.$emit(this.emitValue, 2)
        return;
      }

    // 广告是否存在
      await this.WsProxy.send('otc', 'sale_detail', {id}).then(data => {
       // console.log('1111',data)
        if (data.state === 2 ) { // 广告不存在
          flag = 3
        }
      })
    //广告不存在
      if (flag === 3) {
        this.Bus.$emit(this.emitValue, 3)
        return
      };

    // 是否有钱包(创建成功5，创建失败4)
      await this.WsProxy.send('wallet', 'wallets', {}).then(data => {
        data.wallets && data.wallets.filter(item => {
          return currency === item.currency
        }).length > 0 ? (flag = 5) : (flag = 4)
      })
      if (flag === 4) {
        // 创建钱包
        await this.WsProxy.send('wallet', 'new_wallet', {currency}).then(data => {
          flag = 5
        }).catch(error => {
          console.log(error)
        })
      }
      //创建钱包失败
      if (flag === 4) {
        this.Bus.$emit(this.emitValue, 4)
        return
      }

      if (this.$store.state.userInfo.btverify < btverify) {
      //  大额交易权限判断（权限不符6）
        this.Bus.$emit(this.emitValue, 6)
        return
      }

      // 是否有未完成订单（有7）
      await this.WsProxy.send('otc', 'orders', {type:1, state: '1,2,3', origin: 0}).then(data => {
        if(data.orders) flag = 7;
      })
      if (flag === 7) {
        this.Bus.$emit(this.emitValue, 7)
        return
      }

      this.$router.push({ name: 'order', query: { id: this.JsonBig.stringify(id) }})
    },
  }
};
</script>

<style scoped lang="stylus">
@import '../../../stylus/base.styl';
.item
  div
    position relative
    float left
    overflow hidden
    height 85px
    font-size 14px
    color $col333
    letter-spacing 0.16px
    line-height 85px
    &.title
      box-sizing()
      padding-right 10px
      white-space nowrap
      text-overflow ellipsis
    &.merchant
      width 200px
      padding-left 30px
      .whole
        position absolute
        top 20px
        left 30px
        _rotate(-45deg)
      .avatar
        position absolute
        top 21px
        left 30px
        width 45px
        height 45px
        border-radius 50%
        cursor pointer
      span
        position absolute
        left 85px
        width 90px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        &.nickname
          top 22px
          font-size 14px
          color $col333
          letter-spacing 0.16px
          line-height 16px
          cursor pointer
        &.trust
          bottom 22px
          width 30px
          height 14px
          fz10()
          text-align center
          color #FFA21C
          letter-spacing 0.11px
          line-height 14px
          border 1px solid #FFA21C
          border-radius 2px
    &.payment
      width 120px
    &.order-volume
      width 110px
    &.deal-volume
      width 120px
    &.good-reputation
      width 110px
    &.amount
      width 120px
    &.limit-price
      width 140px
    &.price
      width 150px
      font-size 16px
      color $col100
      letter-spacing 0.18px
    &.button
      button
        width 100px
        height 30px
        margin-bottom 27px
        color #FFF
        background $col422
        border-radius 2px
        cursor pointer
        &:hover
          background $col350
</style>
