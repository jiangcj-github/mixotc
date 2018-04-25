<template>
  <div class="my-order-wrap inner">
    <h1>
      <router-link to="/transaction">mixOTC</router-link> -
      <router-link to="/order">我的订单</router-link>
    </h1>
    <div class="order-item">
      <span @click="selectStatus(1)" :class="contentTabIndex === 1 ? 'content-btn-active' : 'content-btn'">进行中({{conductNum}})</span>
      <span @click="selectStatus(2)" :class="contentTabIndex === 2 ? 'content-btn-active' : 'content-btn'">完成({{completeNum}})</span>
    </div>
    <div class="order-select clearfix">
      <SearchInput :content="content"
                   :title="title"
                   :emitValue1="searchValue"
                   :emitValue3="searchResult"
                   :result="result"
                   color="#E1E1E1"
                   class="order-choice-search">
      </SearchInput>
      <div class="order-choice-time clearfix" v-if="contentTabIndex === 2">
        <DateInterval class="date-group" :endEmitValue="endValue" :startEmitValue="startValue"></DateInterval>
        <ul class="clearfix">
          <li v-for="(item, index) in timeList" :class="{'time-active': index == num}" @click="selectTime(index)">{{item}}</li>
        </ul>
      </div>
    </div>

    <div class="order-content">
      <!-- 表格表头 -->
      <ol class="clearfix">
        <li :data-zIndex="index" v-for="(title, index) in titleList" :class="{sort: title.canSort, 'sort-up': clickUp === index && sortActive, 'sort-down': clickUp === index && !sortActive}" @click="title.canSort && toSort(title, index)">
          <span >
            {{title.content}}
            <i class="before" v-if="title.sortTab"></i>
            <i class="after" v-if="title.sortTab"></i>
          </span>
          <ChoiceBox
            v-if="title.orderTypeShow"
            :classify="orderType"
            title="类型"
            :emitValue="orderTypeValue"
            :selectValue="orderTypeValueData">
          </ChoiceBox>
          <CheckBox
            v-if="title.currencyShow"
            title="币种"
            allName="全部币种"
            :checkBoxList="currencyBox"
            :emitValue="currencyValue"
            :width=105>
          </CheckBox>
          <CheckBox
            v-if="title.status"
            title="状态"
            allName="全部状态"
            :checkBoxList="contentTabIndex === 1 ? allStatusPro : allStatusCom"
            :emitValue="allStatusValue"
            :width=130>
          </CheckBox>
        </li>
      </ol>
      <!-- 表格内容 -->
      <div class="order-content-info" v-for="(content,index) in contentList">
        <ul class="clearfix">
          <li>
            <p>{{content.create && Number(content.create).toDate('yyyy/MM/dd')}}</p>
            <p>{{content.create && Number(content.create).toDate('HH:mm')}}</p>
          </li>
          <li :class="JsonBig.stringify(content.buyer) == userId ? 'text-g' : 'text-r'">{{JsonBig.stringify(content.buyer) == userId ? '购买' : '出售'}}</li>
          <li>{{content.currency&&content.currency.toUpperCase()}}</li>
          <li>
            <p><router-link :to="{path:'/homepage', query:{uid: JsonBig.stringify(content.buyer) == userId ? content.seller : content.buyer}}">{{content.name || content.contact}}</router-link></p>
            <p class="talk" @click="$store.commit({'type':'changeChatBox', data: true})">联系他</p>
          </li>
          <li>{{content.price}}</li>
          <li>
            <p :class="JsonBig.stringify(content.buyer) == userId ? 'text-g' : 'text-r'">{{JsonBig.stringify(content.buyer) == userId ? `+${content.amountc}${content.currency.toUpperCase()}` : `-${content.amountc}${content.currency.toUpperCase()}`}}</p>
            <p>{{content.fee}}</p>
          </li>
          <li>{{content.amountm}}</li>
          <li>{{content.trade_code}}</li>
          <!-- 状态显示 -->
          <li class="state-li">
            <p v-for="state in content.stateList"
               :class="{'text-r': state.flag == 1, 'text-g': state.flag === 2, 'text-b': state.flag === 3}">{{state.name}}</p>
          </li>
          <!-- 操作显示 -->
          <li class="operation-li">
            <p v-for="operation in content.operationList"
               :class="{'active-btn': operation.flag == 1 || operation.flag == 3 || operation.flag == 8, 'text-b': operation.flag == 2}"
               @click="operation.flag == 3 ? openPayment($event, index) : (operation.flag == 4 || operation.flag == 7 || operation.flag == 9 ? openSelect($event, operation, index, content) : (operation.flag == 8 ? openReleaseCoin($event, content, index) : (operation.flag == 5 || operation.flag == 6 ? remindCoin(content) : showOperation(index))))"
            >{{operation.name}}</p>
          </li>
        </ul>
        <p class="order-content-extre clearfix">
          <span>订单号：{{JsonBig.stringify(content.id)}}</span>
          <span>备注：{{content.info}}</span>
          <!--<span  class="reset-time" v-if="content.state == 1">还剩{{minute}}分钟{{second}}秒</span>-->
          <CountDown :endTime="endTime" class="reset-time" v-if="content.state == 1"></CountDown>
        </p>
      </div>
    </div>
    <!-- 订单无内容 -->
    <MyOrderNothing v-if="!contentList"></MyOrderNothing>
    <!-- 分页 -->
    <!--<Pagination  v-if="contentList !== null"-->
                <!--:total="70"-->
                <!--:pageSize="20"-->
                <!--emitValue="changePage">-->
    <!--</Pagination >-->
    <div class="page-btn" v-if="contentList">
      <button @click="clickPre" :class="{'unable-btn': page === 0}" :disabled="page === 0">上一页</button>
      <button @click="clickNext" :class="{'unable-btn': contentList && contentList.length < 10}" :disabled="contentList && contentList.length < 10">下一页</button>
    </div>


    <!-- 标记已付款弹窗 -->
    <MarkedPaymentLayer :paymentShow="showPayment"
                        :id="updateId"
                        :info="updateInfo"
                        :tradeCode="updateTradeCode"
                        @offPayment="openPayment">
    </MarkedPaymentLayer>
    <!-- 引入释放币弹窗 -->
    <ReleaseCoinLayer
      :releaseCoinShow="showReleaseCoin"
      :id="updateId"
      :uid="updateUid"
      @offRelease="openReleaseCoin">
    </ReleaseCoinLayer>
    <!-- 提醒放币弹窗 -->
    <BasePopup :show="remindCoinLayer" class="remind-coin-layer">{{remindCoinContent}}</BasePopup>
    <!-- 取消订单 -->
    <SelectLayer :selectShow="showSelect"
                 @offSelet="openSelect"
                 :type="showType"
                 :id="updateId"
                 :info="updateInfo"
                 :contentInfo="selectContent"
                 :leftContent="selectLeft"
                 :rightContent="selectRight">
    </SelectLayer>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import Pagination from '@/components/common/Pagination' // 引入分页
  // import DatePicker from '@/components/common/DatePicker' // 引入日历
  import DateInterval from '@/components/common/DateInterval' // 引入日历
  import SearchInput from '@/components/common/SearchInput' // 引入搜索下拉框
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import MyOrderNothing from '@/views/myOrder/MyOrderNothing' // 引入无订单页面
  import sendConfig from '@/api/SendConfig.js'// 引入websocket发送包
  import MarkedPaymentLayer from '@/views/myOrder/orderLayer/MarkedPaymentLayer' // 标记已付款弹窗
  import ReleaseCoinLayer from '@/views/myOrder/orderLayer/ReleaseCoinLayer' // 释放币弹窗
  import SelectLayer from '@/views/myOrder/orderLayer/SelectLayer' // 申诉弹窗
  import CheckBox from '@/components/common/CheckBox' // 引入多选弹窗
  import CountDown from '@/components/common/CountDown' // 引入倒计时

  export default {
    name: "my-order",
    components: {
      ChoiceBox,
      Pagination,
      DateInterval,
      SearchInput,
      BasePopup,
      MyOrderNothing,
      MarkedPaymentLayer,
      ReleaseCoinLayer,
      SelectLayer,
      CheckBox,
      CountDown
    },
    data() {
      return {
        sortFlag: "", // 控制排序箭头每次朝上
        userId: '', // 用户id

        titleList:[
          {content: '创建时间', sortTab: true, canSort: true, flag: 0},
          {orderTypeShow: true},
          {currencyShow: true},
          {content: '对方'},
          {content: '单价(CNY)', sortTab: true, canSort: true, flag: 4},
          {content: '数量(手续费)', sortTab: true, canSort: true, flag: 5},
          {content: '金额(CNY)', sortTab: true, canSort: true, flag: 6},
          {content: '资金码'},
          {status: true},
          {content: '操作'}
        ], // 表格表头内容
        clickUp: 20,
        clickDown: 20,
        sortActive: false, // 控制箭头开始无active

        content: [
          {title: '搜索订单号', type: 'order_id'},
          {title: '搜索资金码', type: 'order_tradecode'},
          {title: '搜索商家昵称/账号', type: 'order_trader'}
        ],  // 输入框下拉值
        title: '搜索订单号', // 输入框默认
        searchValue: 'searchValue', // 输入框title改变值
        searchResult: 'searchResult',  // 输入框内容
        result: [], // 模糊搜索结果
        orderId: '',
        tradeCode: '',
        trader: '',
        contentTabIndex: 1, // 控制tab切换
        num: 0, // 控制时间选择Tab active类

        showPayment: false, // 标记已付款弹窗
        showReleaseCoin: false,

        showSelect: false, // 双向选择公共弹窗
        selectContent: 'selectContent', // 内容
        selectLeft: 'selectLeftValue', // 左边内容
        selectRight: 'selectRightValue', // 右边内容
        showType: 0, // 确定弹窗类型

        remindCoinLayer: false, // 提醒弹窗
        remindCoinContent: '提醒发送成功', // 提醒弹窗内容


        updateId: '', //标记已付款弹窗所用id
        updateInfo: '',
        updateUid: '',
        updateTradeCode: '', // 标记弹窗所用资金码

        startValue: 'startValueDate',
        endValue: 'endValueDate',

        timeList: ['今天', '三天', '七天'], // 时间Tab切换title

        orderType: ['全部类型', '购买', '出售'], // 类型下拉显示
        orderTypeValue: 'orderTypeValue', // 传递给子组件
        orderTypeValueData: [3, 1, 2],
        selectOrder: 3, // 订单类型筛选
        selectCurrency: '', // 币种筛选
        selectState: '', // 订单状态筛选
        currencyBox:[ // 币种下拉显示
          {type: 'BTC', state: false, code: 'btc'},
          {type: 'ETH', state: false, code: 'eth'},
          {type: 'LTC', state: false, code: 'ltc'}
        ],
        currencyValue: 'currencyValue', // 传递给子组件
        allStatusPro: [
          {type: '待付款', state: false, code: '1'},
          {type: '待放币', state: false, code: '2'},
          {type: '申诉中', state: false, code: '3'},
        ], // 进行中状态下拉显示
        allStatusCom: [ // (126) 12310 (12678) (126789) (124) 12311 (15)
          {type: '成功', state: false, code: '6'},
          {type: '成功-强制放币', state: false, code: '10'},
          {type: '成功-未评价', state: false, code: '7,8'},
          {type: '成功-已评价', state: false, code: '9'},
          {type: '失败-取消', state: false, code: '4'},
          {type: '失败-终止', state: false, code: '11'},
          {type: '失败-超时', state: false, code: '5'},
        ], // 完成状态下拉显示
        allStatusValue: 'allStatusValue', // 传递给子组件
        contentList: [], // 表格内容数组
        dateSort: 0,// 时间排序 1降序 2升序
        price: 0,// 单价排序 1降序 2升序
        amount: 0,// 电子币数量排序 1降序 2升序
        money: 0,// 法币金额排序 1降序 2升序

        endTime: '', // 设置定时器时间

        conductNum: 0, // 进行数量
        completeNum: 0, // 完成数量

        page: 0 // 分页数量
      }
    },
    created() {
      // 获取用户id
      this.userId = typeof this.$store.state.userInfo.uid  === 'string' ? this.$store.state.userInfo.uid : this.JsonBig.stringify(this.$store.state.userInfo.uid);
      console.log( this.JsonBig.stringify(this.$store.state.userInfo.uid))
      //console.log('这是个字符串', this.$store.state.userInfo.uid,  typeof this.$store.state.userInfo.uid)
      //console.log('1111', typeof this.userId, this.userId, typeof this.$store.state.userInfo.uid, this.$store.state.userInfo.uid)
      // 获取进行状态
      this.selectState = "1,2,3";
      this.initData();
      this.getInitNum();
      this.getCompleteData(); // 获取完成数据
    },
    mounted() {
      // 监听下拉框值，将值传给子组件
      this.Bus.$on(this.orderTypeValue, (data) => { // 类型筛选
        this.selectOrder = data
        console.log('orderTypeValue', this.selectOrder)
        this.initData()
        console.log('this.sortActive', this.sortActive)
      });
      this.Bus.$on(this.currencyValue, (data) => { // 币种筛选
        data.length ? this.selectCurrency = data.join(',') : this.selectCurrency = data
        this.initData()
        console.log('currencyValue', data)
        console.log('selectCurrency', this.selectCurrency)
      });
      this.Bus.$on(this.allStatusValue, (data) => { // 类型筛选
        data.length ? this.selectState = data.join(',') : this.selectState = data
        this.initData()
        console.log('selectState', this.selectState)
      });
      // 监听搜索框title值
      this.Bus.$on(this.searchValue,(data) => {
        this.title = data
        console.log('searchValue', data)
      });
      // 监听搜索框值
      this.Bus.$on('changeInputContent', ({type, data}) => {
        console.log(this.type, type)
        if (type == 'order_id') {
          this.orderId = data
        } else if (type == 'order_tradecode') {
          this.tradeCode = data
        } else{
          this.trader = data
        }
        this.initData()
      })
      // 模糊搜索
      this.Bus.$on(this.searchResult,({type, data}) => {
        this.result = []
        this.WsProxy.send('otc',`fuzzy_search_${type}`,{ // 请求数据
          keyword: data
        }).then((data)=>{
          data.results.forEach(v => {
            this.result.push(v.Result)
          })
        }).catch((msg)=>{
          console.log(msg);
        });
        console.log('searchResult', data)
      });
      // this.Bus.$on('offTime', data => this.showTime = data);
      // 时间框开始值
      this.Bus.$on(this.startValue, (data) => {
        this.startValueDate = new Date(data).getTime()
        console.log('this.startValue', this.startValueDate)
      });
      // 时间框结束值
      this.Bus.$on(this.endValue, (data) => {
        this.endValueDate = new Date(data).getTime()
        console.log('this.endValue', this.endValueDate)
        this.initData()
      });
    },
    destroyed() {
      this.Bus.$off(this.orderTypeValue);
      this.Bus.$off(this.currencyValue);
      this.Bus.$off(this.allStatusValue);
      this.Bus.$off(this.searchValue);
      this.Bus.$off(this.startValue);
      this.Bus.$off(this.endValue);
    },
    methods: {
      initData() {
        let ws = this.WebSocket; // 创建websocket连接
        let seq = ws.seq;

        ws.onMessage[seq] = { // 监听
          callback: (data) => {
            if(!data || data.body.ret !== 0) return;
            console.log('order', data.body.data.orders)
            this.contentList = data.body.data.orders
            // 购买成功的订单显示弹窗
            if (this.$store.state.newOrder) {
              this.updateTradeCode = this.contentList[0].trade_code
              this.showPayment = true
            }
            // 根据状态进行判断
            this.contentList && this.contentList.forEach(v => {
              // 倒计时数据
              if (v.state == 1) {
                // limit - (now - create) 秒 2018-04-23 16:12:04  1524471124000 1524471379606
                this.endTime = (v.limit - (Math.floor(new Date().getTime() / 1000) - v.create * 1) / 60) * 60000
                // console.log('this.endTime', this.endTime)
              }
              // 状态数组
              let stateListObject = {
                1: [{name: '待付款', flag: 3}],
                2: [{name: '待付款'}, {name: '待放币', flag: 3}],
                3: [{name: '待付款'}, {name: '待放币'}, {name: '申述中', flag: 1}],
                4: [{name: '待付款'}, {name: '失败', flag: 1}, {name: '取消'}],
                5: [{name: '待付款'}, {name: '失败', flag: 1}, {name: '超时'}],
                6: [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}],
                7: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}, {name: '已评价'}] : [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}],
                8: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}] : [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}, {name: '已评价'}],
                9: [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}, {name: '已评价'}],
                10: [{name: '待付款'}, {name: '待放币'}, {name: '完成', flag: 2}, {name: '强制放币'}],
                11: [{name: '待付款'}, {name: '待放币'}, {name: '失败', flag: 1}, {name: '终止'}]
              }
              v.stateList = stateListObject[v.state]
              // 操作数组
              let operationListObject = {
                1: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '标记已付款', flag: 3}, {name: '取消订单', flag: 4}] : [{name: '提醒付款', flag: 5}],
                2: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '提醒放币', flag: 6}, {name: '申述', flag: 7}] : [{name: '释放币', flag: 8}, {name: '申述', flag: 7}],
                3: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '提醒放币', flag: 6}, {name: '撤销申述', flag: 9}] : [{name: '释放币', flag: 8}, {name: '撤销申述', flag: 9}],
                6: [{name: '去评价', flag: 1}],
                7: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '查看评价', flag: 2}] : [{name: '去评价', flag: 1}],
                8: this.JsonBig.stringify(v.buyer) == this.userId ? [{name: '去评价', flag: 1}] : [{name: '查看评价', flag: 2}],
                9: [{name: '查看评价', flag: 2}]
              }
              v.operationList = operationListObject[v.state]
            })
          },
          date:new Date()
        };

        ws.send(sendConfig('otc', { // 发包
          seq: seq,
          body:{
            "action": "orders",
            data: {
              "type": this.selectOrder, // 1 买; 2 卖; 3 全部  <-state=0
              "state": this.selectState, // 订单状态
              "origin": this.page, // 分页
              "date": this.dateSort,// 时间排序 1降序 2升序
              "price": this.price,// 单价排序 1降序 2升序
              "amount": this.amount,// 电子币数量排序 1降序 2升序
              "money": this.money,// 法币金额排序 1降序 2升序
              "currency": this.selectCurrency,// 币种筛选
              "start": Math.floor(Number(this.startValueDate) / 1000), // 开始时间
              "end": Math.floor(Number(this.endValueDate) / 1000),// 结束时间
              "order_id": this.orderId,
              "trade_code": this.tradeCode,
              "trader": this.trader
            }
          }
        }))
      },
      getCompleteData() {
        let ws = this.WebSocket; // 创建websocket连接
        ws.onMessage['upd_ord'] = { // 完成状态的action
          callback: (data) => {
            if(!data || data.body.ret !== 0) return;
            console.log('我完成了', data.body.data)
          },
        };
      },
      getInitNum() {
        // 获取进行中和已完成数量
        this.WsProxy.send('otc','get_orders_num',{
          type: 1 // 1: 进行中, 2: 已完成
        }).then((data)=>{
          console.log('num', data)
          this.conductNum = data.amount ? data.amount : 0
        }).catch((msg)=>{
          console.log(msg);
        });
        this.WsProxy.send('otc','get_orders_num',{
          type: 2 // 1: 进行中, 2: 已完成
        }).then((data)=>{
          console.log('num', data)
          this.completeNum = data.amount ? data.amount : 0
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      selectStatus(type) { // Tab切换
        this.contentTabIndex = type;
        this.clickUp = 20;
        this.clickDown = 20;

        // 获取用户id
        this.userId = this.JsonBig.stringify(this.$store.state.userInfo.uid)
        // console.log(this.userId)
        if (this.contentTabIndex === 1) {
          this.selectState = "1,2,3"
        }
        if (this.contentTabIndex === 2) {
          this.selectState = "4,5,6,7,8,9,10,11"
        }
        this.initData()
      },
      selectTime(index) { // 时间切换
        this.num = index;
        if (index === 0) {
          this.startValueDate = new Date().getTime() - (24 * 60 * 60 * 1000)
          this.endValueDate = new Date().getTime()
        }
        if (index === 1) {
          this.startValueDate = new Date().getTime() - (24 * 60 * 60 * 3 * 1000)
          this.endValueDate = new Date().getTime()
          // console.log('this.startValueDate', this.startValueDate, this.endValueDate)
        }
        if (index === 2) {
          this.startValueDate = new Date().getTime() - (24 * 60 * 60 * 7 * 1000)
          this.endValueDate = new Date().getTime()
        }
        this.initData()
      },
      showOperation(index) { // 去评价
        // console.log('this.contentList[index].operationList.flag', this.contentList[index].operationList.flag)
        if (this.contentList[index].operationList[0].flag == 1) { // 去评价
          this.$router.push({path: '/order/evaluate', query: {type: '0', data: this.contentList[index]}})
        }
        if (this.contentList[index].operationList[0].flag == 2) { // 查看评价
          this.$router.push({path: '/order/evaluate', query: {type: '1', data: this.contentList[index]}})
        }
      },
      openPayment(st, index) { // 控制标记已付款弹窗
        if (st === 'false') {
          this.showPayment = false
        } else {
          this.showPayment = true
          this.updateId = this.contentList[index].id
          this.updateInfo = this.contentList[index].info
          this.updateTradeCode = this.contentList[index].trade_code
        }
      },
      remindCoin(content) { // 提醒弹窗
        console.log('content', content)
        this.remindCoinLayer = true;
        this.WsProxy.send('otc','remind_order',{
          uid: content.sid,
          id: content.id,
          state: content.state,
          info: content.info
        }).then((data)=>{
          console.log('remind_order', data)
        }).catch((msg)=>{
          console.log(msg);
        });
        setTimeout(() => {
          this.remindCoinLayer = false
        }, 3000)
      },
      openReleaseCoin(st, content) { // 释放币弹窗
        console.log('content', content)
        // console.log(1111)
        if (st === 'false') {
          this.showReleaseCoin = false
        } else {
          this.showReleaseCoin = true
          this.updateId = content.id
          this.updateUid = content.sid
        }
      },
      openSelect(st, operation, index, content) { // 双选择公共弹窗
        if (st === 'false') {
          this.showSelect = false
        } else {
          this.showType = operation.flag;
          console.log('this.showType', this.showType)
          switch (operation.flag) {
            case 4: // 取消订单弹窗
              this.selectContent = '确定取消订单？'; // 内容
              this.selectLeft = '取消'; // 左边内容
              this.selectRight = '确定'; // 右边内容
              this.updateId = this.contentList[index].id;
              break;
            case 7: // 买家申请弹窗
              this.selectContent = this.JsonBig.stringify(content.buyer) === this.userId ? '请先与对方联系，核实对方是否放币' : '请先与对方联系，核实对方是否付款'; // 内容
              this.selectLeft = '申述'; // 左边内容
              this.selectRight = '联系对方'; // 右边内容
              this.updateId = this.contentList[index].id;
              this.updateInfo = this.contentList[index].info;
              break;
            case 9: // 撤销订单弹窗
              this.selectContent = '确定撤销申述？'
              this.selectLeft = '取消'; // 左边内容
              this.selectRight = '确定'; // 右边内容
              this.updateId = this.contentList[index].id;
              this.updateInfo = this.contentList[index].info;
          }
          this.showSelect = true
        }
      },
      toSort(title, index) { // 排序操作
        this.clickUp = index;
        this.clickDown = index;
        this.sortActive = this.sortFlag === index ? !this.sortActive : true;
        this.dateSort = title.flag === 0 ? (this.sortActive ?  2 : 1) : 0;
        this.price = title.flag === 4 ? (this.sortActive ? 2 : 1) : 0;
        this.amount = title.flag === 5 ? (this.sortActive ? 2 : 1) : 0;
        this.money = title.flag === 6 ? (this.sortActive ? 2 : 1) : 0;
        this.sortFlag = title.flag;
        this.initData()
      },
      // 分页操作
      clickPre() {
        this.page <= 0 ? this.page = 0 : this.page--;
        this.initData()
        console.log(111, this.page)
      },
      clickNext() {
        this.page++;
        this.initData()
        console.log(222, this.page)
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
      height 50px
      padding 0 30px
      background #FFF
      .order-choice-search
        float left
        margin-right 0
        margin-top 10px
      .order-choice-time
        float right
        margin-top 10px
        .date-group
          float left
          margin-right 20px
        li
          float left
        ol
          line-height 30px
          margin-right 22px
          li:nth-child(2)
            margin 0 10px
        ul
          float left
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
        /*img*/
          /*width 16px*/
          /*height 16px*/
          /*margin 8px 10px 0 0*/

    .order-content
      margin-bottom 44px
      li
        width 110px
        font-size $fz13
      li:nth-child(1)
        width 130px
      li:nth-child(4)
        width: 140px
      li:nth-child(8)
        width 90px
      ol
        margin 20px 0
        padding 0 30px
        li
          float left
          color #999

      .sort
        cursor pointer

        span
          position relative
          i.before
            position absolute
            top 3px
            right -19px
            triangle_up($col999)

          i.after
            position absolute
            top 10px
            right -19px
            triangle_down($col999)

      .sort-up
        span
          i.before
            border-bottom-color $col422
      .sort-down
        span
          i.after
            border-top-color $col422

      .order-content-info
        padding 18px 30px
        border 1px solid #E1E1E1
        background #FFF
        margin-bottom 10px
        ul
          padding-bottom 10px
          border-bottom 1px solid #E1E1E1
          .state-li
            p
              color #999
            .text-r
              color #ff794c
            .text-g
              color #57a100
            .text-b
              color #333
              cursor pointer

          .operation-li
            p
              color #FFB422
              cursor pointer
            .active-btn
              display inline-block
              width 100px
              height 25px
              text-align center
              line-height 25px
              color #FFF
              background: #FFB422
              border-radius: 2px
              cursor pointer
            .text-b
              color #333
              cursor pointer


          li
            float left
            p
              margin-bottom 10px
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



          .text-g
            color $col100
          .text-r
            color #FF794C
        .order-content-extre
          padding-top 17px
          font-size 13px
          color #999
          span
            float left
          span:nth-child(1)
            margin-right 30px
          .reset-time
            float right


  /*弹窗部分*/
  .remind-coin-layer
    text-align center
    line-height 94px

  /*分页部分*/
  .page-btn
    width 300px
    margin 0 auto
    text-align center
    button
      width 80px
      height 40px
      background #FFB422
      color #FFF
      cursor pointer
    button:first-child
      margin-right 100px
    .unable-btn
      background #999


</style>
