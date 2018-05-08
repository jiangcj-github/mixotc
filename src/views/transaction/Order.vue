<template>
  <div class="order inner">
    <h2>{{copy.type[type]}}{{contentData.currency && contentData.currency.toUpperCase()}}</h2>
    <div class="main">
      <!-- 交易对方的信息 -->
      <div class="counterparty clearfix">
        <div class="info">
          <div class="avatar">
            <img :src="contentData.icon ? `${HostUrl.http}image/${contentData.icon}` : `/static/images/default_avator.png`" alt="">
          </div>
          <span class="nickname">{{contentData.trader}}</span>
        </div>
        <div class="contact clearfix">
          <span @click="contactSomeone(JsonBig.stringify(contentData.sid))" class="conversation">
            <img src="/static/images/conversation_icon.png" alt="">
            <i @click="$store.commit({'type':'changeChatBox', data: true})">联系TA</i>
          </span>
          <router-link class="self-page" :to="{path:'/homepage', query:{uid: contentData.sid}}" tag="span">
            <img src="/static/images/selfpage_icon.png" alt="">
            <i>访问TA的主页</i>
          </router-link>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order-info">
        <p class="tip">下单后此交易的比特币将托管锁定，请放心{{copy.type[type]}}</p>
        <ul>
          <li class="price clearfix">
            <span class="title">价格</span>
            <p>{{contentData.price}} CNY</p>
          </li>
          <li class="clearfix">
            <span class="title">可交易量</span>
            <p>{{contentData.tradeable}} {{contentData.currency && contentData.currency.toUpperCase()}}</p>
          </li>
          <li class="clearfix">
            <span class="title">限额</span>
            <p>{{contentData.min}}~{{contentData.max}} CNY</p>
          </li>
          <li class="clearfix">
            <span class="title">付款方式</span>
            <p>
              <img src="/static/images/OTC_zhifubao.png" alt="" v-if="contentData.payments %2 === 1">
              <img src="/static/images/OTC_wechat.png" alt="" v-if="[2, 3, 6, 7].includes(contentData.payments)">
              <img src="/static/images/OTC_Bankcard.png" alt="" v-if="[4, 5, 6, 7].includes(contentData.payments)">
            </p>
          </li>
          <li class="clearfix">
            <span class="title">期限</span>
            <p>{{contentData.limit}}min</p>
          </li>
          <li class="remark clearfix">
            <span class="title">备注</span>
            <p>{{contentData.info ? contentData.info : '无'}}</p>
          </li>
        </ul>
      </div>
      <!-- 交易数量 -->
      <div class="amount">
        <h3>
          {{copy.type[type]}}多少？
          <router-link to="" tag="span" v-if="!type">去充币</router-link>
        </h3>
        <p class="rate">{{selectPrice[0] && selectPrice[0].cny}} CNY = {{selectPrice[0] && selectPrice[0].btc}} {{contentData.currency && contentData.currency.toUpperCase()}}</p>
        <span class="error-text">{{errorText[errorFlag]}}</span>
        <div class="input">
          <div>
            <input type="number" :placeholder="`输入${copy.type[type]}金额`" v-model="money" @input="changeMoney" @keydown="checkMoney(money)" autofocus="autofocus">
            <b>CNY</b>
          </div>
          <img src="/static/images/huansuan.png" alt="">
          <div>
            <input type="number" :placeholder="`输入${copy.type[type]}数量`" v-model="amount"  @input="changeAmount" @keydown="checkAmount(amount)">
            <b>{{contentData.currency && contentData.currency.toUpperCase()}}</b>
          </div>
        </div>
        <p class="charge" v-if="!type">手续费：0.2% 0BTC</p>
        <div class="rules">
          <img src="/static/images/rules_checked.png" alt="" v-if="agree" @click="agree = false">
          <img src="/static/images/rules_unchecked.png" alt="" v-else @click="agree = true">
          <a href="#/transaction/tradeRules" target="_blank">我已阅读《OTC购买流程规则》</a>
        </div>
      </div>
      <!--:disabled="agree"-->
      <button :class="{able:agree}" @click="openOrderLayer()">{{copy.type[type]}}</button>
      <p class="tishi">
        <img src="/static/images/hint.png" alt="">
        <span>新用户首次交易前请务必查阅本平台交易流程及规则，如交易出现问题请及时与客服人员沟通</span>
      </p>
    </div>
    <!-- 引入购买弹窗 -->
    <OrderLayer :orderLayerShow="showOrderLayer"
                :id="layerId"
                :price="priceLayer"
                :currency="currencyLayer"
                :money="moneyLayer"
                @offOrderLayer="openOrderLayer">
    </OrderLayer>
    <!-- 引入勾选购买规则弹窗 -->
    <BasePopup class="remind-layer" :show="remindLayer">
      <span v-clickoutside="closeLayer">请勾选购买规则</span>
    </BasePopup>
    <!-- 引入大额交易弹窗 -->
    <!--<BasePopup :show="bigAmountLayer"-->
               <!--:width=470-->
               <!--:height=194>-->
      <!--<div class="big-amount-layer">-->
        <!--<p>您的交易上限为10万，是否申请大额交易</p>-->
        <!--<div class="btn-group clearfix">-->
          <!--<em @click="bigAmountLayer = false">取消</em>-->
          <!--<router-link to="">去申请大额交易</router-link>-->
        <!--</div>-->
      <!--</div>-->
    <!--</BasePopup>-->
  </div>
