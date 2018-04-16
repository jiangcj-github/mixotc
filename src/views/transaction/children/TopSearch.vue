<template>
  <div class="header clearfix">
    <h2>购买{{currency}}</h2>
    <SearchInput class="search" :content="content" :result="result" :title="title" :emitValue1="emitValue1" :emitValue3="emitValue3"></SearchInput>
    <ul class="top5 clearfix">
      <li v-for="(item, index) of topList"
          :key="index" :class="{tuijian: index < 3}"
          :style="{backgroundColor: topListColor[index]}"
          @click="changeCurrency(item)"
      >
      {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
import SearchInput from '@/components/common/SearchInput'
export default {
  props: {
    topList: {
      type: Array,
      default: ['ETH', 'BTC', 'ADA', 'BAT', 'ETH']
    },
    emitValue: {
      type: String,
      default: 'changeCurrency'
    }
  },
  components: {
    SearchInput
  },
  data() {
    return {
      currency: 'BTC',
      content: [{title: '币种', type: 'currency'},{title: '商家昵称/账号', type: 'user'}],
      title: '搜索更多币种',
      emitValue1: 'changeTitle',
      emitValue3: 'searchValue',
      topListColor: ['#FF914C', '#FFB422', '#FFCE16', '#FFF', '#FFF'],
      result: ['99','26']
    }
  },
  methods: {
    changeCurrency(currency) {
      this.Bus.$emit(this.emitValue, currency)
      this.currency = currency
    }
  },
  mounted() {
    this.Bus.$on(this.emitValue1, data => {
      this.title = data
    })
    this.Bus.$on('changeInputContent', ({type, data}) => {
      if (type === 'currency') {
        data === '' && (data = 'btc')
        this.currency = data.toUpperCase()
      }
    })
    this.Bus.$on(this.emitValue3, data => {
      // 输入时，根据输入内容拉取数据，结果替换result
    })
  },
  destroyed() {
    this.Bus.$off(this.emitValue1);
    this.Bus.$off(this.emitValue3);
  }
};
</script>

<style scoped lang="stylus">
@import "../../../stylus/base.styl";
    .header
      margin-bottom 50px
      h2
        float left
        width 129px
        height 30px
        // margin-right 40px
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
          &.tuijian
            color #FFF
          &.tuijian::before
            position absolute
            left 10px
            top 10px
            content ''
            width 6px
            height 9px
            background url('/static/images/recommend_.png') no-repeat
          &:hover
            box-shadow none
</style>
