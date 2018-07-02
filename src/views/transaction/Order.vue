<template>
  <div class="order inner">
    <div class="main">
      <!-- 交易对方的信息 -->
      <div class="counterparty">
        <div class="coin-info">
          <img :src="coinIcon && `${HostUrl.http}image/${coinIcon}`" alt="">
          <span>{{titleType[type-1]}}{{contentData.currency && contentData.currency.toUpperCase()}}</span>
        </div>
        <div class="info" @click="$router.push({path:'/homepage', query:{uid: contentData.sid}})">
          <div class="avatar">
            <img :src="contentData.icon ? `${HostUrl.http}image/${contentData.icon}` : `/static/images/default_avator.png`" alt="">
          </div>
          <p class="nickname">{{contentData.trader}}</p>
        </div>
        <ol class="contact clearfix">
          <li @click="contactSomeone(JsonBig.stringify(contentData.sid))">联系TA</li>
          <router-link class="self-page" :to="{path:'/homepage', query:{uid: contentData.sid}}" tag="li">访问TA的主页</router-link>
        </ol>
      </div>
      <!-- 订单信息 -->
      <div class="order-info">
        <p class="tip">下单后此交易的比特币将托管锁定，请放心{{titleType[type-1]}}</p>
        <ul>
          <li class="price clearfix">
            <span class="title">价格</span>
            <p>{{contentData.price}} CNY</p>
          </li>
          <li class="clearfix">
            <span class="title">可交易量</span>
            <p>{{tradeable}} {{contentData.currency && contentData.currency.toUpperCase()}}</p>
          </li>
          <li class="clearfix">
            <span class="title">限额</span>
            <p>{{contentData.min}}~{{contentData.max}} CNY</p>
          </li>
          <li class="clearfix">
            <span class="title">付款方式</span>
            <p class="payment">
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
        <div class="amount-title">
          <h3>{{titleType[type-1]}}多少？</h3>
          <router-link :to="{path: '/wallet/charge', query: {coin: contentData.currency}}" tag="span" v-if="contentData.type == 2">去充币</router-link>
        </div>
        <p class="rate" v-if="contentData.type == 1">{{selectPrice[0] && selectPrice[0].cny}} CNY = 1 {{contentData.currency && contentData.currency.toUpperCase()}}</p>
        <p class="balance" v-if="contentData.type == 2"><span>可用余额{{balance}}{{contentData.currency && contentData.currency.toUpperCase()}}</span></p>
        <span class="error-text" :class="{'sale-err': contentData.type == 2}">{{errorText[errorFlag]}}</span>
        <div class="input">
          <div>
            <input type="text" :placeholder="`输入${titleType[type-1]}金额`" v-model="money"
                   @input="changeMoney" @keydown="checkMoney(money)" autofocus="autofocus" @wheel.prevent="">
            <b>CNY</b>
          </div>
          <img src="/static/images/huansuan.png" alt="">
          <div>
            <input type="text" :placeholder="`输入${titleType[type-1]}数量`" v-model="amount"
                   @input="changeAmount" @keydown="checkAmount(amount)" @wheel.prevent="">
            <b>{{contentData.currency && contentData.currency.toUpperCase()}}</b>
          </div>
        </div>
        <!--
        <p class="charge" v-if="contentData.type == 2">手续费：0.2% {{processNum}}{{contentData.currency && contentData.currency.toUpperCase()}}</p>
        -->
        <div class="rules" @click="agree = !agree">
          <img src="/static/images/rules_checked.png" alt="" v-if="agree">
          <img src="/static/images/rules_unchecked.png" alt="" v-else>
          <span>我已阅读</span><a href="#/helpcenter" @click.stop="" target="_blank">{{`《OTC${titleType[type-1]}流程规则》`}}</a>
        </div>
      </div>
      <button class="able" @click="openOrderLayer()" v-if="canSubmit">{{titleType[type-1]}}</button>
      <button v-else="">{{titleType[type-1]}}</button>
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
                :type="typeLayer"
                :coinType="coinTypeLayer"
                @offOrderLayer="openOrderLayer">
    </OrderLayer>
    <!-- 引入勾选购买规则弹窗 -->
    <!--
    <BasePopup class="remind-layer" :show="remindLayer" @click.native="remindLayer = false">
      <span>请勾选购买规则</span>
    </BasePopup>
    -->
    <!-- 引入大额交易弹窗 -->
    <BasePopup :show="bigAmountLayer"
               :width=470
               :height=194>
      <div class="big-amount-layer">
        <p>您的交易上限为10万，是否申请大额交易</p>
        <div class="btn-group clearfix">
          <em @click="bigAmountLayer = false">取消</em>
          <router-link to="/personal/account/apply">去申请大额交易</router-link>
        </div>
      </div>
    </BasePopup>
  </div>
