<template>
  <div class="pagi" v-if="total>pageSize">
    <p>共 {{total}} 条</p>
    <ul>
      <li class="arrow left" @click="changePage(curPage-1)" :class="{disabled:curPage<=1}"></li>
      <li :class="{active:e===curPage}" v-for="e of pageArr" @click="changePage(e)">
        {{e}}
      </li>
      <li class="arrow right" @click="changePage(curPage+1)" :class="{disabled:curPage>=totalPage}"></li>
    </ul>
    <p>
      <span>跳至<input title="" ref="input" type="number" @input="onInput" v-model="input" step="1" min="1" :max="totalPage">页</span>
      <button @click="goPage(input)" :class="{disabled:input.length<=0}">跳转</button>
    </p>
  </div>
</template>
<script>
  export default {
    props: {
      curPage:{type:Number,default:1},
      total: {type: Number,default: 0},
      pageSize: {type: Number,default: 15},
      onPageChange:{type:String,default:"onPageChange"},
    },
    data() {
      return {
        input: ""
      };
    },
    computed: {
      pageArr() {
        let cur=this.curPage;
        let total=this.totalPage;
        let arr=[];
        for(let i=-2;i<=2;i++){
          if(cur+i>=1 && cur+i<=total){
            arr.push(cur+i);
          }
        }
       return arr;
      },
      totalPage() {
        return Math.ceil(this.total / this.pageSize);
      }
    },
    methods: {
      onInput() {
        let num = Number(this.input),
          str = this.input;
        if(!/^[0-9]*[1-9][0-9]*$/.test(str) || num > this.totalPage || num < 1 ){
          this.input = str.substring(0, str.length - 1);
          this.$refs.input.value = str.substring(0, str.length - 1);
        }
      },
      changePage(p) {
        if(p<1 || p>this.totalPage) return;
        this.Bus.$emit(this.onPageChange,p);
      },
      goPage(str) {
        if(str === '') return;
        let num = Number(str);
        if(!/^[0-9]*[1-9][0-9]*$/.test(str) || num > this.totalPage) return;
        this.changePage(num);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .pagi{display:flex;justify-content:center;width:100%;height:40px;margin-top:20px;}
  .pagi>p{font-size:13px;color:#333;letter-spacing:0.15px;line-height:40px;}

  .pagi>ul{display:inline-flex;user-select:none;margin:0 15px;}
  .pagi>ul>li{width:40px;height:40px;line-height:40px;text-align:center;margin:0 5px;background:#fff;
    border:1px solid #e1e1e1;cursor:pointer;box-sizing:border-box;border-radius:2px;}
  .pagi>ul>li:hover{border-color:#fea350;}
  .pagi>ul>li.active{background:#fea350;border-color:#fea350;color:#fff;pointer-events:none;cursor:default;}
  .pagi>ul>li.arrow{position:relative;}
  .pagi>ul>li.arrow.disabled{pointer-events:none;background:#e1e1e1;}
  .pagi>ul>li.arrow:before{position:absolute;content:"";width:0;height:0;left:50%;top:50%;border:5px solid transparent;}
  .pagi>ul>li.arrow.right:before{border-left-color:#999;margin-left:-2px;margin-top:-5px;}
  .pagi>ul>li.arrow.left:before{border-right-color:#999;margin-left:-8px;margin-top:-5px;}

  .pagi input{box-sizing:border-box;width:50px;height:40px;margin:0 5px;border:1px solid #e1e1e1;border-radius:2px;text-align:center;}
  .pagi input:focus{border-color:#fea350;outline:none;}
  .pagi button{width:65px;height:40px;margin-left:20px;color:#fff;letter-spacing:0.15px;background:#ffb4222;
    border-radius:2px;border:none;cursor:pointer;background:#ffb422;}
  .pagi button:hover{background:#fea350;}
  .pagi button.disabled{pointer-events:none;background:#e1e1e1;}
</style>

