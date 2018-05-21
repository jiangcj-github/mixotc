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
            <th v-for="(title, index) in titleList" :class="{sort: title.canSort}">
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
                :emitValue="currencyValue">
              </ChoiceBox>
              <ChoiceBox
                v-if="title.statusShow"
                title="模式"
                :classify="statusType"
                :emitValue="allStatusValue">
              </ChoiceBox>
              <ChoiceBox
                v-if="title.payShow"
                title="支付方式"
                :classify="payType"
                :emitValue="payValue">
              </ChoiceBox>
            </th>
          </tr>
        </thead>
        <!--表格内容-->
        <tbody>
          <tr>
            <td>
              <p class="frist-p">2016/3/09</p>
              <p>13:43</p>
            </td>
            <td>购买</td>
            <td>BTC</td>
            <td>固定</td>
            <td class="offer-td">
              <p class="frist-p">90%</p>
              <p>1234.00</p>
            </td>
            <td>200.00~10000.00</td>
            <td>支付方式</td>
            <td>30min</td>
            <td>1.123456</td>
            <td>1.123456</td>
            <td>1.123456</td>
            <td class="operation-td">
              <p class="frist-p"><router-link to="/advertisement/release">编辑</router-link></p>
              <p @click="contentTabIndex === 1 && openUnder()">{{contentTabIndex === 1 ? '下架': '上架'}}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 订单无内容 -->
    <!--<MyOrderNothing v-if="!contentList.length"></MyOrderNothing>-->
    <!-- 分页 -->
    <Pagination  v-if="contentList && contentList.length"
                 :total="pageTotal"
                 :pageSize="15"
                 :curPage="curPage">
    </Pagination >
    <!-- 确定下架弹窗 -->
    <UndercarriageLayer :underShow="showUnder"
                        @offUnder="openUnder">
    </UndercarriageLayer>

  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import DateInterval from '@/components/common/DateInterval' // 引入日历
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import MyOrderNothing from '@/views/myOrder/MyOrderNothing' // 引入无订单页面
  import Pagination from "@/views/verify/component/Pagination" // 引入分页
  import UndercarriageLayer from "@/views/advertisement/child/UndercarriageLayer" // 引入分页

  export default {
    name: "myAd",
    components: {
      ChoiceBox,
      Pagination,
      DateInterval,
      BasePopup,
      MyOrderNothing,
      UndercarriageLayer
    },
    data() {
      return {
        sortFlag: "", // 控制排序箭头每次朝上

        titleList:[
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
        ], // 表格表头内容

        contentTabIndex: 1, // 控制tab切换

        startValueDate: null,
        endValueDate: null,

        timeList: ['今天', '三天', '七天'], // 时间Tab切换title

        adType: ['全部类型', '购买', '出售'], // 类型下拉显示
        adTypeValue: 'adTypeValue', // 传递给子组件
        adTypeValueData: [3, 1, 2],

        currencyValue: 'currencyValue', // 传递给子组件
        currencyType:['全部币种', 'BTC', 'ETH'],// 币种下拉显示

        allStatusValue: 'allStatusValue',
        statusType: ['全部模式', '固定', '溢价'],

        payValue: '',
        payType: ['全部支付方式', '支付宝', '微信', '银行卡'],

        contentList: [], // 表格内容数组
        dateSort: 0,// 时间排序 1降序 2升序
        price: 0,// 单价排序 1降序 2升序
        amount: 0,// 电子币数量排序 1降序 2升序
        money: 0,// 法币金额排序 1降序 2升序

        conductNum: 0, // 进行数量
        completeNum: 0, // 完成数量

        // pageTotal: 0, // 分页总数
        // curPage: 1, // 当前页

        showUnder: false // 下架弹窗

      }
    },
    created() {

    },
    mounted() {
      // 监听下拉框值，将值传给子组件
      this.Bus.$on(this.orderTypeValue, (data) => { // 类型筛选

      });
      this.Bus.$on(this.currencyValue, (data) => { // 币种筛选

      });
      this.Bus.$on(this.allStatusValue, (data) => { // 类型筛选

      });
      this.Bus.$on(this.payValue, (data) => { // 币种筛选

      });

      // 时间框值
      this.Bus.$on('onDiChange', () => {
        this.startValueDate = this.$refs.di.date1 ? Math.floor(new Date(this.$refs.di.date1).getTime() / 1000) : null;
        this.endValueDate = this.$refs.di.date2 ? Math.floor(new Date(this.$refs.di.date2).getTime() / 1000) : null;
        // if (this.startValueDate && this.endValueDate) {
        //   this.initData()
        // }
      });

      // this.Bus.$on('onPageChange', data => {
      //   this.curPage = data;
      // });
    },
    destroyed() {
      this.Bus.$off(this.orderTypeValue);
      this.Bus.$off(this.currencyValue);
      this.Bus.$off(this.allStatusValue);
      this.Bus.$off('onDiChange');
      // this.Bus.$off(this.searchValue);
      // this.Bus.$off('changeInputContent');
      // this.Bus.$off('onPageChange');
    },
    methods: {
      // getInitNum() {
      //   // 获取进行中和已完成数量
      //   this.WsProxy.send('otc','get_orders_num',{
      //     type: 1 // 1: 进行中, 2: 已完成
      //   }).then((data)=>{
      //     console.log('num', data)
      //     this.conductNum = data.amount ? data.amount : 0
      //   }).catch((msg)=>{
      //     console.log(msg);
      //   });
      //   this.WsProxy.send('otc','get_orders_num',{
      //     type: 2 // 1: 进行中, 2: 已完成
      //   }).then((data)=>{
      //     console.log('num', data)
      //     this.completeNum = data.amount ? data.amount : 0
      //   }).catch((msg)=>{
      //     console.log(msg);
      //   });
      // },
      selectStatus(type) { // Tab切换
        this.contentTabIndex = type;
      },
      openUnder(st) {
        if (st === 'false') {
          this.showUnder = false
        } else {
          this.showUnder = true
        }
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
              a
                color #FFA21C
            p:last-child
              cursor pointer

</style>
