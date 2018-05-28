<template>
  <div class="release-ad-info">
    <ol>
      <li>
        <p>选择币种</p>
        <ChoiceBox :choiceClass="adB"
                   :title="adBuyObj.currency && adBuyObj.currency.toUpperCase()"
                   :classify="coinType"
                   :emitValue="selectCoin"
                   :selectValue="coinData"
                   :width=593
                   :top=39
                   :showDisabled="isDisabled"
                   :widthSelect=618
                   :widthWrap=620>
        </ChoiceBox>
      </li>
      <li>
        <p>货币</p>
        <span class="coin-span">{{adBuyObj.money.toUpperCase()}}</span>
      </li>
      <li class="pay-li">
        <p>收款方式</p>
        <PaymentSelect :soreTab="adBuyObj.payment"></PaymentSelect>
      </li>
    </ol>
    <ol>
      <li class="switch-li clearfix">
        <i>是否溢价</i>
        <em class="sel-premium"><b>*</b>根据市场价的溢价比例</em>
        <em v-show="switchValue">当前市场最低价：</em>
        <b v-show="switchValue">{{priceNow}} CNY/{{adBuyObj.currency && adBuyObj.currency.toUpperCase()}}</b>
        <SwitchBlock class="switch-block" :showSwitch="switchValue = adBuyObj.mode == 1 ? false : true"></SwitchBlock>
      </li>
      <li v-show="switchValue">
        <i>溢价</i>
        <em>参考价：</em>
        <b>{{priceNow}} CNY/{{adBuyObj.currency && adBuyObj.currency.toUpperCase()}}</b>
      </li>
      <li v-show="switchValue">
        <SliderBar
          :min="-99"
          :max="99"
          :choiceValue="adBuyObj.premium"
          :minText="minText"
          :maxText="maxText"
          :selectSliderValue="premiumValue"
          :inputText="inputText">
        </SliderBar>
      </li>
      <li class="input-li">
        <p>
          <i>{{switchValue == true ? '最高单价' : '固定单价'}}</i>
          <em v-show="!switchValue">当前市场最低价：</em>
          <b v-show="!switchValue">{{priceNow}} CNY/{{adBuyObj.currency && adBuyObj.currency.toUpperCase()}}</b>
        </p>
        <input type="text"
               v-model="adBuyObj.price"
               @focus="clearPrice=true && (errPrice=true)"
               @blur="clearPrice=false"
               @input="priceInput"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adBuyObj.price && clearPrice" @mousedown="adBuyObj.price=''">
        <span class="text-err" v-show="errPrice && adBuyObj.price">{{errPriceText}}</span>
      </li>
      <li class="input-li">
        <p class="num-p clearfix">
          <i>购买数量</i>
          <strong :class="{selected: adBuyObj.vary == 2}" @click="showVary">不限量</strong>
        </p>
        <input type="text"
               :disabled="adBuyObj.vary == 2"
               :class="{disabledInput: adBuyObj.vary == 2}"
               v-model="adBuyObj.tradeable"
               @focus="clearTradeable=true && (errTradeable=true)"
               @blur="clearTradeable=false"
               @input="tradeableInput"/>
        <span>BTC</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adBuyObj.tradeable && clearTradeable" @mousedown="adBuyObj.tradeable=''">
        <span class="text-err" v-show="errTradeable && adBuyObj.tradeable">{{errTradeableText}}</span>
      </li>
      <li class="input-li">
        <p>最小订单额<b class="limit">最小200</b></p>
        <input type="text"
               v-model="adBuyObj.min"
               @focus="clearMin=true && (errMin=true)"
               @blur="clearMin=false"
               @input="minInput"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adBuyObj.min && clearMin" @mousedown="adBuyObj.min=''">
        <span class="text-err" v-show="errMin && adBuyObj.min">{{errMinText}}</span>
      </li>
      <li class="input-li">
        <p>最大订单额<b class="limit">最大{{maxLimit}}</b></p>
        <input type="text"
               v-model="adBuyObj.max"
               @focus="clearMax = true && (errMax=true)"
               @blur="clearMax=false"
               @input="maxInput"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adBuyObj.max && clearMax" @mousedown="adBuyObj.max=''">
        <span class="text-err" v-show="errMax && adBuyObj.max">{{errMaxText}}</span>
      </li>
      <li>付款期限</li>
      <li>
        <SliderBar :selectSliderValue="limitValue"
                   :choiceValue="adBuyObj.limit">
        </SliderBar>
      </li>
    </ol>
    <ol>
      <li class="message-li">
        <p>备注留言</p>
        <textarea placeholder="请填写广告备注留言（选填）" maxlength="50" v-model.trim="adBuyObj.info"></textarea>
        <span>{{adBuyObj.info.length}}/50</span>
      </li>
      <li>
        <button class="release-btn" :class="{'release-active': canSubmit}" @click="canSubmit ? toRelease() : forbidRelease()">发布购买广告</button>
        <span class="reset-info" @click="reset()">重置信息</span>
      </li>
      <li class="hint-li">广告成交后，手续费为成交量的0.5%</li>
    </ol>
    <BasePopup :show="adSuccLayer"
               class="ad-succ-layer">
      <span>发布成功，<b>{{succNum}}</b>秒后跳转至"我的广告"页面</span>
    </BasePopup>
    <BasePopup :show="adErrLayer"
               class="ad-err-layer">
      <div v-clickoutside="closeLayer" class="ad-err-laye-container">
        <p>
          <span v-html="errText"></span>
        </p>
      </div>
    </BasePopup>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import SliderBar from '@/components/common/SliderBar' // 引入滑块
  import PaymentSelect from '@/views/advertisement/child/PaymentSelect' // 引入支付下拉
  import SwitchBlock from '@/views/advertisement/child/SwitchBlock' // 引入开关
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗

  export default {
    name: "release-ad-buy",
    data() {
      return {
        switchValue: false, // 开关
        coinType: [], // 币种下拉
        coinData: [], // 币种数据
        selectCoin: 'selectCoin', // 获取子组件值
        adB: 'adB', // 选择子组件合适样式
        inputText: '%', // 滑块符号
        minText: '-99%', // 滑块最小值
        maxText: '99%', // 滑块最大值
        premiumValue: 'premiumValue',
        limitValue: 'limitValue',
        selectNum: false, // 是否限量
        adBuyObj: {
          "id": 0,
          "uid": '', // 用户id
          "currency": 'btc', // 电子货币
          "money": 'cny', // 法币
          "mode": 1, // 出售类型: 1 固定; 2 溢价
          "premium": 0, // 溢价
          "price": '', // 固定价格/最低价格
          "min": '200', // 每笔交易的最小限额
          "max": '', // 每笔交易的最大限额
          "payment": 0, // 1支付宝;2微信;4银行卡
          "type": 2, // 1 出售; 2 购买
          "limit": 10, // 付款期限, 分钟
          "info": '', // 描述信息
          "vary": 1, // 余额随动标志 1 不随动 2 随动
          "tradeable": ''// 可交易量
        },
        maxNum: 0, // 最大订单额度
        selectPrice: [], // 根据币种选择返回情况
        priceNow: '',
        maxLimit: '',
        adSuccLayer: false,
        succNum: 4,
        adErrLayer: false,
        errText: '',
        isDisabled: false,

        clearPrice: false,
        clearTradeable: false,
        clearMin: false,
        clearMax: false,

        errPrice: false,
        errTradeable: false,
        errMin: false,
        errMax: false,

        errPriceText: '',
        errTradeableText: '',
        errMinText: '',
        errMaxText: '',

        soreNum: 0

      }
    },
    components: {
      ChoiceBox,
      SliderBar,
      PaymentSelect,
      SwitchBlock,
      BasePopup
    },
    computed: {
      canSubmit() {
        if(this.adBuyObj.payment == 0 || !this.adBuyObj.price || (!this.adBuyObj.tradeable && this.adBuyObj.vary == 1) || this.errPriceText !== '' || this.errTradeableText !== '' || this.errMinText !== '' || this.errMaxText !== '') {
          return false;
        }
        return true;
      }
    },
    watch: {

    },
    created() {
      if (this.$store.state.editFlag == 2) {
        this.isDisabled = true
        this.adBuyObj = this.$store.state.editContent
      }
      if (this.$route.params.buyCon) {
        this.adBuyObj = this.$route.params.buyCon;
        return;
      }
      this.Bus.$emit('buyInfo', this.adBuyObj)
    },
    mounted() {
      this.adBuyObj.uid = this.$store.state.userInfo.uid
      this.selectUserCoin()
      this.getPrice()
      this.initData()
      this.Bus.$on(this.selectCoin, data => { // 币种筛选
        this.adBuyObj.currency = data
        this.getPrice()
      }),
      this.Bus.$on('switchValueType', data => { // 是否溢价
        this.switchValue = data
        this.adBuyObj.mode = this.switchValue ? 2 : 1
      });
      this.Bus.$on(this.premiumValue, data => { // 溢价滑动价格
        this.adBuyObj.premium = data

      });
      this.Bus.$on(this.limitValue, data => { // 期限滑动价格
        this.adBuyObj.limit = data
      });
      this.Bus.$on('choicePayment', data => { // 选择支付方式
        this.adBuyObj.payment = data
      })
    },
    destroyed() {
      this.Bus.$off(this.selectCoin);
      this.Bus.$off('switchValueType');
      this.Bus.$off(this.premiumValue);
      this.Bus.$off(this.limitValue);
      this.Bus.$off('choicePayment');
    },
    methods: {
      async selectUserCoin() { // 选择币种
        this.coinType = []
        await this.Proxy.getCoinData().then(res => {
          res.data.coins.forEach(v => {
            this.coinType.push(v.currency.toUpperCase())
            this.coinData.push(v.currency)
          })
        }).catch(msg => {
          console.log('购买币种错误', msg)
        });
      },
      async getPrice() { // 当前价格
        await this.Proxy.getPrice().then(res => {
          this.selectPrice = res.data.prices.filter(item => {
            return item.currency === this.adBuyObj.currency;
          })
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
        console.log('this.selectPrice', this.selectPrice)
        this.priceNow = this.selectPrice[0] && (this.selectPrice[0].cny)
      },
      initData() { // 数据初始化
        this.maxNum = this.$store.state.userInfo.btverify !== 2 ? 100000 : 10000000
        this.maxLimit = this.$store.state.userInfo.btverify !== 2 ? '100,000' : '10,000,000'
        this.adBuyObj.max = this.maxNum
      },
      showVary() { // 是否溢价
        this.selectNum = !this.selectNum
        this.adBuyObj.vary = this.selectNum == true ? 2 : 1
      },
      forbidRelease() { // 信息不完整
        this.errText = '信息未填写完整'
        this.adErrLayer = true
      },
      toRelease() { // 发布广告
        //提示：可交易量低于最小交易额度+手续费，无法上架
        this.adBuyObj.max = this.adBuyObj.max * 1
        this.adBuyObj.min = this.adBuyObj.min * 1
        this.adBuyObj.price = this.adBuyObj.price * 1
        this.adBuyObj.tradeable = this.adBuyObj.tradeable * 1
        let editeErrNum = 200 * 1.005
        if (this.$store.state.editFlag == 2 && (this.adBuyObj.tradeable * this.priceNow) < editeErrNum) {
          this.adErrLayer = true
          this.errText = '可交易量低于最小交易额度+手续费<br/>无法上架'
          return
        }
        this.WsProxy.send('otc', this.$store.state.editFlag == 2 ? 'update_sale' : 'new_sale', this.adBuyObj).then((data)=>{
          if (this.$store.state.editFlag == 2) {
            this.adErrLayer = true
            this.errText = '已上架'
            setTimeout(() => {
              this.adErrLayer = false
              window.location.hash = '/advertisement'
            }, 3000)
            return
          }
          console.log('发布广告', data)
          this.adSuccLayer = true
          let _this = this
          let timerFn = function () {
            _this.succNum--
            if (_this.succNum <= 0) {
              clearInterval(timer)
              window.location.hash = '/advertisement'
            }
          }
          timerFn()
          let timer = setInterval(timerFn, 1000)
        }).catch((msg)=>{
          console.log('发布广告失败', msg)
          msg.ret !== 1 && (this.adErrLayer = true)
          switch (msg.ret) {
            case 22:
              this.errText = '一个币种同时只能上架一条广告'
              break;
            case 21:
              this.errText = '最多可同时发布3条广告'
              break;
            case 82:
              this.errText = '创建钱包失败'
              break;
          }
        });
      },
      reset() {
        this.adBuyObj.currency = 'btc'
        this.adBuyObj.mode = 1
        this.adBuyObj.premium = 0
        this.adBuyObj.price = ''
        this.adBuyObj.min = '200'
        this.adBuyObj.max = this.$store.state.userInfo.btverify !== 2 ? '100000' : '10000000'
        this.adBuyObj.payment = this.$store.state.PaymentSoreData
        this.adBuyObj.limit = 10
        this.adBuyObj.info = ''
        this.adBuyObj.vary = 1
        this.adBuyObj.tradeable = ''
        this.Bus.$emit('paymentNum', this.$store.state.PaymentSoreData)
      },
      closeLayer() {
        this.adErrLayer = false
      },
      priceInput() { // 表格验证
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adBuyObj.price)) {
          this.errPriceText = '请输入正确的数字格式'
          return
        }
        this.adBuyObj.price = this.adBuyObj.price.replace(/^(\d+)\.(\d{0,2})\d*$/g, '$1' + '.' + '$2');
        this.errPriceText = ''
      },
      tradeableInput() {
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adBuyObj.tradeable)) {
          this.errTradeableText = '请输入正确的数字格式'
          return
        }
        this.adBuyObj.tradeable = this.adBuyObj.tradeable.replace(/^(\d+)\.(\d{0,6})\d*$/g, '$1' + '.' + '$2');
        this.errTradeableText = ''
      },
      minInput() {
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adBuyObj.min)) {
          this.errMinText = '请输入正确的数字格式'
          return
        }
        if (this.adBuyObj.min < 200) {
          this.errMinText = '不能低于最小额度'
          return
        }
        if (this.adBuyObj.min > this.maxNum) {
          this.errMinText = '不能超过最大额度'
          return
        }
        this.adBuyObj.min = this.adBuyObj.min.replace(/^(\d+)\.(\d{0,2})\d*$/g, '$1' + '.' + '$2');
        this.errMinText = ''
      },
      maxInput() {
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adBuyObj.max)) {
          this.errMaxText = '请输入正确的数字格式'
          return
        }
        if (this.adBuyObj.max < 200) {
          this.errMaxText = '不能低于最小额度'
          return
        }
        if (this.adBuyObj.max > this.maxNum) {
          this.errMaxText = '不能超过最大额度'
          return
        }
        this.adBuyObj.max = this.adBuyObj.max.replace(/^(\d+)\.(\d{0,2})\d*$/g, '$1' + '.' + '$2');
        this.errMaxText = ''
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  @import "../../advertisement/css/release.styl"
</style>
