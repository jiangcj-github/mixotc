<template>
  <!--条件渲染-->
  <div class="upload-info" v-if="err===0">
    <h3>{{infos.nickname}}<small>{{infos.account}}</small></h3>
    <!--认证列表-->
    <div v-for="(e,i) in infos.his">
      <sup>第{{infos.his.length-i}}次认证</sup>
      <div v-if="e.flag===1">
        <!--认证信息-->
        <p class="inf-li"><label>提交时间</label><span>{{e.submitTime}}</span></p>
        <p class="inf-li"><label>真实姓名</label><span>{{e.name}}</span></p>
        <p class="inf-li"><label>身份证号</label><span>{{e.idcard}}</span></p>
        <p class="check-img">
          <img :src="e.img1">
          <img :src="e.img2">
          <img :src="e.img3">
        </p>
        <!--表单-->
        <div class="form">
          <p style="margin-bottom:12px">
            <span class="checkbox" :class="{check:formResult===1}" @click="checkPass">审核通过</span>
            <span class="checkbox" :class="{check:formResult===0}" @click="formResult=0" style="margin-left:20px">审核不通过</span>
          </p>
          <div class="textarea" :class="{disabled:formResult!==0}">
            <textarea placeholder="不通过原因：字数限制0～50个字符。" v-model="formRemark" @input="inputRemark" ref="textarea"></textarea>
            <p class="indicator">{{formRemark.length}}/50</p>
          </div>
          <div class="mali">
            <span class="radio" :class="{check:formMali,disabled:formResult!==0}" @click="formMali=!formMali">是否恶意上传认证</span>
            <ul>
              <li>恶意认证提交后，封锁该用户3天认证功能</li>
              <li>3次恶意认证后，永久封锁认证功能</li>
            </ul>
          </div>
          <div class="btn-wrap">
            <button class="submit-btn" :class="{active:canSubmit}" @click="submit(i)">提交</button>
          </div>
        </div>
      </div>
      <div v-else-if="e.flag===2">
        <p class="inf-li"><span>已通过审核</span></p>
      </div>
      <div v-else-if="e.flag===3">
        <p class="inf-li"><label>拒绝理由：</label><span>{{e.remark}}</span></p>
      </div>
      <div v-else-if="e.flag===4">
        <p class="inf-li"><label>拒绝理由：</label><span>恶意上传</span></p>
      </div>
    </div>
  </div>
  <div class="err no-result" v-else-if="err===1">该用户没有待审核数据</div>
  <div class="err load-failed" v-else-if="err===2">网络异常，请重新搜索</div>
  <div class="err net-error" v-else-if="err===3">加载失败，请重新搜索</div>
  <div class="err loading" v-else-if="err===4">数据加载中...</div>
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
        formResult: -1,     // 审核结果【0-不通过,1-通过】
        formMali: false,    // 是否恶意上传
        formRemark: '',     // 审核不通过原因
        formRemarkOld: '',  // formRemark的备份，用于有效性检查
      }
    },
    computed:{
      canSubmit:function () {
        if(this.formResult===1){
          return true;
        }else if(this.formResult===0 && (this.formRemark.length>0 || this.formMali)){
          return true;
        }else{
          return false;
        }
      }
    },
    methods: {
      checkPass(){
        this.formResult=1;
        this.formRemark="";
        this.formMali=false;
      },
      inputRemark(){
        if(this.formRemark.length>50){
          this.formRemark=this.formRemarkOld;
          this.$refs.textarea.value=this.formRemarkOld;
        }else{
          this.formRemarkOld=this.formRemark;
        }
      },
      submit(i){
        if(!this.canSubmit) return;
        //上传参数
        let id=this.infos.his[i].id;
        let uid=this.infos.his[i].uid;
        let type=1;
        let result=2-this.formResult;
        let spite=2-(this.formMali?0:1);
        let info=this.formRemark;
        //WebSocket请求
        this.WsProxy.send("control","a_identify",{
          id:id,uid:uid,type:type,result:result,spite:spite,info:info
        }).then((data)=>{
          location.reload();
        }).catch((msg)=>{
          console.log(msg);
        });
      }
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../../../stylus/base";
  @import "../../stylus/uploadInfo";
</style>
