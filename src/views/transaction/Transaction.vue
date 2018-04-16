<template>
  <div>
    <div class="transacation inner">
      <TopSearch :topList="['ETH', 'BTC', 'ADA', 'BAT', 'LTC']"></TopSearch>

      <div class="filtrate">
        <div class="select" @click.stop="switchPayment">
          <i>{{payTitle}}</i>
          <ul class="payment" v-clickoutside="changePayment" v-show="showPayment">
            <li v-for="(item, index) of payment" :key="index" :class="{selected: item.state}" @click.stop="item.state = !item.state">
              <span>{{item.type}}</span>
            </li>
          </ul>
          <img src="/static/images/cancel_icon.png" alt="" v-if="paymentScore !== 0" @click.stop="clearPayment">
        </div>
        <div class="price">
          <b :class="{tip}">!最大限额不能低于最小限额，且最小限额为200</b>
          <input type="number" class="min" @blur="filte.min = min" @keyup.enter="filte.min = min" @input="inputDealMin(max)" ref='min' v-model="min" placeholder="最低价" step="1" min="200">
          <input type="number" class="max" @blur="filte.max = max" @keyup.enter="filte.max = max" @input="inputDealMax(min)" ref='max' v-model="max" placeholder="最高价" step="1">
        </div>
        <div class="wholesale">
          <img src="/static/images/selected.png" alt="" @click="changeIsWhole" v-if="isWhole">
          <img src="/static/images/unselect.png" alt="" @click="changeIsWhole" v-else>
          <span>大额交易区</span>
        </div>
      </div>

      <div class="result-list">
        <div class="thead clearfix">
          <p class="merchant" title="默认排序">
            <span @click="sort()">广告主</span>
          </p>
          <p class="deal-volume sort" 
             title="该币种已成交总量"
             :class="{'sort-add': filte.volume === 2, 'sort-minus': filte.volume === 1}"
          >
            <span @click="sort('volume')">已成交量</span>
          </p>
          <p class="order-volume sort" 
             title="该币种已成交的订单量"
             :class="{'sort-add': filte.order === 2, 'sort-minus': filte.order === 1}"
          >
            <span @click="sort('order')">完成订单量</span>
          </p>
          <p class="good-reputation sort" 
             title="该币种交易中获得的好评率"
             :class="{'sort-add': filte.rate === 2, 'sort-minus': filte.rate === 1}"
          >
            <span @click="sort('rate')">好评率</span>
          </p>
          <p class="limit-price" title="单笔交易金额范围">
            <span>限额(CNY)</span>
          </p>
          <p class="payment">
            <span>付款方式</span>
          </p>
          <p class="amount sort" 
             title="当前可交易的数量"
          >
            <span @click="sort()">可交易量</span>
          </p>
          <p class="price sort" 
             title="单个数字币价格"
             :class="{'sort-add': filte.price === 2, 'sort-minus': filte.price === 1}"
          >
            <span @click="sort('price')">价格(CNY)</span>
          </p>
        </div>
        <ul>
          <li is='ResultListItem' :emitValue="emitValue" v-for="(item, index) of result" :key="index" :data="item" :class="{even: index%2 === 0}"></li>
        </ul>
      </div>

      <Pagination :total="230" :pageSize="20" emitValue='changePage'></Pagination>
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
    <BasePopup class="popup" :show="showPopup" :top="29.17" v-on:click.native="showPopup = false">
      <slot>
        <p>{{popupTip}}</p>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
