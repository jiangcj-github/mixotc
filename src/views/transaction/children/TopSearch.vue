<template>
  <div class="header clearfix">
    <h2>购买BTC</h2>
    <SearchInput class="search" :content="content" :title="title" :emitValue="emitValue" :buttonColor="buttonColor"></SearchInput>
    <ul class="top5 clearfix">
      <li class="tuijian" style="background-color:#FF914C;color:#FFF">ETH</li>
      <li class="tuijian" style="background-color:#FFB422;color:#FFF">BTC</li>
      <li class="tuijian" style="background-color:#FFCE16;color:#FFF">ADA</li>
      <li>BAT</li>
      <li>ETH</li>
    </ul>
  </div>
</template>

<script>
import SearchInput from '@/components/common/SearchInput'
export default {
  components: {
    SearchInput
  },
  data() {
    return {
      content: ['币种','商家昵称/账号'],
      title: '搜索更多币种',
      emitValue: 'changeTitle',
      buttonColor: '#FFB422'
    }
  },
  mounted() {
    this.Bus.$on(this.emitValue,(data) => {
      this.title = data
    })
  },
  destroyed() {
    this.Bus.$off(this.emitValue);
  }
};
</script>

<style scoped lang="stylus">
@import "../../../stylus/base.styl";
    .header
      margin-bottom 50px
      h2
        float left
        height 30px
        margin-right 40px
        line-height 30px
        letter-spacing 0.23px
        font-size $fz20
        font-weight bold
        color $col333
        &::before
          position relative
          top 2px
          left 0
          display inline-block
          content ''
          width 3px
          height 20px
          margin-right 10px
          background-color $col422
      .search
        float left
      .top5
        display inline-block
        li
          position relative
          float left
          width 80px
          height 30px
          margin-right 20px
          text-align center
          line-height 30px
          font-size 13px
          color $col422
          letter-spacing 0.15px
          background-color #FFF
          box-shadow 0 2px 4px 0 $col1E1
          border-radius 2px
          cursor pointer
          &:last-child
            margin-right 0
          &.tuijian::before
            position absolute
            left 10px
            top 10px
            content ''
            width 6px
            height 9px
            background url('/static/images/recommend_.png') no-repeat
</style>