<template>
  <div class="news-info-right">
    <happy-scroll
      style="width:399px;height:325px"
      :resize="true"
      smaller-move-h="end"
      bigger-move-h="end"
      hide-horizontal
      class="main-content"
      :scroll-top="99999999">
      <div class="wrap">
        <!-- 空白消息框 -->
        <div class="blank" v-if="!title && curChat !== 'system'"></div>
        <!-- 聊天消息框 -->
        <div class="news-info-talk clearfix" v-if="title && curChat !== 'system'">
          <p class="more-info" v-if="chat[index].moreFlag" @click="fetchMore(10, 1)">查看更多消息</p>
          <p class="more-info" v-else></p>
          <div v-for="(value, key) of mapmessages" :key="key" v-show="key === curChat">
            <div class="messages clearfix" v-for="(item, idx) of value" :key="item.id ? item.id : item.time">
              <p class="time-info" v-if="idx > 0 && dealTime(value[idx - 1].time, item.time)">{{dealTime(value[idx-1].time, item.time)}}</p>
              <div v-if="item.type === 'rmd_ord'">
                <p class="time-info">{{item.msg}}</p>
              </div>
              <div v-if="!item.type">
                <div :class="{'left-people': item.from !== JsonBig.stringify($store.state.userInfo.uid), 'right-people': item.from === JsonBig.stringify($store.state.userInfo.uid)}">
                  <img
                    class="avator"
                    :src="chat[index].service && item.from !== JsonBig.stringify($store.state.userInfo.uid) ? '/static/images/service_icon.png' : infoDiction[item.from] && infoDiction[item.from].icon"
                    alt=""
                    @click="toHomepage(item.from)"
                  >
                  <p>
                    <i :class="{name: chat[index].group && userId !== item.from}"></i>
                    <b v-if="chat[index].group && userId !== item.from">{{infoDiction[item.from] && infoDiction[item.from].name}}</b>
                    <span v-if="item.msg.type === 1" class="images">
                      <img
                        :id="'img' + item.time"
                        :src="item.msg.content"
                        alt=""
                        @load="imgLoad(key, item.time, 'img' + item.time)"
                        @error="imgError(key, item.time, item.msg.content)"
                        @click="showBigPicture(!item.isLoding && !item.isFail, item.msg.content, 'img' + item.time)"
                      >
                    </span>
                    <span v-if="item.msg.type === 0" v-html="item.msg.content" class="msg-text"></span>
                    <img src="/static/images/loding.png" class="lodingFlag" v-if="item.isLoding">
                    <img src="/static/images/hint.png" class="failFlag" v-if="!item.isLoding && item.isFail">
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p class="time-info" v-if="!chat[index].service &&  chat[index].uid !== chat[index].id && !chat[index].exists">{{chat[index].group ? '您已被管理员移出群聊' : '对方已将您从好友列表移除'}}</p>
        </div>

        <!-- 系统消息 -->
        <div class="system-info" v-show="curChat === 'system'">
          <div v-for="item of $store.state.messages['system']" :key="item.sid">
            <img :src="infoDiction[item.id] && infoDiction[item.id].icon" alt="">
            <ul>
              <li class="system-info-name">{{infoDiction[item.id] && infoDiction[item.id].name}}</li>
              <li class="system-info-info">{{item.info ? item.info : `我是${infoDiction[item.id] && infoDiction[item.id].name},申请添加你为好友`}}</li>
            </ul>
            <button
              @click="addFriend(item.id, item.info ? item.info : `我是${infoDiction[item.id] && infoDiction[item.id].name},申请添加你为好友`)"
              :class="{disable:item.isDeal}"
              :disabled="item.isDeal"
            >
              {{item.isDeal ? '已添加' : '添加'}}
            </button>
          </div>
        </div>
      </div>
    </happy-scroll>
    <!-- 大图展示 -->
    <div class="big-img" v-show="showBig">
      <span>
        <img
          src="/static/images/close_btn_tr.png"
          ref="bigPic"
          alt=""
          @click="()=>{this.showBigSrc = ''; this.showBig = false}"
          >
        </span>
      <happy-scroll
        style="width:370px;height:376px"
        :resize="true"
        bigger-move-h="start"
        hide-horizontal
        class="bigImg-content"
      >
        <div class="picture">
          <img
            v-show="showBigSrc"
            :style="{visibility: bigLoading ? 'hidden' : 'visible'}"
            :src="showBigSrc"
            alt=""
            ref="bigImg"
            @load="bigImgLoad()"
          >
        </div>
      </happy-scroll>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { HappyScroll } from 'vue-happy-scroll'
  // import EXIF from 'exif-js'

  export default {
    name: "news-info-right-content",
    data() {
      return {
        showBig: false,
        showBigSrc: '',
        bigLoading: true,
        userId: this.JsonBig.stringify(this.$store.state.userInfo.uid)
      }
    },
    components: {
      // HappyScroll
    },
    computed: {
      ...mapGetters([
        'chatIds',
        'infoDiction',
        'title'
      ]),
      curChat() {
        return this.$store.state.curChat
      },
      chat() {
        return this.$store.state.chat
      },
      index() {
        let idx = '';
        this.chat.forEach((item, index)=>{
          if (item.id === this.curChat) idx = index;
        })
        return idx
      },
      mapmessages() {
        let obj = {},
            messages = this.$store.state.messages;
        for (const key in messages) {
          if(this.chatIds.includes(key)) {
            obj[key] = messages[key]
          }
        }
        return obj;
      },
      messages() {
        return this.$store.state.messages[this.curChat] ? this.$store.state.messages[this.curChat] : []
      }
    },
    methods: {
      //更多消息
      async fetchMore(num, flag) {
        // 无匹配对话时不拉取
        if(this.index === '') return;
        let result = [];
        let chat = this.chat[this.index];
        // 新的聊天不获取消息记录
        if(flag && this.messages[0] && !this.messages[0].id) {
          this.$store.commit({type: 'changeMoreFlag', data:{id: this.curChat, flag: false }})
          return;
        }
       await this.WsProxy.send('control', 'get_history_msgs', {
          peer_id:  chat.group || chat.isSingle ? 0 : this.JsonBig.parse(this.curChat),
          group_id: chat.group || chat.isSingle ? this.JsonBig.parse(this.curChat) : 0,
          last_msg_id: this.messages[0] && this.messages[0].id ? this.JsonBig.parse(this.messages[0].id) : 0,
          is_peer_admin: this.chat[this.index].service ? 1 : 0,
          count: num
        }).then(data => {
          (!data.msgs || data.msgs.length < num) && this.$store.commit({type: 'changeMoreFlag', data:{id: this.curChat, flag: false }})
          if (!data.msgs) return;
          let uid = this.userId;
          let length = data.msgs.length;
          // 遍历获取到的消息记录并处理成为前端数据
          data.msgs.forEach(async (item, index) => {
            let sender_id = this.JsonBig.stringify(item.sender_id),
                create_time = item.create_time * 1000,
                messageContent = {
                    text: item.data.msg && item.data.msg.br(),
                    image: `${this.HostUrl.http}file/${item.data.id}`,
                    audio: `您收到一条语音信息，请在手机端查看`,
                    video: `您收到一条视频信息，请在手机端查看`,
                    gift: `您收到一条红包信息，请在手机端查看`
                  };
            let obj = {
              id: this.JsonBig.stringify(item.id),
              from: sender_id === uid ? uid : sender_id,
              to: sender_id === uid ? this.curChat : uid,
              msg:{
                type: item.type === 'image' ? 1 : 0,
                content: messageContent[item.type]
              },
              isLoding: item.type === 'image' ? true : false,
              isFail: false,
              time: create_time
            }
            // 无该用户头像姓名信息时获取并保存
            if(!this.infoDiction[obj.from]) {
              await this.WsProxy.send('otc', 'trader_info', {id: this.JsonBig.parse(obj.from)}).then(({name, phone, email, icon }) => {
                this.$store.commit(
                  {type: 'updateStrangerInfo',
                    data: {
                      id: obj.from,
                      icon: icon ? `${this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                      name: name
                    }
                })
              })
            }
            result.push(obj)
            // 遍历结束后将聊天记录存入vuex
            if(index === length - 1) this.$store.commit({type: 'moreMessage', data: result});
          })
        })
      },
      async fetchFriendList() {
        await this.$store.dispatch({ type: 'getFriendList', ws: this.WsProxy})
      },
      toHomepage(id) {
        this.$router.push({ name: 'homepage', query: { uid: id }})
      },
      // 同意好友请求
      addFriend(id, info) {
        this.Bus.$emit('addReqInfo', info);
        this.$store.commit({type: 'agreeAddFriend', data:{id: id}})
        this.WsProxy.send('control', 'add_friend', {
          ack: 0,
          id: this.JsonBig.parse(id)
        }).then(data => {
          this.fetchFriendList();
        })
      },
      showBigPicture(flag, src, id) {
        if (!flag || this.showBigSrc === src) return;
        this.bigLoading = true;
        this.showBigSrc = src;
        this.showBig = true;
        this.$refs.bigImg.className = document.getElementById(id).className;
      },
      bigImgLoad(){
        this.bigLoading = false;
        let height = this.$refs.bigImg.clientHeight;
        if(height > 376) {
          this.$refs.bigImg.style.marginTop = 0;
          return;
        }
        this.$refs.bigImg.style.marginTop = `${(376-height)/2}px`;
      },
      imgLoad(tid, time, ref) {
        let orient;
        EXIF.getData(document.getElementById(ref), function () {
          orient = EXIF.getTag(this, 'Orientation');
          if (orient === 3 ) {
            this.className = 'rotate180'
          }else if( orient === 6) {
            this.className = 'rotate270'
          }else if( orient === 8) {
            this.className = 'rotate90'
          }else{
            this.className = ''
          }
        });
        this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:0 }})
      },
      imgError(tid, time, src) {
        if (src === '') return;
        this.$store.commit({type: 'changeMessageState', data:{id: tid, time: time, code:1 }})
      },
      // 处理是否显示消息时间
      dealTime(time1, time2) {
        if(time2 - time1 < 180000) return false;
        return time2.formatTime()
      }
    },
    watch: {
      curChat:{
        handler(curvalue){
          let messages = this.$store.state.messages[curvalue];
          if ((!messages || messages && messages.length === 0) && this.chat[this.index] && this.chat[this.index].moreFlag) {
            this.fetchMore(3)
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base.styl"
  .news-info-right
    position relative
    float right
    width 400px
    height 420px
    background #F4F6FA
    .title-info
      height 40px
      line-height 40px
      background #FFF
      border-bottom 1px solid #E1E1E1
      >li
        float left
      .title-info-name
        overflow hidden
        width 304px
        height 40px
        margin-left 20px
        font-size 14px
        color $col333
        font-weight bold
        text-overflow ellipsis
        white-space nowrap
        letter-spacing 0.16px
      .title-info-select
        img
          vertical-align middle
          cursor pointer
        div
          position absolute
          top 40px
          right 0
          width 80px
          background #333
          border-radius 2px
          i
            position absolute
            top -10px
            left 7px
            display block
            border-width 5px 3px
            border-style solid dashed dashed
            border-color transparent transparent #333
            font-size 0
            line-height 0
          ul
            li
              position relative
              height 25px
              padding-left 34px
              line-height 25px
              font-size 12px
              color #FFF
              z-index 99
              background #333
              cursor pointer
              border-radius 2px
            li:hover
              background #474747
            li:nth-child(1):before
              position absolute
              top 6px
              left 10px
              width 13px
              height 13px
              background url("/static/images/add_friend.png")
              background-size 13px 13px
              content ''
            li:nth-child(2):before
              position absolute
              top 6px
              left 10px
              width 12px
              height 13px
              background url("/static/images/trust.png")
              background-size 12px 13px
              content ''
            li:nth-child(3):before
              position absolute
              top 6px
              left 10px
              width 13px
              height 14px
              background url("/static/images/creat_group.png")
              background-size 13px 14px
              content ''
      .close-btn
        float right
        margin-right 24px
        img
          width 10px
          height 10px
          cursor pointer
          vertical-align middle
    .news-info-talk
      width 399px
      text-align center
      .more-info
        font-size 12px
        color #FF794C
        padding-top 10px
        margin-bottom 5px
        cursor pointer
      .time-info
        display inline-block
        padding 0px 5px
        margin 0 auto
        margin-bottom 20px
        font-size 12px
        background #E1E1E1
        border-radius 2px
        color #999
      div
        width 390px
        font-size 12px
        margin-bottom 15px
        img
          width 30px
          height 30px
          border-radius 50%
          vertical-align top
        p
          display inline-block
          position relative
          span
            display inline-block
            max-width 250px
            padding 5px
            border-radius 2px
            margin-top 2px
            word-wrap break-word
            &.images
              width 90px
              height 60px
              img
                width 100%
                height 100%
                border-radius 0
                cursor url('/static/images/bigger.ico'), auto;
                &.rotate90
                  _rotate(90deg)
                &.rotate180
                  _rotate(180deg)
                &.rotate270
                  _rotate(270deg)
          i
            position absolute
            top 9px
            display block
            border-width 5px 8px
            border-style solid dashed dashed
            font-size 0
            line-height 0
            &.name
              top 25px
          b
            display block
            position relative
            left -5px
            fz10()
      .messages
        width 100%
        margin 0
        .lodingFlag, .failFlag
          position absolute
          width 12px
          height 12px
        .lodingFlag
          animation mymove 1.5s linear infinite;
          -webkit-animation mymove 1.5s linear infinite;
      .left-people
        float left
        margin-left 10px
        text-align left
        .lodingFlag, .failFlag
          right -22px
          top 50%
          margin-top -6px
        .avator
          margin-right 10px
          cursor pointer
        span
          background #E1E1E1
        i
          left -16px
          border-color transparent #E1E1E1 transparent transparent
      .right-people
        float right
        margin-right 10px
        text-align right
        .lodingFlag, .failFlag
          left -22px
          top 50%
          margin-top -6px
        .avator
          float right
          // background aquamarine
          cursor pointer
          margin-left 10px
        span
          float right
          text-align left
          margin-right 10px
          background #FFB422
        i
          right -6px
          border-color transparent transparent transparent #FFB422
    .blank
      width 399px
      padding-top 10px
      text-align center
    .system-info
      width 399px
      max-height 320px
      padding-top 10px
      div
        display flex
        align-items center
        width 345px
        height 37px
        padding 12px 20px 11px 15px
        background #FFF
        margin 10px auto 0
        img
          flex-shrink 0
          width 37px
          height 37px
          border-radius 50%
          margin-right 16px
        button
          flex-shrink 0
          width 54px
          height 24px
          line-height 24px
          background #FFB422
          border-radius 2px
          color #FFF
          cursor pointer
          &.disable
            cursor auto
            color $col999
            background #FFF
        ul
          width 380px
          height 60px
          li
            width 190px
          .system-info-name
            height 32px
            line-height 38px
            font-size 14px
          .system-info-info
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            font-size 12px
            color #999
    .big-img
      box-sizing()
      position absolute
      left -400px
      top -40px
      width 400px
      height 420px
      padding 44px 20px 0 20px
      background $col6FA
      box-shadow -2px -2px 8px 0 rgba(51, 51, 51, 0.30)
      span
        position absolute
        top 15px
        right 23.5px
        img
          width 10px
          height 10px
          cursor pointer
      .picture
        text-align center
        img
          max-width 100%
          height auto
          &.rotate90
            _rotate(90deg)
          &.rotate180
            _rotate(180deg)
          &.rotate270
            _rotate(270deg)
    .input-text
      position absolute
      bottom 0
      left 0
      width 400px
      padding 7px 0 3px
      background #FFF
      -webkit-box-shadow: 0 -3px 3px 0 rgba(0,0,0,0.1)
      box-shadow:  0 -3px 3px 0 rgba(0,0,0,0.1)
      li
        position relative
        float left
        text-align center
        img
          cursor pointer
        &.send-image
          cursor pointer
        .money-address
          position absolute
          bottom 45px
          right 12px
          width 150px
          color #FFF
          font-size $fz12
          letter-spacing: 0.14px;
          border-radius 2px
          background $col333
          &::after
            position absolute
            bottom -6px
            right 12px
            content ''
            border-top 7px solid $col333
            border-left 6px solid transparent
            border-right 6px solid transparent
          p
            height 25px
            padding 0 3px
            line-height 25px
            color #FFF
            cursor pointer
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            &:hover
              background #474747
        span
          display block
          margin-top -3px
          color #999
          letter-spacing 0.09px
          transform scale(0.55)
      li:nth-child(1)
        margin-right 15px
        margin-left 5px
        input
          width 274px
          height 33px
          padding-left 10px
          font-size 12px
          border 1px solid #FFB422
          &.disable
            border-color $col1E1
      li:nth-child(2)
        width 30px
        img
          width 20px
          height 18px
      li:nth-child(3)
        width 60px
        img
          width 19.4px
          height 19px
  /*弹窗*/
  .belive-layer, .address-layer
    text-align center
    line-height 50px
    font-size 12px
</style>
