<template>
  <div class='login' @click.stop>
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
  import Client from "@/js/client.js";

  export default {
    data() {
      return {
        account: 'somacyx@sina.com',
        code: '354942'
      };
    },
    methods: {
      hideLoginForm() {
        if (!this.$store.state.loginForm) return;
        this.$store.commit({type: 'changeLoginform', data: false});
      },
      login() {
        window.ws = new Client().socket;
        window.ws.addEventListener('message', this.loginReplay);
        window.ws.addEventListener('open', () => {
          window.ws.send(
            JSON.stringify({
              ver: 1,
              op: 17,
              seq: window.ws.seq++,
              body: {
                phone: '',
                email: this.account,
                code: this.code
              }
            })
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
        this.$store.commit({type: 'changeLogin', data: true});
        this.hideLoginForm();
        window.ws.removeEventListener('message', this.loginReplay);
      },
      getCode() {
        window.ws = new Client().socket;
        window.ws.addEventListener('message', this.codeReplay);
        window.ws.addEventListener('open', () => {
          window.ws.send(
            JSON.stringify({
              ver: 1,
              op: 15,
              seq: window.ws.seq++,
              body: {
                phone: '',
                email: this.account
              }
            })
          );
        });
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

<style scoped lang="stylus">
  .login
    position fixed
    top 50%
    left 50%
    width 420px
    height 200px
    margin-left -250px
    margin-top -130px
    padding 50px 30px 30px 30px
    border-radius 3px
    border 1px solid #333
    text-align left

    span
      position absolute
      top 20px
      right 20px
      cursor: pointer
      font-size 24px
      font-weight: bold

    p
      margin-bottom 30px
</style>
