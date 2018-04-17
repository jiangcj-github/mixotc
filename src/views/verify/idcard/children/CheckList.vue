<template>
  <div>
    <div class="li" v-for="(e,i) in list" :key="i">
      <div class="booth">
        <span class="tjsj">{{e.submit_time}}</span>
        <span class="yh">{{e.nickname}}/{{e.phone}}</span>
        <span class="shr">{{e.nickname_sh}}/{{e.phone_sh}}</span>
        <span class="shsj">{{e.check_time}}</span>
        <span class="ys">{{e.spend}}</span>
        <span class="zt">{{e.check_result}}</span>
        <span class="cz"><a href="javascript:void(0)" class="ck" @click="showPop">查看</a></span>
      </div>
      <div class="division"></div>
      <div class="remark">备注：{{e.check_remark}}</div>
    </div>
    <Pagination :total="6" :pageSize="3" emitValue="changePage" style="width:100%;margin-top:20px"></Pagination>
    <BasePopup :show="pop" :width="764" :height="382">
      <div class="pop">
        <p class="inf-li"><label>提交时间</label><span>2018/03/09 23:30:42</span></p>
        <p class="inf-li"><label>姓名</label><span>李小蹦</span></p>
        <p class="inf-li"><label>身份证号</label><span>189099087656567890</span></p>
        <p class="check-img">
          <img src="">
          <img src="">
          <img src="">
        </p>
        <i class="close" @click="pop=false">&times;</i>
      </div>
    </BasePopup>
  </div>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import BasePopup from "@/components/common/BasePopup";
  import WebSocketProxy from '@/api/WebSocketProxy.js';
  export default {
    props:["list"],
    components: {
      BasePopup,
      Pagination,
    },
    data(){
      return{
        pop: false,  //弹窗-查看
      }
    },
    methods: {
      showPop(){
        this.pop=true;
      },
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../../stylus/base.styl";
  .pop
    padding 60px 80px
    position relative
    .inf-li
      font-size 14px
      letter-spacing 0.16px
      line-height 20px
      margin-bottom 10px
      label
        color #999
        width 150px
        display inline-block
      span
        color #333
        display inline-block
    .check-img
      height 180px
      display flex
      align-items center
      >img
        width 180px
        height 120px
        border 1px solid #EEEEEE
        border-radius 2px
        margin-right 20px
    .close
      position absolute
      top 10px
      right 10px
      font-size 20px
      cursor pointer
      display inline-block
      line-height 24px
      width 24px
      text-align center
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
  .err
    background-repeat no-repeat
    background-position  center 102px
    background-size 140px 140px
    height 547px
    margin-left 250px
    background-color #fff
    padding-top 270px
    text-align center
    font-size 14px
    color #999
    letter-spacing 0.36px
    box-sizing border-box
    &.no-result
      background-image url(/static/images/verify/err_no_result.png);
    &.load-failed
      background-image url(/static/images/verify/err_load_failed.png);
    &.net-error
      background-image url(/static/images/verify/err_net_error.png);
</style>
