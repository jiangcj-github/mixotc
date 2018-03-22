<template>
  <!-- 聊天框 -->
  <div class='chatroom'>
    <div class='top'>聊天{{tid}}</div>
    <div class='content'>
      <div class='wrap' ref='messages'>
        <ul>
          <li v-for="(item, index) of curmessage" :key="index">
            <div class='itemsg' :class="item.from === id ? 'right' : 'left'">
              <p>{{item.from}}</p>
              <p v-if="item.data.msg">
                <span v-if="!expressions.includes(item.data.msg)">{{item.data.msg}}</span>
                <img :src="require(`@/assets/ee_${iconNumber(expressions.indexOf(item.data.msg) + 1)}.png`)" alt="" v-if="expressions.includes(item.data.msg)">
              </p>
              <p v-if="item.data.id">
                <img :src="`/api/image/${item.data.id}`" alt="">
              </p>
              <!-- <p v-if="item.data.ext">
                <a :href="`http://120.76.213.235/file/${item.data.id}`" target='_blank'></a>
              </p> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 输入框 -->
    <div class='shuru'>
      <!-- 传输文件和图片 -->
      <Expression
        v-clickHide="hideExpression" 
        class='expression' 
        v-if="showExpression" 
        :showExpression.sync="showExpression"
        v-on:express="setExpress"
        >
      </Expression>
      <div class='icon'>
        <span @click="triggerUpImg"><img :src="require('@/assets/img.png')" alt=""></span>
        <!-- <span @click="triggerUpFile"><img :src="require('@/assets/file.png')" alt=""></span> -->
        <span @click.stop="showExpression = true"><img :src="require('@/assets/express.png')" alt=""></span>
        <div style='display:none'>
          <form action='' method='post' enctype='multipart/form-data' >
            <input type='file' ref="up_img" @change="uploadImage">
          </form>
        </div>
        <!-- <div style='display:none'>
          <form action='' method='post' enctype='multipart/form-data' >
            <input type='file' ref="up_file" @change="uploadFile">
          </form>
        </div> -->
      </div>
      <!-- 文本编辑 -->
      <textarea v-model="content" @keyup.enter.ctrl="sendMessage" @input="changeType('text')"></textarea>
    </div>
    <p class='butt'>
      <button @click="content=''">取消</button>
      <button @click="sendMessage" >发送</button>
    </p>
  </div>
</template>

