<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
    <News></News>
  </div>
</template>

<script>
  import Header from '@/components/common/Header'
  import Footer from '@/components/common/Footer'
  import News from '@/views/news/News'
  import sendConfig from '@/api/SendConfig.js'

  export default {
    name: 'App',
    components: {
      Header,
      Footer,
      News
    },
    data() {
      return {
        timer1: null,
        timer2: null
      }
    },
    created: function () {
      let ws = this.WebSocket;
      //发送token登录后的处理
      !ws.onMessage['token'] && (ws.onMessage['token'] = {
        callback: (data) => {
          if (data.op !== 18) return;
          if (data.body.ret !== 0) {
            sessionStorage.removeItem('otcToken')
            ws.reConnectFlag = false;
            return;
          }
          this.$store.commit({
            type: 'getUserInfo',
            data: data.body
          });
          this.$store.commit({type: 'changeLogin', data: true});
        }
      });
      let token =  sessionStorage.getItem('otcToken');
      console.log(token)
      //页面打开时时获取sessionStorage的token自动发送token登录
      ws.onOpen['token'] = () => {
        let token = sessionStorage.getItem('otcToken');
        if (!token){
          ws.reConnectFlag = false;
          this.$store.commit({type: 'changeLogin', data: false});
          if (this.path !== '/' && this.path !== 'transaction') {
            this.$router.push('transaction');
          }
          return;
        }
        ws.send(sendConfig('login', {
          seq: ws.seq,
          body: token
        }))
      }
      if (!token) return;
      ws.start('ws://39.106.157.67:8090/sub');
    },
    mounted() {
      //websock发包接口需先判断登录状态
      this.WebSocket.beforeSend = (txt) => {
        let op =  this.JsonBig.parse(txt).op;
        //发送验证码17 登录15 需放行
        if (sessionStorage.getItem('otcToken') || op === 17 || op === 15) return true;
        this.$store.commit({type: 'changeLoginForm', data: true})
        return false;
      }
    },
    destroyed() {
      this.timer1 && (this.timer1 = clearTimeout(this.timer1));
      this.timer2 && (this.timer2 = clearInterval(this.timer2));
      window.onmousedown = null
    },
    methods: {
      //退出登录逻辑
      logout() {
        // console.log('logout');
        // 移除token
        sessionStorage.removeItem('otcToken');
        //改变vuex登录状态
        this.$store.commit({type: 'changeLogin', data: false});
        //重连置否
        this.WebSocket.reConnectFlag = false;
        //websocket链接关闭
        this.WebSocket.close();
        //其他页面跳转至主页
        if (this.path !== '/' && this.path !== 'transaction') {
          this.$router.push('transaction')
        }
      }
    },
    computed: {
      isLogin() {
        return this.$store.state.isLogin;
      }
    },
    watch: {
      //监听登录状态
      isLogin(curVal, oldVal) {
        if (curVal) {
        //登录时设置定时器，绑定事件监听用户操作
          this.timer1 && (this.timer1 = clearTimeout(this.timer1));
          this.timer1 = setTimeout(this.logout, 600000);
          window.onmousedown = (event) => {
            //用户操作时重新计时
            this.timer1 = clearTimeout(this.timer1);
            this.timer1 = setTimeout(this.logout, 600000);
          }
          //定时查询token，token删除即退出登录
          this.timer2 && (this.timer2 = clearInterval(this.timer2));
          this.timer2 = setInterval(() => {
            if(sessionStorage.getItem('otcToken')) return;
            this.logout()
          }, 1000);
          return;
        }
        //退出登录时清理定时器，移除监听
         this.timer1 = clearTimeout(this.timer1);
         this.timer2 = clearTimeout(this.timer2);
         window.onmousedown = null
      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
