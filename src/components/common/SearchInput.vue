<template>
  <div class="clearfix">
    <div class="search" v-clickoutside="hideSelect" >
      <input type="text" :style="{borderColor: color}" ref='input' v-model="inputContent">
      <span ref='title' @click="showSelect = true">{{title}}</span>
      <ul class="clearfix" v-show="showSelect">
        <li v-for="(item, index) of content" @click.stop="changeTitle(item)" :key="index" :class="{ active: item === title}">{{item}}</li>
      </ul>
      <img src="/static/images/cancel_icon.png" alt="" v-show="inputContent" @click="inputContent = ''">
    </div>
    <button @click="changeInputContent" :style="{backgroundColor: color}">
      <img src="/static/images/search_icon.png" alt="" class="search-icon">
    </button>
  </div>
</template>

<script>
export default {
  props: {
    //下拉框内容
    content: {
      type: Array,
      default: []
    },
    //显示标题
    title: {
      type: String,
      default: ''
    },
    //按钮颜色自定义
    color: String,
    //自定义事件
    emitValue1: String,//筛选项改变触发事件
    //筛选内容改变触发事件
    emitValue2: {
      type:String,
      default: 'changeInputContent'
    }
  },
  data() {
    return {
      showSelect: false,
      inputContent: ''
    }
  },
  methods: {
    changeTitle(data) {
      this.showSelect = false;
      this.Bus.$emit(this.emitValue1, data);
    },
    changeInputContent() {
      this.hideSelect();
      this.Bus.$emit(this.emitValue2, this.inputContent);
    },
    hideSelect() {
      if(!this.showSelect) return;
      this.showSelect = false;
    }
  },
  watch:{
    title(newValue,oldValue) {
      setTimeout(()=>{
        this.$refs.input.style.paddingLeft = this.$refs.title.clientWidth + 26 + 'px';
      },0)
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../stylus/base.styl'
.search 
  float left
  position relative
  height 30px
  input 
    box-sizing()
    position relative
    width 384px
    height 30px
    padding-left 110px
    background $colFFF
    border 1px solid $col422
    border-radius 2px 0 0 0
    &:focus 
      outline 0
  span
    position absolute
    left 10px
    top 0
    padding-right 16px
    line-height 30px
    font-size 13px
    color #999
    letter-spacing 0
    cursor pointer
    &::after 
      position absolute
      top 13px
      right 0
      content ''
      triangle_down($col422)
  ul 
    box-sizing()
    position absolute
    left 0px
    top 30
    width 456px
    font-size $fz13
    color $col333
    letter-spacing 0.27px
    border 1px solid #E1E1E1
    z-index 9
    li 
      box-sizing()
      float left
      width 100%
      height 30px
      padding-left 10px
      line-height 30px
      background-color #FFF
      cursor pointer
      &:hover, &.active
        background-color $col3EB
  img 
    position absolute
    top 10px
    right 10px
    cursor pointer
button 
  position relative
  width 72px
  height 30px
  margin-right 125px
  background $col422
  border-radius 0 2px 2px 0
  border 0
  cursor pointer
  &:active 
    background $col350
  .search-icon 
    display block
    position absolute
    top 50%
    left 50%
    margin -8px 0 0 -8px
    width 16px
    height 16px
</style>