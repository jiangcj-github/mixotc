<template>
  <div class="right">
    <div class="h1">{{user}}({{isBuyer}})</div>

    <!-- 对话框展示 -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="fixed swiper-slide" v-for="(content, index) in otherInfo" >
          <h3>{{appl === 1 ? '申诉人' : '被申诉人'}}</h3>
          <div class="mf1">
            <img :src="content.icon ? `${HostUrl.http}image/${content.icon}` : `/static/images/default_avator.png`" @click="changeUser(index)">
            <span class="i1" @click="changeUser(index)">{{content.name}}</span>
            <span class="i2">已标记付款</span>
            <span class="i3">{{Math.floor(((new Date().getTime() / 1000) - content.update) / 60)}}分钟</span>
          </div>
          <div class="mf2">
            <span class="i1">已被申诉{{content.times}}次</span>
            <button class="i2" @click="forceIcon(index)">强制放币</button>
            <button class="i3" @click="stopTrade(index)">终止交易</button>
            <button class="i3" @click="rejectAppeal(index)" v-if="appl === 0">驳回申诉</button>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev" v-if="otherInfo && otherInfo.length > 1"></div>
      <div class="swiper-button-next" v-if="otherInfo && otherInfo.length > 1"></div>
    </div>

    <!-- 聊天-->
    <happy-scroll color="rgba(200,200,200,0.8)" size="5" bigger-move-h="end" resize hide-horizontal class="scrollPane">
      <div class="msgBox">
        <p class="check-more" @click="checkMore(10)">查看更多</p>
        <div v-for="(item, index) in msgHis" :key="index" class="message">
          <div class="tline" v-if="index> 0 && dealTime(msgHis[index-1].time, item.time)"><i>{{dealTime(msgHis[index-1].time, item.time)}}</i></div>
          <p :class="{al: item.isSend !== JsonBig.stringify($store.state.userInfo.uid), ar: item.isSend == JsonBig.stringify($store.state.userInfo.uid)}">
            <img :src="item.headimg" alt=""/>
            <span v-if="item.type === 0" v-html="item.content"></span>
            <span v-else-if="item.type === 1" class="img-wrap"><img :src="item.content" @click="onClickImg(item)"/></span>
            <i class="err" title="发送失败" v-if="!item.isLoding && item.err" @click="resend(item)"></i>
            <img src="/static/images/loding.png" class="lodingFlag" v-if="item.isLoding" alt="">
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
      <div contenteditable="true" ref="textarea" class="textarea" title=""
                v-html="sendMsg"
                @keydown.enter.exact="send"
                @keydown.ctrl.enter="onCtrlEnter">
      </div>
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
        <div class="head"><img :src="forceIconNameIcon"><span>{{forceIconName}}</span></div>
        <div class="textarea">
          <textarea placeholder="填写强制放币的理由" ref="pop1Text" v-model="pop1Text" @input="onPop1Input"></textarea>
          <p>{{pop1Text.length}}/50</p >
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
    <BasePopup :width="470" :height="402" :top="50" :show="showPop3">
      <div class="pop">
        <h2>选择终止交易的责任人</h2>
        <div class="head2">
          <div class="hi" @click="seletPop3Radio(0)">
            <span class="radio" :class="{check: pop3Radio === 0}"></span>
            <img :src="stopTradeUserIcon">
            <span>{{stopTradeUser}}</span>
          </div>
          <div class="hi" @click="seletPop3Radio(1)">
            <span class="radio" :class="{check: pop3Radio === 1}"></span>
            <span class="pop1Text">双方协议，无责任人</span>
          </div>
        </div>
        <p class="pop1Remind">责任用户取消交易权限3天。仲裁3次，永久关闭交易权限</p>
        <div class="textarea">
          <textarea placeholder="填写强制放币的理由" ref="pop3Text" v-model="pop3Text" @input="onPop3Input"></textarea>
          <p>{{pop1Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1" @click="onPop3Ok">确认</button>
          <button class="b2" @click="showPop3 = false">我再想想</button>
        </div>
      </div>
    </BasePopup>
    <!--<BasePopup :width="470" :height="430" :top="50" :show="showPop3">-->
      <!--<div class="pop">-->
        <!--<h2>选择终止交易的责任人</h2>-->
        <!--<div class="head2">-->
          <!--<div class="hi hi-left" @click="pop3Radio = 0">-->
            <!--<img :src="stopTradeUserIcon">-->
            <!--<span>{{stopTradeUser}}</span>-->
            <!--<span class="radio" :class="{check: pop3Radio === 0}"></span>-->
          <!--</div>-->
          <!--<div class="hi hi-right" @click="pop3Radio = 1">-->
            <!--<img :src="stopTradeOtherIcon">-->
            <!--<span>{{stopTradeOther}}</span>-->
            <!--<span class="radio" :class="{check: pop3Radio === 1}"></span>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="textarea">-->
          <!--<textarea placeholder="填写强制放币的理由" ref="pop3Text" v-model="pop3Text" @input="onPop3Input"></textarea>-->
          <!--<p>{{pop3Text.length}}/50</p>-->
        <!--</div>-->
        <!--<div class="btns">-->
          <!--<button class="b1" @click="onPop3Ok">确认</button>-->
          <!--<button class="b2" @click="showPop3 = false">我再想想</button>-->
        <!--</div>-->
      <!--</div>-->
    <!--</BasePopup>-->
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
        popIndex: 0,
        // updateTime: "", // 标记时间
        // msgHis: [],

        // appl: 0, // 申诉人：0-买家,1-卖家
        recv: 0, // 收件人：0-买家,1-卖家
        // resp: 0, // 责任人：0-买家,2-卖家
        orderId: "",
        isBuyer: "", // 显示买卖家

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

        forceIconName: "", // 强制放币弹窗
        forceIconNameIcon: "", // 强制放币头像
        forceIconObj: {}, // 强制放币弹窗所用参数

        rejectAppealObj: {}, // 驳回申述弹窗所用参数

        stopTradeUser: "", // 终止交易发起人
        stopTradeOther: "", // 终止交易发起人对方
        stopTradeUserIcon: "", // 终止交易发起人头像
        stopTradeOtherIcon: "", // 终止交易发起人对方头像
        stopTradePerson: 0, // 终止交易发起责任人
        stopTradeObj: {} // 终止交易弹窗所用参数

      }
    },
    computed: {
      user() { // 监听右侧当前聊天人员
        // console.log('当前', this.$store.state.serviceNow)
        let result = '';
        this.$store.state.serviceData.forEach(item => {
          // console.log('当前', item)
          if (item.user_id === this.$store.state.serviceNow) {
            result = item.user_name
          }
        });
        this.startSwiper() // 轮播图切换
        return result
      },
      serviceNow() { // 当前聊天人员id
        return this.$store.state.serviceNow
      },
      serviceUser() { // 当前聊天人员具体信息
        return this.$store.state.serviceUser
      },
      serviceData() { // 左侧存储信息
        return this.$store.state.serviceData
      },
      msgHis() { // 当前聊天信息
        return this.$store.state.serviceMessage[this.serviceNow] ? this.$store.state.serviceMessage[this.serviceNow] : []
      },
      otherInfo() { // 对方信息
        return this.$store.state.serviceNowOther
      },
      appl() {
        let applUser; //197113900708139008
        this.otherInfo.forEach(v => {
          if (v.appellant_id == this.serviceNow) { // 是否为申述人 0 申诉 1 被申诉
            applUser = 0;
            this.recv = v.buyer_id == this.serviceNow ?  0 : 1; // 是否为买家 0 买 1 卖
            this.isBuyer = v.buyer_id == this.serviceNow ?  "买家" : "卖家";
          } else {
            applUser = 1;
            this.recv = v.buyer_id == this.serviceNow ?  1 : 0; // 是否为买家 0 买 1 卖
            this.isBuyer = v.buyer_id == this.serviceNow ?  "买家" : "卖家";
          }
        })
        console.log('applUser', applUser, this.recv)
        return applUser
      }
    },
    watch: { // 默认显示三条数据
      serviceNow:{
        handler(curvalue){
          let serviceMessage = this.$store.state.serviceMessage[curvalue];
          if (!serviceMessage || serviceMessage && serviceMessage.length === 0) {
            this.checkMore(3)
          }
        },
        immediate: true
      }
    },
    mounted() {
      this.startSwiper();
      // 获取聊天消息
      let _this = this;
      this.Bus.$on("onIpClose", () => {
        this.showPopImg = false;
      });
    },
    methods: {
       startSwiper() {
         new Swiper('.swiper-container', { // 调用轮播图
           nextButton: '.swiper-button-next',
           prevButton: '.swiper-button-prev',
           observer: true, //修改swiper自己或子元素时，自动初始化swiper
           observeParents: true,//修改swiper的父元素时，自动初始化swiper
           onSlideChangeEnd(swiper) {
             swiper.update(); //swiper更新
           }
         })
       },
      onCtrlEnter() { // 换行
        this.$refs.textarea.value += "\n";
      },
      changeUser(index) { // 点击切换身份
        this.WsProxy.send('control', 'a_get_user_appeals', { // 获取点击人对方资料
          "user_id": this.appl === 0 ? this.JsonBig.parse(this.otherInfo[index].appellee_id) : this.JsonBig.parse(this.otherInfo[index].appellant_id)
        }).then(data => {
          console.log('反转申述人', data, this.appl);
          this.$store.commit({type: 'changeServiceNowtalk', data: Object.assign({data}, {id: this.appl === 0 ? this.JsonBig.stringify(this.otherInfo[index].appellee_id) : this.JsonBig.stringify(this.otherInfo[index].appellant_id)})}) // 存储右边聊天人员
          this.$store.commit({type: 'transformServiceUser', data: {id: this.appl === 0 ? this.JsonBig.stringify(this.otherInfo[index].appellant_id) : this.JsonBig.stringify(this.otherInfo[index].appellee_id)}}) // 存储右边聊天人员
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
          err: false, // 0: 发送成功, 1: 发送失败
          time: time
        };
        this.$store.commit({type: 'addServiceMessages', data:{id: this.serviceNow, msg: obj }})
      },
      async chooseImage() { // 上传图片
        this.sendFile = this.$refs.file.files[0];
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
        if (/^\s*$/.test(this.$refs.textarea.innerHTML)) return;
        let time = new Date() - 0;
        this.addStoreMessages(0, this.$refs.textarea.innerHTML, time)
        // 发送消息
        this.WsProxy.sendMessage({
          type: 'text',
          // gid: this.JsonBig.parse("197129593973379072"),
          tid: this.JsonBig.parse(this.serviceNow),
          data:{
            uid: this.$store.state.userInfo.uid,
            rid: this.JsonBig.parse(this.serviceNow),
            tid: this.JsonBig.parse(this.serviceNow),
            msg: this.$refs.textarea.innerHTML
          }
        }).then(data => { // 发送消息成功后更改原保存信息
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:0 }})
        }).catch(error => {
          this.$store.commit({type: 'changeServiceMessages', data:{id: this.serviceNow, time: time, code:1 }})
        });
        this.$refs.textarea.innerHTML = '';
      },
      // resend(item) { // 发送失败
      //   item.err = 0;
      //   setTimeout(() => {
      //     item.err = 1;
      //   }, 2000);
      // },
      async checkMore(num) { // 查看更多消息
        console.log(this.serviceNow, this.JsonBig.parse(this.serviceNow))
        let result = [];
        await this.WsProxy.send('control', 'get_history_msgs', {
          peer_id: this.JsonBig.parse(this.serviceNow),
          group_id: 0,
          last_msg_id: this.msgHis[0] && this.msgHis[0].id ? this.JsonBig.parse(this.msgHis[0].id) : 0,
          is_peer_admin: 1,
          count: num
        }).then(data => {
          console.log('更多', data)
          //(!data.msgs || data.msgs.length < num) && this.$store.commit({type: 'changeServiceMoreFlag', data:{id: this.serviceNow, flag: false }})
          if (!data.msgs) return;
          let uid = this.JsonBig.stringify(this.$store.state.userInfo.uid)
          data.msgs.forEach(item => {
            let sender_id = this.JsonBig.stringify(item.sender_id),
                create_time = item.create_time * 1000;
            result.push({
              id: this.JsonBig.stringify(item.id),
              isSend: sender_id === uid ? uid : sender_id,
              headimg: sender_id === uid ? `/static/images/kefu/kefu.png` : (this.serviceUser.user_icon ? `${this.HostUrl.http}image/${this.serviceUser.user_icon}` : `/static/images/default_avator.png`),
              type: item.type === 'image' ? 1 : 0,
              content: item.type === 'image' ? `${this.HostUrl.http}file/${item.data.id}` : item.data.msg,
              // isLoding: item.type === 'image' ? true : false,
              isLoding: false,
              err: false,
              time: create_time
            })
          })
        })
        this.$store.commit({type: 'moreServiceMessage', data:result })
      },
      // 处理是否显示消息时间
      dealTime(time1, time2) {
        if(time2 - time1 < 180000) return false;
        return time2.formatTime()
      },
      onClickM0() { // 点击上传付款证明按钮
        let text = MSGS.get(0, this.appl, this.recv);
        text = text.replace(/orderId/, `<a href="#/order" style="color:#00A123">(${this.otherInfo[0].sid})</a>`).replace(/trade_code/, `<i style="color:#FF794C">[${this.otherInfo[0].trade_code}]</i>`);
        this.$refs.textarea.innerHTML = text;
        this.$refs.textarea.focus();
      },
      onClickM1() { // 点击通知放币按钮
        let text = MSGS.get(3, this.appl, this.recv).replace(/orderId/,  `<a href="#/order" style="color:#00A123">(${this.otherInfo[0].sid})</a>`);
        this.$refs.textarea.innerHTML = text;
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
      forceIcon(index) { // 强制放币弹窗
        this.popIndex = index
        this.showPop1 = true
        this.forceIconName = this.appl === 0 ? this.otherInfo[index].name : this.serviceUser.user_name
        this.forceIconNameIcon = this.otherInfo[0].icon ? `${this.HostUrl.http}image/${this.otherInfo[index].icon}` : `/static/images/default_avator.png`
        this.forceIconObj = {
          "id": this.JsonBig.parse(this.otherInfo[index].sid),
          "seller": this.JsonBig.parse(this.otherInfo[index].seller_id),
          "buyer": this.JsonBig.parse(this.otherInfo[index].buyer_id),
          "responsible": this.JsonBig.parse(this.otherInfo[index].seller_id),
        }
      },
      rejectAppeal(index) { // 驳回申述弹窗
        this.popIndex = index
        this.showPop2 = true
        this.rejectAppealObj = {
          "id": this.JsonBig.parse(this.otherInfo[index].sid),
        }
      },
      seletPop3Radio(num) { // 终止交易弹窗单选按钮
        this.pop3Radio = num
        this.stopTradePerson = this.pop3Radio === 0 ? this.serviceUser.user_id : 0
        console.log('this.popIndex', this.popIndex)
        this.comfirmStopTradeObj(this.popIndex)
      },
      comfirmStopTradeObj(index) { // 定义终止交易弹窗对象
        this.stopTradeObj = {
          "id": this.JsonBig.parse(this.otherInfo[index].sid), // this.otherInfo
          "responsible": this.JsonBig.parse(this.stopTradePerson), // this.otherInfo
        }
      },
      stopTrade(index) { // 终止交易弹窗
        this.popIndex = index
        this.stopTradeUser = this.serviceUser && this.serviceUser.user_name // 终止交易发起人名
        this.stopTradeOther = this.otherInfo && this.otherInfo[index].name // 终止交易发起对方人名
        this.stopTradeUserIcon = this.serviceUser.user_icon ? `${this.HostUrl.http}image/${this.serviceUser.user_icon}` : `/static/images/default_avator.png`
        this.stopTradeOtherIcon = this.otherInfo[index].icon ? `${this.HostUrl.http}image/${this.otherInfo[index].icon}` : `/static/images/default_avator.png`
        this.showPop3 = true
        this.comfirmStopTradeObj(index)
      },

      onPop1Ok() { // 强制放币确认
        this.showPop1 = false
        let text = MSGS.get(4, this.appl, this.recv).replace(/orderId/,  `<a href="#/order" style="color:#00A123">(${this.otherInfo[this.popIndex].sid})</a>`).replace(/reason/, this.pop1TextOld);
        this.sendMsg = text;
        this.$refs.textarea.focus();
        this.WsProxy.send('control', 'a_send_order',
          Object.assign(this.forceIconObj, {"info": this.pop1TextOld})
        ).then((data)=>{
          console.log('强制放币', data)
          this.$store.commit({type: 'stopTrade', data: this.otherInfo})
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      onPop2Ok() { // 驳回申述确认
        this.showPop2 = false
        let text = MSGS.get(2, this.appl, this.recv).replace(/orderId/,  `<a href="#/order" style="color:#00A123">(${this.otherInfo[this.popIndex].sid})</a>`).replace(/reason/, this.pop2TextOld);
        this.sendMsg = text;
        this.$refs.textarea.focus();
        this.WsProxy.send('control', 'a_reject_appeal',
          Object.assign(this.rejectAppealObj, {"type": 1}) // 1: 交易, 2: 担保转账
        ).then((data)=>{
          console.log('驳回申述', data)
          this.$store.commit({type: 'stopTrade', data: this.otherInfo})
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      onPop3Ok() { // 终止交易确认
        this.showPop3 = false
        let text = MSGS.get(6, this.appl, this.recv).replace(/orderId/,  `<a href="#/order" style="color:#00A123">(${this.otherInfo[this.popIndex].sid})</a>`).replace(/reason/, this.pop3TextOld);
        this.sendMsg = text;
        this.$refs.textarea.focus();
        this.WsProxy.send('control', 'a_terminate_order',
          Object.assign(this.stopTradeObj, {
            "type": 1, // 1: 订单, 2: 担保
            "info": this.pop3TextOld
          })
        ).then((data)=>{
          this.$store.commit({type: 'stopTrade', data: this.otherInfo})
          console.log('终止交易', data)
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      onPop4Ok() { // 证明无效确认
        this.showPop4 = false;
        let text = MSGS.get(1, this.appl, this.recv);
        text = text.replace(/reason/, this.pop4TextOld).replace(/trade_code/, `<span style="color:#FF794C">[${this.otherInfo[0].trade_code}]</span>`);
        this.sendMsg= text;
        this.$refs.textarea.focus();

      },
      onClickImg(item) { // 点击放大图片
        this.showPopImg = true;
        this.popImgSrc = item.content;
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
      .message
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
            /*display inline-flex*/
            /*align-items center*/
            max-width 340px
            > img
              max-width 100px
              height auto
              border-radius 2px
              cursor pointer
          > span.img-wrap
            /*padding 0*/
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
            margin-bottom 10px
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

        > p.ar
          flex-direction row-reverse
          > span
            background #FFB422
            margin-right 18px
            margin-bottom 10px
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
          color #FEA350
          letter-spacing 0
          border-radius 77px
          padding 6px 9px
          cursor pointer
          background #FFE4D3
          &:hover
            color #FF794C
          &:not(:first-of-type)
            margin-left 10px
      .textarea
        height 90px
        width 100%
        padding 5px 10px
        font-size 12px
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
    .pop1Remind
      font-size 12px
      color #FF794C
      margin-bottom 10px
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
        border-radius 50%
      > span
        margin-left 10px
        font-size 14px
        color #333
        letter-spacing 0.29px
    .head2
      display flex
      align-items center
      justify-content space-between
      margin 30px 0 20px
      .hi:first-child
        width 200px
      .hi:last-child
        .pop1Text
          font-size 12px
          color #333
      .hi
        display flex
        align-items center
        > img
          width 40px
          height 40px
          margin-right  10px
          border-radius 50%
        .radio
          width 16px
          height 16px
          margin-right 10px
          font-size 13px
          color #333
          letter-spacing 0.27px
          display inline-block
          cursor pointer
          background url(/static/images/unselect.png) no-repeat center center
          &.check
            background-image url(/static/images/selected.png)
    /*.head2*/
      /*display flex*/
      /*justify-content center*/
      /*align-items center*/
      /*height 130px*/
      /*.hi*/
        /*display flex*/
        /*flex-direction column*/
        /*cursor pointer*/
        /*margin 0 50px*/
        /*font-size 14px*/
        /*letter-spacing 0.29px*/
        /*&:hover*/
          /*color #666*/
        /*.radio*/
          /*margin-top 5px*/
          /*width 40px*/
          /*height 20px*/
          /*font-size 13px*/
          /*color #333*/
          /*letter-spacing 0.27px*/
          /*display inline-block*/
          /*cursor pointer*/
          /*background url(/static/images/unselect.png) no-repeat center center*/
          /*&.check*/
            /*background-image url(/static/images/selected.png)*/
        /*> img*/
          /*width 40px*/
          /*height 40px*/
          /*border-radius 50%*/
        /*> span*/
          /*margin-top 5px*/
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
  .swiper-button-next, .swiper-button-prev
    background-image none
    width 20px
    height 20px
    border-top 2px solid #999
    border-right 2px solid #999
    transform rotate(45deg)
    margin-top -7px
  .swiper-button-prev
    transform rotate(-135deg)


</style>

