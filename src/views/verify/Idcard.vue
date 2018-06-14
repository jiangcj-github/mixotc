<template>
  <div class="verify inner">
    <h2>mixOTC-审核</h2>
    <div class="main">
      <!-- 左边栏菜单 -->
      <Left :leftBar="1"></Left>
      <!--右边内容-->
      <div class="right">
        <ul class="tab">
          <li :class="{active:tab===1}" @click="tab=1">待审核<i v-show="uncheckNum>=0">({{uncheckNum}})</i></li>
          <li :class="{active:tab===2}" @click="tab=2">已审核<i v-show="checkNum>=0">({{checkNum}})</i></li>
        </ul>
        <Uncheck v-if="tab===1"></Uncheck>
        <Check v-else-if="tab===2"></Check>
      </div>
    </div>
  </div>
</template>
<script>
  import Left from "./layout/Left";
  import Uncheck from "./idcard/Uncheck";
  import Check from "./idcard/Check";
  export default {
    components: {
      Left,
      Uncheck,
      Check,
    },
    data() {
      return {
        uncheckNum: -1,    // 待审核数量
        checkNum: -1,      // 已审核数量
        tab:1,            // 选项卡【1-待审核，2-已审核】
      }
    },
    created(){
      this.loadUncheckTotal();
      this.loadCheckTotal();
    },
    methods:{
      loadUncheckTotal(){
        this.WsProxy.send("control","a_get_identity_amount",{
          type:1, state:1,
        }).then((data)=>{
         this.uncheckNum=data.amount;
        }).catch((msg)=>{
          console.log(msg);
        });
      },
      loadCheckTotal(){
        this.WsProxy.send("control","a_get_identity_amount",{
          type:1, state:2,
        }).then((data)=>{
          this.checkNum=data.amount;
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/verify";
</style>
