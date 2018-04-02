<template>
  <div class="order inner">
    <h2>{{copy.type[type]}}{{currency}}</h2>
    <div class="main">
      <!-- 交易对方的信息 -->
      <div class="counterparty clearfix">
        <div class="info">
          <div class="avatar">
            <img src="" alt="">
          </div>
          <span class="nickname">
            {{nickname}}
          </span>
        </div>
        <div class="contact clearfix">
          <router-link class="conversation" to="" tag="span">
            <img :src="require(`@/assets/images/conversation_icon.png`)" alt="">
            联系TA
          </router-link>
          <router-link class="self-page" to="" tag="span">
            <img :src="require(`@/assets/images/selfpage_icon.png`)" alt="">
            访问TA的主页
          </router-link>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order-info">
        <p class="tip">下单后此交易的比特币将托管锁定，请放心{{copy.type[type]}}。</p>
        <ul>
          <li class="price">
            <span class="title">价格</span>
            <p>70000CNY</p>
          </li>
          <li>
            <span class="title">可交易量</span>
            <p>1.12345678 BTC</p>
          </li>
          <li>
            <span class="title">限额</span>
            <p>200.00~10000.00 CNY</p>
          </li>
          <li>
            <span class="title">付款方式</span>
            <p>
              <img :src="require(`@/assets/images/OTC_zhifubao.png`)" alt="">
              <img :src="require(`@/assets/images/OTC_wechat.png`)" alt="">
              <img :src="require(`@/assets/images/OTC_bankcard.png`)" alt="">
            </p>
          </li>
          <li>
            <span class="title">期限</span>
            <p>10min</p>
          </li>
          <li class="remark">
            <span class="title">备注</span>
            <p>请使用微信支付哦～及时联系</p>
          </li>
        </ul>
      </div>
      <!-- 交易数量 -->
      <div class="amount">
        <h3>
          {{copy.type[type]}}多少？
          <router-link to="" tag="span" v-if="!type">去充币</router-link>
        </h3>
        <p class="rate">{{copy.rate[type]}}</p>
        <div class="input">
          <div>
            <input type="number" :placeholder="`输入${copy.type[type]}金额`" v-model="money" @input="changeMoney">
            <b>CNY</b>
          </div>
          <img :src="require(`@/assets/images/huansuan.png`)" alt="">
          <div>
            <input type="number" :placeholder="`输入${copy.type[type]}数量`" v-model="amount" @input="changeAmount">
            <b>BTC</b>
          </div>
        </div>
        <p class="charge" v-if="!type">手续费：0.2%   0BTC</p>
        <div class="rules">
          <img :src="require(`@/assets/images/rules_checked.png`)" alt="" v-if="agree" @click="agree = false">
          <img :src="require(`@/assets/images/rules_unchecked.png`)" alt="" v-else @click="agree = true">
          <router-link to="" tag="span">我已阅读《OTC购买流程规则》</router-link>
        </div>
      </div>
      <button :class="{able:agree}" :disabled="agree">{{copy.type[type]}}</button>
      <p class="tishi">
        <img :src="require(`@/assets/images/hint.png`)" alt="">
        新用户首次交易前请务必查阅本平台交易流程及规则，如交易出现问题请及时与客服人员沟通
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 1,//0表示出售，1表示购买
        balance:1.242342,
        rate: 57525,
        currency: 'BTC',
        avatar: '',
        amount: '',
        money: '',
        agree: false, //true已阅读规则，false未阅读
        nickname: 'xin2378',
        copy:{
          type: ['出售', '购买'],
          rate: [`可用余额1.242342BTC`, `57525 CNY = 1 BTC` ]
        },
      }
    },
    methods: {
      changeMoney() {
        this.amount = this.money/(this.rate);
        this.money === '' && (this.amount = '');
      },
      changeAmount() {
        this.money = this.amount*this.rate;
        this.amount === '' && (this.money = '');
      }
    }
  }
</script>

