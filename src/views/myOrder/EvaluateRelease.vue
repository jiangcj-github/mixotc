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
      <b>{{rateText}}</b>
    </div>
    <textarea placeholder="评价对方：字数限制0～50个字符" v-model="comment"></textarea>
    <button @click="release">发布</button>
  </div>
</template>

<script>
  import sendConfig from '@/api/SendConfig.js'// 引入websocket发送包

  export default {
    props:['id', 'receiver', 'type'],
    name: "evaluate-release",
    data() {
      return {
        score: 0,
        flagCache: 0,
        scoreCache: 0,
        comment: '',
        rateText:''
      }
    },
    mounted() {
      console.log('11111', this.id, this.receiver, this.type)
    },
    computed: { //计算属性
      imgList() {
        this.score > 5 ? this.score = 5 : this.score;
        let result = [];
        console.log('result', result)
        console.log('score', this.score)
        for (let i = 0; i < this.score; i++) {
          result.push({item: 'on', flag: this.flagCache});
        }
        while (result.length < 5) {
          result.push({item: 'off', flag: 0});
        }
        return result;
      }
    },
    methods: {
      rateStandard() {
        if (this.score < 3) {
          this.rateText = '差评'
        } else if (this.score >= 3 && this.score < 4) {
          this.rateText = '中评'
        } else {
          this.rateText = '好评'
        }
      },
      changeRate(index) {
        this.flagCache = 1
        this.score = index + 1
        this.scoreCache = index + 1
        console.log('click', this.score, this.flagCache, this.scoreCache)
        console.log('this.imgList', this.imgList)
        this.rateStandard()
      },
      inRate(evt, item, index) {
        if (evt.target.className.indexOf('off') && (item.flag == 0)) {
          this.flagCache = 0
          this.score = index + 1
        }
        console.log('hover1', this.score, this.flagCache, )
        console.log('hoverthis.imgList', this.imgList)
        this.rateStandard()
      },
      outRate(evt, item, index) {
        if (evt.target.className.indexOf('on') && (item.flag == 0)) {
          this.flagCache = 1
          this.score = this.scoreCache
          this.rateText = ''
          console.log('hover2', this.score, this.flagCache, this.scoreCache)
        }
        if (this.score) {
          this.rateStandard()
        }
      },
      release() {
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
              "id": this.id,    // 订单ID
              "receiver": this.receiver,  // 被评论者ID
              "type": this.type,    // 1 交易; 2 担保
              "credit": this.score,  // 信誉度 1,2,3 好评3 差评1
              "transit": 2,  // 发货速度 1,2,3
              "comment": this.comment // 文字说明
            }
          }
        }))
        // 发送改变状态值，显示评论结果
        this.Bus.$emit('showReult', 1);
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
      span:nth-child(1)
        margin-left 140px
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
