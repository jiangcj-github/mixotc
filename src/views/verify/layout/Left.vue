<template>
    <!-- 左边栏菜单 -->
    <ul class="left-bar">
      <router-link tag="li" :class="{active:leftBar===1}" to="/verify/identifyAuth">
        <i>身份审核</i><img src="/static/images/verify/sfsh.png" alt="">
      </router-link>
      <router-link tag="li" :class="{active:leftBar===2}" to="/verify/largeTransaction">
        <i>大额交易申请</i><img src="/static/images/verify/dejy.png" alt="">
      </router-link>
      <!--
      <router-link tag="li" :class="{active:leftBar===3}" to="/verify/sensitiveLexicon">
        <i>敏感词库</i><img src="/static/images/verify/mgck.png" alt="">
      </router-link>
      -->
      <router-link tag="li" :class="{active:leftBar===4}" to="/verify/arbitrationRecord">
        <i>仲裁记录</i><img src="/static/images/verify/zcjl.png" alt="">
      </router-link>
    </ul>
</template>
<script>
  export default {
    props:["leftBar"],
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  ul.left-bar
    width 180px
    margin-right 20px
    float left
    >li
      width 120px
      height 60px
      padding 0 30px
      display inline-flex
      align-items center
      justify-content space-between
      cursor pointer
      margin-bottom 10px
      &.active
        background #fff
        box-shadow 0 2px 4px 0 rgba(153,153,153,0.70)
        border-radius 4px
        color #ffa21c
      &:hover
        color #ffa21c
</style>
