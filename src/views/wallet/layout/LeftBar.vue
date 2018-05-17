<template>
  <ul>
    <li :class="{active:leftBar===1}">
      <a href="#"><i>账号余额</i><img src="/static/images/verify/sfsh.png"></a>
    </li>
    <li :class="{active:leftBar===2}">
      <a href="#"><i>充币</i><img src="/static/images/verify/sfsh.png"></a>
    </li>
    <li :class="{active:leftBar===3}">
      <a href="#"><i>提币</i><img src="/static/images/verify/sfsh.png"></a>
    </li>
    <li :class="{active:leftBar===4}">
      <a href="#"><i>资产互转</i><img src="/static/images/verify/sfsh.png"></a>
    </li>
    <li :class="{active:leftBar===5}">
      <a href="#"><i>账单明细</i><img src="/static/images/verify/sfsh.png"></a>
    </li>
    <li :class="{active:leftBar===6}">
      <a href="#"><i>地址管理</i><img src="/static/images/verify/sfsh.png"></a>
    </li>
  </ul>
</template>
<script>
  export default {
    props:["leftBar"],
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base";
  *{box-sizing:border-box;}

  ul{width:180px;background:#fff;float:left;}
  ul>li{height:60px;border-bottom:2px solid #fff;}
  ul>li:hover{background:#fff3eb;border-bottom-color:#fff3eb !important;}
  ul>li.active{border-bottom-color:#ffb422;background:#fff3eb;}
  ul>li>a{height:58px;line-height:58px;padding:0 20px 0 30px;display:block;}
  ul>li>a>i{font-size: 14px;color: #333333;letter-spacing: 0.16px;}
  ul>li>a>img{width:auto;height:14px;float:right;margin-top:22px;}
</style>
