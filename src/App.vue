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
    created: function () {
      let token = this.Storage.otcToken.get();
      console.log('sdsad', token)
      if (!token) return;
      let ws = this.WebSocket;
      ws.start('ws://192.168.113.26:8090/sub');
      !ws.onMessage['token'] && (ws.onMessage['token'] = {
        callback: (data) => {
          if (data.op !== 18) return;
          if (data.body.ret !== 0) {
            this.Storage.otcToken.removeAll();
            ws.reConnectFlag = false;
          }
          this.$store.commit({
            type: 'getUserInfo',
            data: data.body
          });
          this.$store.commit({type: 'changeLogin', data: true});
        }
      });
      ws.onOpen['token'] = () => {
        ws.send(sendConfig('login', {
          seq: ws.seq,
          body: token
        }))
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
