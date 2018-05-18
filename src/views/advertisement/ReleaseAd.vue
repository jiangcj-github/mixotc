<template>
  <div class="release-ad-wrap">
    <p class="title"></p>
    <div class="inner release-ad-box clearfix">
      <ul>
        <li class="buy-ad" @click="selectAd(1)" :class="{active: adTabIndex === 1}">购买广告</li>
        <li class="sale-ad" @click="selectAd(2)" :class="{active: adTabIndex === 2}">出售广告</li>
      </ul>
      <div class="release-ad-content">
        <h1>余额超过0.05BTC才能在交易中心展示广告</h1>
        <div class="release-ad-info">
          <ol>
            <li>
              <p>选择币种</p>
              <ChoiceBox :choiceClass="adB"
                         title="BTC"
                         :classify="coinType"
                         :emitValue="selectCoin"
                         :width=608
                         :top=39
                         :widthSelect=618>
              </ChoiceBox>
            </li>
            <li>
              <p>货币</p>
              <span class="coin-span">CNY</span>
            </li>
            <li class="pay-li">
              <p>收款方式</p>
              <PaymentSelect></PaymentSelect>
            </li>
          </ol>
          <ol>
            <li class="switch-li clearfix">
              <i>是否溢价</i>
              <em class="sel-premium"><b>*</b>根据市场价的溢价比例</em>
              <em v-show="switchValue">当前市场最低价：</em>
              <b v-show="switchValue">12345.00 CNY/BTC</b>
              <SwitchBlock class="switch-block"></SwitchBlock>
            </li>
            <li v-show="switchValue">
              <i>溢价</i>
              <em>参考价：</em>
              <b>12345.00 CNY/BTC</b>
            </li>
            <li v-show="switchValue">
              <SliderBar
                :min="-99"
                :max="99"
                :minText="minText"
                :maxText="maxText"
                :inputText="inputText">
              </SliderBar>
            </li>
            <li class="input-li">
              <p>
                <i>{{switchValue == true ? '最低单价' : '固定单价'}}</i>
                <em v-show="!switchValue">当前市场最低价：</em>
                <b v-show="!switchValue">12345.00 CNY/BTC</b>
              </p>
              <input type="text" v-model="priceValue"/>
              <span>CNY</span>
              <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="priceValue" @click="priceValue=''">
            </li>
            <li class="input-li">
              <p class="num-p clearfix">
                <i>{{adTabIndex === 1 ? '购买' : '出售'}}数量</i>
                <em v-if="adTabIndex === 2">可用余额：</em>
                <b v-if="adTabIndex === 2">123BTC</b>
                <button v-if="adTabIndex === 2" class="sale-btn">去充币</button>
                <strong :class="{selected: selectNum}" @click="selectNum = !selectNum">{{adTabIndex === 1 ? '不限量' : '随可用余额变动'}}</strong>
              </p>
              <input type="text" :disabled="selectNum" v-model="numValue"/>
              <span>BTC</span>
              <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="numValue" @click="numValue=''">
            </li>
            <li class="input-li">
              <p>最小订单额<b class="limit">最小200</b></p>
              <input type="text" v-model="minValue"/>
              <span>CNY</span>
              <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="minValue" @click="minValue=''">
            </li>
            <li class="input-li">
              <p>最大订单额<b class="limit">最大1.000.000</b></p>
              <input type="text" v-model="maxValue"/>
              <span>CNY</span>
              <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="maxValue" @click="maxValue=''">
            </li>
            <li>付款期限</li>
            <li>
              <SliderBar></SliderBar>
            </li>
          </ol>
          <ol>
            <li class="message-li">
              <p>备注留言</p>
              <textarea placeholder="请填写广告备注留言（选填）" maxlength="50" v-model.trim="textVale"></textarea>
              <span>{{textVale.length}}/50</span>
            </li>
            <li>
              <button class="release-btn">发布购买广告</button>
              <span class="reset-info">重置信息</span>
            </li>
            <li class="hint-li">广告成交后，手续费为成交量的0.18%</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import SliderBar from '@/components/common/SliderBar' // 引入滑块
  import PaymentSelect from '@/views/advertisement/child/PaymentSelect' // 引入支付下拉
  import SwitchBlock from '@/views/advertisement/child/SwitchBlock' // 引入开关

  export default {
    name: "releaseAd",
    data() {
      return {
        adTabIndex: 1, // 控制tab切换
        switchValue: false, // 开关
        coinType: ['BTC', 'ETH', "DASH"], // 币种下拉
        selectCoin: 'selectCoin', // 获取自组件值
        adB: 'adB', // 选择子组件合适样式
        inputText: '%', // 滑块符号
        minText: '-99%', // 滑块最小值
        maxText: '99%', // 滑块最大值
        selectNum: false, // 是否限量
        priceValue: '', // 单价值
        numValue: '', // 数量值
        minValue: '', // 最小订单额
        maxValue: '', // 最大订单额
        textVale: '' // 留言内容
      }
    },
    components: {
      ChoiceBox,
      SliderBar,
      PaymentSelect,
      SwitchBlock
    },
    mounted() {
      this.Bus.$on(this.selectCoin, (data) => { // 币种筛选

      }),
      this.Bus.$on('switchValueType', (data) => {
        this.switchValue = data
      });
    },
    destroyed() {
      this.Bus.$off(this.selectCoin);
      this.Bus.$off('switchValueType');
    },
    methods: {
      selectAd(type) { // Tab切换
        this.adTabIndex = type
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .release-ad-wrap
    margin-bottom 90px
    .title
      width 100%
      height 40px
      margin-bottom 20px
      background #FFF3EB
    .release-ad-box
      ul
        float left
        width 180px
        background #FFF
        li
          height 60px
          padding-left 30px
          line-height 60px
          cursor pointer
          &.active
            background #FFF3EB
            border-bottom 2px solid #FFB422
        .buy-ad
          position relative
          &:after
            position absolute
            top 20px
            right 20px
            width 20px
            height 20px
            content ''
            background url(/static/images/buy_ad.png) no-repeat
            background-size 20px 20px
        .sale-ad
          position relative
          &:after
            position absolute
            top 20px
            right 20px
            width 20px
            height 20px
            content ''
            background url(/static/images/sale_ad.png) no-repeat
            background-size 20px 20px
    .release-ad-content
      float right
      width 1000px
      h1
        position relative
        padding-left 22px
        font-size 11px
        color #FF794C
        letter-spacing 0.23px
        margin-bottom 10px
        &:before
          position absolute
          top 2px
          left 0
          width 12px
          height 12px
          content ''
          background url(/static/images/hint.png) no-repeat
          background-size 12px 12px
    .release-ad-info
      background #FFF
      padding 20px 30px 45px
      ol:nth-child(1)
        border-bottom 1px solid #E1E1E1
        margin-bottom 35px
        li:last-child
          margin-bottom 30px
      ol:nth-child(2)
        border-bottom 1px solid #E1E1E1
        margin-bottom 30px
        li:last-child
          margin-bottom 30px
        li
          p
            margin-bottom 5px
      li
        margin-bottom 20px
        p
          margin-bottom 10px
        .coin-span
          display block
          width 608px
          height 38px
          line-height 40px
          padding-left 10px
          background #FFF
          border 1px solid #E1E1E1
          border-radius 2px
        input
          width 608px
          height 38px
          padding-left 10px
          background #FFF
          border 1px solid #E1E1E1
          border-radius 2px
        i
          display inline-block
          width 80px
        em
          font-size 11px
          color #999
          letter-spacing 0.23px
          line-height 17px
        .sel-premium
          margin-right 40px
        b
          font-size 11px
          color #FF794C
          letter-spacing 0.23px
        .limit
          margin-left 20px
        .switch-block
          float right
          margin-right 320px
        textarea
          width 598px
          height 128px
          padding 10px
          background #FFF
          border 1px solid #E1E1E1
          border-radius: 2px
          resize none
          outline none
        .sale-btn
          width 60px
          height 25px
          margin-left 20px
          background #FFF
          border 1px solid #FFB422
          border-radius 2px
          color #FFB422
        .release-btn
          width 620px
          height 40px
          margin-right 30px
          background #999
          border-radius 2px
          color #FFF
          font-size 13px
          letter-spacing 0.15px
          vertical-align bottom
        .reset-info
          color #FFB422
          letter-spacing 0.29px
          cursor pointer
      .input-li
        position relative
        p
         line-height 25px
        span
          position absolute
          top 42px
          right 335px
        img
          position absolute
          top 46px
          right 390px
          cursor pointer
        .num-p
          line-height 25px
          i
            float left
          strong
            position relative
            float right
            margin-right 320px
            padding-left 25px
            font-size 13px
            color #FFB422
            letter-spacing 0.27px
            font-weight normal
            cursor pointer
            &:before
              position absolute
              top 7px
              left 0
              content ''
              width 15px
              height 15px
              background url('/static/images/unselect.png')
              background-size 15px 15px
            &.selected:before
              background url('/static/images/selected.png')
              background-size 15px 15px
      .hint-li
        position relative
        padding-left 22px
        font-size 11px
        color #FF794C
        letter-spacing 0.23px
        &:before
          position absolute
          top 2px
          left 0
          width 12px
          height 12px
          content ''
          background url(/static/images/hint.png) no-repeat
          background-size 12px 12px
      .message-li
        position relative
        span
          position absolute
          top 150px
          right 330px
          font-size 13px
          color #999


</style>
