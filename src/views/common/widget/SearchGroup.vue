<template>
  <div class="search-group" :class="{active:isActive}" v-clickoutside="onClickOutside">
    <!--搜索条件下拉-->
    <span class="term"
          @click="isShowTermUl=!isShowTermUl"
          v-clickoutside="()=>{isShowTermUl=false}"
          v-if="terms">
      {{selectedTerm.text}}
    </span>
    <ul class="drop" v-show="isShowTermUl">
      <li v-for="(e,i) in terms" @click="termSel=i" :key="i">{{e.text}}</li>
    </ul>
    <!--搜索框,清楚按钮，搜索按钮-->
    <input type="text" class="input"
           v-model="srchText"
           v-clickoutside="()=>{isShowTip=false}"
           :placeholder="placeText"
           @keydown.enter="onKeyEnter"
           @input="onInput"
           @focus="onFocus">
    <img class="clear" src="/static/images/cancel_icon.png"
         @click="srchText=''"
         v-show="srchText.length>0">
    <button class="srch-btn" @click="onClick"></button>
    <!--模糊搜索结果,使用slot可自定义搜索结果显示内容-->
    <div v-show="isShowTip" class="drop fuzz" v-if="tips">
      <slot name="fuzzy"></slot>
      <p class="empty" v-show="tips.length<=0">无匹配结果</p>
    </div>
  </div>
</template>

<script>
  import timeout from "@/js/Timeout.js";
  export default {
    props:{
      //搜索条件数组格式 [{text:"显示文本",value:0}]
      terms:{type:Array,default:null},
      //模糊搜索结果
      tips:{type:Array,default:null},
      placeText: {type:String,default:""},
      //事件
      onSearch:{type:String,default:"onSearch"},
      onFuzzy:{type:String,default:"onFuzzy"},
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
    watch:{

    },
    computed:{
      selectedTerm(){
        if(this.terms.length<=0){
          return {};
        }
        return this.terms[this.termSel];
      },
    },
    methods:{
      onFocus(){
        this.isActive=true;
        if(this.srchText.length<=0){
          this.isShowTip=false;
          return;
        }
        this.Bus.$emit(this.onFuzzy);
      },
      onInput(){
        if(this.srchText.length<=0){
          this.isShowTip=false;
          return;
        }
        this.Bus.$emit(this.onFuzzy);
      },
      onClick(){
        this.Bus.$emit(this.onSearch);
      },
      onKeyEnter(){
        this.Bus.$emit(this.onSearch);
      },
      onClickOutside(){
        if(this.srchText.length<=0){
          this.isActive=false;
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../stylus/base"
  .search-group{width:450px;height:30px;line-height:28px;position:relative;display:flex;border:1px solid #e1e1e1;border-radius:2px;background:#fff;}
  .search-group .term{background:#f4f6fa;line-height:28px;padding:0 10px;cursor:pointer;border-right:1px solid #e1e1e1;letter-spacing:0;}
  .search-group .term:hover{color:#666;}
  .search-group .term:after{content:"";display:inline-block;border:5px solid transparent;border-top-color:#999;vertical-align:-3px;margin-left:5px;}
  .search-group .input{flex-grow:1;padding:0 10px;}
  .search-group .clear{align-self:center;width:12px;cursor:pointer;margin-right:10px;}
  .search-group .clear:hover{opacity:0.8;}
  .search-group .srch-btn{width:72px;cursor:pointer;background:url(/static/images/search.png) no-repeat center center #e1e1e1;}
  .search-group .drop{position:absolute;left:-1px;right:-1px;top:29px;z-index:1000;background:#fff;border:1px solid #e1e1e1;border-top:none;}

  .search-group .fuzz{}
  .search-group .fuzz .empty{line-height:30px;padding:0 10px;color:#999;}

  .search-group.active{border-color:#ffb422;}
  .search-group.active .srch-btn{background-color:#ffb422;}
  .search-group.active .srch-btn:hover{background-color:#fea350;}

  ul{}
  ul>li{line-height:30px;padding:0 10px;cursor:pointer;}
  ul>li:hover{background:#fff3eb;}

  placeholder()
</style>
