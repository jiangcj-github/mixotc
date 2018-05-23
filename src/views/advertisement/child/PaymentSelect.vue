<template>
  <div class="payment-wrap"  v-clickoutside="()=>{showPayment=false}">
    <span :class="{'select-title': paymentTitle !== '选择支付方式' }" @click.stop="showPayment=!showPayment">{{paymentTitle}}</span>
    <ul v-show="showPayment" class="clearfix">
      <li v-for="(item, index) of payment" :class="{selected: item.state}" @mousedown="item.state = !item.state" @click="choicePayment()">
        <img :src="item.url">
        <b>{{item.type}}</b>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['soreTab'],
    data() {
      return {
        soreItem: 0,
        showPayment: false,
        payment:[
          {type: '支付宝', url: '/static/images/OTC_zhifubao.png', score: 1, state: false},
          {type: '微信', url: '/static/images/OTC_wechat.png', score: 2, state: false},
          {type: '银行卡', url: '/static/images/OTC_Bankcard.png', score:4, state: false}
        ],
      }
    },
    computed: {
      paymentTitle() {
        let title = this.payment.filter(item => {
          return item.state;
        }).map(item => {
          return item.type;
        });
        if (title.length === 0) return '选择支付方式';
        return title.join('/');
      },
      paymentScore() {
        let score = 0;
        this.payment.filter(item => {
          return item.state;
        }).forEach(item => {
          score += item.score;
        });
        return score;
      }
    },
    watch: {

    },
    created() {

    },
    mounted() { // 第一次加载接收值
      this.Bus.$on('paymentNum', data => {
        this.soreItem = data
        this.paymentItem(this.soreItem)
      })
      this.paymentItem(this.soreTab) // tab切换值
    },
    destroyed() {
      this.Bus.$off('showPayment');
      this.Bus.$off('paymentNum');
    },
    methods: {
      choicePayment() {
        this.Bus.$emit('choicePayment', this.paymentScore);
      },
      paymentItem(data) {
        switch (data) {
          case 1:
            this.payment[0].state = true
            break;
          case 2:
            this.payment[1].state = true
            break;
          case 3:
            this.payment[0].state = true
            this.payment[1].state = true
            break;
          case 4:
            this.payment[2].state = true
            break;
          case 5:
            this.payment[0].state = true
            this.payment[2].state = true
            break;
          case 6:
            this.payment[1].state = true
            this.payment[2].state = true
            break;
          case 7:
            this.payment[0].state = true
            this.payment[1].state = true
            this.payment[2].state = true
            break;
          default:
            this.payment[0].state = false
            this.payment[1].state = false
            this.payment[2].state = false
        }
      }
    }
  }
</script>
<style scoped type="text/stylus" lang="stylus">
  @import "../../../stylus/base.styl"
  .payment-wrap
    position relative
    display inline-block
    width 620px
    margin-right 30px
    cursor pointer
    &:after
      position absolute
      top 18px
      right 10px
      content ''
      triangle_down($col422)
    span
      position relative
      display inline-block
      width 608px
      height 39px
      line-height 39px
      color #999
      padding-left 10px
      background #FFF
      border 1px solid #E1E1E1
      border-radius 2px
      &.select-title
        color $col333
    ul
      position absolute
      top 39px
      width 448px
      height 20px
      padding 20px 85px
      background #FFF
      border 1px solid #E1E1E1
      li
        float left
        position relative
        height 20px
        padding-left 0
        line-height 20px
        font-size 13px
        letter-spacing 0.27px
        margin-right 50px
        cursor pointer
        &:after
          position absolute
          top 4px
          right 8px
          content ''
          width 15px
          height 15px
          background url('/static/images/unselect.png')
          background-size 15px 15px
        &.selected:after
          background url('/static/images/selected.png')
          background-size 15px 15px
        img
          position relative
          top -2px
          width 20px
          height 20px
          margin-right 10px
          vertical-align middle
        b
          padding-right 45px
          color #333
      li:last-child
        margin-right 0






</style>


