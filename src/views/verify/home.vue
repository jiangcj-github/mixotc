<template>
  <div class="verify inner">
    <h2>mixOTC-审核</h2>
    <div class="main">
      <!-- 左边栏菜单 -->
      <ul class="left-bar">
        <router-link class="bi" to="" tag="li" :class="{active:bar==1}">
          <i>身份审核</i><img src="/static/images/verify/sfsh.png" alt="">
        </router-link>
        <router-link class="bi" to="" tag="li">
          <i>大额交易申请</i><img src="/static/images/verify/dejy.png" alt="">
        </router-link>
        <router-link class="bi" to="" tag="li">
          <i>敏感词库</i><img src="/static/images/verify/mgck.png" alt="">
        </router-link>
        <router-link class="bi" to="" tag="li">
          <i>仲裁记录</i><img src="/static/images/verify/zcjl.png" alt="">
        </router-link>
      </ul>
      <div class="right">
        <ul class="tab">
            <li :class="{active:tab==1}" @click="showUnCheck">待审核(3)</li>
            <li :class="{active:tab==2}" @click="showChecked">已审核</li>
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
            <p class="check-img">
              <img src="">
              <img src="">
              <img src="">
            </p>
            <div class="form">
              <p style="margin-bottom:12px">
                <span class="checkbox" :class="{check:check_result}" @click="checkSuccess">审核通过</span>
                <span class="checkbox" :class="{check:!check_result}" @click="checkFailed" style="margin-left:20px">审核不通过</span>
              </p>
              <div class="textarea">
                <textarea placeholder="不通过原因：字数限制0～50个字符。" v-model="check_reason" @input="isValidateReason"></textarea>
                <p class="indicator">{{check_reason.length}}/50</p>
              </div>
              <div class="mali">
                <span class="radio" :class="{check:is_malicious}" @click="toggleMali">是否恶意上传认证</span>
                <ul>
                  <li>恶意认证提交后，封锁该用户3天认证功能</li>
                  <li>3次恶意认证后，永久封锁认证功能</li>
                </ul>
              </div>
              <div class="btn-wrap">
                <button class="submit-btn">提交</button>
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
              <a href="javascript:void(0)" :class="{active:flt_days==1}" @click="filterDays1">今天</a>
              <a href="javascript:void(0)" :class="{active:flt_days==3}" @click="filterDays3">三天</a>
              <a href="javascript:void(0)" :class="{active:flt_days==7}" @click="filterDays7">七天</a>
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
          <VerifyListItem v-for="item of 4"></VerifyListItem>
          <Pagination total="6" emitValue="changePage" style="width:100%;margin-top:20px"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Pagination from "../../components/common/Pagination";
  import DatePicker from "../../components/common/DatePicker";
  import VerifyListItem from "./children/VerifyListItem";
  export default {
    components: {
      VerifyListItem,
      Pagination,
      DatePicker,
    },
    data() {
      return {
        bar:1,
        tab:1,
        check_result:true,
        is_malicious:false,
        check_reason:'',
        check_reason_old:'',
        srch_key:'',

        flt_days:1,
      }
    },
    methods: {
      showUnCheck(){
        this.tab=1;
      },
      showChecked(){
        this.tab=2;
      },
      checkSuccess(){
        this.check_result=true;
      },
      checkFailed(){
        this.check_result=false;
      },
      toggleMali(){
        this.is_malicious=!this.is_malicious;
      },
      isValidateReason(e){
        if(this.check_reason.length>50){
          this.check_reason=this.check_reason_old;
        }else{
          this.check_reason_old=this.check_reason;
        }
      },
      searchCheck(){

      },
      filterDays1(){
        this.flt_days=1;
      },
      filterDays3(){
        this.flt_days=3;
      },
      filterDays7(){
        this.flt_days=7;
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
                  &:hover
                    background-color #afaaaa
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
              >a
                width 50px
                line-height 28px
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
    background-size 12px 12px
    &.check
      background-image url(/static/images/rules_checked.png)
    &:hover
      color #666
  .radio
    font-size 13px
    color #333333
    letter-spacing 0.27
    display inline-block
    padding-left 23px
    cursor pointer
    background  url(/static/images/unselect.png) no-repeat 3px center
    background-size 14px 14px
    &.check
      background-image url(/static/images/selected.png)
    &:hover
      color #666

</style>
