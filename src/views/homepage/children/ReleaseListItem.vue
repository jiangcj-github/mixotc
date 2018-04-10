<template>
  <div class="li">
        <div class="booth">
          <span class="time">{{data.create_c}}</span>
          <span class="type">{{data.type_c}}</span>
          <span class="coin">{{data.currency_c}}</span>
          <span class="price">{{data.price_c}}</span>
          <span class="limit">{{data.minmax_c}}</span>
          <span class="pay-method">
            <img src="/static/images/OTC_zhifubao.png" alt="" v-if="data.pays_c %2 === 1">
            <img src="/static/images/OTC_wechat.png" alt="" v-if="[3, 6, 7].includes(data.pays_c)">
            <img src="/static/images/OTC_Bankcard.png" alt="" v-if="[4, 5, 6, 7].includes(data.pays_c)">
          </span>
          <span class="pay-time">{{data.dead_c}}</span>
          <span class="operation">
             <router-link class="buy-to" to="" tag="span" v-if="data.type_c=='出售'"><i>向他购买</i></router-link>
             <router-link class="buy-to" to="" tag="span" v-if="data.type_c=='购买'"><i>向他出售</i></router-link>
          </span>
        </div>
        <div class="division"></div>
        <div class="remark">备注：{{data.info_c}}</div>
      </div>
</template>
<script>
  export default {
    props:['data'],
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .li
    padding 20px 30px 0 30px
    background #fff
    border 1px solid #E1E1E1
    margin-bottom 10px
    span
      display inline-block
    .booth
      font-size 13px
      color #333333
      letter-spacing 0.27px
      height 67px
      line-height 67px
      .type
        color #57A100
      .pay-method img
        vertical-align -4px
      .operation .buy-to
        width 100px
        height 25px
        line-height 25px
        background #FFB422
        border 1px solid #FFB422
        border-radius 2px
        font-size 13px
        color #FFFFFF
        letter-spacing 0.27px
        text-align center
        cursor pointer
        &:hover
          background-color #f1a45c
    .division
      height 1px
      background: #E1E1E1;
    .remark
      height 50px
      line-height 50px
      font-size 13px
      color #999999
      letter-spacing 0.23px
  .time
    width 200px
  .type
    width 100px
  .coin
    width 100px
  .price
    width 100px
  .limit
    width 200px
  .pay-method
    width 150px
  .pay-time
    width 100px
  .operation
    width 150px
</style>
