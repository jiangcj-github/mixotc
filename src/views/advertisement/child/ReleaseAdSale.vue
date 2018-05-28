<template>
  <div class="release-ad-info">
    <ol>
      <li>
        <p>选择币种</p>
        <ChoiceBox :choiceClass="adB"
                   :title="adSaleObj.currency && adSaleObj.currency.toUpperCase()"
                   :classify="coinType"
                   :emitValue="selectCoin"
                   :selectValue="coinData"
                   :width=593
                   :top=39
                   :showDisabled="isDisabled"
                   :createWallet="true"
                   :widthSelect=618
                   :widthWrap=620>
        </ChoiceBox>
      </li>
      <li>
        <p>货币</p>
        <span class="coin-span">{{adSaleObj.money.toUpperCase()}}</span>
      </li>
      <li class="pay-li">
        <p>收款方式</p>
        <PaymentSelect :soreTab="adSaleObj.payment"></PaymentSelect>
      </li>
    </ol>
    <ol>
      <li class="switch-li clearfix">
        <i>是否溢价</i>
        <em class="sel-premium"><b>*</b>根据市场价的溢价比例</em>
        <em v-show="switchValue">当前市场最低价：</em>
        <b v-show="switchValue">{{priceNow}} CNY/{{adSaleObj.currency && adSaleObj.currency.toUpperCase()}}</b>
        <SwitchBlock class="switch-block" :showSwitch="switchValue = adSaleObj.mode == 1 ? false : true"></SwitchBlock>
      </li>
      <li v-show="switchValue">
        <i>溢价</i>
        <em>参考价：</em>
        <b>{{priceNow}} CNY/{{adSaleObj.currency && adSaleObj.currency.toUpperCase()}}</b>
      </li>
      <li v-show="switchValue">
        <SliderBar
          :min="-99"
          :max="99"
          :choiceValue="adSaleObj.premium"
          :minText="minText"
          :maxText="maxText"
          :selectSliderValue="premiumValue"
          :inputText="inputText">
        </SliderBar>
      </li>
      <li class="input-li">
        <p>
          <i>{{switchValue == true ? '最低单价' : '固定单价'}}</i>
          <em v-show="!switchValue">当前市场最低价：</em>
          <b v-show="!switchValue">{{priceNow}} CNY/{{adSaleObj.currency && adSaleObj.currency.toUpperCase()}}</b>
        </p>
        <input type="text"
               v-model="adSaleObj.price"
               @focus="clearPrice=true && (errPrice=true)"
               @blur="clearPrice = false"
               @input="priceInput"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adSaleObj.price && clearPrice" @mousedown="adSaleObj.price=''">
        <span class="text-err" v-show="errPrice && adSaleObj.price">{{errPriceText}}</span>
      </li>
      <li class="input-li">
        <p class="num-p clearfix sale-num-p">
          <i>出售数量</i>
          <em>可用余额：</em>
          <b>{{userBalance}}{{adSaleObj.currency && adSaleObj.currency.toUpperCase()}}</b>
          <router-link to="/wallet/charge" tag="button" class="sale-btn">去充币</router-link>
          <strong :class="{selected: adSaleObj.vary == 2}" @click="showVary()">随可用余额变动</strong>
        </p>
        <SliderBar
          :min="0"
          :max="adSaleObj.length"
          :step="0.000001"
          :minText="coinMinText"
          :maxText="coinMaxText"
          :selectSliderValue="currencyValue"
          :choiceValue="adSaleObj.tradeable"
          :disabled="disabledSlide"
          :inputText="adSaleObj.currency && adSaleObj.currency.toUpperCase()">
        </SliderBar>
      </li>
      <li class="input-li">
        <p>最小订单额<b class="limit">最小200</b></p>
        <input type="text"
               v-model="adSaleObj.min"
               @focus="clearMin=true && (errMin=true)"
               @blur="clearMin = false"
               @input="minInput"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adSaleObj.min && clearMin" @mousedown="adSaleObj.min=''">
        <span class="text-err" v-show="errMin && adSaleObj.min">{{errMinText}}</span>
      </li>
      <li class="input-li">
        <p>最大订单额<b class="limit">最大{{maxLimit}}</b></p>
        <input type="text"
               v-model="adSaleObj.max"
               @focus="clearMax = true && (errMax=true)"
               @blur="clearMax = false"
               @input="maxInput"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adSaleObj.max && clearMax" @mousedown="adSaleObj.max=''">
        <span class="text-err" v-show="errMax && adSaleObj.max">{{errMaxText}}</span>
      </li>
      <li>付款期限</li>
      <li>
        <SliderBar :selectSliderValue="limitValue"
                   :choiceValue="adSaleObj.limit">
        </SliderBar>
      </li>
    </ol>
    <ol>
      <li class="message-li">
        <p>备注留言</p>
        <textarea placeholder="请填写广告备注留言（选填）" maxlength="50" v-model.trim="adSaleObj.info"></textarea>
        <span>{{adSaleObj.info.length}}/50</span>
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
    name: "release-ad-sale",
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

        coinMinText: '',
        coinMaxText: '',
        premiumValue: 'premiumValue',
        limitValue: 'limitValue',
        currencyValue: 'currencyValue',
        disabledSlide: false,

        selectNum: false, // 是否限量
        adSaleObj: {
          "id": 0, // 广告id
          "uid": '', // 用户id
          "currency": 'btc', // 电子货币
          "money": 'cny', // 法币
          "mode": 1, // 出售类型: 1 固定; 2 溢价
          "premium": 0, // 溢价
          "price": '', // 固定价格/最低价格
          "min": '200', // 每笔交易的最小限额
          "max": '', // 每笔交易的最大限额
          "payment": 0, // 1支付宝;2微信;4银行卡
          "type": 1, // 1 出售; 2 购买
          "limit": 10, // 付款期限, 分钟
          "info": '', // 描述信息
          "vary": 1, // 余额随动标志 1 不随动 2 随动
          "tradeable": 0,// 可交易量
          "length": 0
        },

        selectPrice: [], // 根据币种选择返回情况
        priceNow: '',
        maxLimit: '',

        balanceList: [],
        userBalance: '', // 用户余额
        isDisabled: false,
        adSuccLayer: false,
        succNum: 4,
        adErrLayer: false,
        errText: '',

        clearPrice: false,
        clearMin: false,
        clearMax: false,

        errPrice: false,
        errMin: false,
        errMax: false,

        errPriceText: '',
        errMinText: '',
        errMaxText: '',
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
        if(this.adSaleObj.payment == 0 || !this.adSaleObj.price|| this.errPriceText !== '' || this.errMinText !== '' || this.errMaxText !== '') {
          return false;
        }
        return true;
      }
    },
    created() {

      if (this.$store.state.editFlag == 1) {
        this.isDisabled = true
        this.adSaleObj = this.$store.state.editContent
        console.log('赋值完毕',this.adSaleObj.length)
      }
      if(this.$route.params.saleCon){
        this.adSaleObj = this.$route.params.saleCon;
        return;
      }
      this.Bus.$emit('saleInfo', this.adSaleObj)
    },
    mounted() {
      this.adSaleObj.uid = this.$store.state.userInfo.uid
      this.selectUserCoin()
      this.getPrice()
      this.initData()

      console.log('我要看看这是啥',this.$store.state.editContent.tradeable)
      this.Bus.$on(this.selectCoin, data => { // 币种筛选
        this.adSaleObj.currency = data
        this.adSaleObj.tradeable = 0
        this.getPrice()
        this.selectUserCoin()
      }),
      this.Bus.$on('switchValueType', data => { // 是否溢价
        this.switchValue = data
        this.adSaleObj.mode = this.switchValue ? 2 : 1
      });
      this.Bus.$on(this.premiumValue, data => { // 溢价滑动价格
        this.adSaleObj.premium = data
      });
      this.Bus.$on(this.limitValue, data => { // 期限滑动价格
        this.adSaleObj.limit = data
      });
      this.Bus.$on(this.currencyValue, data => { // 出售滑动价格
        this.adSaleObj.tradeable = data
      });
      this.Bus.$on('choicePayment', data => { // 选择支付方式
        this.adSaleObj.payment = data
      })
    },
    destroyed() {
      this.Bus.$off(this.selectCoin);
      this.Bus.$off('switchValueType');
      this.Bus.$off(this.premiumValue);
      this.Bus.$off(this.limitValue);
      this.Bus.$off('choicePayment');
      this.Bus.$off(this.currencyValue);
    },
    methods: {
      async selectUserCoin() { // 选择币种
        this.coinType = []
        await this.WsProxy.send('wallet', 'wallets', {
          id: this.$store.state.userInfo.uid, // 用户id
        }).then((data)=>{
          data.wallets.forEach(v => {
            this.coinType.push(v.currency.toUpperCase())
            this.coinData.push(v.currency)
          })
          this.balanceList = data.wallets.filter(item => {
            return item.currency === this.adSaleObj.currency;
          })
          console.log('this.balanceList', this.balanceList)
        }).catch((msg)=>{
          // console.log('出售币种错误', msg);
        });
        this.userBalance = this.balanceList[0] && (this.JsonBig.stringify(this.balanceList[0].balance)).formatFixed(6) || 0
        this.coinMinText = `0${this.adSaleObj.currency && this.adSaleObj.currency.toUpperCase()}`
        this.coinMaxText = `${this.userBalance}${this.adSaleObj.currency && this.adSaleObj.currency.toUpperCase()}`
        this.Bus.$emit('saleSlideLength', this.userBalance)
      },
      async getPrice() { // 当前价格
        await this.Proxy.getPrice().then(res => {
          console.log('价格', res)
          this.selectPrice = res.data.prices.filter(item => {
            return item.currency === this.adSaleObj.currency;
          })
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
        this.priceNow = this.selectPrice[0] && (this.selectPrice[0].cny)
      },
      initData() { // 数据初始化
        this.maxLimit = this.$store.state.userInfo.btverify !== 2 ? '100,000' : '10,000,000'
        this.adSaleObj.max = this.$store.state.userInfo.btverify !== 2 ? '100000' : '10000000'
      },
      showVary() { // 是否溢价
        this.selectNum = !this.selectNum
        if (this.selectNum == true) {
          this.adSaleObj.vary = 2
          this.disabledSlide = true
          this.adSaleObj.tradeable = this.userBalance * 1
        } else {
          this.adSaleObj.vary = 1
          this.disabledSlide = false
        }
      },
      forbidRelease() { // 信息不完整
        this.errText = '信息未填写完整'
        this.adErrLayer = true
      },
      toRelease() { // 发布广告
        this.adSaleObj.max = this.adSaleObj.max * 1
        this.adSaleObj.min = this.adSaleObj.min * 1
        this.adSaleObj.price = this.adSaleObj.price * 1
        //let editeErrNum = 200 + (this.adSaleObj.tradeable * 0.005)
        // if (this.$store.state.editFlag == 1 && this.adSaleObj.tradeable < editeErrNum) {
        //   this.adErrLayer = true
        //   this.errText = '可交易量低于最小交易额度+手续费<br/>无法上架'
        //   return
        // }
        this.WsProxy.send('otc', this.$store.state.editFlag == 1 ? 'update_sale' : 'new_sale', this.adSaleObj).then((data)=>{
          if (this.$store.state.editFlag == 1) {
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
        this.adSaleObj.currency = 'btc'
        this.adSaleObj.mode = 1
        this.adSaleObj.premium = 0
        this.adSaleObj.price = ''
        this.adSaleObj.min = '200'
        this.adSaleObj.max = this.$store.state.userInfo.btverify !== 2 ? '100000' : '10000000'
        this.adSaleObj.payment = this.$store.state.PaymentSoreData
        this.adSaleObj.limit = 10
        this.adSaleObj.info = ''
        this.adSaleObj.vary = 1
        this.adSaleObj.tradeable = this.userBalance * 1
        this.Bus.$emit('paymentNum', this.$store.state.PaymentSoreData)
      },
      closeLayer() {
        this.adErrLayer = false
      },
      priceInput() { // 表格验证
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adSaleObj.price)) {
          this.errPriceText = '请输入正确的数字格式'
          return
        }
        this.adSaleObj.price = this.adSaleObj.price.replace(/^(\d+)\.(\d{0,2})\d*$/g, "$1" + '.' + '$2');
        this.errPriceText = ''
      },
      minInput() {
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adSaleObj.min)) {
          this.errMinText = '请输入正确的数字格式'
          return
        }
        if (this.adSaleObj.min < 200) {
          this.errMinText = '不能低于最小额度'
          return
        }
        this.adSaleObj.min = this.adSaleObj.min.replace(/^(\d+)\.(\d{0,2})\d*$/g, "$1" + '.' + '$2');
        this.errMinText = ''
      },
      maxInput() {
        if (!(/^(0|([1-9]\d*))(\.\d+)?$/).test(this.adSaleObj.max)) {
          this.errMaxText = '请输入正确的数字格式'
          return
        }
        if (this.adSaleObj.max > this.maxNum) {
          this.errMaxText = '不能超过最大额度'
          return
        }
        this.adSaleObj.max = this.adSaleObj.max.replace(/^(\d+)\.(\d{0,2})\d*$/g, "$1" + '.' + '$2');
        this.errMaxText = ''
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  @import "../../advertisement/css/release.styl"
</style>


