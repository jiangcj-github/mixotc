<template>
  <div class="simplePage">
    <p>第 {{curPage}}/{{totalPage}} 页</p>
    <ul>
      <li class="prev" @click="clickPage(curPage - 1)"></li>
      <li class="next" @click="clickPage(curPage + 1)"></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,//数据总条数
      default: 0
    },
    pageSize: {
      type: Number,//每页展示数据条数
      default: 15
    },
    onPageChange: {
      type: String,//自定义事件名
      default: "onPageChange"
    }
  },
  data() {
    return {
      curPage: 1,
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    clickPage(i) {
      if(i === 0 || i > this.totalPage) return;
      this.curPage = i;
      this.Bus.$emit(this.onPageChange, i);
    }
  }
};
</script>
<style lang="stylus">
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
      &.next::after
        border-left-color #333
        border-right none





</style>

