<template>
  <div class="left">
    <div class="head">
      <img src="/static/images/kefu/kefu.png">
      <h3>OTC客服专员1号</h3>
    </div>
    <div class="search">
      <input type="text" title="" placeholder="搜索联系人">
    </div>
    <happy-scroll color="rgba(100,100,100,0.8)" size="5" hide-horizontal class="scrollPane">
      <ul class="persons">
        <li v-for="(e,i) in uls" :key="i" @click="onLiClick(i)" :class="{active:ulSel===i}">
          <img :src="e.headimg">
          <div class="pinfo">
            <p class="p1">{{e.nickname}}<span>{{e.time}}</span></p>
            <p class="p2">{{e.msg}}</p>
          </div>
        </li>
      </ul>
    </happy-scroll>
  </div>
</template>
<script>
  import { HappyScroll } from 'vue-happy-scroll'
  export default {
    components: {
      HappyScroll
    },
    data() {
      return {
        uls: [],
        ulSel: 0,
      }
    },
    methods: {
      onLiClick(i){
        this.ulSel=i;
        //
      }
    },
    mounted(){
      this.uls=[
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"12:12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"12:12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
        {headimg:"/static/images/default_avator.png",nickname:"李小蹦",time:"2016/01/12",msg:"你好，有个问题需要问你，客顶顶顶"},
      ];
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  .left
    width 250px
    background #333
    border-radius 4px 0 0 4px
    border-right 1px solid #333
    box-sizing border-box
    .head
      height 60px
      display flex
      align-items center
      padding 10px 15px
      box-sizing border-box
      >img
        width 40px
        height 40px
      h3
        margin-left 20px
        font-size 16px
        color #fff
        letter-spacing 0.19px
    .search
      padding 10px 15px
      font-size 12px
      font-size
      >input
        background #222
        border-radius 2px
        width 100%
        height 30px
        color #fff
        padding 0 10px
        box-sizing border-box
        font-size 14px
    .scrollPane
      width 250px
      height 490px
    ul.persons>li
        height 60px
        padding 10px 18px 10px 15px
        box-sizing border-box
        display flex
        align-items center
        cursor default
        &:hover
          background #3c3737
        &.active
          background #474747
        >img
          width 40px
          height 40px
          margin-right 10px
          border-radius 50%
          flex-shrink 0
        .pinfo
          flex-grow 1
          min-width 0
          height 100%
          .p1
            color #fff
            font-size 14px
            line-height 20px
            >span
              font-size 11px
              color #999
              float right
          .p2
            line-height 18px
            margin-top 2px
            color #999
            font-size 11px
            letter-spacing 0.15px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap

</style>
