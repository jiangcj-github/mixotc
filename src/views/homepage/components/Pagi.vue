<template>
  <div class="pagi" v-if="isValid">
    <a class="b1 first" @click="goPage(1)" :class="{disabled:curPage===1}"></a>
    <a class="b2 prev" @click="goPage(curPage-1)" :class="{disabled:curPage===1}"></a>
    <a class="b2 next" @click="goPage(curPage+1)" :class="{disabled:curPageSize<pageSize}"></a>
    <a class="b1 last" @click="goLastPage()" :class="{disabled:curPageSize<pageSize}"></a>
  </div>
</template>
<script>
  export default {
    props: {
      curPage:{type:Number,default:1},
      curPageSize:{type:Number,default:1},
      pageSize: {type: Number,default:10},
      onPageChange:{type:String,default:"onPageChange"},
      onLastPage:{type:String,default:"onLastPage"},
    },
    computed:{
      isValid:function(){
        return !(this.curPage===1 && this.curPageSize<this.pageSize);
      }
    },
    methods: {
      goPage(p){
        if(p<1) return;
        this.Bus.$emit(this.onPageChange,p);
      },
      goLastPage(){
        this.Bus.$emit(this.onLastPage);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  *{box-sizing:border-box;}
  .pagi{display:flex;justify-content:center;width:100%;height:40px;margin-top:20px;}

  .pagi>a{width:40px;height:40px;position:relative;cursor:pointer;margin:0 5px;border-radius:2px;
    background:#fff;border:1px solid #E1E1E1;}
  .pagi>a.disabled{pointer-events:none;background:#e1e1e1;}
  .pagi>a:hover{background:#ffb422;border-color:#ffb422;}

  .pagi .b1:before{position:absolute;left:50%;top:50%;width:2px;height:10px;background:#999;content:"";}
  .pagi .b1:after{position:absolute;left:50%;top:50%;border:5px solid transparent;content:"";}

  .pagi .first:before{margin-left:-3px;margin-top:-5px;}
  .pagi .first:after{border-right-color:#999;margin-left:-5px;margin-top:-5px;}
  .pagi .first:hover:before{background:#fff;}
  .pagi .first:hover:after{border-right-color:#fff;}

  .pagi .last:before{margin-top:-5px;margin-left:1px;}
  .pagi .last:after{border-left-color:#999;margin-left:-5px;margin-top:-5px;}
  .pagi .last:hover:before{background:#fff;}
  .pagi .last:hover:after{border-left-color:#fff;}

  .pagi .b2:before{position:absolute;left:50%;top:50%;border:5px solid transparent;content:"";}

  .pagi .prev:before{border-right-color:#999;margin-left:-8px;margin-top:-5px;}
  .pagi .prev:hover:before{border-right-color:#fff;}

  .pagi .next:before{border-left-color:#999;margin-left:-2px;margin-top:-5px;}
  .pagi .next:hover:before{border-left-color:#fff;}
</style>

