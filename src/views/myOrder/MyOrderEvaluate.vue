<template>
  <div class="my-order-evaluate-wrap inner">
    <h1>mixOTC-我的订单-评价</h1>
    <div class="evaluate-content">
      <p>
        <img src="" alt="">
        <em>xin2378</em>
        <i>访问TA的主页</i>
      </p>
      <dl>
        <dt>评价对方</dt>
        <dd v-for="content in orderList">
          <span>{{content.title}}</span>
          <b>{{content.info}}</b>
        </dd>
      </dl>
      <EvaluateRelease v-if="showContent === 0"></EvaluateRelease>
      <EvaluateResult v-if="showContent === 1"></EvaluateResult>
    </div>
  </div>
</template>

<script>
  import EvaluateRelease from '@/views/myOrder/EvaluateRelease' // 引入发布评价页
  import EvaluateResult from '@/views/myOrder/EvaluateResult' // 引入发布结果页

  export default {
    name: "my-order-evaluate",
    data() {
      return {
        showContent: 0,
        orderList:[
          {'title': '订单类型', 'info': '购买BTC'},
          {'title':'购买单价', 'info': '45678 CNY'},
          {'title':'购买数量', 'info': '0.12345 BTC'},
          {'title':'购买金额', 'info': '45678 CNY'},
          {'title':'创建时间', 'info': '2016/03/08 23:57:03'},
          {'title':'订单编号', 'info': '123456789098765432'},
          {'title':'订单期限', 'info': '10min'},
          {'title':'订单备注', 'info': '请使用微信支付哦～及时联系'}
        ]
      }
    },
    components: {
      EvaluateRelease,
      EvaluateResult
    },
    created() {
      this.showContent = Number(this.$route.query.type)
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .my-order-evaluate-wrap
    margin-top 40px
    margin-bottom 40px
    h1
      font-size $fz20
      font-weight bold
      color $col333
      margin-bottom 30px
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
    .evaluate-content
      padding 0 30px
      background #FFF
      p
        height 95px
        border-bottom 1px solid #E1E1E1
        img
          width 45px
          height 45px
          background aquamarine
          margin 30px 20px 0 0
        em
          position relative
          top -25px
          margin-right 115px
        i
          position relative
          top -18px
          padding-left 28px
          &:before
            position absolute
            top 0
            left 0
            width 20px
            height 20px
            content ''
            background url(/static/images/visit.png) no-repeat
            background-size 20px 20px
      dl
        margin-top 20px
        border-bottom 1px solid #E1E1E1
        dt
          font-size 20px
          font-weight bold
          color #333
          margin-bottom 23px
        dd
          margin-bottom 20px
          span
            color #333
            margin-right 92px
          b
            color #999
        dd:nth-child(2)
          b
            font-size 20px
            color #333





</style>
