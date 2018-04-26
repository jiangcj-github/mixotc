<template>
  <div class="verify inner">
    <h2>mixOTC-审核</h2>
    <div class="main">
      <!-- 左边栏菜单 -->
      <Left :leftBar="2"></Left>
      <!--右边内容-->
      <div class="right">
        <ul class="tab">
          <li :class="{active:tab===1}" @click="tab=1">待审核<i>({{uncheckNum}})</i></li>
          <li :class="{active:tab===2}" @click="tab=2">已审核</li>
        </ul>
        <Uncheck v-show="tab===1"></Uncheck>
        <Check v-show="tab===2"></Check>
      </div>
    </div>
  </div>
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
      this.loadUncheckTotal();
      this.Bus.$on("onSubmit2",(info)=>{
        this.loadUncheckTotal();
      });
    },
    methods:{
      loadUncheckTotal(){
        this.WsProxy.send("control","a_get_identity_amount",{
          type:2,
          state:1
        }).then((data)=>{
          this.uncheckNum=data.amount;
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  @import "./stylus/verify.styl";
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
