<template>
  <div class="release-ad-wrap">
    <p class="title"></p>
    <div class="inner release-ad-box clearfix">
      <ul>
        <li class="buy-ad" @click="selectAd(1)" :class="{active: adTabIndex === 1}">购买广告</li>
        <li class="sale-ad" @click="selectAd(2)" :class="{active: adTabIndex === 2}">出售广告</li>
      </ul>
      <div class="release-ad-content">
        <ol>
          <li>
            <p>选择币种</p>
            <ChoiceBox></ChoiceBox>
          </li>
          <li>
            <p>货币</p>
            <span></span>
            <SliderBar
              :min="-99"
              :max="99">
            </SliderBar>
          </li>
          <li>
            <p>收款方式</p>
            <SliderBar></SliderBar>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
  import ChoiceBox from '@/components/common/ChoiceBox' // 引入下拉选择框
  import SliderBar from '@/components/common/SliderBar' // 引入日历

  export default {
    name: "releaseAd",
    data() {
      return {
        adTabIndex: 1, // 控制tab切换
      }
    },
    components: {
      ChoiceBox,
      SliderBar
    },
    methods: {
      selectAd(type) { // Tab切换
        this.adTabIndex = type
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .release-ad-wrap
    .title
      width 100%
      height 40px
      margin-bottom 20px
      background #FFF3EB
    .release-ad-box
      ul
        float left
        width 180px
        background #FFF
        li
          height 60px
          padding-left 30px
          line-height 60px
          &.active
            background #FFF3EB
            border-bottom 2px solid #FFB422
        .buy-ad
          position relative
          &:after
            position absolute
            top 20px
            right 20px
            width 20px
            height 20px
            content ''
            background url(/static/images/buy_ad.png) no-repeat
            background-size 20px 20px
        .sale-ad
          position relative
          &:after
            position absolute
            top 20px
            right 20px
            width 20px
            height 20px
            content ''
            background url(/static/images/sale_ad.png) no-repeat
            background-size 20px 20px
    .release-ad-content
      float right
      width 940px
      height 1000px
      padding 0 30px
      background #FFF
</style>
