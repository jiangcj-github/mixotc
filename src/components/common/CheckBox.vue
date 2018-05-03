<template>
  <div class="choice-box" v-clickoutside="closeSelect">
    <span><b @click="showChoice()">{{items}}</b><i></i></span>
    <ul v-show="contentShow"  :style="{width: `${width}px`}">
      <li @click="allCheck" :class="{selected: checkAll}" v-show="isAll">{{allName}}</li>
      <li v-for="(content, index) in checkBoxList" :key="index" :class="{selected: content.state}" @click.stop="checkContent(content)"><span>{{content.type}}</span></li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      width: Number,
      title: String,
      checkBoxList: Array,
      isAll: {
        type: Boolean,
        default: true
      }, // 是否替换全选
      emitValue: String, // emit返回标识
      allName: String
    },
    data() {
      return {
        contentShow: false,
        items: '',
        allList: [],
        checkAll: false
      }
    },
    created() {
      this.items = this.title;
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
      showChoice() {
        this.contentShow = !this.contentShow
      },
      allCheck() {
        this.checkAll = !this.checkAll
        if (this.checkAll) {
          this.checkBoxList.map(item => {
            item.state = true
            this.items = this.allName
          })
        } else {
          this.checkBoxList.map(item => {
            item.state = false
            this.items = this.title
          })
        }
        this.Bus.$emit(this.emitValue, '');
      },
      checkContent(content) {
        content.state = !content.state
        this.checkAll = false
        let titleList = this.checkBoxList.filter(item => {
          return item.state;
        }).map(item => {
          return item.type;
        })
        this.items = titleList.join('/');
        if(titleList.length ===0) {
          this.items = this.title;
        }
        // 筛选用
        let selectList = this.checkBoxList.filter(item => {
          return item.state;
        }).map(item => {
          return item.code;
        })
        this.Bus.$emit(this.emitValue, selectList);
        // 全选用
        this.allList = this.checkBoxList.filter(item => {
          return item.state;
        }).map(item => {
          return item.state;
        })
        if (this.allList.length === this.checkBoxList.length) {
          this.checkAll = true
          this.items = this.allName
        }
      },
      closeSelect() {
        this.contentShow = false
      }
    }
  }
</script>
<style scoped type="text/stylus" lang="stylus">
  @import "../../stylus/base.styl"
  .choice-box
    position relative
    display inline-block
    width 80px
    margin-right 30px
    span
      display inline-block
      position relative
      b
        position relative
        display inline-block
        max-width 80px
        font-size $fz13
        color #999
        cursor pointer
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      i
        position absolute
        top 8px
        triangle_down(#999)
        margin-left 5px

    ul
      position absolute
      top 20px
      background #FFF
      border 1px solid #E1E1E1
      font-size $fz13
      cursor pointer
      z-index 999
      li
        padding 8px 0 8px 10px
        position relative
        &:after
          position absolute
          top 8px
          right 8px
          content ''
          width 16px
          height 16px
          background url('/static/images/unselect.png')
      .selected:after
        background url('/static/images/selected.png')
      li:hover
        background #FFF3EB






</style>


