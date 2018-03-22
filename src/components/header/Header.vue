<template>
  <div class='header'>
     <span class='log' @click="show_loginform" v-if="!this.$store.state.isLogin">登录/注册</span>
     <span class='log' v-else>{{this.$store.state.userInfo.name}}</span>
     <Login v-if="loginForm" :loginForm.sync="loginForm" v-defaultClick="hideLoginForm"></Login>  
  </div>
</template>

<script>
import Login from '@/components/login/Login'
  export default {
    data(){
      return {
        loginForm: false
      }
    },
    components:{
      Login
    },
    methods:{
      show_loginform(){
        if(this.loginForm) return;
        this.loginForm = true;
      },
      hideLoginForm() {
        if (!this.loginForm) return;
        this.loginForm = false;
      }
    }
  }
</script>

<style scoped lang='stylus'>
  .header
    height 50px
    text-align right
    background skyblue
    .log
      margin-right 50px
      line-height 50px
      cursor pointer
</style>