<template>
  <div class="release-ad-info">
    <ol>
      <li>
        <p>选择币种</p>
        <ChoiceBox :choiceClass="adB"
                   :title="coinTitle"
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
        <span class="coin-span">{{money.toUpperCase()}}</span>
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
          :selectSliderValue="premiumValue"
          :inputText="inputText">
        </SliderBar>
      </li>
      <li class="input-li">
        <p>
          <i>{{switchValue == true ? '最低单价' : '固定单价'}}</i>
          <em v-show="!switchValue">当前市场最低价：</em>
          <b v-show="!switchValue">12345.00 CNY/BTC</b>
        </p>
        <input type="text" v-model="priceValue" @change="priceChange"/>
        <span>CNY</span>
        <img class="cancel" src="/static/images/cancel_icon.png" alt="" v-show="priceValue" @click="priceValue=''">
      </li>
      <li class="input-li">
        <p class="num-p clearfix">
          <i>购买数量</i>
          <strong :class="{selected: selectNum}" @click="showVary">不限量</strong>
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
        <SliderBar :selectSliderValue="limitValue"></SliderBar>
      </li>
    </ol>
    <ol>
      <li class="message-li">
        <p>备注留言</p>
        <textarea placeholder="请填写广告备注留言（选填）" maxlength="50" v-model.trim="textVale"></textarea>
        <span>{{textVale.length}}/50</span>
      </li>
      <li>
        <button class="release-btn" @click="initData()">发布购买广告</button>
        <span class="reset-info" @click="">重置信息</span>
      </li>
      <li class="hint-li">广告成交后，手续费为成交量的0.18%</li>
    </ol>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import SliderBar from '@/components/common/SliderBar' // 引入滑块
  import PaymentSelect from '@/views/advertisement/child/PaymentSelect' // 引入支付下拉
  import SwitchBlock from '@/views/advertisement/child/SwitchBlock' // 引入开关

  export default {
    name: "release-ad-buy",
    data() {
      return {
        switchValue: false, // 开关
        coinType: [], // 币种下拉
        coinData: [], // 币种数据
        coinTitle: 'BTC',
        selectCoin: 'selectCoin', // 获取子组件值
        adB: 'adB', // 选择子组件合适样式
        inputText: '%', // 滑块符号
        minText: '-99%', // 滑块最小值
        maxText: '99%', // 滑块最大值
        premiumValue: 'premiumValue',
        limitValue: 'limitValue',
        selectNum: false, // 是否限量
        vary: 0,
        priceValue: '', // 单价值
        numValue: '', // 数量值
        minValue: '', // 最小订单额
        maxValue: '', // 最大订单额
        textVale: '', // 留言内容
        userId: '', // 用户id
        currency: 'BTC',
        money: 'cny',
        mode: 1,
        premium: 0,
        limit: 10,
        payment: 0
      }
    },
    components: {
      ChoiceBox,
      SliderBar,
      PaymentSelect,
      SwitchBlock
    },
    computed: {
      adObj() {
        let dataObj = {
          "uid": this.$store.state.userInfo.uid, // 用户id
          "currency": this.currency, // 电子货币
          "money": this.money, // 法币
          "mode": this.mode, // 出售类型: 1 固定; 2 溢价
          "premium": this.premium, // 溢价
          "price": this.priceValue * 1, // 固定价格/最低价格
          "min": this.minValue * 1, // 每笔交易的最小限额
          "max": this.maxValue * 1, // 每笔交易的最大限额
          "payment": this.payment, // 1支付宝;2微信;4银行卡
          "type": 2, // 1 出售; 2 购买
          "limit": this.limit, // 付款期限, 分钟
          "info": this.textVale, // 描述信息
          "vary": this.vary, // 余额随动标志 1 不随动 2 随动
          "tradeable": this.numValue * 1 // 可交易量
        }
        return dataObj
      }
    },
    watch: {
      adObj(newValue, oldValue) {
        console.log('购买子组件的值', newValue)
        this.Bus.$emit('buyInfo', newValue)
      }
    },
    created() {
      // 获取用户id
      this.userId = typeof this.$store.state.userInfo.uid  === 'string' ? this.$store.state.userInfo.uid : this.JsonBig.stringify(this.$store.state.userInfo.uid);
      // console.log('userId', this.userId)
      this.selectUserCoin()
    },
    mounted() {
      this.Bus.$on(this.selectCoin, data => { // 币种筛选
        this.currency = data
      }),
        this.Bus.$on('switchValueType', data => { // 是否溢价
          this.switchValue = data
          this.mode = this.switchValue ? 2 : 1
          console.log('222', this.switchValue)
        });
      this.Bus.$on(this.premiumValue, data => { // 溢价滑动价格
        this.premium = data
      });
      this.Bus.$on(this.limitValue, data => { // 期限滑动价格
        this.limit = data
      });
      this.Bus.$on('choicePayment', data => { // 选择支付方式
        this.payment = data
      });
      this.Bus.$on('buyRelease', data => { // 接收购买信息
        console.log('buy', data)
      })
    },
    destroyed() {
      this.Bus.$off(this.selectCoin);
      this.Bus.$off('switchValueType');
      this.Bus.$off(this.premiumValue);
      this.Bus.$off(this.limitValue);
      this.Bus.$off('choicePayment');
      this.Bus.$off('buyRelease');
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
      showVary() {
        this.selectNum = !this.selectNum
        this.selectNum && (this.vary = 2) || (this.vary = 1)
      },
      priceChange() {

      },
      initData() { // 发布广告
        this.WsProxy.send('otc','new_sale', this.adObj).then((data)=>{
          console.log('发布广告', data)
        }).catch((msg)=>{
          console.log('发布广告失败', msg)
        });
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  @import "../../advertisement/css/release.styl"
</style>
