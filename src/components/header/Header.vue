<template>
  <div class='header'>
     <span class='log' @click.stop="show_loginform" v-if="!this.$store.state.isLogin">登录/注册</span>
     <span class='log' v-else>{{this.$store.state.userInfo.name}}</span>
     <Login v-if="this.$store.state.loginForm"></Login>  
  </div>
</template>

<script>
import Login from '@/components/login/Login'
  export default {
    data(){
      return {}
    },
    components:{
      Login
    },
    methods:{
      show_loginform(){
        if(this.$store.state.loginForm) return;
        this.$store.commit({ type: 'changeLoginform', data: true})
      }
    }
  }
</script>

<style scoped>
  .header{
    text-align: right;
    height: 50px;
    background: skyblue;
  }
  .header .log{
    margin-right:50px;
    line-height: 50px;
    cursor:pointer;
  }
</style>