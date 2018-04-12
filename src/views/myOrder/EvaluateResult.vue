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
  import sendConfig from '@/api/SendConfig.js'// 引入websocket发送包

  export default {
    name: "evaluate-result",
    data() {
      return {
        imgList:['/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png', '/static/images/evaluate_red.png']
      }
    },
    mounted() {
      let ws = this.WebSocket; // 创建websocket连接
      let seq = ws.seq;
      ws.onMessage[seq] = { // 监听
        callback: (data) => {
          if(!data || data.body.ret !== 0) return;
          console.log('rate', data.body.data)
        },
        date:new Date()
      };

      ws.send(sendConfig('otc', { // 发包
        seq: seq,
        body:{
          "action": "new_rate",
          data: {
            "id": this.id,    // 出售ID
            "receiver": this.receiver,  // 被评论者ID
            "type": this.type,    // 1 交易; 2 担保
            "credit": this.score,  // 信誉度 1,2,3 好评3 差评1
            "transit": 2,  // 发货速度 1,2,3
            "comment": this.comment // 文字说明
          }
        }
      }))
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
