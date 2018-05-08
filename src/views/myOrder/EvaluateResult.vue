<template>
  <div class="evaluate-result-wrap">
    <p v-if="flag ===1 ">该评价已被删除</p>
    <ul v-if="flag !==1 ">
      <li>
        <p>{{content}}</p>
        <p>{{date}}</p>
      </li>
      <li>
        <span>{{rate}}</span>
        <img :src="src" alt="" v-for="src in imgList">
      </li>
      <li>
        <button @click="delOrder">删除评价</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "evaluate-result",
    props:['id'],
    data() {
      return {
        //arr.slice(0,3)
        imgList:['/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png'],
        content: '', // 评价内容
        date: '', // 日期
        rate: '', // 评分
        flag: 0 // 判断是否删除
      }
    },
    mounted() {
      this.WsProxy.send('otc', 'get_order_rate', {
        id: this.JsonBig.parse(this.id), // 广告id
      }).then((data)=>{
        let rateArr = ['差评', '差评', '中评', '好评', '好评'];
        console.log('评价结果', data);
        this.content = data.comment;
        this.rate = rateArr[data.credit - 1];
        this.imgList = this.imgList.slice(0, data.credit);
        this.date = data.date.toDate('yyyy/MM/dd HH:mm:ss');
        this.flag = data.state
      }).catch((msg)=>{
        console.log(msg);
      });
    },
    methods: {
      delOrder() { // 删除评价
        this.WsProxy.send('otc', 'del_order_rate', {
          id: this.JsonBig.parse(this.id), // 广告id
        }).then((data)=>{
          console.log('删除评价', data)
          this.flag = 1
        }).catch((msg)=>{
          console.log(msg);
        });
      }
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
          cursor pointer
</style>
