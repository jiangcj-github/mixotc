<template>
  <div class="my-order-wrap inner">
    <h1>mixOTC-我的订单</h1>
    <div class="order-item">
      <span @click="selectStatus(1)" :class="contentTabIndex === 1 ? 'content-btn-active' : 'content-btn'">进行中(3)</span>
      <span @click="selectStatus(2)" :class="contentTabIndex === 2 ? 'content-btn-active' : 'content-btn'">完成(6)</span>
    </div>
    <div class="order-select">
      <div class="order-choice">
        <div>
          <ChoiceBox :classify="orderType"
                     title="订单类型"
                     :emitValue="orderTypeValue">
          </ChoiceBox>
          <ChoiceBox :classify="currency"
                     title="币种"
                     :emitValue="currencyValue">
          </ChoiceBox>
          <ChoiceBox :classify="allStatus"
                      title="全部状态"
                     :emitValue="allStatusValue">
          </ChoiceBox>
        </div>
        <div class="order-choice-time clearfix" v-if="contentTabIndex === 2">
          <img src="/static/images/calendar.png" alt="">
          <ol class="clearfix">
            <li><DatePicker></DatePicker></li>
            <li>-</li>
            <li><DatePicker></DatePicker></li>
          </ol>
          <ul class="clearfix">
            <li v-for="item in timeList">{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="order-search clearfix">
        <input type="text" placeholder="搜索订单号"/>
        <div><img src="/static/images/search.png"></div>
      </div>
    </div>

    <div class="order-content">
      <ol class="clearfix">
        <li v-for="content in contentTitleList">{{content}}</li>
      </ol>
      <div class="order-content-info">
        <ul class="clearfix">
          <li>
            <p>2016/03/09</p>
            <p>13:43</p>
          </li>
          <li>购买</li>
          <li>BTC</li>
          <li>
            <p>lihh/130***123</p>
            <p class="talk">联系他</p>
          </li>
          <li>1.12345678</li>
          <li>
            <p>+1.12 BTC</p>
            <p>0.00004</p>
          </li>
          <li>1.12345678</li>
          <li>234abc</li>
          <li>
            <p>代付款</p>
          </li>
          <li><router-link to="/order/evaluate">去评价</router-link></li>
        </ul>
        <p class="order-content-extre">
          <span>订单号：123456789098765432</span>
          <span>备注：希望可以快速放币</span>
        </p>
      </div>
    </div>
    <div>
      <Pagination :type=10></Pagination>
    </div>

  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import Pagination from '@/components/common/Pagination' // 引入分页
  import DatePicker from '@/components/common/DatePicker' // 引入日历

  export default {
    name: "my-order",
    components: {
      ChoiceBox,
      Pagination,
      DatePicker
    },
    data() {
      return {
        contentTabIndex: 1,
        timeList: ['今天', '三天', '七天'],
        orderType: ['全部类型', '购买', '出售'],
        orderTypeValue: 'orderTypeValue',
        currency: ['BTC', 'ETH', 'LTC'],
        currencyValue: 'currencyValue',
        allStatus: ['全部状态', '待付款', '待放币', '申述中'],
        allStatusValue: 'allStatusValue',
        contentTitleList: ['创建时间', '类型', '币种', '对方', '单价(CNY)', '数量(手续费)', '金额(CNY)', '资金码', '状态', '操作'],
        contentList:[
          {date: '2016/03/09', time: ''}
        ]
      }
    },
    mounted() {
      // 监听时间值，将值传给子组件
      this.Bus.$on(this.orderTypeValue, (data) => {
        console.log('orderTypeValue', data)
      });
      this.Bus.$on(this.currencyValue, (data) => {
        console.log('currencyValue', data)
      });
      this.Bus.$on(this.allStatusValue, (data) => {
        console.log('allStatusValue', data)
      });
    },
    methods: {
      selectStatus(type) { // Tab切换
        this.contentTabIndex = type;
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .my-order-wrap
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

    .order-item
      margin-bottom 1px
      padding-left 30px
      background #FFF
      line-height 60px
      font-size 16px
      span
        padding 18px 15px
      span:first-child
        margin-right 30px
      .content-btn
        color #999
      .content-btn-active
        color $col422
        border-bottom 2px solid $col422

    .order-select
      padding 0 0 10px 30px
      background #FFF
      .order-choice
        display flex
        align-items center
        height 50px
        margin-bottom 10px
      .order-search
        width 456px
        border 1px solid #E1E1E1
        border-radius 2px 2px 2px 0
        input
          float left
          width 374px
          height 30px
          padding-left 10px
        div
          position relative
          float right
          width 72px
          height 30px
          line-height 30px
          text-align center
          background #E1E1E1
          &:after
            position absolute
            top 13px
            left -300px
            width 11px
            height 5px
            content ''
            background url(/static/images/triangle_yellow.png) no-repeat
            background-size 11px 5px
          img
            vertical-align middle
      .order-choice-time
        margin-left 370px
        ol, ul, img
          float left
        li
          float left
        ol
          line-height 30px
          margin-right 22px
          li:nth-child(2)
            margin 0 10px
        ul
          line-height 30px
          border 1px solid #FFF3EB
          border-radius 0 2px 2px 0
          li
            width 50px
            text-align center
        img
          width 16px
          height 16px
          margin 8px 10px 0 0

    .order-content
      li
        width 110px
        font-size $fz13
      li:nth-child(1)
        width 130px
      li:nth-child(4)
        width: 160px
      li:nth-child(9)
        width 70px
      ol
        margin 20px 0
        padding 0 30px
        li
          float left
          color #999
      .order-content-info
        padding 18px 30px
        border 1px solid #E1E1E1
        background #FFF
        ul
          padding-bottom 10px
          border-bottom 1px solid #E1E1E1
          li
            float left
            .talk
              position relative
              padding-left 30px
              color #FFB422
              &:before
                position absolute
                top 0
                left 0
                width 18px
                height 18px
                content ''
                background url(/static/images/talk.png) no-repeat
                background-size 18px 18px

          li:nth-child(2)
            color $col100
        .order-content-extre
          padding-top 17px





</style>