import TopSearch from './children/TopSearch';
import ResultListItem from './children/ResultListItem';
import Pagination from '@/components/common/Pagination';
import BasePopup from '@/components/common/BasePopup';
  export default {
    components: {
      TopSearch,
      ResultListItem,
      Pagination,
      BasePopup
    },
    data() {
      return {
        tip: false,//限额错误文案提示
        showPayment: false,
        isWhole: false,
        payment:[{type: '支付宝', score: 1, state: false}, {type: '微信', score: 2, state: false}, {type: '银行卡', score:4, state: false}],
        min:'',
        max:'',
        filte:{
          type: 1,// 1出售，2购买
          payment: '',//1支付宝，2微信，4银行卡，可相加，共6种
          currency: 'btc',//字符串
          money: 'CNY',//货币类型CNY
          min: 200,
          max: 9007199254741,
          count: 20,//每页广告条数
          user: '',//用户名昵称模糊搜索
          // mode: '',//是否可溢价，1可，2不可，暂无
          price: '', //价格排序，1降序，2升序
          date: '',//时间排序，1降序，2升序
          order: '',//订单数排序，1降序，2升序
          volume: '',//交易量排序，1降序，2升序
          rate: '',//好评率排序，1降序，2升序
          // trust: '',//信任人数排序，1降序，2升序
          // isWhole: false,
          page: 0
        },
        showPopup: false,
        popupTip: '',
        emitValue: 'popup',
        result: []
      }
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
      });
      this.Bus.$on('changeInputContent', ({type, data}) => {
        type === 'currency' && (this.filte.user = '')
        this.filte[type] = data;
      });
      this.Bus.$on(this.emitValue, data => {
        this.popupTip = data;

      });
    },
    destroyed() {
      this.Bus.$off('changePage');
      this.Bus.$off('changeCurrency');
      this.Bus.$off('changeInputContent');
      this.Bus.$off(this.emitValue);
    },
    methods: {
      //拉取广告数据
      fetchData(params) {
        this.Proxy.sales(params).then(res=>{
          this.result = res.data.sales;
        })
      },
      //最小限额输入处理
      inputDealMin(max) {
        let num = Number(this.min),
            str = this.min;
        if(!/^[0-9]+$/.test(str) || (this.max === '' ? false : num > this.max) || num < 1){
          this.min = str.substring(0, str.length - 1);
          this.$refs.min.value = str.substring(0, str.length - 1);
        }
      },
      //最大限额输入处理
      inputDealMax(min){
        let num = Number(this.max),
            str = this.max;
        if(!/^[0-9]+$/.test(str) || num < 1){
          this.max = str.substring(0, str.length - 1);
          this.$refs.max.value = str.substring(0, str.length - 1);
        }
      },
      changeIsWhole() {
        this.isWhole = !this.isWhole
      },
      //点击选择支付方式
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
      },
      sort(title) {
        title !== 'price' && (this.filte.price = ''), 
        title !== 'date' && (this.filte.date = ''),
        title !== 'order' && (this.filte.order = ''),
        title !== 'volume' && (this.filte.volume = ''),
        title !== 'rate' && (this.filte.rate =  '');
        if (title && (this.filte[title] === 1 || !this.filte[title])) {
          this.filte[title] = 2;
          return;
        }
        title && this.filte[title] === 2 && (this.filte[title] = 1)
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
      },
    },
    watch: {
      filte: {
        handler(curVal){
          setTimeout(console.log('req' , curVal.price), 0)
          let min = Number(curVal.min),
              max = Number(curVal.max);
          curVal.min === '' && (curVal.min = 200);
          curVal.min === '' && (curVal.min = 9007199254741);
          if ((min > max && curVal.min !== '' && curVal.max !== '') || curVal.min < 200) {
            console.log(this.tip)
            this.tip = true
            return;
          }
          this.tip && (this.tip = false)
          let obj = {};
          for (const key in curVal) {
            curVal.hasOwnProperty(key) && curVal[key] !== '' &&  (obj[key] = curVal[key])
          }
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
        width 260px
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
          right 10px
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
          span
             cursor pointer
          &.merchant
            width 170px
            padding-left 30px
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
          &.sort
            span
              position relative
              padding-right 19px
              &::before
                position absolute
                top 3px
                right 0px
                content ''
                triangle_up($col999)
                cursor pointer
              &::after
                position absolute
                top 10px
                right 0px
                content ''
                triangle_down($col999)
                cursor pointer
            &.sort-add
              span
                &::before
                  border-bottom-color $col422
            &.sort-minus
              span
                &::after
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
