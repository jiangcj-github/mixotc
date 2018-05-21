<template>
  <div class="account">
    <div class="tab">
      <ul class="clearfix">
        <!-- <li :class="{active: !type || type === 'base'}"> -->
          <router-link :to="{name:'personal-baseInfo', params: {num: 123}}" tag="li" active-class="active">基本设置</router-link>
          <router-link :to="{name:'personal-auth', params: {authData}}" tag="li" active-class="active">实名认证</router-link>
          <router-link :to="{name:'personal-apply',  params: {num: 123}}" tag="li" active-class="active">大额交易申请</router-link>
          <!-- 基本设置 -->
        <!-- </li> -->
        <!-- <li :class="{active: type === 'auth'}">实名认证</li>
        <li :class="{active: type === 'apply'}">大额交易申请</li> -->
      </ul>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        authData:{
          surname: '',
          name: '',
          type: 1,
          number: '',
          iconArr: ['', '', '']
        }
      }
    },
    created(){
       this.Bus.$on('upLoadAuth', (data)=>{
        this.authData = data
      })
    },
    components: {},
    computed: {}
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base"
  .account
    margin-bottom 40px
    .tab
      width 1000px
      height 60px
      margin-bottom 10px
      background-color #FFF
      border-bottom 1px solid #E1E1E1
      ul
        padding-left 30px
        li
          box-sizing()
          float left
          width 120px
          height 60px
          margin-right 28px
          line-height 60px
          font-size $fz16
          color #999999
          text-align center
          letter-spacing 0.33px
          cursor pointer
          &:hover, &.active
            color $col422
            border-bottom 2px solid $col422
    .main
      background-color #FFF
</style>