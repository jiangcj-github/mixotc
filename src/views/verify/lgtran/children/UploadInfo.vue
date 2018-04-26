<template>
  <div class="upload-info" v-if="err===0">
    <h3>{{infos.nickname}}</h3>
    <div v-for="(e,i) in infos.his" :key="i">
      <sup>第{{i+1}}次认证</sup>
      <div v-if="e.flag===1">
        <p class="inf-li"><label>提交时间</label><span>{{e.submitTime}}</span></p>
        <p class="inf-li"><label>真实姓名</label><span>{{e.name}}</span></p>
        <p class="inf-li"><label>银行卡号</label><span>{{e.bankcard}}</span></p>
        <p class="inf-li"><label>开户行</label><span>{{e.bank}}</span></p>
        <p class="check-img">
          <img :src="e.img1">
          <img :src="e.img2">
          <img :src="e.img3">
        </p>
        <div class="form">
          <p style="margin-bottom:12px">
            <span class="checkbox" :class="{check:formResult===1}" @click="checkPass">审核通过</span>
            <span class="checkbox" :class="{check:formResult===0}" @click="checkRefuse" style="margin-left:20px">审核不通过</span>
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
            <button class="submit-btn" :class="{active:canSubmit}" @click="submit">提交</button>
          </div>
        </div>
      </div>
      <div v-else-if="e.flag===2">
        <p class="inf-li"><span>已通过审核</span></p>
      </div>
      <div v-else-if="e.flag===3">
        <p class="inf-li"><span>拒绝理由：&nbsp;{{e.remark}}</span></p>
      </div>
      <div v-else-if="e.flag===4">
        <p class="inf-li"><span>拒绝理由：&nbsp;恶意上传</span></p>
      </div>
    </div>
  </div>
  <div class="err no-result" v-else-if="err===1">无相应的用户，请重新搜索</div>
  <div class="err load-failed" v-else-if="err===2">网络异常，请重新搜索</div>
  <div class="err net-error" v-else-if="err===3">加载失败，请重新搜索</div>
  <div class="err net-error" v-else-if="err===4">数据加载中...</div>
  <div class="err empty" v-else>没有待审核数据</div>
</template>
<script>
  export default {
    props: {
      infos:{},
      err:{},
      onSubmit:{type: String,default:"onSubmit"},
    },
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
        if(this.formResult===1){
          this.canSubmit=true;
        }else if(this.formResult===0 && (this.formRemark.length>0 || this.formMali)){
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
      },
      submit(){
        if(!this.canSubmit) return;
        //
        let id=this.infos.his[0].id;
        let uid=this.infos.his[0].uid;
        let type=2;
        let result=2-this.formResult;
        let spite=2-(this.formMali?0:1);
        let info=this.formRemark;
        //ws-提交审核
        this.WsProxy.send("control","a_identify",{
          id:id,uid:uid,type:type,result:result,spite:spite,info:info
        }).then((data)=>{
          this.Bus.$emit("onSubmit",this.infos);
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    },
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
          cursor not-allowed
          &.active
            background-color #ffb422
            cursor pointer
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
      background-image url(/static/images/verify/err_no_result.png)
    &.load-failed
      background-image url(/static/images/verify/err_load_failed.png)
    &.net-error
      background-image url(/static/images/verify/err_net_error.png)
    &.empty
      background-image url(/static/images/rectangle.png)
</style>

