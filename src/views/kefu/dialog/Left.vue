<template>
  <div class="left">
    <div class="head">
      <img src="/static/images/kefu/kefu.png">
      <h3>OTC客服专员1号</h3>
    </div>
    <div class="search">
      <input type="text" title="" placeholder="搜索联系人" v-model="srchText" @input="parseUls">
    </div>
    <happy-scroll color="rgba(100,100,100,0.8)" size="5" resize hide-horizontal
                  bigger-move-h="start" smaller-move-h="start" class="scrollPane">
      <ul class="persons">
        <li v-for="(e,i) in uls" :key="i" @click="onLiClick(i)" :class="{active:ulSel===i}">
          <img :src="e.headimg"><i v-show="i===1">{{i}}</i>
          <div class="pinfo">
            <p class="p1">
              <span class="s1">{{e.nickname}}</span>
              <span class="s2">{{e.time}}</span>
            </p>
            <p class="p2">{{e.msg}}</p>
          </div>
        </li>
      </ul>
    </happy-scroll>
  </div>
</template>
<script>
  import { HappyScroll } from 'vue-happy-scroll';
  export default {
    components: {
      HappyScroll,
    },
    data() {
      return {
        srchText: "",
        uls: [],
        ulsBuf: [],
        ulSel: 0,

      }
    },
    methods: {
      onLiClick(i){ // 点击添加active类
        this.ulSel=i;
        //
      },
      parseUls(){ // 搜索输入框
        this.uls = [];
        this.ulsBuf.forEach((e) => {
          if (new RegExp("^.*"+this.srchText+".*$").test(e.nickname)) {
            this.uls.push(e);
          }
        });
      }
    },
    mounted(){
      this.ulsBuf=[
        {headimg:"/static/images/default_avator.png",nickname:"兰陵王",account:"15810269653",time:"12:12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"程咬金",account:"15810269653",time:"12:12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"吕布",account:"15810269653",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"孙尚香",account:"15810269653",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"乔峰",account:"15810269653",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"张无忌",account:"15810269653",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"王兰",account:"15810269653",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"赵信",account:"398017990@qq.com",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"易大师",account:"398017990@qq.com",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"盖伦",account:"398017990@qq.com",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"艾希",account:"398017990@qq.com",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"李白",account:"398017990@qq.com",time:"2016/01/12",msg:"你好"},
        {headimg:"/static/images/default_avator.png",nickname:"杜甫",account:"398017990@qq.com",time:"2016/01/12",msg:"你好"},
      ];
      this.parseUls();
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
        position relative
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
        >i
          display inline-block
          line-height 19px
          text-align center
          width 20px
          height 20px
          background #FF794C
          border-radius 50%
          fz10()
          color #FFF
          position absolute
          left 40px
          top 10px
        .pinfo
          flex-grow 1
          min-width 0
          height 100%
          .p1
            line-height 20px
            >span.s1
              color #fff
              font-size 14px
            >span.s2
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
