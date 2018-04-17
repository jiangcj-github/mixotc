<template>
  <div class="evaluate-result-wrap">
    <ul>
      <li>
        <p>速度一般～～～～其实有点慢，价钱也不是很低！！！！</p>
        <p>2016/03/08 23:57:03</p>
      </li>
      <li>
        <span>中评</span>
        <img :src="src" alt="" v-for="src in imgList">
      </li>
      <li>
        <button>删除评价</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "evaluate-result",
    props:['sid'],
    data() {
      return {
        imgList:['/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png']
      }
    },
    mounted() {
      this.WsProxy.send('otc','rates',{
        id: this.sid, // 广告id sid
        origin: 0
      }).then((data)=>{
        console.log('评价结果', data)
      }).catch((msg)=>{
        console.log(msg);
      });
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl"
  .evaluate-result-wrap
    padding 44px 0
    ul
      display flex
      align-items center
      li:first-child
        flex 4
        p:first-child
          margin-bottom 10px
        p:last-child
          color #999
      li:nth-child(2)
        flex 3
        img
          width 28px
          height 23px
          margin-right 20px
          vertical-align middle
        span
          margin-right 40px
      li:last-child
        flex 1
        button
          width 140px
          height 25px
          border 1px solid #FFB422
          border-radius 2px
          color #FFB422
</style>
