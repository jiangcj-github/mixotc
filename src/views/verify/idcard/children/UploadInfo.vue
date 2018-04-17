<template>
  <div class="upload-info" v-if="info.type==0">
    <h3>{{info.nickname}}/{{info.phone}}</h3>
    <sup>第3次认证</sup>
    <p class="inf-li"><label>提交时间</label><span>{{info.submit_time}}</span></p>
    <p class="inf-li"><label>姓名</label><span>{{info.name}}</span></p>
    <p class="inf-li"><label>身份证号</label><span>{{info.idcard}}</span></p>
    <p class="check-img">
      <img :src="info.img1">
      <img :src="info.img2">
      <img :src="info.img3">
    </p>
    <div class="form" v-if="info.can_check">
      <p style="margin-bottom:12px">
        <span class="checkbox" :class="{check:formResult==1}" @click="checkPass">审核通过</span>
        <span class="checkbox" :class="{check:formResult==0}" @click="checkRefuse" style="margin-left:20px">审核不通过</span>
      </p>
      <div class="textarea">
        <textarea placeholder="不通过原因：字数限制0～50个字符。" v-model="formRemark" @input="inputRemark" ref="textarea"></textarea>
        <p class="indicator">{{formRemark.length}}/50</p>
      </div>
      <div class="mali">
        <span class="radio" :class="{check:formMali}" @click="checkMali">是否恶意上传认证</span>
        <ul>
          <li>恶意认证提交后，封锁该用户3天认证功能</li>
          <li>3次恶意认证后，永久封锁认证功能</li>
        </ul>
      </div>
      <div class="btn-wrap">
        <button class="submit-btn" :class="{active:canSubmit}">提交</button>
      </div>
    </div>
    <sup>第2次认证</sup>
    <p class="inf-li"><span>恶意上传认证</span></p>
    <sup>第1次认证</sup>
    <p class="inf-li"><span>照片不清楚</span></p>
  </div>
  <div class="err no-result" v-else-if="info.type==1">无相应的用户，请重新搜索</div>
  <div class="err load-failed" v-else-if="info.type==2">网络异常，请重新搜索</div>
  <div class="err net-error" v-else-if="info.type==3">加载失败，请重新搜索</div>
</template>
<script>
  export default {
    props:["info"],
    data(){
      return{
        formResult: -1,
        formMali: false,
        formRemark: '',
        formRemarkOld: '',

        canSubmit: false,
      }
    },
    methods: {
      checkPass(){
        this.formResult=1;
        this.isValidSubmit();
      },
      checkRefuse(){
        this.formResult=0;
        this.isValidSubmit();
      },
      checkMali(){
        this.formMali=!this.formMali;
        this.isValidSubmit();
      },
      inputRemark(){
        this.isValidateRemark();
        this.isValidSubmit();
      },
      isValidSubmit(){
        if(this.formResult==1){
          this.canSubmit=true;
        }else if(this.formResult==0 && (this.formRemark.length>0 || this.formMali)){
          this.canSubmit=true;
        }else{
          this.canSubmit=false;
        }
      },
      isValidateRemark(){
        if(this.formRemark.length>50){
          this.formRemark=this.formRemarkOld;
          this.$refs.textarea.value=this.formRemarkOld;
        }else{
          this.formRemarkOld=this.formRemark;
        }
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../../stylus/base.styl";
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
      font-weight bold
    sup
      display inline-block
      font-size 11px
      color #FF794C
      letter-spacing 0.12px
      margin-top 20px
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
