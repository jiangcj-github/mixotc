<style scoped lang="stylus">
  @import "../../../stylus/base";
  ul{}
  ul>li{}
  ul>li.active{}
  ul>li:hover{}
  ul>li>a{}
  ul>li>a>i{}
  ul>li>a>img{}
</style>
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
