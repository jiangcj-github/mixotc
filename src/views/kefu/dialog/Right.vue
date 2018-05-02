<template>
  <div class="right">
    <div class="h1">{{user}}</div>

    <!-- 对话框展示 -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="fixed swiper-slide" v-for="(content, index) in otherInfo" >
          <h3>{{(appl === 0 && recv === 0) || (appl === 1 && recv === 1) ? '申诉人' : '被申诉人'}}</h3>
          <div class="mf1">
            <img src="/static/images/default_avator.png" @click="changeUser(index)">
            <span class="i1" @click="changeUser(index)">{{content.name}}</span>
            <span class="i2">已标记付款</span>
            <span class="i3">{{content.update}}分钟</span>
          </div>
          <div class="mf2">
            <span class="i1">已被申诉{{content.times}}次</span>
            <button class="i2" @click="showPop1 = true">强制放币</button>
            <button class="i3" @click="showPop3 = true">终止交易</button>
            <button class="i3" @click="showPop2 = true" v-if="(appl === 0 && recv === 0) || (appl === 1 && recv === 1)">驳回申诉</button>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev" v-if="otherInfo && otherInfo.length > 1"></div>
      <div class="swiper-button-next" v-if="otherInfo && otherInfo.length > 1"></div>
    </div>

    <!-- 聊天-->
    <happy-scroll color="rgba(200,200,200,0.8)" size="5" bigger-move-h="end" resize hide-horizontal class="scrollPane">
      <div class="msgBox">
        <p class="check-more" @click="checkMore">查看更多</p>
        <div v-for="(item, index) in msgHis" :key="index" class="message">
          <div class="tline" v-if="index > 0 && dealTime(msgHis[index-1].time, item.time)"><i>12月19日 12:12</i></div>
          <p :class="{al: item.isSend !== JsonBig.stringify($store.state.userInfo.uid), ar: item.isSend == JsonBig.stringify($store.state.userInfo.uid)}">
            <img :src="item.headimg"/>
            <span v-if="item.type === 0">{{item.content}}</span>
            <span v-else-if="item.type === 1" class="img-wrap"><img :src="item.url" @click="onClickImg(item)"/></span>
            <i class="err" title="发送失败" v-if="!item.loding && item.err === 1" @click="resend(item)"></i>
            <img src="/static/images/loding.png" class="lodingFlag" v-if="item.loding">
          </p>
        </div>
      </div>
    </happy-scroll>
    <!-- 下方发送消息 -->
    <div class="sendBox">
      <div class="menu">
        <img src="/static/images/kefu/album.png" @click="$refs.file.click()" title="发送图片">
        <input type="file" ref="file" v-show="0" accept="image/*" @change="chooseImage">
        <span class="br"></span>
        <button class="b1" @click="onClickM0">上传付款证明</button>
        <button class="b2" @click="showPop4 = true">证明无效</button>
        <button class="b3" @click="onClickM1">通知放币</button>
      </div>
      <textarea ref="textarea" class="textarea" title=""
                v-model="sendMsg"
                @keydown.enter.exact="send"
                @keydown.ctrl.enter="onCtrlEnter">
      </textarea>
      <div class="bottom">
        <span>按下Enter发送内容/Ctrl+Enter换行</span>
        <button @click="send">发送</button>
      </div>
    </div>
    <!--图片弹出框-->
    <ImagePopup v-if="showPopImg" :url="popImgSrc"></ImagePopup>
    <!--强制放币-->
    <BasePopup :width="470" :height="380" :top="50" :show="showPop1">
      <div class="pop">
        <h2>责任人</h2>
        <div class="head"><img src="/static/images/default_avator.png"><span>李小蹦</span></div>
        <div class="textarea">
          <textarea placeholder="填写强制放币的理由" ref="pop1Text" v-model="pop1Text" @input="onPop1Input"></textarea>
          <p>{{pop1Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1" @click="onPop1Ok">确认</button>
          <button class="b2" @click="showPop1 = false">我再想想</button>
        </div>
      </div>
    </BasePopup>
    <!--驳回申诉-->
    <BasePopup :width="470" :height="280" :top="50" :show="showPop2">
      <div class="pop">
        <div class="textarea">
          <textarea placeholder="填写驳回申诉的理由" ref="pop2Text" v-model="pop2Text" @input="onPop2Input"></textarea>
          <p>{{pop2Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1" @click="onPop2Ok">确认</button>
          <button class="b2" @click="showPop2 = false">我再想想</button>
        </div>
      </div>
    </BasePopup>
    <!--终止交易-->
    <BasePopup :width="470" :height="430" :top="50" :show="showPop3">
      <div class="pop">
        <h2>选择终止交易的责任人</h2>
        <div class="head2">
          <div class="hi" @click="pop3Radio = 0">
            <img src="/static/images/default_avator.png">
            <span>李小蹦</span>
            <span class="radio" :class="{check:pop3Radio === 0}"></span>
          </div>
          <div class="hi" @click="pop3Radio = 1">
            <img src="/static/images/default_avator.png">
            <span>王华华</span>
            <span class="radio" :class="{check:pop3Radio === 1}"></span>
          </div>
        </div>
        <div class="textarea">
          <textarea placeholder="填写强制放币的理由" ref="pop3Text" v-model="pop3Text" @input="onPop3Input"></textarea>
          <p>{{pop3Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1" @click="onPop3Ok">确认</button>
          <button class="b2" @click="showPop3 = false">我再想想</button>
        </div>
      </div>
    </BasePopup>
    <!--证明无效弹窗-->
    <BasePopup :width="470" :height="280" :top="50" :show="showPop4">
      <div class="pop">
        <div class="textarea">
          <textarea placeholder="填写证明无效的理由" ref="pop4Text" v-model="pop4Text" @input="onPop4Input"></textarea>
          <p>{{pop4Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1" @click="onPop4Ok">确认</button>
          <button class="b2" @click="showPop4 = false">我再想想</button>
        </div>
      </div>
    </BasePopup>
  </div>
</template>
<script>
  import {HappyScroll} from 'vue-happy-scroll';
  import BasePopup from "@/components/common/BasePopup";
  import ImagePopup from "../widges/ImagePopup";
  import MSGS from "./msg.js";
  import Swiper from 'swiper'; // 引入swiper
  import 'swiper/dist/css/swiper.min.css';

  export default {
    components: {
      HappyScroll,
      BasePopup,
      ImagePopup,
    },
    data() {
      return {
        sendFile: "", // 发送图片用
        sendMsg: "", // 发送消息内容
        // msgHis: [],

        // appl: 0, // 申诉人：0-买家,1-卖家
        recv: 0, // 收件人：0-买家,1-卖家
        resp: 0, // 责任人：0-买家,2-卖家
        orderId: "",

        showPopImg: false,
        popImgSrc: "",

        showPop1: false, // 控制强制放币弹出框
        pop1Text: "", // 填写强制放币的理由
        pop1TextOld: "",

        showPop2: false, // 控制驳回申诉弹出框
        pop2Text: "", // 填写驳回申诉的理由
        pop2TextOld: "",

        showPop3: false, // 控制终止交易弹出框
        pop3Text: "", // 填写强制放币的理由
        pop3TextOld: "",
        pop3Radio: 1, // 控制单选按钮显示

        showPop4: false, // 控制证明无效弹窗
        pop4Text: "", // 填写证明无效的理由
        pop4TextOld: "",

      }
    },
    computed: {
      user() { // 监听右侧当前聊天人员
        let result = '';
        this.$store.state.serviceData.forEach(item => {
          if (this.JsonBig.stringify(item.appellant_id) === this.$store.state.serviceNow) {
            result = item.appellant_name
          }
        });
        return result
      },
      serviceNow() { // 当前聊天人员id
        return this.$store.state.serviceNow
      },
      serviceData() { // 左侧存储信息
        return this.$store.state.serviceData
      },
      msgHis() { // 当前聊天信息
        return this.$store.state.serviceMessage[this.serviceNow] ? this.$store.state.serviceMessage[this.serviceNow] : []
      },
      otherInfo() { // 对方信息
        this.startSwiper()
        return this.$store.state.serviceNowOther
      },
      appl() { // 确定申述人是否为购买者
        let applUser; //88607959879680   88607959879680
        this.otherInfo.forEach(item => {
          if (this.JsonBig.stringify(item.buyer_id) == this.serviceNow) {
            applUser = 0
            this.recv = 1
          } else {
            applUser = 1
            this.recv = 0
          }
        })
        return applUser
      }
    },
    mounted() {
      this.startSwiper();
      // 获取聊天消息
      let _this = this;
      //聊天信息监听
      this.WebSocket.onMessage['sms']={
        async callback(res){
          // console.log('聊天消息', res)
          // op为7单人聊天信息，对象类型
          if (res.op && res.op === 7) {
            let {id, uid, icon, name, data, type } = res.body;
            let obj = {};
            if (type === 'text') { // 文字
              obj = {
                isSend:  _this.JsonBig.stringify(uid),
                headimg: icon ? `${_this.HostUrl.http}image/${icon}` : "/static/images/default_avator.png",
                type: 0, // 0: 发送文字, 1: 发送图片
                isLoding: true, // 加载中
                err: 0, // 0: 发送成功, 1: 发送失败
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
              err: 0, // 0: 发送成功, 1: 发送失败
              content: `${_this.HostUrl.http}file/${data.id}`,
              time: new Date() - 0
            };
            _this.$store.commit({type: 'addServiceMessages', data:{id: _this.JsonBig.stringify(uid), msg: obj }})
          }
        }
      };

      this.Bus.$on("onIpClose", () => {
        this.showPopImg = false;
      });
    },
    methods: {
       startSwiper() {
         new Swiper('.swiper-container', { // 调用轮播图
           nextButton: '.swiper-button-next',
           prevButton: '.swiper-button-prev',
           onSlideChangeEnd: function(swiper){
             swiper.update(); //swiper更新
           }
         })
       },
      onCtrlEnter() { // 换行
        this.$refs.textarea.value += "\n";
      },
      changeUser(index) { // 点击切换身份
        let otherObj = {
          appellant_icon: this.otherInfo[index].icon ? `${this.HostUrl.http}image/${this.otherInfo[index].icon}` : "/static/images/default_avator.png",
          appellant_name: this.otherInfo[index].name,
          time: new Date().getTime(),
          data: '',
          appellee_id: this.JsonBig.stringify(this.otherInfo[index].uid)
        }
        this.$store.commit({type: 'transformServiceUser', data: otherObj})
        this.recv = this.recv === 1 ? 0 : 1;
        console.log('uid', index, this.otherInfo[index].uid)
        this.WsProxy.send('control', 'a_get_user_appeals', { // 获取点击人对方资料
          "appellee_id": this.JsonBig.parse(this.otherInfo[index].uid)
        }).then(data => {
          console.log('申述人', data);
          this.$store.commit({type: 'changeServiceNowtalk', data: Object.assign({data}, {id: this.otherInfo[index].appellant_id})}) // 存储右边聊天人员
        }).catch(error=>{
          console.log('错误', error)
        })
      },
      addStoreMessages(type, content, time) { // 设置发送样式
        let obj = {
          isSend: this.JsonBig.stringify(this.$store.state.userInfo.uid),
          headimg: "/static/images/kefu/kefu.png",
          type: type, // 0: 发送文字, 1: 发送图片
          content: content,
          isLoding: true, // 加载中
          err: 0, // 0: 发送成功, 1: 发送失败
          time: time
        };
        this.$store.commit({type: 'addServiceMessages', data:{id: this.serviceNow, msg: obj }})
      },
      async chooseImage() { // 发送图片
        this.sendFile = this.$refs.file.files[0];
        // let reader = new FileReader();
        // reader.readAsDataURL(this.sendFile);
        // reader.onload = ((e) => {
        //   this.msgHis.push({
        //     headimg: "/static/images/default_avator.png",
        //     url: e.target.result,
        //     type: 1, // 0: 发送文字, 1: 发送图片
        //     isSend: 1, // 0: 接收信息, 1: 发送信息
        //     err: 0, // 0: 发送成功, 1: 发送失败
        //     loding: true
        //   });
        // });
        let a = new FormData();
        let file = this.$refs.file.files[0],
            time = new Date() - 0;
        a.append("uploadfile", file);
        this.$refs.file.value = ''
        this.sendImg(time);

        let icon = await fetch(`${this.HostUrl.http}file/`, {
          method: 'Post',
          body: a
        }).then(res => res.text()).then(res => res).catch(error=>{
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:1 }})
          return false;
        })
        if(!icon) return;
       this.$store.commit({type: 'changeServiceImgsrc', data:{id: this.serviceNow, time: time, src: `${this.HostUrl.http}file/${icon}`}})
        this.WsProxy.sendMessage({
          // gid: chat.group ? tid : 0,
          type: 'image',
          tid: this.JsonBig.parse(this.serviceNow),
          data:{
            uid: this.$store.state.userInfo.uid,
            rid: this.JsonBig.parse(this.serviceNow),
            tid: this.JsonBig.parse(this.serviceNow),
            type: 'image',
            id: icon,
            length: file.size,
            ext: file.type,
          }
        }).then(data => {
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:0 }})
        }).catch(error => {
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:1 }})
        })
      },
      sendImg(time) { // 发送图片
        this.addStoreMessages(1, '', time);
      },
      send() { // 发送消息
        if (/^\s*$/.test(this.sendMsg)) return;
        let time = new Date() - 0;
        this.addStoreMessages(0, this.sendMsg, time)
        // 发送消息
        this.WsProxy.sendMessage({
          type: 'text',
          // gid: this.JsonBig.parse("197129593973379072"),
          tid: this.JsonBig.parse(this.serviceNow),
          data:{
            uid: this.$store.state.userInfo.uid,
            rid: this.JsonBig.parse(this.serviceNow),
            tid: this.JsonBig.parse(this.serviceNow),
            msg: this.sendMsg
          }
        }).then(data => { // 发送消息成功后更改原保存信息
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:0 }})
        }).catch(error => {
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:1 }})
        });
        this.$refs.textarea.value = '';
      },
      resend(item) { // 发送失败
        item.err = 0;
        setTimeout(() => {
          item.err = 1;
        }, 2000);
      },
      checkMore(num) { // 查看更多消息
        // this.WsProxy.send('control', 'get_history_msgs', {
        //   peer_id: this.chat[this.index].group ? 0 : this.JsonBig.parse(this.curChat),
        //   group_id: this.chat[this.index].group ? this.JsonBig.parse(this.curChat) : 0,
        //   last_msg_id: this.messages[0] && this.messages[0].id ? messages[0].id : 0,
        //   is_peer_admin: this.chat[this.index].service ? 1 : 0,
        //   count: num
        // }).then(data=>{
        //   (!data.msgs || data.msgs.length <= 10) && this.morFlag
        // })
      },
      // 处理是否显示消息时间
      dealTime(time1, time2) {
        if(time2 - time1 < 180000) return false;
        return time2
      },
      onClickM0() { // 点击上传付款证明按钮
        let text = MSGS.get(0, this.appl, this.recv);
        this.$refs.textarea.value = text;
        this.$refs.textarea.focus();
      },
      onClickM1() { // 点击通知放币按钮
        let text = MSGS.get(4, this.appl, this.recv);
        this.$refs.textarea.value = text;
        this.$refs.textarea.focus();
      },

      onPop1Input() { // 填写强制放币理由(责任人已定)
        if (this.pop1Text.length > 50) {
          this.pop1Text = this.pop1TextOld;
          this.$refs.pop1Text.value = this.pop1TextOld;
        } else {
          this.pop1TextOld = this.pop1Text;
        }
      },
      onPop2Input() { // 填写驳回申述理由
        if (this.pop2Text.length > 50) {
          this.pop2Text = this.pop2TextOld;
          this.$refs.pop2Text.value = this.pop2TextOld;
        } else {
          this.pop2TextOld = this.pop2Text;
        }
      },
      onPop3Input() { // 填写强制放币理由(选择终止交易的责任人)
        if (this.pop3Text.length > 50) {
          this.pop3Text = this.pop3TextOld;
          this.$refs.pop3Text.value = this.pop3TextOld;
        } else {
          this.pop3TextOld = this.pop3Text;
        }
      },
      onPop4Input() { // 填写证明无效理由
        if (this.pop4Text.length > 50) {
          this.pop4Text = this.pop4TextOld;
          this.$refs.pop4Text.value = this.pop4TextOld;
        } else {
          this.pop4TextOld = this.pop4Text;
        }
      },
      onPop1Ok() { // 强制放币确认
        this.showPop1 = false
        let text = MSGS.get(5, this.appl, this.recv).replace(/reason/, this.pop1TextOld);
        this.$refs.textarea.value = text;
        this.$refs.textarea.focus();
        this.WsProxy.send('control', 'a_send_order',{
          "id": this.JsonBig.parse("209038372436447232"),  // this.otherInfo
          "seller": this.JsonBig.parse("203973913955278848"), // this.otherInfo
          "buyer": this.JsonBig.parse("197129593973379072"), // this.otherInfo
          "responsible": this.JsonBig.parse("203973913955278848"),
          "info": this.pop1TextOld
        }).then((data)=>{
          console.log('强制放币', data)
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      onPop2Ok() { // 驳回申述确认
        this.showPop2 = false
        let text = MSGS.get(2, this.appl, this.recv).replace(/reason/, this.pop2TextOld);
        this.$refs.textarea.value = text;
        this.$refs.textarea.focus();
        this.WsProxy.send('control', 'a_reject_appeal',{
          "id": this.JsonBig.parse("209038372436447232"), // this.otherInfo
          "type": 1  // 1: 交易, 2: 担保转账
        }).then((data)=>{
          console.log('驳回申述', data)
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      onPop3Ok() { // 终止交易确认
        this.showPop3 = false
        let text = MSGS.get(7, this.appl, this.recv).replace(/reason/, this.pop3TextOld);
        this.$refs.textarea.value = text;
        this.$refs.textarea.focus();
        this.WsProxy.send('control', 'a_terminate_order',{
          "id": this.JsonBig.parse("209038372436447232"), // this.otherInfo
          "type": 1, // 1: 订单, 2: 担保
          "responsible": this.JsonBig.parse("197113900708139008"), // this.otherInfo
          "info": this.pop3TextOld
        }).then((data)=>{
          console.log('终止交易', data)
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      onPop4Ok() { // 证明无效确认
        this.showPop4 = false;
        let text = MSGS.get(1, this.appl, this.recv).replace(/reason/, this.pop4TextOld);
        this.$refs.textarea.value = text;
        this.$refs.textarea.focus();
      },
      onClickImg(item) { // 点击放大图片
        this.showPopImg = true;
        this.popImgSrc = item.url;
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  *
    box-sizing border-box

  .right
    height 560px
    width 650px
    .h1
      height 49px
      border-bottom 1px solid #e1e1e1
      line-height 49px
      font-size 16px
      color #333
      letter-spacing 0.19px
      padding 0 20px
    .fixed
      margin 15px 0
      height 160px
      background #fff
      box-shadow 0 2px 4px 0 #999
      cursor pointer
      > h3
        height 45px
        padding 0 20px
        line-height 45px
        font-size 16px
        font-weight bold
        color #333
        letter-spacing 0.41px
        border-bottom 1px solid #e1e1e1
        &:before
          display inline-block
          position relative
          top 2px
          left 0
          content ''
          width 3px
          height 16px
          margin-right 10px
          background-color $col422

      .mf1
        padding 0 30px 0 20px
        height 60px
        display flex
        align-items center
        > img
          width 40px
          height 40px
          border-radius 50%
          margin-right 10px
        > span
          display inline-block
          color #333
          letter-spacing 0.27px
        > span.i1
          font-size 14px
          letter-spacing 0.29px
          flex-grow 1
        > span.i2
          font-size 13px
        > span.i3
          font-size 13px
          color #FF794C
          margin-left 5px
      .mf2
        height 30px
        margin-top 10px
        display flex
        padding 0 30px 0 20px
        > span
          font-size: 13px;
          letter-spacing 0.27px
          display inline-block
          color #FF794C
          flex-grow 1
          line-height 30px
        > button
          font-size: 13px;
          letter-spacing 0.27px
          display inline-block
          border 1px solid #FFB422
          border-radius 2px
          cursor pointer
          text-align center
          line-height 28px
          width 90px
        > button.i2
          background #FFB422
          color #FFF
          &:hover
            background #fea350
        > button.i3
          margin-left 10px
          color #FFB422
          background #fff
          &:hover
            background #fff3eb
    .scrollPane
      height 200px
    .msgBox
      padding 20px
      box-sizing border-box
      .lodingFlag
        width 16px
        height 16px
        margin 0 10px
        align-self center
        animation mymove 1.5s linear infinite;
        -webkit-animation mymove 1.5s linear infinite;
      .check-more
        font-size 11px
        color #ff794c
        margin-bottom 10px
        text-align center
        cursor pointer
      .tline
        text-align center
        > i
          font-size 11px
          color #999
          letter-spacing 0.12px
          background #E1E1E1
          border-radius 2px
          padding 1px 5px
      .message
        > p
          font-size 13px
          color #333333
          letter-spacing 0.16px
          margin-top 10px
          display flex
          align-items flex-start
          box-sizing border-box
          > img
            width 40px
            height 40px
            border-radius 50%
          > span
            border-radius 2px
            padding 10px
            line-height 20px
            position relative
            box-sizing border-box
            min-height 40px
            display inline-flex
            align-items center
            max-width 340px
            > img
              max-width 100px
              height auto
              border-radius 2px
              cursor pointer
          > span.img-wrap
            padding 0
          > i.err
            display inline-block
            width 16px
            height 16px
            background #FF794C
            align-self center
            margin 0 10px
            border-radius 50%
            text-align center
            line-height 16px
            font-size 12px
            cursor pointer
            &:before
              content "!"
              color #fff
        > p.al
          > span
            background #E1E1E1
            margin-left 18px
            &:before
              content ""
              height 2px
              display inline-block
              border-right 8px solid #e1e1e1
              border-top 5px solid transparent
              border-bottom 5px solid transparent
              position absolute
              left -8px
              top 15px
          > span.img-wrap
            background transparent
            &:before
              display none
        > p.ar
          flex-direction row-reverse
          > span
            background #FFB422
            margin-right 18px
            &:before
              content ""
              height 2px
              display inline-block
              border-left 8px solid #FFB422
              border-top 5px solid transparent
              border-bottom 5px solid transparent
              position absolute
              right -8px
              top 15px
          > span.img-wrap
            background transparent
            &:before
              display none
    .sendBox
      height 160px
      border-top 1px solid #D8D8D8
      .menu
        height 40px
        padding 0 20px
        display flex
        align-items center
        > img
          cursor pointer
        .br
          flex-grow 1
        > button
          font-size 12px
          color #FF794C
          letter-spacing 0
          border-radius 77px
          padding 6px 9px
          cursor pointer
          background #FFE4D3
          &:hover
            color #fea350
          &:not(:first-of-type)
            margin-left 10px
      .textarea
        padding 5px 10px
        height 90px
        width 100%
        resize none
        border none
        outline none
        background transparent
        display block
      .bottom
        height 30px
        font-size 12px
        color #999
        letter-spacing 0.14px
        padding 0 20px
        text-align right
        > button
          margin-left 10px
          background #ffb422
          padding 4px 15px
          color #fff
          border-radius 2px
          cursor pointer
          font-size 12px
          letter-spacing 1px
          &:hover
            background #fea350

  .pop
    padding 30px 60px
    > h2
      height 30px
      padding-left 5px
      line-height 30px
      font-size $fz20
      font-weight bold
      color $col333
      letter-spacing 0.41px
      &::before
        display inline-block
        position relative
        top 2px
        left 0
        content ''
        width 3px
        height 20px
        margin-right 10px
        background-color $col422
    .head
      display flex
      justify-content center
      align-items center
      height 40px
      margin 20px 0
      > img
        width 40px
        height 40px
      > span
        margin-left 10px
        font-size 14px
        color #333
        letter-spacing 0.29px
    .head2
      display flex
      justify-content center
      align-items center
      height 130px
      .hi
        display flex
        flex-direction column
        cursor pointer
        margin 0 50px
        font-size 14px
        letter-spacing 0.29px
        &:hover
          color #666
        .radio
          margin-top 5px
          width 40px
          height 20px
          font-size 13px
          color #333333
          letter-spacing 0.27px
          display inline-block
          cursor pointer
          background url(/static/images/unselect.png) no-repeat center center
          &.check
            background-image url(/static/images/selected.png)
        > img
          width 40px
          height 40px
        > span
          margin-top 5px
    .textarea
      width 350px
      height 150px
      border 1px solid #E1E1E1
      border-radius 2px
      > textarea
        border none
        outline none
        resize none
        height 120px
        display block
        width 100%
        padding 10px
      > p
        text-align right
        height 30px
        line-height 30px
        font-size 13px
        color #999
        letter-spacing 0
        padding 0 10px
    .btns
      margin 20px 0
      display flex
      > button
        width 160px
        height 40px
        border-radius 2px
        font-size 14px
        letter-spacing 0.29px
        cursor pointer
      > button.b1
        margin-right 15px
        background #FFB422
        border 1px solid #FFB422
        color #fff
        &:hover
          background #fea350
      > button.b2
        margin-left 15px
        background #FFF
        border 1px solid #FFB422
        color #ffb422
        &:hover
          background #fff3eb

  placeholder()

  /* 轮播图展示 */
  .swiper-container, swiper-container-horizontal
    width 610px
    margin 0 20px


</style>