<script>
import { sendSms } from '@/api/sendConfig.js';
import { upload } from '@/api/http.js';
import Expression from './Expression'
export default {
  data() {
    return {
      expressions:["[/:^_^]","[/:^$^]","[/:Q]","[/:815]","[/:809]","[/:^O^]","[/:081]","[/:087]","[/:086]","[/:H]","[/:012]","[/:806]","[/:b]","[/:^x^]","[/:814]","[/:^W^]","[/:080]","[/:066]","[/:807]","[/:805]","[/:071]","[/:072]","[/:065]","[/:804]","[/:813]","[/:818]","[/:015]","[/:084]","[/:801]","[/:811]","[/:?]","[/:077]","[/:083]","[/:817]","[/:!]","[/:068]","[/:079]","[/:028]","[/:026]","[/:007]","[/:816]",'[/:\'""]',"[/:802]","[/:027]","[/:(Zz...)]","[/:*&*]","[/:810]","[/:>_<]","[/:018]","[/:>O<]","[/:020]","[/:044]","[/:819]","[/:085]","[/:812]",'[/:"]',"[/:>M<]","[/:>@<]","[/:076]","[/:069]","[/:O]","[/:067]","[/:043]","[/:P]","[/:808]","[/:>W<]","[/:073]","[/:008]","[/:803]","[/:074]","[/:O=O]","[/:036]","[/:039]","[/:045]","[/:046]","[/:048]","[/:047]","[/:girl]","[/:man]","[/:052]","[/:(OK)]","[/:8*8]","[/:)-(]","[/:lip]","[/:-F]","[/:-W]","[/:Y]","[/:qp]","[/:$]","[/:%]","[/:(&)]","[/:@]","[/:~B]","[/:U*U]","[/:clock]","[/:R]","[/:C]","[/:plane]","[/:alipay]","[/:wechat]","[/:card]","[/:red]","[/:trans]","[/:secured]"],
      id: '',
      content: '',
      tid: '196715391714594816',
      message: {},
      curmessage: [],
      img: '',
      type: 'text',
      showExpression:false,
      express:'',
    };
  },
  components:{
    Expression
  },
  // 初始化监听消息
  mounted: function() {
    this.id = this.jsonBig.stringify(this.$store.state.userInfo.uid);
    window.ws.addEventListener("message", (evt) => {
      let data = this.jsonBig.parse(evt.data);
      if (data.op !== 7) return;
      this.tid = this.jsonBig.stringify(data.body.uid);
      this.addMessage({
        from: this.tid,
        to: this.id,
        data: {
          msg: data.body.data.msg,
          id: data.body.data.id
          // length: data.body.data.length,
          // ext: data.body.data.ext
        }
      })
    });
  },
  watch:{
    // 监听curmessage变化，发送或收到消息时，自动滚动到底部
    curmessage:{
      handler() {
        let messages = this.$refs.messages;
        setTimeout(() => {
          if(messages){
            messages.scrollTop = messages.scrollHeight;
          }
        }, 0);
      },
      deep:true
    }
  },
  methods: {
    changeType(type){
      this.type = type;
    },
    iconNumber(num) {
      if (num < 10) {
        return "00" + num;
      } else if (num < 100) {
        return "0" + num;
      } else {
        return num;
      }
    },
    hideExpression() {
      this.showExpression = false;
    },
    getFileExt(filename) {
      let index = filename.lastIndexOf(".");
      let ext = filename.substr(index+1);
      return ext;
    },
    setExpress(payload) {
      this.express = payload.express;
      this.sendExpress();
    },
    addMessage(obj) {
      if (!this.message[this.tid]) {
        this.message[this.tid] = [];
      }
      this.message[this.tid].push(obj);
      this.curmessage = this.message[this.tid];
    },
    sendMessage() {
      if (this.content.trim() === '') return;
      window.ws.send(
        sendSms('text', window.ws.seq++, this.jsonBig.parse(this.tid), { msg: this.content.trim() })
      );
      this.addMessage({
        from: this.id,
        to: this.tid,
        data: { msg: this.content }
      })
      this.content = '';
    },
    sendExpress() {
      window.ws.send(
        sendSms('text', window.ws.seq++, this.jsonBig.parse(this.tid), { msg: this.express })
      );
      this.addMessage({
        from: this.id,
        to: this.tid,
        data: { msg: this.express }
      })
    },
    sendImg() {
      window.ws.send(
        sendSms('image', window.ws.seq++, this.jsonBig.parse(this.tid), { id: this.img })
      );
      this.addMessage({
        from: this.id,
        to: this.tid,
        data: { id: this.img}
      })
      this.$refs.up_img.value = '';
      this.img = '';
    },
    // sendFile(type, mes) {
    //   window.ws.send(
    //     sendSms(type, window.ws.seq++, this.jsonBig.parse(this.tid), mes)
    //   );
    //   this.addMessage({
    //     from: this.id,
    //     to: this.tid,
    //     data: mes
    //   })
    //   this.$refs.up_file.value = '';
    //   this.file = null;
    // },
    triggerUpImg() {
      this.$refs.up_img.click();
    },
    // triggerUpFile() {
    //   this.$refs.up_file.click();
    // },
    uploadImage() {
      let filename = this.$refs.up_img.value;
      if (!filename) return;
      let ext = this.getFileExt(filename);
      if (ext !== 'jpg' && ext !=='png') {
        this.$refs.up_img.value = '';
        alert('图片仅支持jpg及png格式！');
        return;
      }
      this.type = 'image';
      let self = this;
      upload('/api/image/', 'uploadimage', this.$refs.up_img.files[0], function(data) {
        self.img = data;
        self.sendImg();
      })
    },
    // uploadFile() {
    //   let filename = this.$refs.up_file.value;
    //   if (!filename) return;
    //   let ext = this.getFileExt(filename);
    //   if (ext !== 'amr' && ext !=='mp4') {
    //     this.$refs.up_file.value = '';
    //     alert('文件仅支持amr音频及mp4视频格式！');
    //     return;
    //   }
    //   this.type = ext === 'amr' ? 'audio' : 'video';
    //   let self = this;
    //   let file = this.$refs.up_file.files[0],
    //       size = file.size;
    //   upload('/api/file/', 'uploadfile', this.$refs.up_file.files[0], function(data) {
    //     self.file = data;
    //     self.sendFile(self.type, {id:self.file, length:size, ext:ext});
    //   })
    // }
  }
};
</script>

<style scoped lang='stylus'>
.chatroom 
  position fixed
  top 50%
  left 50%
  width 500px
  height 500px
  border 1px solid
  margin-left -250px
  margin-top -250px
  background yellowgreen
  .top 
    height 30px
    line-height 30px
    background skyblue
  .content 
    overflow hidden
    height 310px
    padding 10px 0 10px 10px
    background #EEE
    .wrap
      overflow-y auto
      overflow-x hidden
      width 100%
      height 100%
      ul
        box-sizing border-box
        width 490px
        height 100%
        padding-right 20px
        .itemsg
          font-size 14px
          img
            max-width 463px
          &.left
            text-align left
          &.right
            text-align right
  .shuru 
    position relative
    height 140px
    .expression
      position absolute
      top -66px
      left 0
    .icon 
      height 30px
      text-align left
      span 
        display inline-block
        height 30px
        margin-right 10px
        cursor pointer
        img 
          width 30px
          height 30px
    textarea 
      width 480px
      height 60px
      padding 10px
      border none
      resize none
  .butt 
    position absolute
    right 0
    bottom 0
</style>
