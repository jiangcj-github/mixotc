<template>
  <div class="left">
    <div class="head">
      <img src="/static/images/kefu/kefu.png">
      <h3>OTC客服专员1号</h3>
    </div>
    <div class="search">
      <input type="text" title="" placeholder="搜索联系人" v-model="srchText" @input="parseUls">
    </div>
    <happy-scroll color="rgba(100,100,100,0.8)" size="5" resize hide-horizontal
                  bigger-move-h="start" smaller-move-h="start" class="scrollPane">
      <ul class="persons">
        <li v-for="(content, index) in uls" :key="index" @click="onLiClick(index, content.user_id)" :class="{active: content.user_id === $store.state.serviceNow}">
          <img :src="content.user_icon ? `${HostUrl.http}image/${content.user_icon}` : `/static/images/default_avator.png`" alt="">
          <i v-if="content.unread">{{unreadNum}}</i>
          <div class="pinfo">
            <p class="p1">
              <span class="s1">{{content.user_name}}</span>
              <span class="s2">{{(content.msg_time * 1000).formatTime()}}</span>
            </p>
            <p class="p2">{{content.msg_data ? (content.msg_type === "image" ? '[图片]' : content.msg_data.msg) : ''}}</p>
          </div>
        </li>
      </ul>
    </happy-scroll>
  </div>
</template>
<script>
  import { HappyScroll } from 'vue-happy-scroll';
  export default {
    components: {
      HappyScroll,
    },
    data() {
      return {
        srchText: "",
        uls: [],
        ulsBuf: [],
        unreadNum: 1
      }
    },
    computed: {

    },
    mounted(){
      this.listenNews();
      this.parseUls();
      this.userIdArr;
      this.initData();
      this.selectNowUser()
    },
    methods: {
      listenNews() { //聊天信息监听
        this.WebSocket.onMessage['sms']={
          async callback(res){
            // op为7单人聊天信息，对象类型
            if (res.op && res.op === 7) {
              console.log('聊天消息', res)
              let {id, uid, icon, name, data, type } = res.body;
              let obj = {};
              if (type === 'text') { // 文字
                obj = {
                  isSend:  _this.JsonBig.stringify(uid),
                  headimg: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                  type: 0, // 0: 发送文字, 1: 发送图片
                  isLoding: true, // 加载中
                  err: false, // 0: 发送成功, 1: 发送失败
                  content: data.msg,
                  time: new Date() - 0
                };
                _this.$store.commit({type: 'addServiceMessages', data:{id: _this.JsonBig.stringify(uid), msg: obj }})
                return;
              }
              obj = { // 图片
                isSend:  _this.JsonBig.stringify(uid),
                headimg: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                type: 1, // 0: 发送文字, 1: 发送图片
                isLoding: true, // 加载中
                err: false, // 0: 发送成功, 1: 发送失败
                content: `${_this.HostUrl.http}file/${data.id}`,
                time: new Date() - 0
              };
              _this.$store.commit({type: 'addServiceMessages', data:{id: _this.JsonBig.stringify(uid), msg: obj }})
            }
          }
        };
      },
      initData() { // 初始化列表数据
        this.WsProxy.send('control', 'a_get_appeal_users', {
          "id": this.$store.state.userInfo.uid
        }).then(data => {
          console.log('对话列表', data);
          this.uls =  this.ulsBuf = data;
          data.forEach(v => {
            v.user_id = this.JsonBig.stringify(v.user_id)
          })
          this.$store.commit({type: 'initServiceData', data: data}); // 获取列表数据存储到vuex中
        }).catch(error=>{
          console.log('错误', error)
        })
      },
      selectNowUser() {
        this.WsProxy.send('control', 'a_get_user_appeals', { // 初始化页面获得联系人
          "user_id": this.$route.query.uid ? this.JsonBig.parse(this.$route.query.uid) : this.JsonBig.parse(this.uls[0].user_id),
        }).then(data => {
          data.forEach(v => {
            v.buyer_id = this.JsonBig.stringify(v.buyer_id) // 买家
            v.seller_id = this.JsonBig.stringify(v.seller_id) // 卖家
            v.sid = this.JsonBig.stringify(v.sid) // 订单
            v.appellant_id = this.JsonBig.stringify(v.appellant_id) // 申述人
            v.appellee_id = this.JsonBig.stringify(v.appellee_id) // 被申述人
          })
          this.$store.commit({type: 'changeServiceNowtalk', data: Object.assign({data}, {id: this.$route.query.uid ? this.$route.query.uid : this.uls[0].user_id})}) // 存储右边聊天人员
        }).catch(error=>{
          console.log('错误', error)
        })
      },
      onLiClick(index, id) { // 点击列表
        this.WsProxy.send('control', 'a_get_user_appeals', { // 获取点击人资料
          "user_id": this.JsonBig.parse(this.uls[index].user_id),
        }).then(data => {
          // console.log('申述人', data);
          data.forEach(v => {
            v.buyer_id = this.JsonBig.stringify(v.buyer_id) // 买家
            v.seller_id = this.JsonBig.stringify(v.seller_id) // 卖家
            v.sid = this.JsonBig.stringify(v.sid) // 订单
            v.appellant_id = this.JsonBig.stringify(v.appellant_id) // 申述人
            v.appellee_id = this.JsonBig.stringify(v.appellee_id) // 被申述人
          })
          this.$store.commit({type: 'getServiceNowtalk', data: this.uls[index]}) // 存储左边聊天人
          this.$store.commit({type: 'changeServiceNowtalk', data: Object.assign({data}, {id: this.uls[index].user_id})}) // 存储右边聊天人员
        }).catch(error=>{
          console.log('错误', error)
        })
      },
      parseUls() { // 搜索输入框
        this.uls = [];
        this.ulsBuf.forEach((v) => {
          if (new RegExp("^.*"+this.srchText+".*$").test(v.user_name)) {
            this.uls.push(v);
          }
        });
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .left
    width 250px
    background #333
    border-radius 4px 0 0 4px
    border-right 1px solid #333
    box-sizing border-box
    .head
      height 60px
      display flex
      align-items center
      padding 10px 15px
      box-sizing border-box
      >img
        width 40px
        height 40px
      h3
        margin-left 20px
        font-size 16px
        color #fff
        letter-spacing 0.19px
    .search
      padding 10px 15px
      font-size 12px
      font-size
      >input
        background #222
        border-radius 2px
        width 100%
        height 30px
        color #fff
        padding 0 10px
        box-sizing border-box
        font-size 14px
    .scrollPane
      width 250px
      height 490px
    ul.persons>li
        height 60px
        padding 10px 18px 10px 15px
        box-sizing border-box
        display flex
        align-items center
        cursor pointer
        position relative
        &:hover
          background #3c3737
        &.active
          background #474747
        >img
          width 40px
          height 40px
          margin-right 10px
          border-radius 50%
          flex-shrink 0
        >i
          display inline-block
          line-height 19px
          text-align center
          width 20px
          height 20px
          background #FF794C
          border-radius 50%
          fz10()
          color #FFF
          position absolute
          left 40px
          top 10px
        .pinfo
          flex-grow 1
          min-width 0
          height 100%
          .p1
            line-height 20px
            >span.s1
              color #fff
              font-size 14px
            >span.s2
              font-size 11px
              color #999
              float right
          .p2
            line-height 18px
            margin-top 2px
            color #999
            font-size 11px
            letter-spacing 0.15px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
</style>
