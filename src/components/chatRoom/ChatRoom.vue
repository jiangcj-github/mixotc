<template>
  <!-- 聊天框 -->
  <div class='chatroom'>
    <div class='top'>聊天{{tid}}</div>
    <div class='content'>
      <ul ref='messages'>
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
    <!-- 输入框 -->
    <div class='shuru'>
      <!-- 传输文件和图片 -->
      <Expression 
        class='expression' 
        v-show="showExpression" 
        :showExpression.sync="showExpression"
        v-on:express="setExpress"
        >
      </Expression>
      <div class='icon'>
        <span @click="triggerUpImg"><img :src="require('@/assets/img.png')" alt=""></span>
        <!-- <span @click="triggerUpFile"><img :src="require('@/assets/file.png')" alt=""></span> -->
        <span @click="showExpression = true"><img :src="require('@/assets/express.png')" alt=""></span>
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

<style scoped>
.chatroom {
  position: fixed;
  width: 500px;
  height: 500px;
  top: 50%;
  left: 50%;
  margin-left: -250px;
  margin-top: -250px;
  background: yellowgreen;
  border: 1px solid;
}
.chatroom .top {
  background: skyblue;
  line-height: 30px;
  height: 30px;
}
.chatroom .content {
  background: #eee;
  padding: 10px;
  height: 310px;
}
.chatroom .content ul{
  overflow: auto;
  width: 100%;
  height: 100%;

}
.chatroom .content .itemsg {
  font-size: 14px;
}
.chatroom .content .itemsg p img{
  max-width:463px;
}
.chatroom .content .itemsg p a{
  display: inline-block;
  width: 32px;
  height: 32px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABRhJREFUeNrsnb9PFEEUx4cLGgOEAAFibIBEGyykkEIbzpbeGmos0AJb9S8QC6mltobKxKPG4iyk0cSzkBghQAhcjBJ1vptdsi4zs7O7M7Mz5r1kcsD92vnMzHvf92aX7WECOzw8mOQPy7w1eZthZCpr89bi7cXw8Egn+2SPAO5z/vCQuJWyVQ75kRAwBzvEH97SjDUyo+9x0Ef4pZF6guCasZmYJTsHHLsFgmsQcsyU9cQB7TMxsWJTjVgtkNmx5UYsxcjsWBMu4g9xsGcNQkCACTAZASbABJiMABNgAkxGgAOz3pAOtnP0k3V//WYTQ5dZ/6UGATYJdv39Afuw9yP6fay/l92fHmLNiQHvj93rYs9e94y93jlirc6J8PkQQHsJOA9s1ia5y1i8NcKmx64QYJWdcv+6+fE4avhZNGNvcogy8HgOM9on0F4A1gGbdgV5Mxygl2ZH2VhfLwFufTlh6+0DLbAiV7LBB2WLgxa9vzk5EL2/TtC1AQZYzMK907PKSz1vBQD0AvfRdUg754B3uNR6+W7fCNgioAF3/sZg1FyCdgYYYDFjEy1rMzgloLFKsgPpGrR1wNkkwbWPlLkiVxraGmBVpK8j+NQF2grgV3zGYon6GNVloJGsLN0ejR69Bgxf+3Tr2wWfB7g+6FJVTEAseDJ31ej3GPfyfZnAgYADdyFSDXUmNt/5MaFl3UUQLkImxepOZWUyzqaysKoiZFmaa9AqfWw7LliXaarO2Qad993I7kwHtdoSDXQQelgk29DJKBAakkrw+fgeEVj42QdcLbhaPc5TZXR+bXtfmHhU1aQq7Q3fujAz4rw478RFoNqFWZqeNQiE0MvI9KqCzgObDWB4/fbX7oVjCgqwyP/NXutjK3fHtatqOuVKVV1YFMBwPBhYV77YCmCRekAHAFcUrXUK7oCczELM+s1Px8qCuwqa6PhslTSNA0bnH7/Z/edvmEVoVQJhstwBW+RWigYwfMYa1+rpzxKtsKpmXPx1BXXYJJvL05p4LeoBGAxRIMTnnArglglgOM5gy5XwiyZEvaqGXDYDk/l8zN5FPkimEw6nQa5sgiGCUmSwEiWzwf226/TdWSYHQKJghNmH2aNjyWDh9TpRv84s0nmioZJUpoveLr/Ly0xO1fm0HCtTxcM2/vZut3awTgGjw1jSaX+p2qsrGrzw+XADRT4LgwHotjcBrAJGx5E1JYFFtGOQpxRUwUyVBcrApt/jYofZWsE9C02VySXvkZ0vkYCevz4YzTrZlrxOVoZgB42ddiNBFdxFmRwOHGc/VtGpOlZEugEwQGfTZSQ6wWVyaDqZXNRJHoTQioAuc7IfVhRaepXZ2Df0ets+rwhURsvCFWHwsioGrmflzrj/2/ZpOSYrrFcFXWZXQhZMbRfircs0lUooAxrLuMgsU4F1cY6as0RD5VNt7OyqtLHL01mdZ3JJXUJ2Hi+kWBU/qBpIWxUzrwDbCl4mT+gOHrBOXUIHDAYHrqDsnt5/D1hHcYhA560A+Fa8HgGsbvPqMq68ugRA4zJa2UUvdV0mEAzgKumyD+ceBwNYR3FUSZMJsIbi8Pny2aAAZxUH3Mbc5EAQV9oHBThUo/94QoAJMBkBJsAEmIwAE2ACTEaACTAZAXYNuE0YrFkbgFvEwZq16GZRdm2qEd8mcZVYGDfcHbGTBLln5IvN+t6YKd1y0hLc81tO0k1TzbsF8U1TM5AR+Oi2v/ozFkpMeNvfvwIMAJlj0EFd8r8AAAAAAElFTkSuQmCC);
  background-size:32px 32px;
}
.chatroom .content .itemsg.left {
  text-align: left;
}
.chatroom .content .itemsg.right {
  text-align: right;
}
.chatroom .shuru {
  position: relative;
  height: 140px;
}
.chatroom .shuru .expression{
  position: absolute;
  top:-66px;
  left:0;
}
.chatroom .shuru .icon {
  text-align: left;
  height: 30px;
}
.chatroom .shuru .icon span {
  display: inline-block;
  height: 30px;
  cursor: pointer;
  margin-right: 10px;
}
.chatroom .shuru .icon span img {
  width: 30px;
  height: 30px;
}
.chatroom .shuru textarea {
  width: 480px;
  height: 60px;
  padding: 10px;
  border: none;
  resize: none;
}
.chatroom .butt {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
