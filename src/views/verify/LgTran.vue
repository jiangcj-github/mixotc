<template>
  <Left :leftBar="2">
    <div class="right" slot="right">
      <ul class="tab">
        <li :class="{active:tab==1}" @click="tab=1">待审核<i v-if="uncheckNum>0">({{uncheckNum}})</i></li>
        <li :class="{active:tab==2}" @click="tab=2">已审核</li>
      </ul>
      <Uncheck v-if="tab==1" numChange="uncheckNumChange"></Uncheck>
      <Check v-else-if="tab==2"></Check>
    </div>
  </Left>
</template>
<script>
  import Left from "./layout/Left";
  import Uncheck from "./lgtran/Uncheck";
  import Check from "./lgtran/Check";
  export default {
    components: {
      Left,
      Uncheck,
      Check,
    },
    data() {
      return {
        uncheckNum: 0,
        tab:1,  //1-待审核，2-已审核
      }
    },
    mounted(){
      this.Bus.$on("uncheckNumChange",(num)=>{
        this.uncheckNum=num;
      });
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .right
    width 1000px
    margin-left 200px
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
