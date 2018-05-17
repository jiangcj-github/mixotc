<template>
  <div class="head" v-if="0">
    <h3>mixOTC-钱包</h3>
  </div>
  <div class="notify" v-else>
    <div class="wrap">
      <h3>mixOTC-钱包</h3>
      <span class="p1"><img src="">消息：充币 2016/01/01</span>
      <span class="p2 hl">BTC：1个</span>
      <span class="p3">当前状态：确认中(<i class="hl">1</i>/5)</span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        msg:1,
      }
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  *{box-sizing:border-box;}

  .title{width:1200px;margin:0 auto;height:40px;line-height:40px;margin-bottom:20px;}
  .title>h3{font-size:12px;}

  .notify{background:#FFE4D3;margin-bottom:20px;}
  .notify .wrap{width:1200px;margin:0 auto;text-align:center;height:40px;line-height:40px;position:relative;}
  .notify .wrap>h3{position:absolute;width:180px;left:0;text-align:left;font-size:12px;}
  .notify .wrap>span{font-size:12px;color: #333333;letter-spacing: 0.23px;}
  .notify .wrap .p1{}
  .notify .wrap .p2{margin:0 30px;}
  .notify .wrap .p3{}
  .notify .wrap .hl{color:#ff794c;}

</style>