<style scoped lang="stylus">
  .order
    margin-top 40px
    margin-bottom 40px
    h2
      height 30px
      padding-left 30px
      line-height 30px
      letter-spacing: 0.23px;
      font-size 20px
      font-weight bold
      color: #333333;
      &::before
        position relative
        top 2px
        left 0
        display inline-block
        content ''
        width 3px
        height 20px
        margin-right 10px
        background-color #FFB422
    .main
      box-sizing border-box
      width 100%
      padding 30px
      margin-top 25px
      background-color #FFF
      .counterparty
        padding-bottom 20px
        border-bottom 1px solid #E1E1E1
        .info
          float left
          width 230px
          height 45px
          line-height 45px
          .avatar
            display inline-block
            width 45px
            height 45px
            margin-right 20px
            border-radius 50%
            background-color skyblue
          .nickname
            letter-spacing: 0.16px
        .contact
          float left
          line-height 45px
          height 45px
          span
            float left
            letter-spacing 0.23px
            font-size 11px
            cursor pointer
            &.conversation
              position relative
              padding-left 30px
              margin-right 30px
              img
                position absolute
                top 50%
                left 0
                width 20px
                height 20px
                margin-top -10px
            &.self-page
              position relative
              padding-left 30px
              img
                position absolute
                top 50%
                left 0
                width 20px
                height 20px
                margin-top -10px
      .order-info
        padding 20px 0 10px 0
        border-bottom 1px solid #E1E1E1
        .tip
          letter-spacing 0.23px
          font-size 11px
          color #FF794C
        ul
          li
            height 34px
            line-height 34px
            .title
              float left
              width 150px
              height 100%
              letter-spacing 0.16px
            p
              color #999
              letter-spacing 0.16px
            &.price
              p
                font-size 20px
                color #333333
                letter-spacing 0.23px;
      .amount
        margin-bottom 30px
        h3
          width 620px
          height 60px
          line-height 60px
          letter-spacing 0.23px
          font-weight bold
          font-size 20px
          span
            float right 
            font-weight normal
            font-size: 13px;
            color: #FFB422;
            letter-spacing: 0.15px;
            cursor pointer
        .rate
          letter-spacing 0.12px
          font-size 11px
          margin-bottom 10px
        .input
          margin-bottom 10px
          div
            display inline-block
            position relative
            input
              box-sizing border-box
              width 270px
              height 40px
              padding 0 36px 0 10px
              letter-spacing 0.15px
              font-size 13px
              color #333
              background #F4F6FA
              border-radius 2px
              border none
              &::-webkit-input-placeholder
                font-size 13px
                color #999
                letter-spacing 0.15px
              &::-moz-placeholder   
                font-size 13px
                color #999
                letter-spacing 0.15px
              &:-moz-placeholder 
                font-size 13px
                color #999
                letter-spacing 0.15px
              &:-ms-input-placeholder
                font-size 13px
                color #999
                letter-spacing 0.15px
            b
              position absolute
              top 0
              right 0
              width 36px
              height 40px
              line-height 40px
              font-size 13px
              letter-spacing 0.15px
          img
            margin 0 28px
      .charge
        letter-spacing 0
        margin-bottom 10px
        font-size 13px
        color #333
      .rules
        height 12px
        line-height 12px
        img
          position relative
          top 1px
          left 0
          margin-right 5px
          cursor pointer
        span
          letter-spacing 0.23px
          font-size 11px
          color #57A100
          cursor pointer
    button
      width 620px
      height 40px
      line-height 40px
      border none
      border-radius 2px
      background #999
      letter-spacing 0.15px
      font-size 13px
      color #FFF
      cursor pointer
      &:focus
        outline 0
      &.able
        background #FFB422
        &:active
          background #FEA350
    .tishi
      height 32px
      line-height 32px
      font-size 11px
      color #FF794C
      letter-spacing 0.23px
      img
        position relative
        top 1px
        left 0
        margin-right 8px


</style>