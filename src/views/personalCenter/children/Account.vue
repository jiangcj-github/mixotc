<template>
  <div class="account">
    <div class="tab">
      <ul class="clearfix">
        <!-- <li :class="{active: !type || type === 'base'}"> -->
          <router-link to="/personal/account?type=base" tag="li" active-class="selected" :class="{active: type === 'base'}">基本设置</router-link>
          <router-link to="/personal/account?type=auth" tag="li" active-class="selected" :class="{active: type === 'auth'}">实名认证</router-link>
          <router-link to="/personal/account?type=apply" tag="li" active-class="selected" :class="{active: type === 'apply'}">大额交易申请</router-link>
          <!-- 基本设置 -->
        <!-- </li> -->
        <!-- <li :class="{active: type === 'auth'}">实名认证</li>
        <li :class="{active: type === 'apply'}">大额交易申请</li> -->
      </ul>
    </div>
    <div class="main">
      <BaseInfo v-if="type === 'base'"></BaseInfo>
      <Auth v-if="type === 'auth'"></Auth>
      <Apply v-if="type === 'apply'"></Apply>
    </div>
  </div>
</template>

<script>
import BaseInfo from "../components/account/BaseInfo";
import Auth from "../components/account/Auth";
import Apply from "../components/account/Apply";
  export default {
    data(){
      return {}
    },
    components: {
      BaseInfo,
      Auth,
      Apply
    },
    computed: {
      type() {
        if(!this.$route.query.type) this.$router.push({ name: 'personal-account', query: { type: 'base' }})
        return this.$route.query.type;
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../stylus/base"
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