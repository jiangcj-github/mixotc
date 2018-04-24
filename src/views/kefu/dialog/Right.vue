<template>
  <div class="right">
    <div class="h1">李小蹦</div>
    <div class="fixed" v-if="appl===0&&recv===0">
      <h3>申诉人</h3>
      <div class="mf1">
        <img src="/static/images/default_avator.png">
        <span class="i1">王华华</span>
        <span class="i2">已标记付款</span>
        <span class="i3">69分钟</span>
      </div>
      <div class="mf2">
        <span class="i1">已被申诉1次</span>
        <button class="i2" @click="onClickMf2">强制放币</button>
        <button class="i3" @click="onClickMf3">终止交易</button>
        <button class="i3" @click="onClickMf4">驳回申诉</button>
      </div>
    </div>
    <div class="fixed" v-else-if="appl===0&&recv===1">
      <h3>被申诉人</h3>
      <div class="mf1">
        <img src="/static/images/default_avator.png">
        <span class="i1">王华华</span>
        <span class="i2">已标记付款</span>
        <span class="i3">69分钟</span>
      </div>
      <div class="mf2">
        <span class="i1">已被申诉一次</span>
        <button class="i2" @click="onClickMf2">强制放币</button>
        <button class="i3" @click="onClickMf3">终止交易</button>
      </div>
    </div>
    <div class="fixed" v-else-if="appl===1&&recv===1">
      <h3>申诉人</h3>
      <div class="mf1">
        <img src="/static/images/default_avator.png">
        <span class="i1">王华华</span>
        <span class="i2">已标记付款</span>
        <span class="i3">69分钟</span>
      </div>
      <div class="mf2">
        <span class="i1">已被申诉一次</span>
        <button class="i2" @click="onClickMf2">强制放币</button>
        <button class="i3" @click="onClickMf3">终止交易</button>
        <button class="i3" @click="onClickMf4">驳回申诉</button>
      </div>
    </div>
    <div class="fixed" v-else-if="appl===1&&recv===0">
      <h3>被申诉人</h3>
      <div class="mf1">
        <img src="/static/images/default_avator.png">
        <span class="i1">王华华</span>
        <span class="i2">已标记付款</span>
        <span class="i3">69分钟</span>
      </div>
      <div class="mf2">
        <span class="i1">已被申诉一次</span>
        <button class="i2" @click="onClickMf2">强制放币</button>
        <button class="i3" @click="onClickMf3">终止交易</button>
      </div>
    </div>
    <happy-scroll color="rgba(200,200,200,0.8)" size="5" bigger-move-h="end" resize hide-horizontal class="scrollPane">
      <div class="msgBox">
        <div class="tline"><i>12月19日 12:12</i></div>
        <p v-for="(e,i) in msgHis" :key="i" :class="{al:!e.isSend,ar:e.isSend}">
          <img :src="e.headimg"/>
          <span v-if="e.type===0">{{e.text}}</span>
          <span v-else-if="e.type===1" class="img-wrap"><img :src="e.url" @click="onClickImg(e)"/></span>
          <i class="err" title="发送失败" v-if="e.err===1" @click="resend(e)"></i>
        </p>
        <!--
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span class="img-wrap"><img src="/static/images/kefu/background.jpg"></span>
          <i class="err" title="发送失败"></i>
        </p>
        -->
      </div>
    </happy-scroll>
    <div class="sendBox">
      <div class="menu">
        <img src="/static/images/kefu/album.png" @click="$refs.file.click()" title="发送图片">
        <input type="file" ref="file" v-show="0" accept="image/*" @change="chooseImage">
        <span class="br"></span>
        <button class="b1" @click="onClickM0">上传付款证明</button>
        <button class="b2" @click="showPop4=true">证明无效</button>
        <button class="b3" @click="onClickM2">通知放币</button>
      </div>
      <textarea ref="textarea" class="textarea" title=""
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
          <button class="b1">确认</button>
          <button class="b2" @click="showPop1=false">我再想想</button>
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
          <button class="b1">确认</button>
          <button class="b2" @click="showPop2=false">我再想想</button>
        </div>
      </div>
    </BasePopup>
    <!--终止交易-->
    <BasePopup :width="470" :height="430" :top="50" :show="showPop3">
      <div class="pop">
        <h2>选择终止交易的责任人</h2>
        <div class="head2">
          <div class="hi" @click="pop3Radio=0">
            <img src="/static/images/default_avator.png">
            <span>李小蹦</span>
            <span class="radio" :class="{check:pop3Radio===0}"></span>
          </div>
          <div class="hi" @click="pop3Radio=1">
            <img src="/static/images/default_avator.png">
            <span>王华华</span>
            <span class="radio" :class="{check:pop3Radio===1}"></span>
          </div>
        </div>
        <div class="textarea">
          <textarea placeholder="填写强制放币的理由" ref="pop3Text" v-model="pop3Text" @input="onPop3Input"></textarea>
          <p>{{pop3Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1">确认</button>
          <button class="b2" @click="showPop3=false">我再想想</button>
        </div>
      </div>
    </BasePopup>
    <!--证明无效-->
    <BasePopup :width="470" :height="280" :top="50" :show="showPop4">
      <div class="pop">
        <div class="textarea">
          <textarea placeholder="填写证明无效的理由" ref="pop4Text" v-model="pop4Text" @input="onPop4Input"></textarea>
          <p>{{pop4Text.length}}/50</p>
        </div>
        <div class="btns">
          <button class="b1" @click="onPop4Ok">确认</button>
          <button class="b2" @click="showPop4=false">我再想想</button>
        </div>
      </div>
    </BasePopup>
  </div>
</template>
<script>
  import { HappyScroll } from 'vue-happy-scroll';
  import BasePopup from "@/components/common/BasePopup";
  import ImagePopup from "../widges/ImagePopup";
  import MSGS from "./msg.js";

  export default {
    components: {
      HappyScroll,
      BasePopup,
      ImagePopup,
    },
    data() {
      return {
        sendFile: "",
        sendMsg: "",
        sendMsgOld: "",
        msgHis: [],

        appl: 0,  //申诉人：0-买家,1-卖家
        recv: 0, //收件人：0-买家,1-卖家
        resp: 0, //责任人：0-买家,2-卖家
        orderId: "",

        showPopImg: false,
        popImgSrc: "",

        showPop1: false,
        pop1Text: "",
        pop1TextOld: "",

        showPop2: false,
        pop2Text: "",
        pop2TextOld: "",

        showPop3: false,
        pop3Text: "",
        pop3TextOld: "",
        pop3Radio: 1,

        showPop4: false,
        pop4Text: "",
        pop4TextOld: "",

      }
    },
    methods: {
      chooseImage(){
        this.sendFile=this.$refs.file.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(this.sendFile);
        reader.onload = ((e)=>{
          //发送图片
          //
          this.msgHis.push({
            headimg:"/static/images/default_avator.png",
            url: e.target.result,
            type:1,
            isSend:1,
            err:1,
          });
        });
      },
      onCtrlEnter(){
        this.$refs.textarea.value+="\n";
        console.log("dd");
      },
      send(){console.log("aa");
        let text=this.$refs.textarea.value;
        if(/^\s*$/.test(text)) return;
        //发送信息
        this.msgHis.push({
          headimg:"/static/images/default_avator.png",
          text:text,
          type:0,
          isSend:1,
          err:1,
        });
        this.$refs.textarea.value=null;
      },
      resend(item){
        item.err=0;
        setTimeout(()=>{item.err=1;},2000);
      },
      onClickM0(){
        let text=MSGS.get(0,this.appl,this.recv);
        this.$refs.textarea.value=text;
        this.$refs.textarea.focus();
      },
      onClickM2(){
        let text=MSGS.get(4,this.appl,this.recv);
        this.$refs.textarea.value=text;
        this.$refs.textarea.focus();
      },
      onPop1Input(){
        if(this.pop1Text.length>50){
          this.pop1Text=this.pop1TextOld;
          this.$refs.pop1Text.value=this.pop1TextOld;
        }else{
          this.pop1TextOld=this.pop1Text;
        }
      },
      onPop2Input(){
        if(this.pop2Text.length>50){
          this.pop2Text=this.pop2TextOld;
          this.$refs.pop2Text.value=this.pop2TextOld;
        }else{
          this.pop2TextOld=this.pop2Text;
        }
      },
      onPop3Input(){
        if(this.pop3Text.length>50){
          this.pop3Text=this.pop3TextOld;
          this.$refs.pop3Text.value=this.pop3TextOld;
        }else{
          this.pop3TextOld=this.pop3Text;
        }
      },
      onPop4Input(){
        if(this.pop4Text.length>50){
          this.pop4Text=this.pop4TextOld;
          this.$refs.pop4Text.value=this.pop4TextOld;
        }else{
          this.pop4TextOld=this.pop4Text;
        }
      },
      onPop4Ok(){
        this.showPop4=false;
        let text=MSGS.get(1,this.appl,this.recv);
        this.$refs.textarea.value=text;
        this.$refs.textarea.focus();
      },
      onClickMf2(){
        let text=MSGS.get(5,this.appl,this.recv);
        this.$refs.textarea.value=text;
        this.$refs.textarea.focus();
      },
      onClickMf3(){
        let text=MSGS.get(7,this.appl,this.recv);
        this.$refs.textarea.value=text;
        this.$refs.textarea.focus();
      },
      onClickMf4(){
        let text=MSGS.get(2,this.appl,this.recv);
        this.$refs.textarea.value=text;
        this.$refs.textarea.focus();
      },
      onClickImg(item){
        this.showPopImg=true;
        this.popImgSrc=item.url;
      }
    },
    mounted(){
      this.msgHis=[
        {headimg:"/static/images/default_avator.png",text:"你好",type:0,isSend:0,err:0},
        {headimg:"/static/images/default_avator.png",text:"有事吗",type:0,isSend:0,err:0},
        {headimg:"/static/images/default_avator.png",text:"你好",type:0,isSend:0,err:0},
        {headimg:"/static/images/default_avator.png",text:"是您的验证码，请尽快提交验证，切勿泄露给他人，如非本人操作请忽略",type:0,isSend:1,err:0},
        {headimg:"/static/images/default_avator.png",text:"上传付款证明",type:0,isSend:1,err:0},
        {headimg:"/static/images/default_avator.png",text:"请提交付款证明",type:0,isSend:0,err:0},
        {headimg:"/static/images/default_avator.png",url:"/static/images/kefu/background.jpg",type:1,isSend:0,err:1},
        {headimg:"/static/images/default_avator.png",url:"/static/images/kefu/background.jpg",type:1,isSend:1,err:1},
      ];
      this.Bus.$on("onIpClose",()=>{
        this.showPopImg=false;
      });
    },
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
      margin 15px 20px
      height 160px
      background #fff
      box-shadow 0 2px 4px 0 #999
      >h3
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
        >img
          width 40px
          height 40px
          border-radius 50%
          margin-right 10px
        >span
          display inline-block
          color #333
          letter-spacing 0.27px
        >span.i1
          font-size 14px
          letter-spacing 0.29px
          flex-grow 1
        >span.i2
          font-size 13px
        >span.i3
          font-size 13px
          color #FF794C
          margin-left 5px
      .mf2
        height 30px
        margin-top 10px
        display flex
        padding 0 30px 0 20px
        >span
          font-size: 13px;
          letter-spacing 0.27px
          display inline-block
          color #FF794C
          flex-grow 1
          line-height 30px
        >button
          font-size: 13px;
          letter-spacing 0.27px
          display inline-block
          border 1px solid #FFB422
          border-radius 2px
          cursor pointer
          text-align center
          line-height 28px
          width 90px
        >button.i2
          background #FFB422
          color #FFF
          &:hover
            background #fea350
        >button.i3
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
      .tline
        text-align center
        >i
          font-size 11px
          color #999
          letter-spacing 0.12px
          background #E1E1E1
          border-radius 2px
          padding 1px 5px
      >p
        font-size 13px
        color #333333
        letter-spacing 0.16px
        margin-top 10px
        display flex
        align-items flex-start
        box-sizing border-box
        >img
          width 40px
          height 40px
          border-radius 50%
        >span
          border-radius 2px
          padding 10px
          line-height 20px
          position relative
          box-sizing border-box
          min-height 40px
          display inline-flex
          align-items center
          max-width 340px
          >img
            max-width 100px
            height auto
            border-radius 2px
            cursor pointer
        >span.img-wrap
          padding 0
        >i.err
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
      >p.al
        >span
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
        >span.img-wrap
          background transparent
          &:before
            display none
      >p.ar
        flex-direction row-reverse
        >span
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
        >span.img-wrap
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
        >img
          cursor pointer
        .br
          flex-grow 1
        >button
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
        >button
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
    >h2
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
      >img
        width 40px
        height 40px
      >span
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
          background  url(/static/images/unselect.png) no-repeat center center
          &.check
            background-image url(/static/images/selected.png)
        >img
          width 40px
          height 40px
        >span
          margin-top 5px
    .textarea
      width 350px
      height 150px
      border 1px solid #E1E1E1
      border-radius 2px
      >textarea
        border none
        outline none
        resize none
        height 120px
        display block
        width 100%
        padding 10px
      >p
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
      >button
        width 160px
        height 40px
        border-radius 2px
        font-size 14px
        letter-spacing 0.29px
        cursor pointer
      >button.b1
        margin-right 15px
        background #FFB422
        border 1px solid #FFB422
        color #fff
        &:hover
          background #fea350
      >button.b2
        margin-left 15px
        background #FFF
        border 1px solid #FFB422
        color #ffb422
        &:hover
          background #fff3eb
  .popImg
    max-width 800px
    >img
      width 100%
      height auto
  placeholder()
</style>
