<template>
  <LeftLayout :leftBar="1">
    <div class="right" slot="right">
      <ul class="tab">
        <li :class="{active:tab==1}" @click="tab=1">待审核(3)</li>
        <li :class="{active:tab==2}" @click="tab=2">已审核</li>
      </ul>
      <!--待审核-->
      <div class="uncheck" v-show="tab==1">
        <div class="search-bar">
          <div class="search" >
            <input type="text" placeholder="查找昵称/帐号" v-model="srch_key" v-clickoutside="clickOutside">
            <img src="/static/images/search_gray.png">
            <ul class="cand" :class="{show:srch_show_cand}">
              <li v-for="item of 10" @click="srch_key=item" :key="item">{{item}}</li>
            </ul>
          </div>
          <ul class="results">
            <li class="active">lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
            <li>lihh / 130***123</li>
          </ul>
        </div>
        <div class="upload-info">
          <h3>lihh / 130***123</h3>
          <sup>第1次认证</sup>
          <p class="inf-li"><label>提交时间</label><span>2018/03/09 23:30:42</span></p>
          <p class="inf-li"><label>姓名</label><span>李小蹦</span></p>
          <p class="inf-li"><label>身份证号</label><span>189099087656567890</span></p>
          <p class="check-img">
            <img src="">
            <img src="">
            <img src="">
          </p>
          <div class="form">
            <p style="margin-bottom:12px">
              <span class="checkbox" :class="{check:form_result==1}" @click="checkPass">审核通过</span>
              <span class="checkbox" :class="{check:form_result==0}" @click="checkRefuse" style="margin-left:20px">审核不通过</span>
            </p>
            <div class="textarea">
              <textarea placeholder="不通过原因：字数限制0～50个字符。" v-model="form_remark" @input="isValidateText" ref="textarea"></textarea>
              <p class="indicator">{{form_remark.length}}/50</p>
            </div>
            <div class="mali">
              <span class="radio" :class="{check:form_mali}" @click="form_mali=!form_mali">是否恶意上传认证</span>
              <ul>
                <li>恶意认证提交后，封锁该用户3天认证功能</li>
                <li>3次恶意认证后，永久封锁认证功能</li>
              </ul>
            </div>
            <div class="btn-wrap">
              <button class="submit-btn" :class="{active:form_submit}">提交</button>
            </div>
          </div>
        </div>
      </div>
      <!--已审核-->
      <div class="checked" v-show="tab==2">
        <div class="filter">
          <div class="f1">
            <input type="text" placeholder="搜索商家昵称/账号" v-model="flt_srch">
            <img src="/static/images/cancel_icon.png" @click="flt_srch=''" :class="{show:flt_srch.length>0}">
            <a href="javascript:void(0)" @click="search"></a>
          </div>
          <div class="f2">
            <DateInterval ref="di"></DateInterval>
          </div>
          <div class="f3">
            <a href="javascript:void(0)" :class="{active:flt_days==1}" @click="flt_days=1">今天</a>
            <a href="javascript:void(0)" :class="{active:flt_days==3}" @click="flt_days=3">三天</a>
            <a href="javascript:void(0)" :class="{active:flt_days==7}" @click="flt_days=7">七天</a>
          </div>
        </div>
        <div class="tb-head">
          <span class="tjsj">提交时间</span>
          <span class="yh">用户</span>
          <span class="shr">审批人</span>
          <span class="shsj">审核时间</span>
          <span class="ys">用时</span>
          <span class="zt">状态</span>
          <span class="cz">操作</span>
        </div>
        <div class="li" v-for="item of 4">
          <div class="booth">
            <span class="tjsj">2016/03/09 13:24</span>
            <span class="yh">lihh/130***123</span>
            <span class="shr">lihh/130***123</span>
            <span class="shsj">2016/03/09 13:24</span>
            <span class="ys">6min30s</span>
            <span class="zt">通过</span>
            <span class="cz"><a href="javascript:void(0)" class="ck" @click="showPop">查看</a></span>
          </div>
          <div class="division"></div>
          <div class="remark">备注：照片不清晰，模糊看不清</div>
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
    </div>
  </LeftLayout>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import BasePopup from "@/components/common/BasePopup";
  import LeftLayout from "./layout/LeftLayout";
  import WebSocketProxy from '@/api/WebSocketProxy.js';
  import DateInterval from "@/components/common/DateInterval";
  export default {
    components: {
      DateInterval,
      LeftLayout,
      BasePopup,
      Pagination,
    },
    data() {
      return {
        proxy: new WebSocketProxy(this.WebSocket),
        tab:1,  //审核，未审核

        srch_key: '',
        srch_show_cand: false,

        form_result: -1,
        form_mali: false,
        form_remark: '',
        form_remark_old: '',
        form_submit: false,

        flt_srch: '',
        flt_days: 1,

        pop:false,  //弹窗-查看
      }
    },
    watch:{
      srch_key:function(){
        this.srch_show_cand=true;
      }
    },
    methods: {
      checkPass(){
        this.form_result=1;
        this.form_submit=true;
      },
      checkRefuse(){
        this.form_result=0;
        this.form_submit=this.form_remark.length>0;
      },
      isValidateText(){
        if(this.check_remark.length>50){
          this.check_remark=this.check_remark_old;
          this.$refs.textarea.value=this.check_remark_old;
        }else{
          this.check_remark_old=this.check_remark;
        }
        if(this.check_result==0){
          this.can_submit=this.check_remark.length>0;
        }
      },
      searchCheck(){

      },
      showPop(){
        //
        this.pop=true;
      },
      //
      loadUnchecks(){
        this.proxy.send("otc","",{

        }).then(function(data){

        })
      },
      clickOutside(){
        this.srch_show_cand=false;
      },
      //
      search(){

      }
    },
    mounted(){
      //
      //
      this.Bus.$on('changePage',(p) => {

      });
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base.styl";
  .right
    width 1000px
    margin-left 200px
    min-height 500px
    .tab
      background #fff
      height 60px
      line-height 58px
      margin-bottom 20px
      padding 0 30px
      font-size 16px
      >li
        display inline-block
        width 100px
        text-align center
        color #999999
        letter-spacing 0.33px
        cursor pointer
        &.active
          color #FFB422
          border-bottom 2px solid #FFB422
    .uncheck
      position relative
      &::after
        clear both
        content ''
        display block
      .search-bar
        width 230px
        background #fff
        position absolute
        top 0
        bottom 0
        .search
          padding 10px 30px
          border-bottom 1px solid #E1E1E1
          display flex
          align-items center
          position relative
          input
            background #F4F6FA
            border-radius 2px
            padding 5px 30px 5px 10px
            font-size 13px
            line-height 20px
            width 100%
            min-width 0
            box-sizing border-box
            border 1px solid #e1e1e1
          img
            margin-left -24px
            cursor pointer
          ul.cand
            display none
            position absolute
            top 100%
            margin-top -10px
            width 170px
            background #fff
            z-index 1000
            border 1px solid #e1e1e1
            border-top none
            box-sizing border-box
            max-height 301px
            overflow-y auto
            &.show
              display block
            li
              line-height 30px
              padding 0 10px
              cursor pointer
              font-size 13px
              &:hover
                background #fff3eb
        .results
          margin-top 2px
          font-size 14px
          color #FFB422
          letter-spacing 0.16px
          padding-bottom 15px
          >li
            line-height 20px
            padding 0 34px
            margin-top 15px
            &.active
              color #FFB422
      .upload-info
        margin-left 250px
        padding 30px
        background #fff
        h3
          font-size 20px
          color #333333
          letter-spacing 0.23px
          border-bottom 1px solid #E1E1E1
          padding-bottom 20px
          margin-bottom 20px
          font-weight bold
        sup
          font-size 11px
          color #FF794C
          letter-spacing 0.12px
        .inf-li
          font-size 14px
          letter-spacing 0.16px
          line-height 20px
          margin-top 10px
          label
            color #333333
            width 150px
            display inline-block
          span
            color #999999
            display inline-block
        .check-img
          height 180px
          display flex
          justify-content center
          align-items center
          >img
            width 180px
            height 120px
            border 1px solid #EEEEEE
            border-radius 2px
            margin 0 10px
        .form
          background #F4F6FA
          padding 20px
          .mali
            margin-top 12px
            display flex
            align-items flex-start
            >ul
              margin-left 30px
              >li
                font-size 11px
                color #FF794C
                letter-spacing 0.12px
                margin-bottom 10px
          .btn-wrap
            text-align center
            margin-top 30px
            .submit-btn
              background #999999
              border-radius 2px
              width 464px
              height 40px
              line-height 40px
              text-align center
              font-size 13px
              color #FFFFFF
              letter-spacing 0.15px
              cursor pointer
              &.active
                background-color #ffb422
              &.active:hover
                background-color #f5a60e
    .checked
      border-top 1px solid #E1E1E1
      margin-top -20px
      .filter
        padding 10px 30px
        display flex
        background #fff
        .f1
          flex-grow 1
          margin-right 70px
          border 1px solid #E1E1E1
          border-radius 2px 2px 2px 0
          display inline-flex
          >input
            padding 0 10px
            flex-grow 1
          >img
            align-self center
            margin-right 10px
            display none
            &:hover
              cursor pointer
              opacity 0.8
            &.show
              display inline-block
          >a
            display inline-block
            flex-shrink 0
            width 72px
            background url(/static/images/search.png) no-repeat center center
            background-color #e1e1e1
            &:hover
              background-color #dcd5d5
        .f2
          margin-right 20px
        .f3
          font-size 13px
          letter-spacing 0.27px
          background #FFF3EB
          border 1px solid #FFF3EB
          border-radius 2px
          display inline-flex
          align-items center
          height 30px
          box-sizing border-box
          padding 0 1px
          >a
            width 50px
            line-height 26px
            display inline-block
            text-align center
            color #999
            &.active
              background #FFFFFF
              border-radius 2px
              color #FFB422

      .tb-head
        height 50px
        padding 0 32px
        font-size 13px
        color #999999
        letter-spacing 0.27px
        span
          display inline-block
          line-height 50px
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
  .textarea
    border 1px solid #E1E1E1
    border-radius 2px
    height 150px
    display flex
    flex-direction column
    textarea
      resize none
      border none
      background transparent
      outline none
      flex-grow 1
      padding 10px
    .indicator
      text-align right
      font-size 13px
      color #999999
      letter-spacing 0
      line-height 24px
      padding 0 6px


  .checkbox
    font-size 13px
    color #333333
    letter-spacing 0.27
    display inline-block
    padding-left 23px
    cursor pointer
    background  url(/static/images/rules_unchecked.png) no-repeat 3px center
    &.check
      background-image url(/static/images/rules_checked.png)
    &:hover
      color #666

  .radio
    font-size 13px
    color #333333
    letter-spacing 0.27
    display inline-block
    padding-left 27px
    cursor pointer
    background  url(/static/images/unselect.png) no-repeat 3px center
    &.check
      background-image url(/static/images/selected.png)
    &:hover
      color #666
  placeholder()
</style>
