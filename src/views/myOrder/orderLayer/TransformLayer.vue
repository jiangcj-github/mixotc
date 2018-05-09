<template>
  <BasePopup :show="codeLayer"
             :width=600
             :height=516
             :top=50>
    <div  class="transform-layer">
      <img class="close-btn" src="/static/images/close_btn.png" alt="" @click="closePopup">
      <h2>资金互转</h2>
      <ul>
        <li>
          <p>币种</p>
          <ChoiceBox :choiceClass="transforB"
                     title="BTC"
                     :classify="coinType"
                     :emitValue="coinTypeValue"
                     :width=470
                     :widthSelect=478
                     :top=40
                     :widthWrap=480>
          </ChoiceBox>
        </li>
        <li>
          <ol>
            <li>
              <p>从</p>
              <ChoiceBox :choiceClass="transforB"
                         title="法币账户"
                         :classify="fromType"
                         :emitValue="fromTypeValue"
                         :width=210
                         :top=40
                         :widthSelect=218
                         :widthWrap=220>
              </ChoiceBox>
              <span>({{fromText}}余额为：1.12345678 BTC)</span>
            </li>
            <li>
              <img src="/static/images/huansuan.png"/>
            </li>
            <li>
              <p>转至</p>
              <ChoiceBox :choiceClass="transforB"
                         title="币币账户"
                         :classify="toType"
                         :emitValue="toTypeValue"
                         :width=210
                         :top=40
                         :widthSelect=218
                         :widthWrap=220>
              </ChoiceBox>
              <span>({{toText}}余额为：1.12345678 BTC)</span>
            </li>
          </ol>
        </li>
        <li>
          <p>数量</p>
          <div><input type="text" v-model.trim="amount"/><button>全部</button></div>
          <b v-show="amount">数量应不大于可划转数量</b>
        </li>
      </ul>
      <div class="btn-group">
        <i @click="closePopup">取消</i>
        <em>立即划转</em>
      </div>
    </div>
  </BasePopup>
</template>

<script>
  import BasePopup from '@/components/common/BasePopup' // 引入弹窗
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框

  export default {
    name: "transform-layer",
    props: ['transformShow'],
    data() {
      return {
        codeLayer: this.transformShow,
        transforB: 'transforB',
        coinType: ['BTC', 'ETH'],
        fromType: ['法币账户', '币币账户'],
        toType: ['法币账户', '币币账户'],
        coinTypeValue: 'coinTypeValue',
        fromTypeValue: 'fromTypeValue',
        toTypeValue: 'toTypeValue',
        fromText: '法币账户',
        toText: '币币账户',
        amount: ''
      }
    },
    components: {
      BasePopup,
      ChoiceBox
    },
    watch: {
      transformShow(state) {
        this.codeLayer = state === true ?  true : false
      }
    },
    mounted() {
      this.Bus.$on(this.coinTypeValue, (data) => { // 币种筛选

      });
      this.Bus.$on(this.fromTypeValue, (data) => { // from筛选
        this.fromText = data
      });
      this.Bus.$on(this.toTypeValue, (data) => { // to筛选
        this.toText = data
      });
    },
    methods: {
      closePopup() {
        this.$emit('offTransform', 'false')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl"
  .transform-layer
    padding 0 60px
    .close-btn
      width 12px
      height 12px
      margin-top 10.6px
      margin-left 516.6px
      cursor pointer
    h2
      font-size $fz20
      font-weight bold
      letter-spacing 0.41px
      color $col333
      margin 30px 0
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
    ul
      li:last-child
        position relative
        b
          display inline-block
          margin-top 10px
          position absolute
          font-size 11px
          color #FF794C
          letter-spacing 0.23px
      >li
        margin-bottom 30px
        /*input*/
          /*width 470px*/
          /*height 40px*/
          /*background #F4F6FA*/
          /*border-radius 2px*/
          /*padding-left 10px*/
        p
          font-size 14px
          letter-spacing 0.29px
          margin-bottom 10px
        div
          input
            width 400px
            height 40px
            padding-left 10px
            background #F4F6FA
            border-radius 2px 0 0 2px
          button
            width 70px
            height 40px
            color #FFF
            background #FFB422
            border-radius 0 2px 2px 0
            cursor pointer
      ol
        display flex
        align-items center
        li
          span
            display block
            margin-top 7px
            font-size 12px
            text-align right
            letter-spacing 0.12px
          img
            width 16.3px
            height 12.9px
            margin 15px 12px 0
    .btn-group
      text-align center
      i,em
        display inline-block
        width 160px
        height 40px
        margin-top 20px
        line-height 40px
        text-align center
        cursor pointer
      i
        color #FFB422
        background #FFF
        border 1px solid #FFB422
        border-radius 2px
        margin-right 30px
      em
        color #FFF
        background #FFB422
        border-radius 2px



</style>
