<template>
  <div>
    <div class="transacation inner">
      <TopSearch></TopSearch>
      <div class="filtrate">
        <div class="select">
          <i>选择支付方式</i>
          <!-- <ul>
            <li>
              <span></span>
            </li>
            <li>
              <span></span>
            </li>
            <li>
              <span></span>
            </li>
          </ul> -->
        </div>
        <div class="price">
          <input type="text" class="min" placeholder="最低价">
          <input type="text" class="max" placeholder="最高价">
        </div>
        <div class="wholesale">
          <img src="/static/images/selected.png" alt="" @click="changeIsWhole" v-if="filter.isWhole">
          <img src="/static/images/unselect.png" alt="" @click="changeIsWhole" v-else>
          <span>大额交易区</span>
        </div>
      </div>
      <div class="result-list">
        <div class="thead clearfix">
          <p class="merchant"><span>商家</span></p>
          <p class="payment"><span>付款方式</span></p>
          <p class="order-volume sort"><span>订单量</span></p>
          <p class="deal-volume sort"><span>已成交量</span></p>
          <p class="good-reputation sort"><span>好评率</span></p>
          <p class="trust-amount sort"><span>信任人数</span></p>
          <p class="amount sort"><span>数量</span></p>
          <p class="limit-price sort"><span>限额(CNY)</span></p>
          <p class="price sort"><span>价格(CNY)</span></p>
        </div>
        <ul>
          <li is='ResultListItem' v-for="item of 15" :key="item" :class="{even: item%2 === 0}"></li>
        </ul>
      </div>
      <Pagination :total="75"></Pagination>
    </div>
    <div class="faq">
      <div class="inner clearfix">
        <h2>常见问题</h2>
        <ul>
          <li>如何购买数字币</li>
          <li>如何出售数字币</li>
          <li>费率说明</li>
        </ul>
        <img src="/static/images/question.jpg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import TopSearch from './children/TopSearch';
import ResultListItem from './children/ResultListItem';
import Pagination from '@/components/common/Pagination';
  export default {
    components: {
      TopSearch,
      ResultListItem,
      Pagination
    },
    mounted() {
      this.Bus.$on('changePage',(data) => {
        this.filter.pageNumber = data;
      })
    },
    destroyed() {
      this.Bus.$off('changePage')
    },
    data() {
      return {
        filter:{
          currency: '',
          nickname: '',
          account: '',
          payment: [],
          minPrice: '',
          maxPrice: '',
          sortBy: '',
          isWhole: false,
          pageNumber: 1
        },
        result: []
      }
    },
    methods: {
      changeIsWhole() {
        this.filter.isWhole = !this.filter.isWhole
      }
    },
    watch: {
      filter: {
        handler(curVal){
          console.log(curVal)
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../stylus/base.styl";
  .transacation
    margin-top 40px
    margin-bottom 40px
    .filtrate
      position relative
      height 70px
      background #FFF
      .select
        position absolute
        left 252px
        top 20px
        width 270px
        height 30px
        background #FFF
        border 1px solid $col1E1
        border-radius 2px
        i
          position absolute
          top 0px
          left 10px
          height 30px
          line-height 30px
          font-size $fz13
          color #999
          letter-spacing 0.27px
        &::before
          position absolute
          top 12.5px
          right 10px
          content ''
          triangle_down($col422)
        &::after
          position absolute
          top 7.5px
          right -30px
          width 1px
          height 15px
          content ''
          background $col1E1
      .price
        position absolute
        left 583px
        top 20px
        width 245px
        height 50px
        input
          position relative
          float left
          box-sizing()
          width 100px
          height 30px
          padding 0 24px
          margin-right 15px
          font-size: 13px;
          letter-spacing 0.15px
          border 1px solid $col1E1
          border-radius 2px
          placeholder()
        &::before
          position absolute
          top 14.5px
          left 105px
          width 5px
          height 1px
          content ''
          background $col999
        &::after
          position absolute
          top 7.5px
          right 0
          width 1px
          height 15px
          content ''
          background $col1E1
      .wholesale
        position absolute
        top 0
        left 828px
        width 371px
        height 70px
        img
          position absolute
          top 27px
          left 30px
          cursor pointer
        span
          position absolute
          left 67px
          top 27px
          font-size $fz13
          color $col333
          letter-spacing 0.15px
          &::before
            position absolute
            top 5px
            left -12px
            width 11px
            height 9px
            content ''
            background url('/static/images/whole_icon2.png')

    .result-list
      margin-bottom 20px
      border 1px solid $col1E1
      border-radius 2px
      .thead
        height 60px
        line-height 60px
        p
          position relative
          float left
          font-size $fz13
          color $col999
          letter-spacing 0.27px
          &.merchant
            width 160px
            padding-left 30px
          &.payment
            width 110px
          &.order-volume
            width 100px
          &.deal-volume
            width 110px
          &.good-reputation
            width 100px
          &.trust-amount
            width 100px
          &.amount
            width 110px
          &.limit-price
            width 110px
          &.price
            width 150px
          &.sort
            span
              position relative
              &::before
                position absolute
                top 3px
                right -19px
                content ''
                triangle_up($col999)
                cursor pointer
              &::after
                position absolute
                top 10px
                right -19px
                content ''
                triangle_down($col999)
                cursor pointer
      ul
        li.even
          background-color #FFF
  .faq
    position relative
    height 200px
    background-color #FFF
    h2
      float left
      height 30px
      margin-top 15px
      margin-right 40px
      line-height 30px
      letter-spacing 0.23px
      font-size $fz20
      font-weight bold
      color $col333
      &::before
        position relative
        top 2px
        left 0
        display inline-block
        content ''
        width 3px
        height 20px
        margin-right 10px
        background-color $col422
    ul
      height 141px
      padding-top 59px
      margin-left 389px
      font-size $fz14
      color $col333
      letter-spacing 0.16px
      li
        position relative
        margin-bottom 20px
        line-height 14px
        cursor pointer
        &::before
          position absolute
          top 0
          left -34px
          width 14px
          height 14px
          content ''
          border-radius 50%
          background $col422
        &::after
          position absolute
          top 4px
          left -31px
          width 5px
          height 5px
          content ''
          transform rotate(-45deg)
          -ms-transform rotate(-45deg) 	/* IE 9 */
          -moz-transform rotate(-45deg) 	/* Firefox */
          -webkit-transform rotate(-45deg) /* Safari 和 Chrome */
          -o-transform rotate(-45deg) 	/* Opera */
          border 1px solid #FFF
          border-left 0
          border-top 0
    img
      position absolute
      left 710px
      top 23px


</style>
