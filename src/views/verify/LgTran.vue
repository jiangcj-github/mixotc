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
          <li :class="{active:tab===2}" @click="tab=2">已审核<i>({{checkNum}})</i></li>
        </ul>
        <Uncheck v-if="tab===1"></Uncheck>
        <Check v-else-if="tab===2"></Check>
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
        checkNum: 0,
        tab:1,  //1-待审核，2-已审核
      }
    },
    mounted(){
      this.loadUncheckTotal();
      this.loadCheckTotal();
    },
    methods:{
      loadUncheckTotal(){
        this.WsProxy.send("control","a_get_identity_amount",{
          type:2,
          state:1
        }).then((data)=>{
          this.uncheckNum=data.amount;
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
      },
      loadCheckTotal(){
        this.WsProxy.send("control","a_get_identity_amount",{
          type:2,
          state:2
        }).then((data)=>{
          this.checkNum=data.amount;
        }).catch((msg)=>{
          alert(JSON.stringify(msg));
        });
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/verify";
</style>