</template>
<script>
  import OrderLayer from '@/views/transaction/OrderLayer' // 购买弹窗
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    data() {
      return {
        type: 1,//0表示出售，1表示购买
        balance: 1.242342,
        rate: 0,
        avatar: '',
        amount: '',
        money: '',
        moneyValue: '',
        amountValue: '',
        agree: false, //true已阅读规则，false未阅读
        copy:{
          type: ['出售', '购买'],
          // rate: [`可用余额1.242342BTC`, `${cnyPrice} CNY = ${btcPrice} BTC` ]
        },
        errorText: ['请输入交易金额', '交易量不能超过最大限额', '交易量不能低于最小限额', '交易量不能超过可交易量'],
        errorFlag: 5,
        contentData: {},
        showOrderLayer: false, // 控制购买弹窗显示隐藏
        remindLayer: false, // 控制勾选弹窗
        bigAmountLayer: false, // 大额交易弹窗
        priceList: [], // 实时价格查询表
        selectPrice: [], // 根据币种选择返回情况
        layerId: '',
        priceLayer: '',
        currencyLayer: '',
        moneyLayer: ''
      }
    },
    components: {
      OrderLayer,
      BasePopup
    },
    mounted() {
      this.WsProxy.send('otc','sale_detail',{
        id: this.JsonBig.parse(this.$route.query.id)
      }).then((data)=>{
        console.log('sale_detail', data)
        this.contentData = data
      }).catch((msg)=>{
        console.log(msg);
      });
      this.getPrice()
    },
    methods: {
      // 获取价格
      async getPrice() {
        await this.Proxy.getPrice().then(res => {
          this.priceList = res.data.prices
          console.log('this.priceList', res)
          this.selectPrice = this.priceList.filter(item => {
            return item.currency == this.contentData.currency
          })
        });
        this.rate = this.selectPrice[0] && (this.selectPrice[0].cny / this.selectPrice[0].btc)
        console.log('selectPrice', this.selectPrice)
      },
      contactSomeone(id){
        this.Bus.$emit('contactSomeone', {id: id})
      },
      changeMoney() {
        this.money = /^\d+\.?\d{0,2}$/.test(this.money) || this.money === '' ? this.money : this.moneyValue
        this.amount = (this.money / (this.rate)).toFixed(6);
        this.money === '' && (this.amount = '');
      },
      checkMoney(value) {
        this.moneyValue = value
      },
      changeAmount() {
        this.amount = /^\d+\.?\d{0,6}$/.test(this.amount) || this.amount === '' ? this.amount : this.amountValue
        this.money = (this.amount * this.rate).toFixed(2);
        this.amount === '' && (this.money = '');
      },
      checkAmount(value) {
        this.amountValue = value
      },
      openOrderLayer(st) { // 弹窗提示
        if (this.money == '') { // 无内容提示
          this.errorFlag = 0;
          return
        }
        if (this.money > this.contentData.max) { // 超过交易额
          this.errorFlag = 1;
          return
        }
        if (this.money < this.contentData.min) { // 低于最小交易额
          this.errorFlag = 2;
          return
        }
        if (this.amount > this.contentData.tradeable) { // 超过交易量
          this.errorFlag = 3;
          return
        }
        // if (this.money > 100000) { // 大额交易
        //   this.bigAmountLayer = true
        // }
        if (this.agree == false) { // 提示勾选
          this.remindLayer = true;
          return
        }
        // 购买提示框
        if (st == false) {
          this.showOrderLayer = false
        } else {
          this.priceLayer = this.contentData.price; // 弹窗价格
          this.layerId = this.contentData.id; // 弹窗id
          this.currencyLayer = this.amount;
          this.moneyLayer = this.money;
          this.showOrderLayer = true;
        }
      },
      closeLayer() { // 关闭提示勾选弹窗
        this.remindLayer = false
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../stylus/base.styl";
  .order
    margin-top 40px
    margin-bottom 40px
    h2
      height 30px
      padding-left 30px
      line-height 30px
      letter-spacing: 0.23px
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
    .main
      box-sizing()
      width 100%
      padding 30px
      margin-top 25px
      background-color #FFF
      .counterparty
        padding-bottom 20px
        border-bottom 1px solid $col1E1
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
            img
              width 45px
              height 45px
              border-radius 50%
              vertical-align middle
        .contact
          float left
          line-height 45px
          height 45px
          i
            display inline-block
            fz11()
          span
            float left
            letter-spacing 0.23px
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
        padding 20px 0 10px
        border-bottom 1px solid $col1E1
        .tip
          text-align left
          letter-spacing 0.23px
          color $col94C
          fz11()
        ul
          li
            line-height 34px
            .title
              float left
              width 150px
              height 100%
              letter-spacing 0.16px
            p
              float left
              width 980px
              color $col999
              letter-spacing 0.16px
            &.price
              p
                font-size $fz20
                color $col333
                letter-spacing 0.23px
      .amount
        position relative
        margin-bottom 30px
        h3
          width 620px
          height 60px
          line-height 60px
          letter-spacing 0.23px
          font-weight bold
          font-size $fz20
          span
            float right
            font-weight normal
            font-size $fz13
            color $col422
            letter-spacing 0.15px
            cursor pointer
        .rate
          letter-spacing 0.12px
          margin-bottom 10px
          fz11()
        .error-text
          position absolute
          top 60px
          left 355px
          font-size 11px
          color #ff794c
          letter-spacing 0.23px
        .input
          margin-bottom 10px
          div
            display inline-block
            position relative
            input
              box-sizing()
              width 270px
              height 40px
              padding 0 36px 0 10px
              letter-spacing 0.15px
              font-size $fz13
              color $col333
              background $col6FA
              border-radius 2px
              border none
              placeholder()
            b
              position absolute
              top 0
              right 0
              width 36px
              height 40px
              line-height 40px
              font-size $fz13
              letter-spacing 0.15px
          img
            margin 0 28px
      .charge
        letter-spacing 0
        margin-bottom 10px
        font-size $fz13
        color $col333
      .rules
        height 12px
        line-height 12px
        img
          margin-right 5px
          cursor pointer
        a
          display inline-block
          letter-spacing 0.23px
          color #57A100
          fz11()
          cursor pointer
    button
      width 620px
      height 40px
      line-height 40px
      border none
      border-radius 2px
      background $col999
      letter-spacing 0.15px
      font-size $fz13
      color #FFF
      cursor pointer
      &:focus
        outline 0
      &.able
        background $col422
        &:active
          background $col350
    .tishi
      height 32px
      line-height 32px
      color $col94C
      letter-spacing 0.23px
      img
        margin-right 8px
      span
        display inline-block
        fz11()
  .remind-layer
    text-align center
    line-height 94px

  /*弹窗样式*/
  .big-amount-layer
    padding 60px  60px 0
    text-align center
    .btn-group
      margin-top 60px
      em, a
        display inline-block
        width 160px
        height 40px
        text-align center
        line-height 40px
        cursor pointer
      em
        float left
        border 1px solid #FFB422
        border-radius 2px
        color #FFB422
      a
        float right
        background #FFB422
        border-radius 2px
        color #FFF
</style>
