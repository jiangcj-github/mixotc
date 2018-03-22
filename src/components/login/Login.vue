<template>
  <div class='login'>
    <span @click="hideLoginForm">×</span>
    <p>
      手机/邮箱：
      <input type='text' v-model="account">
    </p>
    <p>
      验证码：
      <input type='text' v-model="code">
      <button @click="getCode">获取验证码</button>
    </p>
    <button @click="login">登录/注册</button>
  </div>
</template>

<script>
import { sendCode, sendLogin } from '@/api/sendConfig.js';
import Client from "@/js/client.js";
export default {
  props:['loginForm'],
  data () {
    return {
      account: '17634029450@163.com',
      code: '932265',
      type:  ''
    };
  },
  methods: {
    checkout(account) {
      return /^1[34578]\d{9}$/.test(account) ? 'phone' : (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(account) ? 'email' : false)
    },
    hideLoginForm() {
      if (!this.loginForm) return;
      this.$emit('update:loginForm', false);
    },
    login() {
      let type = this.checkout(this.account);
      if (!type) {
        alert('请输入正确的手机或邮箱！');
        return;
      }
      this.type = type;
      window.ws = new Client().socket;
      window.ws.addEventListener('message', this.loginReplay);
      window.ws.addEventListener('open', () => {
        window.ws.send(
          sendLogin(this.type, window.ws.seq++, this.account, this.code)
        );
      })
    },
    loginReplay(evt) {
      let data = this.jsonBig.parse(evt.data);
      if (data.op !== 18 || data.body.ret !== 0) return;
      this.$store.commit({
        type: 'getUserInfo',
        data: data.body
      });
      this.$store.commit({ type: 'changeLogin', data: true });
      this.hideLoginForm();
      window.ws.removeEventListener('message', this.loginReplay);
    },
    getCode() {
      let type = this.checkout(this.account);
      if (!type) {
        alert('请输入正确的手机或邮箱！');
        return;
      }
      this.type = type;
      window.ws = new Client().socket;
      window.ws.addEventListener('message', this.codeReplay);
      window.ws.addEventListener('open', () => {
        window.ws.send(
          sendCode(this.type, window.ws.seq++, this.account)
        );
      })
    },
    codeReplay(evt) {
      let data = JSON.parse(evt.data);
      if (data.op !== 16) return;
      if (data.body.ret == 0) {
        alert('发送成功！');
      } else {
        alert('发送失败，请重试！');
      }
      window.ws.removeEventListener('message', this.codeReplay);
    }
  }
};
</script>

<style scoped lang='stylus'>
.login
  position fixed
  left 50%
  top 50%
  width 420px
  height 200px
  padding 50px 30px 30px 30px
  margin-left -250px
  margin-top -130px
  border-radius 3px
  border 1px solid #333
  text-align left
  span 
    position absolute
    right 20px
    top 20px
    font-size 24px
    font-weight bold
    cursor pointer
  p 
    margin-bottom 30px

</style>