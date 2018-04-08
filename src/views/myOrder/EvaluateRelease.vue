<template>
  <div class="evaluate-release">
    <div class="img-group">
      <img v-for="url in imgList" :src="url" >
      <span>中评</span>
    </div>
    <textarea placeholder="评价对方：字数限制0～50个字符"></textarea>
    <button>发布</button>
  </div>
</template>

<script>
  export default {
    name: "evaluate-release",
    data() {
      return {
        imgList: ['/static/images/evaluate_gray.png', '/static/images/evaluate_gray.png', '/static/images/evaluate_gray.png','/static/images/evaluate_gray.png','/static/images/evaluate_gray.png']
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .evaluate-release
    width 620px
    margin 0 auto
    text-align center
    textarea
      width 620px
      height 151px
      border 1px solid #E1E1E1
      border-radius 2px
      resize none
      outline none
      &::-webkit-input-placeholder
        color #333
    button
      width 464px
      height 40px
      background #FFB422
      color #FFF
      border-radius 2px
</style>
