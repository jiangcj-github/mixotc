<template>
  <div class="verify inner">
    <h2>mixOTC-审核</h2>
    <div class="main">
      <!-- 左边栏菜单 -->
      <ul class="left-bar">
        <li class="bi" :class="{active:bar===1}" @click="toggleBar(1)">
          <i>身份审核</i><img src="/static/images/verify/sfsh.png" alt="">
        </li>
        <li class="bi" :class="{active:bar===2}" @click="toggleBar(2)">
          <i>大额交易申请</i><img src="/static/images/verify/dejy.png" alt="">
        </li>
        <li class="bi" :class="{active:bar===3}" @click="toggleBar(3)">
          <i>敏感词库</i><img src="/static/images/verify/mgck.png" alt="">
        </li>
        <li class="bi" :class="{active:bar===4}" @click="toggleBar(4)">
          <i>仲裁记录</i><img src="/static/images/verify/zcjl.png" alt="">
        </li>
      </ul>
      <IdAud v-show="bar==1"></IdAud>
      <LgTran v-show="bar==2"></LgTran>
      <SensLex v-show="bar==3"></SensLex>
      <ArbiRec v-show="bar==4"></ArbiRec>
    </div>
  </div>
</template>
<script>
  import IdAud from "./frame/IdAud";
  import LgTran from "./frame/LgTran";
  import SensLex from "./frame/SensLex";
  import ArbiRec from "./frame/ArbiRec";

  export default {
    components: {
      IdAud,
      LgTran,
      SensLex,
      ArbiRec
    },
    data() {
      return {
        bar:1,
      }
    },
    methods: {
      toggleBar(i){
        this.bar=i;
        console.log(i)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .verify
    margin-top: 40px;
    margin-bottom: 40px;
    h2
      height 30px
      padding-left 5px
      line-height 30px
      font-size $fz20
      font-weight bold
      color $col333
      letter-spacing 0.41px
      &::before
        display inline-block
        position relative
        top 2px
        left 0
        content ''
        width 3px
        height 20px
        margin-right 10px
        background-color $col422
    .main
      margin-top 28px
      &::after
        clear both
        content ''
        display block
      .left-bar
        width 180px
        margin-right 20px
        float left
        .bi
          width 120px
          height 60px
          padding 0 30px
          display inline-flex
          align-items center
          justify-content space-between
          cursor pointer
          margin-bottom 10px
          &.active
            background #fff
            box-shadow 0 2px 4px 0 rgba(153,153,153,0.70)
            border-radius 4px
            color #ffa21c
          &:hover
            color #ffa21c
</style>
