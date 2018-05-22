<template>
  <div class="my-ad-wrap inner">
    <h1>
      <router-link to="/transaction">mixOTC</router-link> -
      <router-link to="/advertisement">我的广告</router-link>
    </h1>
    <div class="ad-item clearfix">
      <span @click="selectStatus(1)" :class="{'content-btn-active': contentTabIndex === 1}">进行中({{conductNum}})</span>
      <span @click="selectStatus(2)" :class="{'content-btn-active': contentTabIndex === 2}">已下架({{completeNum}})</span>
    </div>

    <div class="ad-choice-time clearfix" v-if="contentTabIndex === 2">
      <ul class="clearfix">
        <li v-for="(item, index) in timeList" @click="selectTime(index)">{{item}}</li>
      </ul>
      <DateInterval class="date-group" :max="Date.parse(new Date())" ref="di"></DateInterval>
    </div>

    <div class="ad-content">
      <table>
        <!-- 表格表头 -->
        <thead>
          <tr>
            <th v-for="(title, index) in titleList"
                :class="{sort: title.canSort, 'sort-up': clickUp === index && sortActive, 'sort-down': clickUp === index && !sortActive}"
                @click="title.canSort && toSort(title, index)">
              <p>
                <span>
                  {{title.content}}
                  <i class="before" v-if="title.sortTab"></i>
                  <i class="after" v-if="title.sortTab"></i>
                </span>
                <b>{{title.mark}}</b>
              </p>
              <ChoiceBox
                v-if="title.adTypeShow"
                :classify="adType"
                title="类型"
                :emitValue="adTypeValue"
                :selectValue="adTypeValueData">
              </ChoiceBox>
              <ChoiceBox
                v-if="title.currencyShow"
                :classify="currencyType"
                title="币种"
                :emitValue="currencyValue"
                :selectValue="currencyValueData">
              </ChoiceBox>
              <ChoiceBox
                v-if="title.statusShow"
                title="模式"
                :classify="statusType"
                :emitValue="statusValue"
                :selectValue="statusValueData">
              </ChoiceBox>
              <ChoiceBox
                v-if="title.payShow"
                title="支付方式"
                :classify="payType"
                :emitValue="payValue"
                :selectValue="payValueData">
              </ChoiceBox>
            </th>
          </tr>
        </thead>
        <!--表格内容-->
        <tbody>
          <tr v-for="(content, index) in saleList">
            <td>
              <p class="frist-p">{{content.update.toDate('yyyy/MM/dd')}}</p>
              <p>{{content.update.toDate('HH:ss')}}</p>
            </td>
            <td :class="content.type === 1 ? 'text-r' : 'text-g'">{{content.type === 1 ? '出售' : '购买'}}</td>
            <td>{{content.currency && content.currency.toUpperCase()}}</td>
            <td>{{content.mode === 1 ? '固定' : '溢价'}}</td>
            <td class="offer-td">
              <p class="frist-p" v-show="content.premium">{{content.premium}}</p>
              <p>{{content.price}}</p>
            </td>
            <td>{{content.min}}~{{content.max}}</td>
            <td>
              <img src="/static/images/OTC_zhifubao.png" alt="" v-if="[1, 3, 5, 7].includes(content.payments)">
              <img src="/static/images/OTC_wechat.png" alt="" v-if="[2, 3, 6, 7].includes(content.payments)">
              <img src="/static/images/OTC_Bankcard.png" alt="" v-if="[4, 5, 6, 7].includes(content.payments)">
            </td>
            <td>{{content.limit}}</td>
            <td>{{content.tradeable}}</td>
            <td>{{content.volume}}</td>
            <td>1.123456</td>
            <td class="operation-td">
              <p class="frist-p" @click="edit(content)">编辑</p>
              <p @click="contentTabIndex === 1 ? openUnder($event, content) : grounding(content)">{{contentTabIndex === 1 ? '下架': '上架'}}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
     <!--订单无内容-->
    <AdNothing v-if="!saleList.length"></AdNothing>
     <!--分页-->
    <Pagination  v-if="saleList.length"
                 :total="pageTotal"
                 :pageSize="20"
                 :curPage="curPage">
    </Pagination >
    <!-- 确定下架弹窗 -->
    <UndercarriageLayer :underShow="showUnder"
                        :id='layerAdId'
                        @offUnder="openUnder">
    </UndercarriageLayer>
    <!-- 弹窗 -->
    <BasePopup :show="adremindLayer"
               class="ad-remind-layer">
      <span v-clickoutside="closeLayer">{{errText}}</span>
    </BasePopup>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import DateInterval from '@/components/common/DateInterval' // 引入日历
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import AdNothing from '@/views/advertisement/child/AdNothing' // 引入无广告页面
  import Pagination from "@/views/verify/component/Pagination" // 引入分页
  import UndercarriageLayer from "@/views/advertisement/child/UndercarriageLayer" // 引入分页

  export default {
    name: "myAd",
    components: {
      ChoiceBox,
      Pagination,
      DateInterval,
      BasePopup,
      AdNothing,
      UndercarriageLayer
    },
    data() {
      return {
        titleList:[ // 表格表头内容
          {content: '更新时间', sortTab: true, canSort: true, flag: 0},
          {adTypeShow: true},
          {currencyShow: true},
          {statusShow: true},
          {content: '报价', mark: '(CNY)'},
          {content: '交易限额', mark: '(CNY)'},
          {payShow: true},
          {content: '订单期限', mark: '(min)', sortTab: true, canSort: true, flag: 7},
          {content: '可交易数量', sortTab: true, canSort: true, flag: 8},
          {content: '已成交数量', sortTab: true, canSort: true, flag: 9},
          {content: '平均成交价', mark: '(CNY)', sortTab: true, canSort: true, flag: 10},
          {content: '操作'}
        ],
        saleList: [], // 表格内容

        contentTabIndex: 1, // 控制tab切换

        startValueDate: null,
        endValueDate: null,

        timeList: ['今天', '三天', '七天'], // 时间Tab切换title

        adType: ['全部类型', '购买', '出售'], // 类型下拉显示
        adTypeValue: 'adTypeValue', // 传递给子组件
        adTypeValueData: [0, 2, 1],
        saleType: 0, // 选择购买类型

        currencyValue: 'currencyValue', // 传递给子组件
        currencyType: ['全部币种', 'BTC', 'ETH'],// 币种下拉显示
        currencyValueData: ['', 'btc', 'eth'],
        saleCoin: '',

        statusValue: 'statusValue',
        statusType: ['全部模式', '固定', '溢价'],
        statusValueData: [0, 1, 2],
        saleStatus: 0,

        payValue: '',
        payType: ['全部方式', '支付宝', '微信', '银行卡'],
        payValueData: [7, 1, 2, 4],
        salePay: 0,

        conductNum: 0, // 进行数量
        completeNum: 0, // 完成数量

        showUnder: false, // 下架弹窗
        layerAdId: '',
        myObj: {}, // 编辑内容

        clickUp: 20,
        sortActive: false, // 控制箭头开始无active
        sortFlag: 0, // 控制排序箭头每次朝上

        dateSort: 0,// 时间排序 1降序 2升序
        limitSort: 0,// 单价排序 1降序 2升序
        priceSort: 0,
        volumeSort: 0,//  1降序 2升序
        tradeableSort: 0,//  1降序 2升序

        pageTotal: 0, // 分页总数
        curPage: 1, // 当前页

        adremindLayer: false,
        errText: ''
      }
    },
    created() {
      this.initData()
      this.getInitNum()
    },
    mounted() {
      // 监听下拉框值，将值传给子组件
      this.Bus.$on(this.adTypeValue, (data) => { // 类型筛选
        this.saleType = data
        console.log('222', this.saleType)
        this.initData()
      });
      this.Bus.$on(this.currencyValue, (data) => { // 币种筛选
        this.saleCoin = data
        this.initData()
      });
      this.Bus.$on(this.statusValue, (data) => { // 类型筛选
        this.saleStatus = data
        this.initData()
      });
      this.Bus.$on(this.payValue, (data) => { // 支付筛选
        this.salePay = data
        this.initData()
      });

      // 时间框值
      this.Bus.$on('onDiChange', () => {
        this.startValueDate = this.$refs.di.date1 ? Math.floor(new Date(this.$refs.di.date1).getTime() / 1000) : null;
        this.endValueDate = this.$refs.di.date2 ? Math.floor(new Date(this.$refs.di.date2).getTime() / 1000) : null;
        if (this.startValueDate && this.endValueDate) {
          this.initData()
        }
      });
      this.Bus.$on('onPageChange', data => {
        this.curPage = data;
        this.initData()
      });
    },
    destroyed() {
      this.Bus.$off(this.adTypeValue);
      this.Bus.$off(this.currencyValue);
      this.Bus.$off(this.allStatusValue);
      this.Bus.$off('onDiChange');
      this.Bus.$off('onPageChange');
    },
    methods: {
      getInitNum() {
        // 获取进行中和已完成数量
        this.WsProxy.send('otc','get_sales_num',{
          "id": this.$store.state.userInfo.uid,
          "state": 1 // 1在架 2下架
        }).then((data)=>{
          this.conductNum = data.amount ? data.amount : 0
        }).catch((msg)=>{
          console.log(msg);
        });
        this.WsProxy.send('otc','get_sales_num',{
          "id": this.$store.state.userInfo.uid,
          "state": 2 // 1在架 2下架
        }).then((data)=>{
          this.completeNum = data.amount ? data.amount : 0
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      initData() {
        this.WsProxy.send('otc','my_sales',{
          "state": this.contentTabIndex, // 1在架 2下架
          "type":  this.saleType, // 1 出售 2 购买
          "currency": this.saleCoin,
          "price": 0, // 1降序 2升序
          "start": this.startValueDate,
          "end": this.endValueDate,
          "payment": this.salePay, // 1支付宝 2微信 4银行卡
          "date": this.dateSort, // 1降序 2升序
          "mode": this.saleStatus, // 是否可溢价 1固定价格 2溢价
          "volume": this.volumeSort, // 交易量排序 1降序 2升序
          "tradeable": this.tradeableSort, // 可交易量排序 1降序 2升序
          "limit": this.limitSort, // 付款期限排序 1降序 2升序
          "origin": this.curPage - 1, // 分页
          "count": 20
        }).then((data)=>{
          console.log('广告列表', data)
          this.saleList = data.sales ? data.sales : []
          this.pageTotal = data.amount
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      selectStatus(type) { // Tab切换
        this.contentTabIndex = type;
        this.initData()
      },
      openUnder(st, content) { // 下架
        if (st === 'false') {
          this.showUnder = false
        } else {
          this.showUnder = true
          this.layerAdId = content.id
        }
      },
      grounding(content) { // 上架
        this.WsProxy.send('otc','handle_sale',{
          "id": content.id,
          "online": 1 //1在售 2下架
        }).then((data)=>{
          console.log('上架', data)
          window.location.reload()
          // this.router.go(0)
        }).catch((msg)=>{
          console.log(msg);
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
          this.adremindLayer = true
        });
      },
      selectTime(index) { // 时间切换
        this.num = index;
        let date2 = new Date(new Date(new Date().toDateString()).getTime() + 24 * 60 * 60 * 1000);
        this.$refs.di.date2 = date2;
        if (index === 0) {
          this.$refs.di.date1 = new Date(date2.getTime() - (24 * 60 * 60 * 1000))
        }
        if (index === 1) {
          this.$refs.di.date1 = new Date(date2.getTime() - (24 * 60 * 60 * 3 * 1000))
        }
        if (index === 2) {
          this.$refs.di.date1 = new Date(date2.getTime() - (24 * 60 * 60 * 7 * 1000))
        }
      },
      edit(content) { // 编辑
        this.myObj= {
          "uid": '', // 用户id
          "currency": content.currency, // 电子货币
          "money": 'cny', // 法币
          "mode": content.mode, // 出售类型: 1 固定; 2 溢价
          "premium": content.premium, // 溢价
          "price": content.price, // 固定价格/最低价格
          "min": content.min, // 每笔交易的最小限额
          "max": content.max, // 每笔交易的最大限额
          "payment": content.payments, // 1支付宝;2微信;4银行卡
          "type": 2, // 1 出售; 2 购买
          "limit": content.limit, // 付款期限, 分钟
          "info": content.info, // 描述信息
          "vary": content.vary, // 余额随动标志 1 不随动 2 随动
          "tradeable": content.tradeable// 可交易量
        }
        if (content.type === 1) {
          this.$router.push({name:'releaseSale'})
          this.$store.commit({type: 'editSaleCon', data:{content: this.myObj, flag: 1 }})
        } else {
          this.$router.push({name:'releaseBuy'})
          this.$store.commit({type: 'editBuyCon', data:{content: this.myObj, flag: 2 }})
        }
      },
      toSort(title, index) { // 排序操作
        this.clickUp = index;
        this.sortActive = this.sortFlag === index ? !this.sortActive : true;
        this.dateSort = title.flag === 0 ? (this.sortActive ?  2 : 1) : 0;
        this.limitSort = title.flag === 7 ? (this.sortActive ? 2 : 1) : 0;
        this.tradeableSort = title.flag === 8 ? (this.sortActive ? 2 : 1) : 0;
        this.volumeSort = title.flag === 9 ? (this.sortActive ? 2 : 1) : 0;
        //this.money = title.flag === 10 ? (this.sortActive ? 2 : 1) : 0;
        this.sortFlag = title.flag;
        this.initData()
      },
      closeLayer() {
        this.adremindLayer = false
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .my-ad-wrap
    margin-top 11px
    margin-bottom 40px
    h1
      font-size 12px
      color #333
      letter-spacing 0.25px
      margin-bottom 20px

    .ad-item
      height 60px
      margin-bottom 1px
      padding 0 30px
      background #FFF
      line-height 60px
      font-size 16px
      cursor pointer
      span
        float left
        padding 0 15px
        color #999
        letter-spacing 0.33px
      span:first-child
        margin-right 30px
      .content-btn-active
        margin-top -2px
        color $col422
        border-bottom 2px solid $col422

    .ad-choice-time
      padding 10px 32px 10px 0
      background #FFF
      margin-bottom 10px

      .date-group
        float right
        margin-right 20px
      ul
        float right
        line-height 30px
        border 1px solid #FFF3EB
        border-radius 0 2px 2px 0
        li
          float left
          width 50px
          text-align center
          background #FFF3EB
          color #999
          cursor pointer
          &:hover
            background #FFF
            color #FFB422
        .time-active
          background #FFF
          color #FFB422

    .ad-content
      padding 30px 30px 0
      background #FFF
      table
        width 1140px
        tr
          border-bottom 1px solid #D8D8D8
        thead
          vertical-align top
          th
            padding-bottom 10px
            font-size 13px
            color #999
            letter-spacing 0.27px
            font-weight normal
            text-align left
            b
             display block
             color #999
            span
              color #999
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

          .sort
            cursor pointer

          .sort-up
            span
              i.before
                border-bottom-color $col422
          .sort-down
            span
              i.after
                border-top-color $col422
        tbody
          font-size 13px
          letter-spacing 0.27px
          .text-r
            color #ff794c
          .text-g
            color #57a100
          tr:last-child
            border-bottom none
          td
            padding 17px 0
            .frist-p
              margin-bottom 10px
          .offer-td
            p:first-child
              color #FF794C
            p:last-child
              font-size 16px
              color #57A100
              letter-spacing 0.33px
          .operation-td
            p:first-child
              cursor pointer
              color #FFA21C

            p:last-child
              cursor pointer

  .ad-remind-layer
    text-align center
    line-height 94px
    cursor pointer

</style>
