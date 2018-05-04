<template>
  <div class="simplePage" v-if="total>pageSize">
    <p>第 {{curPage}}/{{totalPage}} 页</p>
    <ul>
      <li class="prev" @click="changePage(curPage - 1)" :class="{disabled:curPage<=1}"></li>
      <li class="next" @click="changePage(curPage + 1)" :class="{disabled:curPage>=totalPage}"></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    curPage:{type:Number,default:1,},
    total: {type: Number, default: 0},
    pageSize: {type: Number,default: 15},
    onPageChange: {type: String, default: "onPageChange"}
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    changePage(p) {
      if(p === 0 || p > this.totalPage) return;
      this.Bus.$emit(this.onPageChange, p);
    }
  }
};
</script>
<style lang="stylus" scoped>
.simplePage
  display flex
  justify-content:center
  align-items center
  height 40px
  width 100%
  >p
    font-size 13px
    color #333
    letter-spacing 0.15px
  >ul
    float left
    margin-left 15px
    >li
      float left
      width 24px
      height 20px
      text-align center
      font-size 13px
      letter-spacing 0.15px
      background-color #fff
      cursor pointer
      position relative
      border 1px solid #ccc
      border-radius 2px
      margin-left 5px
      &.prev::before, &.next::after
        position absolute
        top 0
        left 0
        bottom 0
        right 0
        width 0
        height 0
        content ''
        margin auto auto
        border 5px solid transparent
      &:hover
        border-color #999
      &.prev::before
        border-right-color #333
        border-left none
      &.prev.disabled
        pointer-events none
      &.next::after
        border-left-color #333
        border-right none
      &.next.disabled
        pointer-events none
</style>

