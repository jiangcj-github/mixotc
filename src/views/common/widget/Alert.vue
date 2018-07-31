<template>
  <div class="alert-wrap" v-if="show" @click="onClickNative">
    <div class="alert">
      <div class="alert-title" v-show="isShowTitle">
        {{title}}<i class="close">&times;</i>
      </div>
      <div class="alert-content"  v-html="content"></div>
      <div class="alert-btns" v-show="isShowBtns">
        <button class="btn green" @click="onClickOk">确定</button>
        <button class="btn white" @click="onClickCancel">取消</button>
    </div>
    </div>
  </div>
</template>

<script>
  import timeout from "@/js/Timeout.js";
  export default {
    data(){
      return {
        isShowBtns: false,      // 是否显示按钮
        isShowTitle: false,      // 是否显示标题栏
        title: "标题",                // 标题
        content: "确定要删除吗？",              // 内容，可以是原生html
        onOk: null,               // 确定按钮事件处理
        onCancel: null,          // 取消按钮事件处理
        autoHide: true,          // 是否自动关闭(3s后自动关闭)
        clickHide: true,          //点击自动关闭
        show: false,
      }
    },
    methods:{
      onClickOk(){
        this.show = false;
        this.onOk && this.onOk();
      },
      onClickCancel(){
        this.show=false;
        this.onCancel && this.onCancel();
      },
      onClickNative(){
        this.clickHide && (this.show=false)
      },
      showAlert(opt={}){
        this.isShowBtns=false;
        this.isShowTitle=false;
        this.title="标题";
        this.content="内容";
        this.onOk=null;
        this.onCancel=null;
        this.autoHide=true;
        this.clickHide=true;

        Object.assign(this,opt);

        this.show=true;
        this.autoHide && timeout(()=>{
            this.show=false;
          },3000);
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "../stylus/common"
  .alert-wrap {
    position:fixed;
    background:rgba(0, 0, 0, 0.4);
    z-index:3000;
    left:0;
    top:0;
    right:0;
    bottom:0;
  }
  .alert{
    position:absolute;
    left:50%;
    top:50%;
    transform:translateX(-50%) translateY(-50%);
    background:#FFF;
    border-radius:2px;
    width:300px;
  }
  .alert .alert-title{ height:30px; line-height:30px;padding:0 15px;font-weight:bold;}
  .alert .alert-title .close{display:inline-block;width:30px;height:30px; text-align:center;float:right; cursor:pointer;
    font-size:16px;margin-right:-15px;}
  .alert .alert-title .close:hover{opacity:0.8;}
  .alert .alert-content{ text-align:center; padding:20px;}
  .alert .alert-btns{text-align:center;padding:15px;}
  .alert .alert-btns .btn{padding:5px 20px;margin:0 5px;}
</style>
