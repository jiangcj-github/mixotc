<template>
  <div class="search-group" :class="{active:isActive}">
    <!--搜索条件下拉-->
    <span class="term" @click="isShowTermUl=!isShowTermUl" v-clickoutside="()=>{isShowTermUl=false}">
      {{terms[termSel].text}}
    </span>
    <ul v-show="isShowTermUl">
      <li v-for="(e,i) in terms" @click="termSel=i" :key="i">{{e.text}}</li>
    </ul>
    <!--搜索框,清楚按钮，搜索按钮-->
    <input type="text" class="input"
           v-model="srchText"
           v-clickoutside="()=>{isShowTip=false}"
           @keyup.enter="()=>{isShowTip=false;}"
           @input=""
           @focus="onFocus"
           @blur="onBlur">
    <img class="clear" src="/static/images/cancel_icon.png"
         @click="srchText=''"
         v-show="srchText.length>0">
    <button class="srch-btn" @click=""></button>
    <!--模糊搜索结果-->
    <div>
      <slot name="fuzzy"></slot>
    </div>
  </div>
</template>

<script>
  import timeout from "@/js/Timeout.js";
  export default {
    props:{
      terms:{type:Array,default:[{text:"文本",value:0}]}
    },
    data(){
      return {
        isActive: false,

        termSel: 0,
        isShowTermUl: false,
        srchText: "",
        isShowTip: false,
      }
    },
    methods:{
      onFocus(){
        this.isActive=true;
        this.isShowTip=true;
      },
      onBlur(){
        if(this.srchText.length<=0){
          this.isActive=false;
        }
      },
      onClickOk(){
        this.show = false;
        if(this.onOk) this.onOk();
      },
      onClickCancel(){
        this.show=false;
        if(this.onCancel) this.onCancel();
      },
      onClickNative(){
        if(this.autoHide){
          this.show=false;
        }
      },
      showAlert(opt={}){
        this.isShowBtns=opt.isShowBtns || false;
        this.isShowTitle=opt.isShowTitle || false;
        this.title=opt.title || "标题";
        this.content=opt.content || "内容";
        this.onOk=opt.onOk || null;
        this.onCancel=opt.onCancel || null;
        this.autoHide=true;
        if(opt.autoHide!=null){
          this.autoHide=opt.autoHide;
        }
        this.clickHide=true;
        if(opt.clickHide!=null){
          this.clickHide=opt.clickHide;
        }
        this.show=true;
        if(this.autoHide){
          timeout(()=>{
            this.show=false;
          },3000);
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "../stylus/common"

  .search-group{width:380px;height:30px;line-height:28px;position:relative;display:flex;border:1px solid #e1e1e1;border-radius:2px;background:#fff;}
  .search-group .term{background:#f4f6fa;line-height:28px;padding:0 10px;cursor:pointer;border-right:1px solid #e1e1e1;letter-spacing:0;}
  .search-group .term:hover{color:#666;}
  .search-group .term:after{content:"";display:inline-block;border:5px solid transparent;border-top-color:#999;vertical-align:-3px;margin-left:5px;}
  .search-group .input{flex-grow:1;padding:0 10px;}
  .search-group .clear{align-self:center;width:12px;cursor:pointer;margin-right:10px;}
  .search-group .clear:hover{opacity:0.8;}
  .search-group .srch-btn{width:72px;cursor:pointer;background:url(/static/images/search.png) no-repeat center center #e1e1e1;}
  .search-group .drop-trangle{width:30px;position:relative;}
  .search-group .drop-trangle:after{content:"";border:5px solid transparent;border-top-color:#999;position:absolute;top:12px;right:10px;}
  .search-group .drop{position:absolute;left:-1px;right:-1px;top:29px;border-top:none;}

  .search-group.active{border-color:#ffb422;}
  .search-group.active .srch-btn{background-color:#ffb422;}
  .search-group.active .srch-btn:hover{background-color:#fea350;}

</style>
