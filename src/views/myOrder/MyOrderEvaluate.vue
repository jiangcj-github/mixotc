<template>
  <div class="my-order-evaluate-wrap inner">
    <h1>
      <router-link to="/transaction">mixOTC</router-link>-
      <router-link to="/order">我的订单</router-link>-
      <router-link to="/order/evaluate">评价</router-link>
    </h1>
    <div class="evaluate-content">
      <p>
        <img :src="orderList.icon ? `${HostUrl.http}image/${orderList.icon}` : `/static/images/default_avator.png`"  alt="">
        <em>{{orderList.name}}</em>
        <router-link :to="{path:'/homepage', query:{uid: JsonBig.stringify(orderList.buyer) == userId ? orderList.seller : orderList.buyer}}">访问TA的主页</router-link>
      </p>
      <div class="content-info clearfix">
        <h2>评价对方</h2>
        <ul>
          <li v-for="content in titleList">{{content}}</li>
        </ul>
        <ol>
          <li>{{orderList.currency && `${JsonBig.stringify(orderList.buyer) == userId ? '购买' : '出售'}${orderList.currency.toUpperCase()}`}}</li>
          <li>{{`${orderList.price} CNY`}}</li>
          <li>{{orderList.currency && `${orderList.amountc} ${orderList.currency.toUpperCase()}`}}</li>
          <li>{{`${orderList.amountm} CNY`}}</li>
          <li>{{(Number(orderList.create)).toDate('yyyy/MM/dd HH:mm:ss')}}</li>
          <li>{{Number(orderList.id)}}</li>
          <li>{{ `${orderList.limit}min`}}</li>
          <li>{{orderList.info === '' ? '无' : orderList.info}}</li>
        </ol>
      </div>
      <EvaluateRelease v-if="showContent === 0"
                       :id="propsId"
                       :receiver="propsReceiver"
                       :type="propsType">
      </EvaluateRelease>
      <EvaluateResult v-if="showContent === 1"
                      :id="propsId">
      </EvaluateResult>
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
        propsId: '',
        propsReceiver: '',
        propsSid: '',
        propsType: '',
        userId: '',
        orderList: ''
      }
    },
    components: {
      EvaluateRelease,
      EvaluateResult
    },
    mounted() {
      this.userId = this.JsonBig.stringify(this.$store.state.userInfo.uid);
      this.showContent = Number(this.$route.query.type);
      this.orderList = this.$store.state.evaluateOrderResult;
      this.propsId = this.orderList.id;
      this.propsType = this.orderList.type;
      this.propsSid = this.orderList.sid;
      this.propsReceiver = this.JsonBig.stringify(this.orderList.buyer) == this.userId ? this.orderList.seller : this.orderList.buyer;
      this.Bus.$on('showReult', data => { // 接收订单完成后的变量提示，变为订单结果
        // console.log('111', data)
        this.showContent = data
        this.$route.query.type = 1
      })
      console.log('this.orderList', this.orderList)
    },
    // beforeRouteUpdate(to, from, next) { // 路由更新获取新的值
    //   this.showContent = to.query.type;
    //   next();
    // }
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
          line-height 20px
          margin-bottom 20px
        ul
          float left
          width 60px
          margin-right 90px
          li
            color #333
        ol
          float left
          width 980px
          li
            color #999
          li:first-child
            font-size 20px
            color #333






</style>
