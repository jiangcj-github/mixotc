<template>
  <div class="evaluate-wrap">
    <div class="evaluate-rate clearfix">
      <ul>
        <li v-for="item in rateOriginList">{{item}}</li>
      </ul>
      <ol>
        <li v-for="(content, index) in rateList">
          <p class="clearfix" :style="{width: `calc(100 * ${content}px`}">
            <img src="/static/images/personal/evaluate_white.png" alt="" v-for="index in Math.floor(content)">
            <span>{{content <= 2 ? '差评：' : (content >= 4 ? '好评：' : '中评：')}}{{content}}分</span>
          </p>
        </li>
      </ol>
    </div>
    <div class="evaluate-main">
      <div class="evaluate-search clearfix">
        <p>
          <input type="text" placeholder="请输入订单号" v-model.trim="inputValue"><button></button>
        </p>
        <ChoiceBox class="rate-search"
                   :choiceClass="evaluateB"
                   :width=120
                   title="评价"
                   :top=29
                   :widthSelect=145
                   :classify="evaluateType">
        </ChoiceBox>
        <DateInterval class="date-search"></DateInterval>
      </div>
      <ul class="clearfix">
        <li v-for="(content, index) in contentList" :class="{'active-tab': index == tabIndex}" @click="contentTab(index)">{{content}}</li>
      </ul>
    </div>
    <div class="evaluate-content">
      <table>
        <thead>
          <div class="add-color-left"></div>
          <tr class="clearfix">
            <td v-for="title in evaluatTitleList" :class="{sort: title.canSort}">
              <span >
                {{title.content}}
                <i class="before" v-if="title.sortTab"></i>
                <i class="after" v-if="title.sortTab"></i>
              </span>
              <!--:emitValue="evaTypeValue"-->
              <!--:selectValue="evaTypeValueData"-->
              <ChoiceBox
                v-if="title.evaTypeShow"
                :classify="evaType"
                title="评价内容">
              </ChoiceBox>
            </td>
          </tr>
          <div class="add-color-right"></div>
        </thead>
        <tbody>
        <tr>
          <td>
            <img src="/static/images/evaluate_red.png" alt=""/>
            <img src="/static/images/evaluate_red.png" alt=""/>
            <img src="/static/images/evaluate_red.png" alt=""/>
            <img src="/static/images/evaluate_red.png" alt=""/>
            <p>5分好评</p>
          </td>
          <td>
            <p>评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容评价内容</p>
            <span>2018-04-14 15:11:18</span>
            <i>订单号：123456789098765432</i>
          </td>
          <td>
            <img src="/static/images/evaluate_red.png" alt=""/>
            <b>李小鹏</b>
          </td>
          <td>
            <p>234 CNY购买</p>
            <i>+0.00001234 BTC</i>
          </td>
          <td v-if="tabIndex == 1 || tabIndex == 3">
            <em @click="openDel">删除</em>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <DelLayer :delShow="showDel"
              @offDel="openDel"></DelLayer>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import DateInterval from '@/components/common/DateInterval' // 引入日历
  import DelLayer from "@/views/personalCenter/children/evaluate/EvaluateLayer" // 引入删除弹窗

  export default {
    name: "evaluate",
    data() {
      return {
        rateOriginList: ['来自交易对方的评价', '给交易对方的评价', '来自担保对方的评价', '给担保对方的评价'],
        rateList: [2.5, 1, 3, 4],
        inputValue: '',
        evaluateType: ['全部评价', '好评(3分以上)', '中评(3分)', '差评(1以上，3分以下)'],
        evaluateB: 'evaluateB', // 选择子组件合适样式
        contentList: ['来自交易对方的评价', '给交易对方的评价', '来自担保对方的评价', '给担保对方的评价'],
        tabIndex: 0,
        evaluatTitleList: [
          {content: '评分', canSort: true, sortTab: true},
          {evaTypeShow: true},
          {content: '对方'},
          {content: '订单信息', canSort: true, sortTab: true}
        ],
        evaType: ['全部内容', '有评价', '无评价'],
        showDel: false
      }
    },
    components: {
      ChoiceBox,
      DateInterval,
      DelLayer
    },
    methods: {
      contentTab(index) {
        this.tabIndex = index
        if (this.evaluatTitleList.length === 4 && (this.tabIndex == 1 || this.tabIndex == 3)) {
          this.evaluatTitleList.push({content: '操作'})
        }
        if (this.evaluatTitleList.length === 5 && (this.tabIndex == 0 || this.tabIndex == 2)) {
          this.evaluatTitleList.pop()
        }
      },
      openDel(st) {
        if (st === 'false') {
          this.showDel = false
        } else {
          this.showDel = true
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base";
  .evaluate-wrap
    box-sizing()
    width 1000px
    .evaluate-rate
      box-sizing()
      height 280px
      padding 30px 0 30px 30px
      margin-bottom 20px
      background #FFF
      li
        height 25px
        margin-bottom 40px
        li:last-child
          margin-bottom 0
      ul
        float left
        width 177px
        li
          line-height 25px
          font-size 13px
          color #333
      ol
        float left
        width 500px
        li
          background #F4F6FA
          border-radius 32px
          p
            box-sizing()
            height 25px
            padding 4px 10px 0 10px
            background linear-gradient(90deg, #FFB422 0%, #FF794C 100%)
            border-radius 32px
            img
              float left
              width 14px
              height 12px
              margin-top 3px
              margin-right 5px
            span
              float right
              font-size 12px
              color #FFF
    .evaluate-main
      box-sizing()
      padding 10px 30px 0
      height 110px
      background #FFF
      border-bottom 1px solid #E1E1E1
      .evaluate-search
        padding-bottom 10px
        p
          float left
          width 456px
          height 28px
          border 1px solid #E1E1E1
          border-radius 2px
          margin-right 80px
          input
            width 374px
            height 28px
            padding-left 10px
            vertical-align top
          button
            width 72px
            height 28px
            background url("/static/images/search_icon.png")  #E1E1E1 no-repeat 27px 7px
            background-size 16px 16px
        .rate-search
          float left
          margin-right 40px
        .date-search
          float left
      ul
        li
          float left
          padding 18px 15px
          margin-right 10px
          font-size 16px
          color #999
          letter-spacing 0.33px
          cursor pointer
        .active-tab
          color #FFB422
          border-bottom 2px solid #FFB422
    .evaluate-content
      box-sizing()
      position relative
      width 1000px
      background #FFF
      padding 0 30px
      table
        width 940px
        thead
          background #F4F6FA
          .add-color-left, .add-color-right
            position absolute
            top 0
            left 0
            width 30px
            height 55px
            background #F4F6FA
          .add-color-right
            left 970px
          td
            padding 20px 0 18px
            font-size 13px
            color #999
            letter-spacing 0.27px
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

          td:first-child
            padding-left 10px
        tbody
          tr
            border-bottom 1px solid #E1E1E1
          td
            padding 15px 0 11px
            font-size 13px
            letter-spacing 0.27px
          td:nth-child(1)
            img
              width 16px
              height 14px
              margin-bottom 5px
          td:nth-child(2)
            max-width 180px
            padding-right 40px
            p
              margin-bottom 5px
              line-height 16px
            span
              font-size 12px
              color #999
              margin-right 20px
            i
              font-size 12px
              color #999
          td:nth-child(3)
            img
              width 37px
              height 37px
              border-radius 50%
              margin-right 5px
              vertical-align middle
          td:nth-child(4)
            p
              margin-bottom 5px
          td:nth-child(5)
            em
              color #FFB422
              cursor pointer

</style>
