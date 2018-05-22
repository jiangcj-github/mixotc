<template>
  <div class="release-ad-info">
    <ol>
      <li>
        <!--{{$route.params}}-->
        <p>选择币种</p>
        <ChoiceBox :choiceClass="adB"
                   :title="adObj.currency && adObj.currency.toUpperCase()"
                   :classify="coinType"
                   :emitValue="selectCoin"
                   :selectValue="coinData"
                   :width=593
                   :top=39
                   :widthSelect=618
                   :widthWrap=620>
        </ChoiceBox>
      </li>
      <li>
        <p>货币</p>
        <span class="coin-span">{{adObj.money.toUpperCase()}}</span>
      </li>
      <li class="pay-li">
        <p>收款方式</p>
        <PaymentSelect :paymentItem="adObj.payment"></PaymentSelect>
      </li>
    </ol>
    <ol>
      <li class="switch-li clearfix">
        <i>是否溢价</i>
        <em class="sel-premium"><b>*</b>根据市场价的溢价比例</em>
        <em v-show="switchValue">当前市场最低价：</em>
        <b v-show="switchValue">{{priceNow}} CNY/{{adObj.currency && adObj.currency.toUpperCase()}}</b>
        <SwitchBlock class="switch-block" :showSwitch="switchValue = adObj.mode == 1 ? false : true"></SwitchBlock>
      </li>
      <li v-show="switchValue">
        <i>溢价</i>
        <em>参考价：</em>
        <b>{{priceNow}} CNY/{{adObj.currency && adObj.currency.toUpperCase()}}</b>
      </li>
      <li v-show="switchValue">
        <SliderBar
          :min="-99"
          :max="99"
          :choiceValue="adObj.premium"
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
          <b v-show="!switchValue">{{priceNow}} CNY/{{adObj.currency && adObj.currency.toUpperCase()}}</b>
        </p>
        <input type="text" v-model="adObj.price"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adObj.price" @click="adObj.price=''">
      </li>
      <li class="input-li">
        <p class="num-p clearfix">
          <i>购买数量</i>
          <strong :class="{selected: adObj.vary == 2}" @click="showVary">不限量</strong>
        </p>
        <input type="text" :disabled="adObj.vary == 2" :class="{disabledInput: adObj.vary == 2}" v-model="adObj.tradeable"/>
        <span>BTC</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adObj.tradeable" @click="adObj.tradeable=''">
      </li>
      <li class="input-li">
        <p>最小订单额<b class="limit">最小200</b></p>
        <input type="text" v-model="adObj.min"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adObj.min" @click="adObj.min=''">
      </li>
      <li class="input-li">
        <p>最大订单额<b class="limit">最大{{maxLimit}}</b></p>
        <input type="text" v-model="adObj.max"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="adObj.max" @click="adObj.max=''">
      </li>
      <li>付款期限</li>
      <li>
        <SliderBar :selectSliderValue="limitValue"
                   :choiceValue="adObj.limit">
        </SliderBar>
      </li>
    </ol>
    <ol>
      <li class="message-li">
        <p>备注留言</p>
        <textarea placeholder="请填写广告备注留言（选填）" maxlength="50" v-model.trim="adObj.info"></textarea>
        <span>{{adObj.info.length}}/50</span>
      </li>
      <li>
        <button class="release-btn" :class="{'release-active': canSubmit}" @click="canSubmit && toRelease()">发布购买广告</button>
        <span class="reset-info" @click="reset()">重置信息</span>
      </li>
      <li class="hint-li">广告成交后，手续费为成交量的0.18%</li>
    </ol>
    <BasePopup :show="adSuccLayer"
               class="ad-succ-layer">
      <span>发布成功，<b>{{succNum}}</b>秒后跳转至"我的广告"页面</span>
    </BasePopup>
    <BasePopup :show="adErrLayer"
               class="ad-err-layer">
     {{errText}}
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
        adObj: {
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
        selectPrice: [], // 根据币种选择返回情况
        priceNow: '',
        maxLimit: '',
        adSuccLayer: false,
        succNum: 3,
        adErrLayer: false,
        errText: ''
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
        if(this.adObj.payment == 0 || !this.adObj.price || (!this.adObj.tradeable && this.adObj.vary == 1)) {
          return false;
        }
        return true;
      }
    },
    watch: {

    },
    created() {
      // 获取用户id
      // this.adObj.uid = typeof this.$store.state.userInfo.uid  === 'string' ? this.$store.state.userInfo.uid : this.JsonBig.stringify(this.$store.state.userInfo.uid);
      // console.log('userId', this.userId)
      this.adObj.uid = this.$store.state.userInfo.uid
      this.selectUserCoin()
      this.getPrice()
      this.initData()
    },
    mounted() {
      this.Bus.$on(this.selectCoin, data => { // 币种筛选
        this.adObj.currency = data
        this.getPrice()
      }),
      this.Bus.$on('switchValueType', data => { // 是否溢价
        this.switchValue = data
        this.adObj.mode = this.switchValue ? 2 : 1
        console.log('222', this.switchValue)
      });
      this.Bus.$on(this.premiumValue, data => { // 溢价滑动价格
        this.adObj.premium = data

      });
      this.Bus.$on(this.limitValue, data => { // 期限滑动价格
        this.adObj.limit = data
      });
      this.Bus.$on('choicePayment', data => { // 选择支付方式
        console.log('支付', data)
        this.adObj.payment = data
      })
      if(this.$route.params.buyObj){
        this.adObj = this.$route.params.buyObj;
        return;
      }
      this.Bus.$emit('buyInfo', this.adObj)
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
          console.log('购买币种', res)
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
          console.log('价格', res)
          this.selectPrice = res.data.prices.filter(item => {
            return item.currency === this.adObj.currency;
          })
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
        console.log('this.selectPrice', this.selectPrice)
        this.priceNow = this.selectPrice[0] && (this.selectPrice[0].cny)
      },
      initData() { // 数据初始化
        this.maxLimit = this.$store.state.userInfo.btverify !== 2 ? '100,000' : '10,000,000'
        this.adObj.max = this.$store.state.userInfo.btverify !== 2 ? '100000' : '10000000'
      },
      showVary() {
        this.selectNum = !this.selectNum
        this.adObj.vary = this.selectNum == true ? 2 : 1
      },
      toRelease() { // 发布广告
        this.adObj.max = this.adObj.max * 1
        this.adObj.min = this.adObj.min * 1
        this.adObj.price = this.adObj.price * 1
        this.adObj.tradeable = this.adObj.tradeable * 1
        this.WsProxy.send('otc','new_sale', this.adObj).then((data)=>{
          console.log('发布广告', data)
          this.adSuccLayer = true
          let timer = setTimeout(() => {
            this.succNum--
            if (this.succNum < 0) {
              this.adSuccLayer = false
              this.$router.push({name:'MyAd'})
              clearTimeout(timer)
            }
          }, 1000)
        }).catch((msg)=>{
          console.log('发布广告失败', msg)
          this.adErrLayer = true
          switch (msg.reg) {
            case 22:
              this.errText = '一个币种同时只能上架一条广告'
              break;
            case 7:

              break;
            case 9:
              break
          }
        });
      },
      reset() {
        this.adObj.currency = 'btc'
        this.adObj.mode = 1
        this.adObj.premium = 0
        this.adObj.price = ''
        this.adObj.min = '200'
        this.adObj.max = this.$store.state.userInfo.btverify !== 2 ? '100000' : '10000000'
        this.adObj.payment = 0
        this.adObj.limit = 10
        this.adObj.info = ''
        this.adObj.vary = 1
        this.adObj.tradeable = ''
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  @import "../../advertisement/css/release.styl"
  .ad-succ-layer
    text-align center
    line-height 94px
</style>
