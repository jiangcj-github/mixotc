<template>
  <div id="app" @click="hideLoginForm">
    <Header></Header>
    <router-view/>
    <ChatRoom v-if="this.$store.state.isLogin"></ChatRoom>
  </div>
</template>

<script>
import Header from '@/components/header/Header'
import ChatRoom from '@/components/chatRoom/ChatRoom'
export default {
  name: 'App',
  components:{
    Header,
    ChatRoom
  },
  methods:{
    hideLoginForm(){
      if(!this.$store.state.loginForm) return;
      this.$store.commit({type:'changeLoginform', data:false})
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
  text-align: center;
  color: #2c3e50;
}
</style>
