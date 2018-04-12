<template>
  <div class="my-order-evaluate-wrap inner">
    <h1>
      <router-link to="/transaction">mixOTC</router-link>-
      <router-link to="/order">我的订单</router-link>-
      <router-link to="/order/evaluate">评价</router-link>
    </h1>
    <div class="evaluate-content">
      <p>
        <img :src="`http://192.168.113.26/image/${icon}`" alt="">
        <em>{{name}}</em>
        <router-link to="/homepage">访问TA的主页</router-link>
      </p>
      <div class="content-info clearfix">
        <h2>评价对方</h2>
        <ul>
          <li v-for="content in titleList">{{content}}</li>
        </ul>
        <ol>
          <li>{{currency}}</li>
          <li>{{price}}</li>
          <li>{{num}}</li>
          <li>{{amountc}}</li>
          <li>{{create}}</li>
          <li>{{id}}</li>
          <li>{{limit}}</li>
          <li>{{info}}</li>
        </ol>
      </div>
      <EvaluateRelease v-if="showContent === 0"
                       :id="propsId"
                       :receiver="propsSid"
                       :type="propsType">
      </EvaluateRelease>
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
        titleList: ['订单类型', '购买单价', '购买数量', '购买金额', '创建时间', '订单编号', '订单期限', '订单备注'],
        name: '',
        currency: '',
        price: '',
        num: '',
        amountc: '',
        create: '',
        id: '',
        limit: '',
        info: '',
        propsId: '',
        propsSid: '',
        propsType: '',
        icon: ''
      }
    },
    components: {
      EvaluateRelease,
      EvaluateResult
    },
    created() {

      this.showContent = Number(this.$route.query.type)
      this.orderList = this.$route.query.data
      console.log('orderList', this.orderList)
      this.icon = this.orderList.icon
      this.name = this.orderList.name
      this.currency = `${this.orderList.type == 1 ? '购买' : '出售'}${this.orderList.currency.toUpperCase()}`
      this.price = `${this.orderList.price}CNY`
      this.num = '1111111'
      this.amountc = `${this.orderList.amountc}CNY`
      this.create = (Number(this.orderList.create) * 1000).toDate('yyyy/MM/dd HH:mm:ss')
      this.id = this.JsonBig.stringify(this.orderList.id)
      this.limit = '222222'
      this.info = this.orderList.info
      this.propsId = this.orderList.id
      this.propsType = this.orderList.type
      this.propsSid = this.orderList.sid
      this.Bus.$on('showReult', data => { // 接收订单完成后的变量提示，变为订单结果
        this.showContent = data
      })
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
          margin 30px 20px 0 0
          border-radius 50%
        em
          position relative
          top -25px
          margin-right 115px
        a
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
      .content-info
        margin-top 20px
        border-bottom 1px solid #E1E1E1
        h2
          font-size 20px
          font-weight bold
          color #333
          margin-bottom 23px
        li
          height 20px
          line-height 20px
          margin-bottom 20px
        ul
          float left
          margin-right 92px
          li
            color #333
        ol
          float left
          li
            color #999
          li:first-child
            font-size 20px
            color #333






</style>
