<template>
  <Left :leftBar="1">
    <div class="right" slot="right">
      <ul class="tab">
        <li :class="{active:tab==1}" @click="tab=1">待审核(3)</li>
        <li :class="{active:tab==2}" @click="tab=2">已审核</li>
      </ul>
      <Uncheck v-if="tab==1"></Uncheck>
      <Check v-else-if="tab==2"></Check>
    </div>
  </Left>
</template>
<script>

  import Left from "./layout/Left";
  import Uncheck from "./idcard/Uncheck";
  import Check from "./idcard/Check";
  import WebSocketProxy from '@/api/WebSocketProxy.js';
  export default {
    components: {
      Left,
      Uncheck,
      Check,
    },
    data() {
      return {
        proxy: new WebSocketProxy(this.WebSocket),
        tab:1,  //审核，未审核
      }
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .right
    width 1000px
    margin-left 200px
    min-height 500px
    .tab
      background #fff
      height 60px
      line-height 58px
      margin-bottom 20px
      padding 0 30px
      font-size 16px
      >li
        display inline-block
        width 100px
        text-align center
        color #999999
        letter-spacing 0.33px
        cursor pointer
        &.active
          color #FFB422
          border-bottom 2px solid #FFB422
</style>
