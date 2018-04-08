<template>
  <div class="evaluate-release-wrap">
    <div class="img-group">
      <span v-for="(item, index) in imgList" :class="item" class="rate" :track-by="index" @click="changeRate(index)"></span>
      <b>中评</b>
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
        score: 0
      }
    },
    computed: { //计算属性
      imgList() {
        this.score > 5 ? this.score = 5 :  this.score;
        let result = [];
        console.log('result', result)

        console.log('score', this.score)

        for(let i=0;i<this.score;i++){
          result.push('on');
        }
        while(result.length < 5){
          result.push('off');
        }
        return result;
      }
    },
    methods: {
      changeRate (index) {
        this.score = index + 1
        console.log('index', index)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .evaluate-release-wrap
    width 620px
    margin 40px auto 0
    padding-bottom 44px
    text-align center
    .img-group
      display: flex;
      align-items: center;
      justify-content: center;
      height 23px
      margin-bottom 20px
      b
        font-size 14px
        color #333
      span
        display inline-block
        width 28px
        height 23px
        margin-right 20px
      span:nth-child(5)
        margin-right 80px
      .rate.on
        background-image url('/static/images/evaluate_red.png')
      .rate.off
        background-image url('/static/images/evaluate_gray.png')

    textarea
      width 600px
      height 131px
      margin-bottom 30px
      padding 10px 10px
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
