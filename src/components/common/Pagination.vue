<template>
  <div class="pagination">
    <div class="main clearfix" :style="`width:${370 + (pageArr.length - 1) * 40}px`">
      <p>共{{totalPage}}</p>
      <ul class="clearfix">
        <li class="prev" @click="changeCurPage(curPage - 1)"></li>
        <li 
          class="page" 
          :class="{current: item === curPage}" 
          v-for="(item, index) of pageArr" 
          :key="index"
          @click="changeCurPage(item)"
          >
            {{item}}
          </li>
        <li class="next" @click="changeCurPage(curPage + 1)"></li>
      </ul>
      <p>
        <span>跳至<input type="tel" v-model="toPage">页</span>
        <button @click="goToPage(toPage)">跳转</button>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      curPage: 1,
      toPage: '',
      pageSize: 15 ,
    };
  },
  computed: {
    pageArr() {
      let totalPage = this.totalPage,
        curPage = this.curPage;
      if (totalPage < 8) {
        return Array.from(Array(totalPage), (v, k) => k + 1)
      };
      if (curPage < 4) return [1, 2, 3, 4, "...", totalPage - 1, totalPage];
      if (curPage === 4) return [1, 2, 3, 4, 5, "...", totalPage];
      if (curPage < totalPage - 3) return [1, "...", curPage - 1, curPage, curPage + 1, "...", totalPage]
      if (curPage === totalPage - 3)
        return [
          1,
          "...",
          totalPage - 4,
          totalPage - 3,
          totalPage - 2,
          totalPage - 1,
          totalPage
        ];
      return [
        1,
        2,
        "...",
        totalPage - 3,
        totalPage - 2,
        totalPage - 1,
        totalPage
      ];
    },
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    changeCurPage(num) {
      if(num === '...' || num === 0 || num > this.totalPage) return;
      this.curPage = num
    },
    goToPage(str) {
      let num = Number(str);
      console.log(num)
      if(!/^[0-9]*[1-9][0-9]*$/.test(str) || num > this.totalPage) return;
      this.curPage = num;
    }
  }
};
</script>
<style lang="stylus">
.pagination
  position relative
  width 1200px
  margin 0 auto
  height 40px
  line-height 40px
  .main
    position absolute
    top 0
    left 50%
    transform translateX(-50%)
    -ms-transform translateX(-50%) 	/* IE 9 */
    -moz-transform translateX(-50%) 	/* Firefox */
    -webkit-transform translateX(-50%) /* Safari 和 Chrome */
    -o-transform translateX(-50%)
    p
      float left
      font-size 13px
      color #333
      letter-spacing 0.15px

      input
        box-sizing border-box
        width 50px
        height 40px
        margin 0 5px
        text-align center
        background #FFF
        border 1px solid #E1E1E1
        border-radius 2px
      
      button
        width 65px
        height 40px
        margin-left 20px
        font-size 13px
        color #FFF
        letter-spacing 0.15px
        background #FFB422
        border-radius 2px
        border 0

        &:active
          background #FEA350
        &:focus
          outline 0
          cursor pointer
    ul
      float left
      margin-left 20px
      margin-right 20px
      li
        float left
        width 40px
        height 40px
        text-align center
        font-size 13px
        color #000
        letter-spacing 0.15px
        background-color #FFF
        cursor pointer
        &.page:hover, &.current
          color #FFF
          background-color #FFB422
        &.prev, &.next
          position relative
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
          border-right 5px solid #FFA21C
          border-top 5px solid #FFF
          border-bottom 5px solid #FFF
        &.next::after
          border-left 5px solid #FFA21C
          border-right 0
        
      
    
  

</style>

