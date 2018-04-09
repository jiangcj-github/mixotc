<template>
  <div class="my-order-wrap inner">
    <h1>mixOTC-我的订单</h1>
    <div class="order-item">
      <span @click="selectStatus(1)" :class="contentTabIndex === 1 ? 'content-btn-active' : 'content-btn'">进行中(3)</span>
      <span @click="selectStatus(2)" :class="contentTabIndex === 2 ? 'content-btn-active' : 'content-btn'">完成(6)</span>
    </div>
    <div class="order-select">
      <div class="order-choice">
        <div>
          <ChoiceBox :classify="orderType"
                     title="订单类型"
                     :emitValue="orderTypeValue">
          </ChoiceBox>
          <ChoiceBox :classify="currency"
                     title="币种"
                     :emitValue="currencyValue">
          </ChoiceBox>
          <ChoiceBox :classify="allStatus"
                      title="全部状态"
                     :emitValue="allStatusValue">
          </ChoiceBox>
        </div>
        <div class="order-choice-time clearfix" v-if="contentTabIndex === 2">
          <img src="/static/images/calendar.png" alt="">
          <ol class="clearfix">
            <li><DatePicker></DatePicker></li>
            <li>-</li>
            <li><DatePicker></DatePicker></li>
          </ol>
          <ul class="clearfix">
            <li v-for="(item, index) in timeList" :class="{'time-active': index == num}" @click="selectTime(index)">{{item}}</li>
          </ul>
        </div>
      </div>
      <SearchInput :content="content"
                   :title="title"
                   :emitValue1="searchValue"
                   color="#E1E1E1">
      </SearchInput>
    </div>

    <div class="order-content">
      <ol class="clearfix">
        <li v-for="content in contentTitleList">{{content}}</li>
      </ol>
      <div class="order-content-info">
        <ul class="clearfix">
          <li>
            <p>2016/03/09</p>
            <p>13:43</p>
          </li>
          <li>购买</li>
          <li>BTC</li>
          <li>
            <p>lihh/130***123</p>
            <p class="talk">联系他</p>
          </li>
          <li>1.12345678</li>
          <li>
            <p>+1.12 BTC</p>
            <p>0.00004</p>
          </li>
          <li>1.12345678</li>
          <li>234abc</li>
          <li>
            <p>代付款</p>
          </li>
          <li>
            <p>
              <router-link :to="{path: '/order/evaluate', query: {type: '0'}}" class="active-btn">去评价</router-link>
            </p>
            <p>
              <router-link :to="{path: '/order/evaluate', query: {type: '1'}}">查看评价</router-link>
            </p>
            <p @click="remindCoin()">提醒放币</p>
            <p @click="explain">申诉</p>
            <p @click="cancelExplain">取消申诉</p>
            <p @click="buy">购买</p>
          </li>
        </ul>
        <p class="order-content-extre">
          <span>订单号：123456789098765432</span>
          <span>备注：希望可以快速放币</span>
        </p>
      </div>
    </div>
    <Pagination :total="70" emitValue="changePage"></Pagination>

    <!--<MyOrderNothing></MyOrderNothing>-->

    <!-- 提醒放币弹窗 -->
    <BasePopup :show="remindCoinLayer" class="remind-coin-layer">{{remindCoinContent}}</BasePopup>
    <!-- 申述弹窗 -->
    <BasePopup class="explain-layer"
               :show="explainLayer"
               :width=470
               :height=194>
      <img src="/static/images/close_btn.png" alt="" @click="closePopup">
      <p>请先与对方联系，核实对方是否放币</p>
      <div>
        <em>申诉</em>
        <i>联系对方</i>
      </div>
    </BasePopup>
    <!-- 取消申述 -->
    <BasePopup class="explain-layer"
               :show="cancelExplainLayer"
               :width=470
               :height=194>
      <img src="/static/images/close_btn.png" alt="" @click="closePopup">
      <p>请先与对方联系，核实对方是否放币</p>
      <div>
        <em @click="closePopup">取消</em>
        <i>确定</i>
      </div>
    </BasePopup>
    <!-- 购买 -->
    <BasePopup class="buy-layer"
               :show="buyLayer"
               :width=470
               :height=250>
      <img src="/static/images/close_btn.png" alt="" @click="closePopup">
      <div class="buy-layer-content">
        <h1>请输入支付密码</h1>
        <input type="password"/>
        <div>
          <em @click="closePopup">取消</em>
          <i @click="buyNext">下一步</i>
        </div>
      </div>
    </BasePopup>
    <!-- 输入短信验证码 -->
    <BasePopup class="info-layer"
               :show="infoLayer"
               :width=470
               :height=250>
      <img src="/static/images/close_btn.png" alt="" @click="closePopup">
      <div class="buy-layer-content">
        <h1>请输入短信验证码</h1>
        <p>
          <input type="text"/><span @click="sendVerify" :class="{offBg: showOffBg}">{{verifyCode}}</span>
        </p>
        <div>
          <em @click="closePopup">取消</em>
          <i>确定</i>
        </div>
      </div>
    </BasePopup>
    <!-- 输入谷歌验证码 -->
    <BasePopup class="geogle-layer"
               :show="geogleLayer"
               :width=470
               :height=250>
      <img src="/static/images/close_btn.png" alt="" @click="closePopup">
      <div class="buy-layer-content">
        <h1>请输入谷歌验证码</h1>
        <input type="tel" maxlength="6" class="realInput" v-model="realInput"  @keyup="getNum()" @keydown="delNum()">
        <ul class="clearfix">
          <li v-for="disInput in disInputs"><input type="tel" maxlength="1"  v-model="disInput.value" ></li>
        </ul>
        <div>
          <em @click="closePopup">取消</em>
          <i>确定</i>
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import Pagination from '@/components/common/Pagination' // 引入分页
  import DatePicker from '@/components/common/DatePicker' // 引入日历
  import SearchInput from '@/components/common/SearchInput' // 引入搜索下拉框
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import MyOrderNothing from '@/views/myOrder/MyOrderNothing' // 引入无订单页面

  export default {
    name: "my-order",
    components: {
      ChoiceBox,
      Pagination,
      DatePicker,
      SearchInput,
      BasePopup,
      MyOrderNothing
    },
    data() {
      return {
        content: ['搜索订单号', '搜索资金码', '搜索商家昵称／账号'],
        title: '搜索订单号',
        searchValue: 'changeTitle',
        contentTabIndex: 1,
        num: 0,
        remindCoinLayer: false,
        remindCoinContent: '提醒发送成功',
        explainLayer: false,
        cancelExplainLayer: false,
        buyLayer: false,
        infoLayer: false,
        geogleLayer: false,
        verifyCode: '发送验证码',
        flag: true,
        showOffBg: false,
        count: 60,
        geogleLayer: false,
        disInputs:[{value:''},{value:''},{value:''},{value:''},{value:''},{value:''}],
        realInput:'',
        timeList: ['今天', '三天', '七天'],
        orderType: ['全部类型', '购买', '出售'],
        orderTypeValue: 'orderTypeValue',
        currency: ['BTC', 'ETH', 'LTC'],
        currencyValue: 'currencyValue',
        allStatus: ['全部状态', '待付款', '待放币', '申述中'],
        allStatusValue: 'allStatusValue',
        contentTitleList: ['创建时间', '类型', '币种', '对方', '单价(CNY)', '数量(手续费)', '金额(CNY)', '资金码', '状态', '操作'],
        contentList:[
          {date: '2016/03/09', time: ''}
        ]
      }
    },
    mounted() {
      // 监听下拉框值，将值传给子组件
      this.Bus.$on(this.orderTypeValue, (data) => {
        console.log('orderTypeValue', data)
      });
      this.Bus.$on(this.currencyValue, (data) => {
        console.log('currencyValue', data)
      });
      this.Bus.$on(this.allStatusValue, (data) => {
        console.log('allStatusValue', data)
      });
      // 监听搜索框值
      this.Bus.$on(this.searchValue,(data) => {
        this.title = data
      })
    },
    destroyed() {
      this.Bus.$off(this.orderTypeValue);
      this.Bus.$off(this.currencyValue);
      this.Bus.$off(this.allStatusValue);
      this.Bus.$off(this.searchValue);
    },
    methods: {
      selectStatus(type) { // Tab切换
        this.contentTabIndex = type;
      },
      selectTime(index) { // 时间切换
        this.num = index;
      },
      remindCoin() {
        this.remindCoinLayer = true;
        setTimeout(() => {
          this.remindCoinLayer = false
        }, 3000)
      },
      explain() {
        this.explainLayer = true
      },
      cancelExplain() {
        this.cancelExplainLayer = true
      },
      buy() {
        this.buyLayer = true;
      },
      buyNext() {
        this.buyLayer = false;
        // this.infoLayer = true;
        this.geogleLayer = true
      },
      sendVerify() {
        if (this.flag && this.infoLayer) {
          this.flag = false;
          this.count = 60;
          let _this = this;
          let verifyFn = function () {
            _this.count--;
            _this.verifyCode = `${_this.count}秒后重发`;
            _this.showOffBg = true;
            if (_this.count <= 0) {
              _this.verifyCode = '发送验证码';
              _this.flag = true;
              _this.showOffBg = false;
              clearInterval(timer)
            }
          };
          verifyFn();
          let timer = setInterval(verifyFn, 1000)
        }
      },
      getNum(){
        for (var i = 0; i < this.realInput.length; i++) {
          this.disInputs[i].value = this.realInput.charAt(i) // 表示字符串中某个位置的数字，即字符在字符串中的下标

        }
      },
      delNum(){
        let oEvent = window.event;
        console.log(oEvent)
        if (oEvent.keyCode === 8) {
          if (this.realInput.length > 0) {
            this.disInputs[this.realInput.length-1].value=''
          }
        }
      },
      closePopup() {
        this.explainLayer = false;
        this.cancelExplainLayer = false;
        this.buyLayer = false;
        this.infoLayer = false;
        this.geogleLayer = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .my-order-wrap
    margin-top 40px
    margin-bottom 40px
    h1
      font-size $fz20
      font-weight bold
      color $col333
      margin-bottom 30px
      &:before
        display inline-block
        width 3px
        height 20px
        position relative
        top 2px
        left 0
        content ''
        margin-right 9px
        background-color $col422

    .order-item
      margin-bottom 1px
      padding-left 30px
      background #FFF
      line-height 60px
      font-size 16px
      cursor pointer
      span
        padding 18px 15px
      span:first-child
        margin-right 30px
      .content-btn
        color #999
      .content-btn-active
        color $col422
        border-bottom 2px solid $col422

    .order-select
      padding 0 0 10px 30px
      background #FFF
      .order-choice
        display flex
        align-items center
        height 50px
        margin-bottom 10px
      .order-search
        width 456px
        border 1px solid #E1E1E1
        border-radius 2px 2px 2px 0
        input
          float left
          width 374px
          height 30px
          padding-left 10px
        div
          position relative
          float right
          width 72px
          height 30px
          line-height 30px
          text-align center
          background #E1E1E1
          &:after
            position absolute
            top 13px
            left -300px
            width 11px
            height 5px
            content ''
            background url(/static/images/triangle_yellow.png) no-repeat
            background-size 11px 5px
          img
            vertical-align middle
      .order-choice-time
        margin-left 370px
        ol, ul, img
          float left
        li
          float left
        ol
          line-height 30px
          margin-right 22px
          li:nth-child(2)
            margin 0 10px
        ul
          line-height 30px
          border 1px solid #FFF3EB
          border-radius 0 2px 2px 0
          li
            width 50px
            text-align center
            background #FFF3EB
            color #999
            cursor pointer
          .time-active
            background #FFF
            color #FFB422
        img
          width 16px
          height 16px
          margin 8px 10px 0 0

    .order-content
      margin-bottom 44px
      li
        width 110px
        font-size $fz13
      li:nth-child(1)
        width 130px
      li:nth-child(4)
        width: 160px
      li:nth-child(9)
        width 70px
      ol
        margin 20px 0
        padding 0 30px
        li
          float left
          color #999
      .order-content-info
        padding 18px 30px
        border 1px solid #E1E1E1
        background #FFF
        ul
          padding-bottom 10px
          border-bottom 1px solid #E1E1E1
          li
            float left
            p
              margin-bottom 10px
              cursor pointer
            .talk
              position relative
              padding-left 30px
              color #FFB422
              &:before
                position absolute
                top 0
                left 0
                width 18px
                height 18px
                content ''
                background url(/static/images/talk.png) no-repeat
                background-size 18px 18px
            .active-btn
              display inline-block
              width 100px
              height 25px
              text-align center
              line-height 25px
              color #FFF
              background: #FFB422
              border-radius: 2px

          li:nth-child(2)
            color $col100
        .order-content-extre
          padding-top 17px
          font-size 13px
          color #999

  /*弹窗部分*/
  .remind-coin-layer
    text-align center
    line-height 94px

  .explain-layer
    text-align center
    img
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 442.6px
      cursor pointer
    p
      margin 32.4px 0 60px
    div
      em, i
        display inline-block
        width 160px
        height 40px
        text-align center
        line-height 40px
        cursor pointer
      em
        color #FFB422
        background #FFF
        border 1px solid #FFB422
        border-radius 2px
        margin-right 30px
      i
        color #FFF
        background #FFB422
        border-radius 2px

  .buy-layer, .info-layer, .geogle-layer
    img
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 442.6px
      cursor pointer
    .buy-layer-content
      margin-top 32.4px
      margin-left 60px
      input
        width 340px
        height 40px
        padding-left 10px
        margin-bottom 40px
        background #F4F6FA
        border-radius 2px
      div
        em, i
          display inline-block
          width 160px
          height 40px
          text-align center
          line-height 40px
          cursor pointer
        em
          color #FFB422
          background #FFF
          border 1px solid #FFB422
          border-radius 2px
          margin-right 30px
        i
          color #FFF
          background #FFB422
          border-radius 2px

  .info-layer
    .buy-layer-content
      p
        input
          width 250px
          vertical-align top
        span
          display inline-block
          width 100px
          height 40px
          text-align center
          line-height 40px
          color #FFF
          background #FFB422
          border-radius 0 2px 2px 0
          cursor pointer
        .offBg
          background #999

  .geogle-layer
    .buy-layer-content
      .realInput
        position: absolute
        padding 0
        background: none
        text-indent: -5em;
      ul
        margin-bottom 40px
        li
          float left
          width 40px
          height 40px
          margin-right 20px
          input
            width 40px
            height 40px
            text-align center
            line-height 40px
            padding 0
        li:last-child
          margin-right 0

</style>