</template>
<script>
  import OrderLayer from '@/views/transaction/OrderLayer' // 购买弹窗
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    data() {
      return {
        type: 1,
        titleType: ['购买', '出售'],
        balance: 0,
        rate: 0,
        processNum: 0, // 手续费
        avatar: '',
        amount: '',
        money: '',
        moneyValue: '',
        amountValue: '',
        agree: true, //true已阅读规则，false未阅读
        errorText: ['', '交易量不能超过最大限额', '交易量不能低于最小限额', '交易量不能超过可交易量'],
        errorFlag: 0,
        contentData: {},
        showOrderLayer: false, // 控制购买弹窗显示隐藏
        remindLayer: false, // 控制勾选弹窗
        bigAmountLayer: false, // 大额交易弹窗
        priceList: [], // 实时价格查询表
        selectPrice: [], // 根据币种选择返回情况
        layerId: '',
        priceLayer: '',
        currencyLayer: '',
        moneyLayer: '',
        typeLayer: '',
        tradeable: '',
        coinTypeLayer: '',
        coinIcon: '' // 币种图标
      }
    },
    components: {
      OrderLayer,
      BasePopup
    },
    creatd() {

    },
    mounted() {
      this.Bus.$on("offOrderLayer",()=>{
        this.showOrderLayer=false;
      });
      this.WsProxy.send('otc','sale_detail',{
        id: this.JsonBig.parse(this.$route.query.id)
      }).then((data)=>{
        //console.log('下单内容', data)
        this.contentData = data;
        this.type = data.type;
        this.tradeable = typeof data.tradeable == 'number' ? data.tradeable.formatFixed(6) : this.JsonBig.stringify(data.tradeable).formatFixed(6)
        this.tradeable = (data.type == 2 && data.tradeable == 0) ? '不限量' : this.tradeable
        this.getPrice();
        this.getCoinIcon();
        this.getBalance();
      }).catch((msg)=>{
        console.log('错误', msg)
        //alert(JSON.stringify(msg));
      });
    },
    destroyed(){
      this.Bus.$off("offOrderLayer");
    },
    computed:{
      canSubmit:function () {
        if(!this.agree || !this.amount || !this.money) {
          this.errorFlag=0;
          return false;
        }
        if (this.money * 1 > this.contentData.max) { // 超过交易额
          this.errorFlag = 1;
          return false;
        }else if (this.money * 1 < this.contentData.min) { // 低于最小交易额
          this.errorFlag = 2;
          return false;
        }else if (this.amount * 1 > this.contentData.tradeable) { // 超过交易量
          this.errorFlag = 3;
          return false;
        }else{
          this.errorFlag=0;
        }
        return true;
      }
    },
    methods: {
      // 获取价格
      async getPrice() {
        let res = await this.Proxy.getPrice()
        console.log('价格数组', res)
        this.priceList = res.data.prices;
        this.selectPrice = this.priceList.filter(item => {
          return item.currency === this.contentData.currency;
        })
        this.rate = this.contentData.price;
      },
      // 获取币种图标
      async getCoinIcon() {
        let res = await this.Proxy.coinSearch(), selectIconList = [];
        selectIconList = res.data.coins.filter(item => {
          return item.currency === this.contentData.currency;
        })
        this.coinIcon = selectIconList[0] && (selectIconList[0].icon);
      },
      // 获取可用余额
      getBalance() {
        let balanceList = []
        this.WsProxy.send('wallet', 'wallets', {
          id: this.$store.state.userInfo.uid, // 用户id
        }).then((data)=>{
          balanceList = data.wallets.filter(item => {
            return item.currency === this.contentData.currency;
          })
          // console.log('this.balanceList', this.balanceList)
        }).catch((msg)=>{
          //alert(JSON.stringify(msg));
        });
        this.balance = balanceList[0] && (this.JsonBig.stringify(balanceList[0].balance)).formatFixed(6) || 0
      },
      contactSomeone(id){
        this.Bus.$emit('contactSomeone', {id: id});
      },
      changeMoney() {
        this.money = /^\d+\.?\d{0,2}$/.test(this.money) || this.money === '' ? this.money : this.moneyValue;
        this.amount = (this.money / (this.rate)).formatFixed(6);
        this.money === '' && (this.amount = '');
        //this.processNum = 0.002 * (this.amount * 1)
      },
      checkMoney(value) {
        this.moneyValue = value
      },
      changeAmount() {
        this.amount = /^\d+\.?\d{0,6}$/.test(this.amount) || this.amount === '' ? this.amount : this.amountValue;
        this.money = (this.amount * this.rate).formatFixed(2);
        this.amount === '' && (this.money = '');
        //this.processNum = 0.002 * (this.amount * 1)
      },
      checkAmount(value) {
        this.amountValue = value;
      },
      openOrderLayer(st) { // 弹窗提示
        if ((this.money * 1 > 100000) && (this.$store.state.userInfo.btverify !== 2)) { // 大额交易
          this.bigAmountLayer = true
          return
        }
        // 购买提示框
        if (st === false) {
          this.showOrderLayer = false;
        } else {
          this.priceLayer = this.contentData.price; // 弹窗价格
          this.layerId = this.contentData.id; // 弹窗id
          this.currencyLayer = this.amount;
          this.moneyLayer = this.money;
          this.typeLayer = this.contentData.type;
          this.coinTypeLayer = this.contentData.currency.toUpperCase()
          this.showOrderLayer = true;
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../stylus/base.styl";
@import "stylus/order";
  .order
    margin-top 20px
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
      padding 0 30px 44px
      background-color #FFF
      .counterparty
        display flex
        align-items center
        height 95px
        border-bottom 1px solid $col1E1
        .coin-info
          margin-right 287px
          img
            position relative
            top -3px
            width 37px
            height 37px
            border-radius 50%
            vertical-align middle
            margin-right 20px
          span
            font-size 20px
            color #333
            letter-spacing 0.23px
        .info
          margin-right 50px
          text-align center
          cursor pointer
          .avatar
            display inline-block
            width 45px
            height 45px
            border-radius 50%
            img
              width 45px
              height 45px
              border-radius 50%
              margin-bottom 5px
        .contact
          li
            cursor pointer
            fz11()
          li:first-child
            position relative
            padding-left 30px
            margin-bottom 15px
            &:before
              position absolute
              top 1px
              left 0
              width 18px
              height 17px
              content ''
              background url(/static/images/conversation_icon.png) no-repeat
              background-size 18px 17px
          li:last-child
            position relative
            padding-left 30px
            &:before
              position absolute
              top 0
              left 0
              width 20px
              height 20px
              content ''
              background url(/static/images/selfpage_icon.png) no-repeat
              background-size 20px 20px
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
        .amount-title
          width 620px
          height 60px
          display flex
          align-items center
          justify-content space-between
          h3
            letter-spacing 0.23px
            font-weight bold
            font-size $fz20
          span
            display block
            padding 3px 8px
            border 1px solid #FFB422
            border-radius 2px
            font-size $fz13
            color $col422
            letter-spacing  0.27px
            cursor pointer

        .rate
          letter-spacing 0.12px
          margin-bottom 10px
          fz11()
        .balance
          width 620px
          letter-spacing 0.12px
          margin-bottom 10px
          text-align right
          span
            fz11()
        .error-text
          position absolute
          top 60px
          left 355px
          font-size 11px
          color #ff794c
          letter-spacing 0.23px
          &.sale-err
            left 0
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
              right 10px
              width 36px
              height 40px
              line-height 40px
              font-size $fz13
              letter-spacing 0.15px
              text-align right
          img
            margin 0 28px
      .charge
        letter-spacing 0
        margin-bottom 10px
        font-size $fz13
        color $col333
      .rules
        img
          margin-right 5px
          cursor pointer
        a
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
      &:focus
        outline 0
      &.able
        background $col422
        &:active
          background $col350
    .tishi
      color $col94C
      letter-spacing 0.23px
      img
        margin-right 5px
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
