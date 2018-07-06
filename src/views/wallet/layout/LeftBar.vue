<template>
  <ul>
    <li :class="{active:leftBar===1}">
      <router-link tag="span" to="/wallet/account"><i>账号余额</i><img src="/static/images/wallet/account.png"></router-link>
    </li>
    <li :class="{active:leftBar===2}">
      <router-link tag="span" to="/wallet/charge"><i>充币</i><img src="/static/images/wallet/charge.png"></router-link>
    </li>
    <li :class="{active:leftBar===3}" v-show="0">
      <router-link tag="span" to="/wallet/withdraw"><i>提币</i><img src="/static/images/wallet/widhdraw.png"></router-link>
    </li>
    <li :class="{active:leftBar===4}">
      <router-link tag="span" to="/wallet/conversion"><i>资产划转</i><img src="/static/images/wallet/conversion.png"></router-link>
    </li>
    <li :class="{active:leftBar===5}">
      <router-link tag="span" to="/wallet/history"><i>账单</i><img src="/static/images/wallet/bid.png"></router-link>
    </li>
    <li :class="{active:leftBar===6}" v-show="0">
      <router-link tag="span" to="/wallet/address"><i>地址管理</i><img src="/static/images/wallet/address.png"></router-link>
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
  ul>li{height:60px;background:#fff;}
  ul>li.active{border-bottom:2px solid #ffb422;background:#fff3eb;pointer-events:none;}
  ul>li:hover{background:#fff3eb;}
  ul>li>span{height:58px;line-height:58px;padding:0 20px 0 30px;display:block;cursor:pointer;}
  ul>li>span:hover{background:#fff3eb;}
  ul>li>span>i{font-size: 14px;color: #333333;letter-spacing: 0.16px;}
  ul>li>span>img{width:auto;height:20px;float:right;margin-top:18px;}
</style>
