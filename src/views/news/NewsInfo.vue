<template>
  <div class="news-info-wrap clearfix" v-show="this.$store.state.showChat">
    <NewsInfoLeft></NewsInfoLeft>
    <NewsInfoRight></NewsInfoRight>
  </div>
</template>

<script>
  import NewsInfoLeft from '@/views/news/children/NewsInfoLeft' // 添加群
  import NewsInfoRight from '@/views/news/children/NewsInfoRight' // 查看群

  export default {
    name: "news-info",
    props:['talkBoxShow'],
    data() {
      return {
        boxShow: this.talkBoxShow
      }
    },
    components: {
      NewsInfoLeft,
      NewsInfoRight
    },
    watch: {

    },
    methods: {

    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .news-info-wrap
    box-sizing border-box
    position fixed
    bottom 100px
    right 0
    width 560px
    height  420px
    background #FFF
     -webkit-box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
    box-shadow: -3px 0 3px 0 rgba(0,0,0,0.1), 0 -3px 3px 0 rgba(0,0,0,0.1)
</style>
