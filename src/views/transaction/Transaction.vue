<template>
  <div>
    <div class="transacation inner">
      <TopSearch :topList="['ETH', 'BTC', 'ADA', 'BAT', 'ETH']"></TopSearch>
      <div class="filtrate">
        <div class="select" @click.stop="switchPayment">
          <i>{{payTitle}}</i>
          <ul class="payment" v-clickoutside="changePayment" v-show="showPayment">
            <li v-for="(item, index) of payment" :key="index" :class="{selected: item.state}" @click.stop="item.state = !item.state">
              <span>{{item.type}}</span>
            </li>
          </ul>
          <img src="/static/images/cancel_icon.png" alt="" v-if="paymentScore !== 0" @click="clearPayment">
        </div>
        <div class="price">
          <b :class="{tip}">最大限额不能低于最小限额且最小限额为200</b>
          <input type="number" class="min" @blur="filte.min = min" @keyup.enter="filte.min = min" @input="inputDealMin(max)" ref='min' v-model="min" placeholder="最低价" step="1" min="200">
          <input type="number" class="max" @blur="filte.max = max" @keyup.enter="filte.max = max" @input="inputDealMax(min)" ref='max' v-model="max" placeholder="最高价" step="1">
        </div>
        <div class="wholesale">
          <img src="/static/images/selected.png" alt="" @click="changeIsWhole" v-if="filte.isWhole">
          <img src="/static/images/unselect.png" alt="" @click="changeIsWhole" v-else>
          <span>大额交易区</span>
        </div>
      </div>
      <div class="result-list">
        <div class="thead clearfix">
          <p class="merchant"><span>商家</span></p>
          <p class="payment"><span>付款方式</span></p>
          <p class="order-volume sort"><span>订单量<i class="before"></i><i class="after"></i></span></p>
          <p class="deal-volume sort"><span>已成交量<i class="before"></i><i class="after"></i></span></p>
          <p class="good-reputation sort"><span>好评率<i class="before"></i><i class="after"></i></span></p>
          <p class="trust-amount sort"><span>信任人数<i class="before"></i><i class="after"></i></span></p>
          <p class="amount sort"><span>数量<i class="before"></i><i class="after"></i></span></p>
          <p class="limit-price sort"><span>限额(CNY)<i class="before"></i><i class="after"></i></span></p>
          <p class="price sort" 
            :class="{'sort-add': filte.sort === 5, 'sort-minus': filte.sort === 6}">
            <span>价格(CNY)
              <i class="before" @click="filte.sort = 5"></i>
              <i class="after" @click="filte.sort = 6"></i>
            </span>
          </p>
        </div>
        <ul>
          <li is='ResultListItem' v-for="(item, index) of result" :key="index" :data="item" :class="{even: index%2 === 0}"></li>
        </ul>
      </div>
      <Pagination :total="75" :pageSize="20" emitValue='changePage'></Pagination>
    </div>
    <div class="faq">
      <div class="inner clearfix">
        <h2>常见问题</h2>
        <ul>
          <li>如何购买数字币</li>
          <li>如何出售数字币</li>
          <li>费率说明</li>
        </ul>
        <img src="/static/images/question.png" alt="">
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
    created() {
      this.fetchData({type: 1, count: 20, page: 0 })
    },
    mounted() {
      this.Bus.$on('changePage',data => {
        this.filte.page = data - 1 ;
      });
      this.Bus.$on('changeCurrency', data => {
        this.filte.currency = data.toLowerCase()
      })
      this.Bus.$on('changeInputContent', ({type, data}) => {
        this.filte[type] = data;
      })
    },
    destroyed() {
      this.Bus.$off('changePage');
      this.Bus.$off('changeCurrency');
      this.Bus.$off('changeInputContent');
    },
    data() {
      return {
        tip: false,
        showPayment: false,
        payment:[{type: '支付宝', score: 1, state: false}, {type: '微信', score: 2, state: false}, {type: '银行卡', score:4, state: false}],
        min:'',
        max:'',
        filte:{
          type: 1,// 1出售，2购买
          sort: 2,//1智能排序，2最新，3成交最多，4信任数最多，5价格由高到低，6价格由低到高
          payment: '',//1支付宝，2微信，4银行卡，可相加，共6种
          currency: 'btc',//字符串
          money: 'CNY',//货币类型CNY
          min: 200,
          max: '',
          count: 20,//每页广告条数
          nickname: '',
          isWhole: false,
          page: 0
        },
        result: []
      }
    },
    methods: {
      fetchData(params) {
        this.Proxy.sales(params).then(res=>{
          this.result = res.data.sales;
          console.log(this.result)
        })
      },
      inputDealMin(max) {
        let num = Number(this.min),
            str = this.min;
        if(!/^[0-9]+$/.test(str) || (this.max === '' ? false : num > this.max) || num < 1){
          this.min = str.substring(0, str.length - 1);
          this.$refs.min.value = str.substring(0, str.length - 1);
        }
      },
      inputDealMax(min){
        let num = Number(this.max),
            str = this.max;
        if(!/^[0-9]+$/.test(str) || num < 1){
          this.max = str.substring(0, str.length - 1);
          this.$refs.max.value = str.substring(0, str.length - 1);
        }
      },
      changeIsWhole() {
        this.filte.isWhole = !this.filte.isWhole
      },
      switchPayment() {
        if (!this.showPayment) {
          this.showPayment = true;
          return;
        }
        this.changePayment()
      },
      clearPayment() {
        this.payment.forEach(item => {
          item.state = false
        })
      },
      hidePayment() {
        if(!this.showPayment) return;
        this.showPayment = false
      },
      changePayment() {
        this.hidePayment();
        if (this.paymentScore === 0 ) {
          this.filte.payment = ''
          return;
        }
        this.filte.payment = this.paymentScore
      }
    },
    computed: {
      payTitle() {
        let title = this.payment.filter(item => {
            return item.state;
        }).map(item => {
            return item.type;
        })
        if(title.length ===0) return '选择支付方式'
        return title.join('/');
      },
      paymentScore() {
        let score = 0;
        this.payment.filter(item => {
          return item.state;
        }).forEach(item => {
          score += item.score;
        })
        return score;
      }
    },
    watch: {
      filte: {
        handler(curVal){
          let min = Number(curVal.min),
              max = Number(curVal.max);
          if (curVal.min === '') curVal.min = 200
          if ((min > max && curVal.min !== '' && curVal.max !== '') || curVal.min < 200) {
            console.log(this.tip)
            this.tip = true
            return;
          }
          this.tip && (this.tip = false)
          let obj = JSON.parse(JSON.stringify(curVal))
          this.fetchData(obj)
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
        box-sizing()
        position absolute
        left 252px
        top 20px
        width 270px
        height 30px
        background #FFF
        border 1px solid $col1E1
        border-radius 2px
        img
          position absolute
          top 9px
          right 30px
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
        .payment
          position absolute
          top 28px
          left -1px
          width 100%
          background #FFF
          border 1px solid $col1E1
          z-index 9
          li
            position relative
            height 30px
            line-height 30px
            cursor pointer
            &:hover
              background-color $col3EB
            &::after
              position absolute
              top 8px
              right 8px
              content ''
              width 16px
              height 16px
              background url('/static/images/unselect.png')
            &.selected::after
              background url('/static/images/selected.png')
            span
              float left
              height 30px
              padding-left 10px
              font-size $fz13
              letter-spacing 0.27px
      .price
        position absolute
        left 583px
        top 20px
        width 245px
        height 50px
        b
          display none
          position absolute
          left 0
          top 32px
          color $col422
          fz11()
          &.tip
            display block
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
              i.before
                position absolute
                top 3px
                right -19px
                triangle_up($col999)
                cursor pointer
              i.after
                position absolute
                top 10px
                right -19px
                triangle_down($col999)
                cursor pointer
            &.sort-add
              span
                i.before
                  border-bottom-color $col422
            &.sort-minus
              span
                i.after
                  border-top-color $col422
      ul
        li.even
          background-color #FFF
  .faq
    position relative
    height 200px
    background-color #FFF
    .inner
      position relative
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
      left 650px
      top 35px


</style>
