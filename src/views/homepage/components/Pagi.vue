<template>
  <div class="pagi" v-if="isValid">
    <button class="first" @click="goPage(1)" :class="{disabled:curPage===1}"> << </button>
    <button class="prev" @click="goPage(curPage-1)" :class="{disabled:curPage===1}"> < </button>
    <button class="next" @click="goPage(curPage+1)" :class="{disabled:curPageSize<pageSize}"> > </button>
    <button class="last"> >> </button>
  </div>
</template>
<script>
  export default {
    props: {
      curPage:{type:Number,default:1},
      curPageSize:{type:Number,default:1},
      pageSize: {type: Number,default:10},
      onPageChange:{type:String,default:"onPageChange"},
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
      }
    }
  };
</script>
<style lang="stylus">
  .pagi{display:flex;justify-content:center;width:100%;height:40px;margin-top:20px;}
  .pagi>button{width:40px;height:40px;position:relative;cursor:pointer;margin:0 5px;border-radius:2px;
    background:#fff;border:1px solid #E1E1E1;}
  .pagi>button.disabled{pointer-events:none;}
  .pagi>button:hover{background:#ffb422;color:#fff;border-color:#ffb422;}
  .pagi>button.first:before{width:1px;height:10px;}
</style>

