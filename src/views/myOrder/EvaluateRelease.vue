<template>
  <div class="evaluate-release-wrap">
    <div class="img-group">
      <span v-for="(item, index) in imgList"
            :class="item.item"
            :from-click="item.flag"
            class="rate"
            :track-by="index"
            @click="changeRate(index)"
            @mouseenter="inRate($event, item, index)"
            @mouseleave="outRate($event, item, index)">
      </span>
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
        for (let i = 0; i < this.score; i++) {
          result.push({item: 'on', flag: 0});
        }
        while (result.length < 5) {
          result.push({item: 'off', flag: 0});
        }
        return result;
      }
    },
    methods: {
      changeRate(index) {
        this.score = index + 1
        console.log('click', this.score)
        this.imgList.forEach(v => {
          if (v.item.indexOf('off')) {
            v.flag = 1
          }
        })
        console.log('this.imgList', this.imgList)
      },
      inRate(evt, item, index) {
        if (evt.target.className.indexOf('off') && (item.flag == 0)) {
          this.score = index + 1
          //evt.target.className = 'rate on'
        }
        console.log('hover', this.score)
        console.log('hoverthis.imgList', this.imgList)
      },
      outRate(evt, item, index) {
        if (evt.target.className.indexOf('on') && (item.flag == 0)) {
          this.score = index + 1 - this.score
          //evt.target.className = 'rate off'
        }
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
