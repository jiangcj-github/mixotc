<template>
  <div id="app">
    <Header v-if="$route.path !== '/verify/service'"></Header>
    <router-view class="main-container" v-if="showView" :key="$route.path + JsonBig.stringify($route.query)"/>
    <Footer v-if="$route.path !== '/verify/service'"></Footer>
    <News v-if="!$store.state.userInfo.is_admin"></News>
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
        // watchTokenFlag: true
      }
    },
    created() {
      this.$store.commit({type: 'changeLoginForm', data: false})
      // this.$store.commit({type: 'changeLogin', data: false});
      // console.log(this.token)
      let ws = this.WebSocket;
      //发送token登录后的处理
      !ws.onMessage['token'] && (ws.onMessage['token'] = {
        callback: (data) => {
          if (data.op !== 18) return;
          if (data.body.ret !== 0) {
            this.$store.commit({ type: 'changeToken', data: '' })
            ws.reConnectFlag = false;
            return;
          }
          ws.reConnectFlag = true;
          this.$store.commit({
            type: 'getUserInfo',
            data: data.body
          });
          this.$store.commit({type: 'changeLogin', data: true});
          this.Storage.loginTime.set(new Date() - 0)

          // this.watchTokenFlag = false
        }
      });

      ws.onOpen['token'] = () => {
        if (!this.token){
          ws.reConnectFlag = false;
          this.$store.commit({type: 'changeLogin', data: false});
          if (["/transaction", "/", "/homepage", "/transaction/tradeRules", "/coinData"].includes(this.$route.path)) {
            return;
          }
          this.$router.push('/transaction');
          return;
        }
        ws.send(sendConfig('login', {
          seq: ws.seq,
          body: this.token
        }))
      }
      if (!this.token) return;
      ws.start(this.HostUrl.ws);
    },
    mounted() {
      //websock发包接口需先判断登录状态
      this.WebSocket.beforeSend = (txt) => {
        let op =  this.JsonBig.parse(txt).op;
        //发送验证码17 登录15 需放行
        if (this.token || op === 17 || op === 15) return true;
        this.$store.commit({type: 'changeLoginForm', data: true})
        return false;
      }
    },
    destroyed() {
      // this.timer1 && (this.timer1 = clearTimeout(this.timer1));
      this.timer2 && (this.timer2 = clearInterval(this.timer2));
      window.onmousedown = null
    },
    methods: {
      //退出登录逻辑
      logout() {
        // 一个选项卡退出，所有选项卡均退出
        localStorage.setItem("removeSessionStorage", Date.now());
        this.$store.commit({type: 'changeToken', data: ''});
        //改变vuex登录状态
        this.$store.commit({type: 'changeLogin', data: false});
        //重连置否
        this.WebSocket.reConnectFlag = false;
        //websocket链接关闭
        this.WebSocket.close();
        //其他页面跳转至主页
        if (["/transaction", "/", "/homepage", "/transaction/tradeRules", "/coinData"].includes(this.$route.path)) return;
        this.$router.push('transaction')
      }
    },
    computed: {
      showView() {
        if (["/transaction", "/", "/homepage", "/transaction/tradeRules", "/coinData"].includes(this.$route.path)) {
          return true;
        }
        if (["/verify", "/verify/identifyAuth", "/verify/largeTransaction", "/verify/arbitrationRecord", "/verify/service"].includes(this.$route.path) && this.$store.state.userInfo && !this.$store.state.userInfo.is_admin) {
          this.$router.push('/transaction');
          return true;
        }
        if(this.isLogin) return true;
        return false
      },
      isLogin() {
        return this.$store.state.isLogin;
      },
      token() {
        return this.$store.state.token;
      }
    },
    watch: {
      //监听登录状态
      isLogin: {
        handler: function(curVal, oldVal) {
          if (curVal) {
          //登录时设置定时器，绑定事件监听用户操作(任意一个选项卡有点击即重新计时)
            window.onmousedown = (event) => {
              //用户操作时重新计时
              this.Storage.loginTime.set(new Date() - 0);
            }
            this.Loop.isOverTime.clear();
            this.Loop.isOverTime.set(() => {
              // 10分钟无操作则自动退出
              let flag = new Date() - 0 - this.Storage.loginTime.get() > 600000;
              if(flag) this.logout();
            }, 1000)
            this.Loop.isOverTime.start()

            //定时查询token，token删除即退出登录
            this.timer2 && (this.timer2 = clearInterval(this.timer2));
            this.timer2 = setInterval(() => {
              if (this.token) return;
              this.logout()
            }, 1000);
            return;
          }
          //退出登录时清理定时器，移除监听
          this.Loop.isOverTime.clear();
          this.timer2 = clearInterval(this.timer2);
          window.onmousedown = null
          this.$store.commit({type: 'changeTrustList', data: []});
        },
        immediate: true
      }
    }
  }
</script>

<style lang="stylus">
  @import "stylus/base.styl";
  #app {
    height: 100%;
    box-sizing()
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .main-container{
    position relative
    flex-grow: 1;
  }
</style>
