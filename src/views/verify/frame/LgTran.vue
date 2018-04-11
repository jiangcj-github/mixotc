<template>
  <div class="right">
    <ul class="tab">
      <li :class="{active:tab==1}" @click="tab=1">待审核(3)</li>
      <li :class="{active:tab==2}" @click="tab=2">已审核</li>
    </ul>
    <!--待审核-->
    <div class="uncheck" v-show="tab==1">
      <div class="search-bar">
        <div class="search">
          <input type="text" placeholder="查找昵称/帐号" @input="searchCheck" v-model="srch_key">
          <img src="/static/images/search_gray.png">
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
        <p class="inf-li"><label>银行卡号</label><span>189099087656567890</span></p>
        <p class="inf-li"><label>开户行</label><span>北京银行中关村支行</span></p>
        <p class="check-img">
          <img src="">
          <img src="">
          <img src="">
        </p>
        <div class="form">
          <p style="margin-bottom:12px">
            <span class="checkbox" :class="{check:check_result==1}" @click="checkSuccess">审核通过</span>
            <span class="checkbox" :class="{check:check_result==0}" @click="checkFailed" style="margin-left:20px">审核不通过</span>
          </p>
          <div class="textarea">
            <textarea placeholder="不通过原因：字数限制0～50个字符。" v-model="check_remark" @input="isValidateReason"></textarea>
            <p class="indicator">{{check_remark.length}}/50</p>
          </div>
          <div class="mali">
            <span class="radio" :class="{check:is_mali}" @click="is_mali=!is_mali">是否恶意上传认证</span>
            <ul>
              <li>恶意认证提交后，封锁该用户3天认证功能</li>
              <li>3次恶意认证后，永久封锁认证功能</li>
            </ul>
          </div>
          <div class="btn-wrap">
            <button class="submit-btn" :class="{active:can_submit}">提交</button>
          </div>
        </div>
      </div>
    </div>
    <!--已审核-->
    <div class="checked" v-show="tab==2">
      <div class="filter">
        <div class="f1">
          <input type="text" placeholder="搜索商家昵称/账号">
          <a href="javascript:void(0)"></a>
        </div>
        <div class="f2">
          <img src="/static/images/date_icon.png" class="data-icon">
          <DatePicker text="开始日期"></DatePicker>
          <span class="to">-</span>
          <DatePicker text="截止日期"></DatePicker>
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
      <Pagination total="6" emitValue="changePage" style="width:100%;margin-top:20px"></Pagination>
      <!--查看弹框-->
      <BasePopup :show="show_pop" :width="764" :height="382">
        <div class="pop">
          <p class="inf-li"><label>提交时间</label><span>2018/03/09 23:30:42</span></p>
          <p class="inf-li"><label>银行卡号</label><span>189099087656567890</span></p>
          <p class="inf-li"><label>开户行</label><span>北京银行中关村支行</span></p>
          <p class="check-img">
            <img src="">
            <img src="">
            <img src="">
          </p>
          <i class="close" @click="show_pop=false">&times;</i>
        </div>
      </BasePopup>
    </div>
  </div>
</template>
<script>
  import Pagination from "@/components/common/Pagination";
  import DatePicker from "@/components/common/DatePicker";
  import BasePopup from "@/components/common/BasePopup";

  export default {
    components: {
      Pagination,
      DatePicker,
      BasePopup,
    },
    data() {
      return {
        tab:1,    //审核，未审核

        srch_key:'',

        check_result:-1,
        is_mali:false,
        check_remark:'',
        check_remark_old:'',
        can_submit:false,

        flt_days:1,

        show_pop:false,  //弹框-查看
      }
    },
    methods: {
      checkSuccess(){
        this.check_result=1;
        this.can_submit=true;
      },
      checkFailed(){
        this.check_result=0;
        this.can_submit=this.check_remark.length>0;
      },
      isValidateReason(e){
        if(this.check_remark.length>50){
          this.check_remark=this.check_remark_old;
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
        this.show_pop=true;
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
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
          input
            background #F4F6FA
            border-radius 2px
            padding 5px 30px 5px 10px
            font-size 13px
            line-height 20px
            width 100%
            min-width 0
            box-sizing border-box
          img
            margin-left -24px
            cursor pointer
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
          >a
            display inline-block
            flex-shrink 0
            width 72px
            background url(/static/images/search.png) no-repeat center center
            background-color #e1e1e1
            &:hover
              background-color #dcd5d5
        .f2
          display inline-flex
          align-items center
          margin-right 20px
          .data-icon
            margin-right 10px
          .to
            width 15px
            text-align center
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
            margin 0 10px
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

</style>
