<template>
  <div id="app">
    <Header v-if="$route.path !== '/verify/service'"></Header>
    <router-view class="main-container" v-if="showView" :key="JsonBig.stringify($route.query)" />
    <div style="width:100%;height:100%"></div>
    <Footer v-if="$route.path !== '/verify/service'"></Footer>
    <News v-if="$store.state.userInfo && !$store.state.userInfo.is_admin"></News>
    <img src="/static/images/to_top.png" alt="" class="to-top" :class="{show:showTop}" @click="toTop">
    <BasePopup :show="showTip" class="app-popup" :top="40" @click.native="hidePopup">
      <slot>
        <p>您的账号已在其他地方登录，请重新登录</p>
      </slot>
    </BasePopup>
    <BasePopup :show="showError" class="app-popup"  :top="40"  @click.native="hideErr">
      <slot>
        <img src="/static/images/close_btn_tr2.png" alt="" @click="hideErr">
        <p>抱歉，服务器维护中，请耐心等待。</p>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
  import Header from '@/components/common/Header'
  import Footer from '@/components/common/Footer'
  import News from '@/views/news/News'
  import BasePopup from '@/components/common/BasePopup'
  import sendConfig from '@/api/SendConfig.js'
  import getExplorerInfo from '@/js/Browser.js'
  import detectOS from '@/js/Os.js'

  export default {
    name: 'App',
    components: {
      Header,
      Footer,
      News,
      BasePopup
    },
    data() {
      return {
        timer: null,
        timer2: null,
        timer3: null,
        timer4: null,
        showTop: false,
        showTip: false,
        showError: false
      }
    },
    beforeCreate(){
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      let isiOS = /(iPhone|iPad|iPod|iOS)/i.test(u); //ios终端
      if (isAndroid || isiOS) {
        window.location.href = this.HostUrl.download + 'download.html'
      }
    },
    created() {
      let flag = this.getUrl('token');
      this.listenOffline();
      window.addEventListener('scroll', this.handleScroll);
      this.$store.commit({type: 'changeLoginForm', data: false})
      let ws = this.WebSocket;
      let seq = ws.seq;
      // 交易所跳转时带token处理
      if(flag){
        ws.onMessage[seq] = {
         callback: (data) => {
           if(!data || data.body.ret !== 0) {
             window.location = 'http://127.0.0.1:8081'
             return;
           };
           if(data.body && this.$store.state.userInfo && this.JsonBig.stringify(this.$store.state.userInfo.uid) !== this.JsonBig.stringify(data.body.uid)) {
             this.$store.commit({ type: 'initState'})
           }
           this.$store.commit({
               type: 'getUserInfo',
               data: data.body
             });
           data.body.token && this.$store.commit({ type: 'changeToken', data: data.body.token })
             data.body.token && localStorage.setItem('getToken', JSON.stringify({
               phone:data.body.phone,
               email:data.body.email,
               token: data.body.token, 
               code: data.body.code
             }));
            //  this.$store.commit({ type: 'changeLogin', data: true });
             this.Storage.loginTime.set(new Date() - 0)
             localStorage.removeItem('getToken')
            window.location = 'http://127.0.0.1:8081'
         },
         date: new Date()
       }
       ws.onOpen['otherLogin'] = () => {
           ws.send(sendConfig('login',{
             seq: seq,
             body:{
               action: 'login',
               country: 'CN',
               version: 1,
               mode: 0,
               device: `${detectOS()}/${getExplorerInfo()}`,
               os: 3,
               token: flag
             }
           })
         )
       }
       ws.start(this.HostUrl.ws);
      }else{
        // 单开新页面正常处理
        //发送token登录后的处理
        !ws.onMessage['token']  && (ws.onMessage['token'] = {
          callback: (data) => {
            if (data.op !== 18) return;
            if (data.body.ret !== 0) {
              this.$store.commit({ type: 'changeToken', data: '' })
              ws.reConnectFlag = false;
              if (!this.authority(this.toPath)) {
                !this.$store.state.token && this.$router.push({
                  name: "transaction"
                });
              }
              return;
            }
            ws.reConnectFlag = true;
            data.body['code'] = this.$store.state.userInfo.code;
            this.$store.commit({
              type: 'getUserInfo',
              data: data.body
            });
            if(data.body && this.$store.state.userInfo && this.JsonBig.stringify(this.$store.state.userInfo.uid) !== this.JsonBig.stringify(data.body.uid)) {
              this.$store.commit({ type: 'initState'})
            }
            this.$store.commit({type: 'changeLogin', data: true});
            this.Storage.loginTime.set(new Date() - 0)
  
            // this.watchTokenFlag = false
          }
        });
        ws.onOpen['token'] = () => {
          if (!this.token){
            ws.reConnectFlag = false;
            this.$store.commit({type: 'changeLogin', data: false});
            if (this.authority(this.$route.path)) {
              return;
            }
            this.$router.push({name: "transaction"})
            return;
          }
          ws.send(sendConfig('login', {
            seq: ws.seq,
            body: {
                action: 'login',
                phone: this.$store.state.userInfo && this.$store.state.userInfo.phone,
                email: this.$store.state.userInfo && this.$store.state.userInfo.email,
                // code: this.$store.state.userInfo && this.$store.state.userInfo.code,
                country: 'CN',
                version: 1,
                mode: 1,
                device: `${detectOS()}/${getExplorerInfo()}`,
                os: 3,
                token: this.token
              }
          }))
        }
        this.token && ws.start(this.HostUrl.ws);
      }


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
      clearInterval(this.timer2);
      cancelAnimationFrame(this.timer3);
      clearTimeout(this.timer);
      clearTimeout(this.timer4);
      window.removeEventListener('scroll', this.handleScroll);
      window.onmousedown = null;
    },
    methods: {
      getUrl(para){
        let paraArr = window.location.search.substring(1).split('&');
        for(let i = 0;i < paraArr.length;i++){
          if(para == paraArr[i].split('=')[0]){
            return paraArr[i].split('=')[1]
          }
        }
        return false;
      },
      hideErr(){
        this.showError = false;
        clearTimeout(this.timer);
      },
      showErr(){
        this.showError = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showError = false;
          clearTimeout(this.timer)
        }, 3000);
      },
      hidePopup(){
        this.showTip = false;
        clearTimeout(this.timer4);
      },
      showPopup(){
        this.showTip = true;
        clearTimeout(this.timer4);
        this.timer4 = setTimeout(() => {
          this.showTip = false;
          clearTimeout(this.timer4)
        }, 3000);
      },
      // 两个全周期存在的监听
      listenOffline(){
        this.WebSocket.onMessage['offline'] = {
          callback: (res) => {
            //监听被挤掉的通知
            if(res.body && res.body.type === 'offline') {
              this.showPopup();
              this.logout();
              return;
            };
            //错误码为250时，提示服务器维护中，做退出操作
            if(res.body && (res.body.ret === 250 || res.body.type === 'offline_maintaining' && res.body.data.mantain && [3, 4].includes(res.body.data.mantain))) {
              this.showErr();
              this.logout();
              return;
            }
          }
        }
      },
      toTop(){
        cancelAnimationFrame(this.timer3);
        let self = this;
        this.timer3 = requestAnimationFrame(function fn(){
          let oTop = document.body.scrollTop || document.documentElement.scrollTop;
          if(oTop > 0){
          scrollTo(0, oTop - 80);
          self.timer3 = requestAnimationFrame(fn);
          }else{
            cancelAnimationFrame(self.timer3);
          }
        });
      },
      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop > 1200) {
          !this.showTop && (this.showTop = true);
          return;
        }
        this.showTop && (this.showTop = false);
      },
      authority(path){
        return ["/transaction", "/", "/homepage", "/helpcenter", "/coinData"].includes(path);
      },
      //退出登录逻辑
      logout() {
        // 一个选项卡退出，所有选项卡均退出
        localStorage.setItem("removeSessionStorage", Date.now());
        this.$store.commit({type: 'changeToken', data: ''});
        //改变vuex登录状态
        this.$store.commit({type: 'changeLogin', data: false});
        this.$store.commit({type: 'initState'});
        //重连置否
        this.WebSocket.reConnectFlag = false;
        //websocket链接关闭
        this.WebSocket.close();
        //其他页面跳转至主页'
        if (this.authority(this.$route.path)) return;
        this.$router.push({
              name: "transaction"
            })
      }
    },
    computed: {
      path(){
        return this.$route.path
      },
      showView() {
        if (this.authority(this.$route.path)) {
          return true;
        }
        if (["/verify", "/verify/identifyAuth", "/verify/largeTransaction", "/verify/arbitrationRecord", "/verify/service"].includes(this.$route.path) && this.$store.state.userInfo && !this.$store.state.userInfo.is_admin) {
          this.$router.push({name: "transaction"})
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
              console.log('click', new Date())
              this.Storage.loginTime.set(new Date() - 0);
            }
            this.Loop.isOverTime.clear();
            this.Loop.isOverTime.set(() => {
              // 10分钟无操作则自动退出
              let flag = new Date() - 0 - this.Storage.loginTime.get() > 3600000;
              if(flag) {
                console.log('十分钟无操作， 退出', new Date(), new Date(this.Storage.loginTime.get()))
                this.logout()
              };
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
  #app
    height 100%
    box-sizing()
    display flex
    flex-direction column
    padding-top 100px
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    .main-container
      position relative
      flex-grow 1
    .app-popup
      p
        height 94px
        line-height 94px
        text-align center
      img
       position absolute
       top 10px
       right 10px
       cursor pointer
    .to-top
      display none
      position fixed
      right 8px
      bottom 73px
      width 30px
      height 30px
      cursor pointer
      transition all 1s
      -moz-transition all 1s /* Firefox 4 */
      -webkit-transition all 1s /* Safari 和 Chrome */
      -o-transition all 1s /* Opera */
      &.show
        display block
</style>
