<template>
  <div class="li">
    <div class="booth">
      <span class="tjsj">2016/03/09 13:24</span>
      <span class="yh">lihh/130***123</span>
      <span class="shr">lihh/130***123</span>
      <span class="shsj">2016/03/09 13:24</span>
      <span class="ys">6min30s</span>
      <span class="zt">通过</span>
      <span class="cz"><router-link to="" class="ck">查看</router-link></span>
    </div>
    <div class="division"></div>
    <div class="remark">备注：照片不清晰，模糊看不清</div>
  </div>
</template>
<script>
  export default {
    props:['item'],
    data() {
      return {

      }
    },
    computed:{
      data(){
        return this.item;
      }
    },
    methods: {

    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .li
    padding 0 30px
    background #fff
    border 1px solid #E1E1E1
    margin-bottom 10px
    span
      display inline-block
    .booth
      font-size 14px
      color #333333
      letter-spacing 0.16px
      height 67px
      line-height 67px
      .yh
        color #ffb422
      .cz
        .ck
          color #ffb422
          &:hover
            color #dca02a
    .division
      height 1px
      background: #E1E1E1;
    .remark
      height 50px
      line-height 50px
      font-size: 13px;
      color: #999999;
      letter-spacing: 0.23px;
  .tjsj
    width 160px
  .yh
    width 140px
  .shr
    width 140px
  .cz
    width 100px
  .shsj
    width 160px
  .ys
    width 100px
  .zt
    width 100px
</style>
