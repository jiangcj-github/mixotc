<template>
  <div class="accont">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="1"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <div class="asset">
            <span class="big">总资产约：</span>
            <span class="big hl">1.000000</span>
            <span class="small">BTC</span>
            <span class="big">/</span>
            <span class="big h1">666666</span>
            <span class="small">CNY</span>
          </div>
          <div class="filter">
            <div class="f1">
              <input type="text" placeholder="搜索币种">
              <img src="/static/images/cancel_icon.png">
              <button @click=""></button>
            </div>
            <div class="f2">
              <span class="radio check">是否恶意上传认证</span>
              <span class="radio check">是否恶意上传认证</span>
              <span class="radio check">是否恶意上传认证</span>
            </div>
          </div>
          <div class="tb-head">

          </div>
          <div class="li">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  export default {
    components: {
      Notify,
      LeftBar,
    },
    data() {
      return {

      }
    },
    methods:{

    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/account"
</style>
