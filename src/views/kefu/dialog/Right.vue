<template>
  <div class="right">
    <div class="h1">李小蹦</div>
    <div class="fixed">
      <h3>申诉对象</h3>
      <div class="mf1">
        <img src="/static/images/default_avator.png">
        <span class="i1">王华华</span>
        <span class="i2">已标记付款</span>
        <span class="i3">69分钟</span>
      </div>
      <div class="mf2">
        <span class="i1">已被申诉一次</span>
        <span class="i2">强制放币</span>
        <span class="i3">驳回申诉</span>
      </div>
    </div>
    <happy-scroll color="rgba(200,200,200,0.8)" size="5" hide-horizontal class="scrollPane">
      <div class="msgBox">
        <div class="tline"><i>12月19日 12:12</i></div>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span>付款证明这是所有的付款证明付款证明这是所有的付款证明付款证明</span>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span>付款证明<br>这是所有的付款证明</span>
        </p>
        <p class="ar">
          <img src="/static/images/default_avator.png">
          <span class="img-wrap"><img src="/static/images/kefu/background.jpg"></span>
          <i class="err"></i>
        </p>
        <p class="al">
          <img src="/static/images/default_avator.png">
          <span class="img-wrap"><img src="/static/images/kefu/background.jpg"></span>
          <i class="err" title="发送失败"></i>
        </p>
      </div>
    </happy-scroll>
    <div class="sendBox">
      <div class="menu">
        <img src="/static/images/kefu/album.png" @click="$refs.file.click()">
        <input type="file" ref="file" v-show="0" @change="chooseImage">
        <span class="br"></span>
        <button class="b1">上传付款证明</button>
        <button class="b2">证明无效</button>
        <button class="b3">通知放币</button>
      </div>
      <div class="textarea" contenteditable="true" ref="textarea"></div>
      <div class="bottom">按下Enter发送内容/Ctrl+Enter换行</div>
    </div>
  </div>
</template>
<script>
  import { HappyScroll } from 'vue-happy-scroll';

  export default {
    components: {
      HappyScroll
    },
    data() {
      return {
        file: "",
      }
    },
    methods: {
      chooseImage(){
        this.file=this.$refs.file.files[0];
        let _this=this;
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = function() {
          _this.$refs.textarea.innerHTML+="<img src="+this.result+" style='max-width:100px;height:auto'>";
        }
      }
    },
    watch:{
      file:function(){
        console.log(this.file);
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "../../../stylus/base.styl";
  *
    box-sizing border-box
  .right
    height 560px
    width 650px
    .h1
      height 49px
      border-bottom 1px solid #e1e1e1
      line-height 49px
      font-size 16px
      color #333
      letter-spacing 0.19px
      padding 0 20px
    .fixed
      margin 15px 20px
      height 160px
      background #fff
      box-shadow 0 2px 4px 0 #999
      >h3
        height 45px
        padding 0 20px
        line-height 45px
        font-size 16px
        font-weight bold
        color #333
        letter-spacing 0.41px
        border-bottom 1px solid #e1e1e1
        &:before
          display inline-block
          position relative
          top 2px
          left 0
          content ''
          width 3px
          height 16px
          margin-right 10px
          background-color $col422

      .mf1
        padding 0 30px 0 20px
        height 60px
        display flex
        align-items center
        >img
          width 40px
          height 40px
          border-radius 50%
          margin-right 10px
        >span
          display inline-block
          color #333
          letter-spacing 0.27px
          &.i1
            font-size 14px
            letter-spacing 0.29px
            flex-grow 1
          &.i2
            font-size 13px
          &.i3
            font-size 13px
            color #FF794C
            margin-left 5px
      .mf2
        height 30px
        margin-top 10px
        display flex
        padding 0 30px 0 20px
        >span
          font-size: 13px;
          letter-spacing 0.27px
          display inline-block
          &.i1
            color #FF794C
            flex-grow 1
          &.i2
            width 90px
            background #FFB422
            border 1px solid #FFB422
            border-radius 2px
            cursor pointer
            color #FFF
            text-align center
            line-height 28px
            &:hover
              background #fea350
          &.i3
            margin-left 10px
            border 1px solid #FFB422
            border-radius 2px
            cursor pointer
            color #FFB422
            text-align center
            line-height 28px
            width 90px
            &:hover
              background #fff3eb
    .scrollPane
      height 200px
    .msgBox
      padding 20px
      box-sizing border-box
      .tline
        text-align center
        >i
          font-size 11px
          color #999
          letter-spacing 0.12px
          background #E1E1E1
          border-radius 2px
          padding 1px 5px
      >p
        font-size 13px
        color #333333
        letter-spacing 0.16px
        margin-top 10px
        display flex
        align-items flex-start
        box-sizing border-box
        >img
          width 40px
          height 40px
          border-radius 50%
        >span
          border-radius 2px
          padding 10px
          line-height 20px
          position relative
          box-sizing border-box
          min-height 40px
          display inline-flex
          align-items center
          max-width 340px
          >img
            width 100px
            height auto
            border-radius 2px
        >span.img-wrap
          padding 0
        >i.err
          display inline-block
          width 16px
          height 16px
          background #FF794C
          align-self center
          margin 0 10px
          border-radius 50%
          text-align center
          line-height 16px
          font-size 12px
          &:before
            content "!"
            color #fff
      >p.al
        >span
          background #E1E1E1
          margin-left 18px
          &:before
            content ""
            height 2px
            display inline-block
            border-right 8px solid #e1e1e1
            border-top 5px solid transparent
            border-bottom 5px solid transparent
            position absolute
            left -8px
            top 15px
        >span.img-wrap
          background transparent
          &:before
            display none
      >p.ar
        flex-direction row-reverse
        >span
          background #FFB422
          margin-right 18px
          &:before
            content ""
            height 2px
            display inline-block
            border-left 8px solid #FFB422
            border-top 5px solid transparent
            border-bottom 5px solid transparent
            position absolute
            right -8px
            top 15px
        >span.img-wrap
          background transparent
          &:before
            display none
    .sendBox
      height 160px
      border-top 1px solid #D8D8D8
      .menu
        height 40px
        padding 0 20px
        display flex
        align-items center
        >img
          width 20px
          height 20px
          cursor pointer
        .br
          flex-grow 1
        >button
          font-size 12px
          color #FF794C
          letter-spacing 0
          border-radius 77px
          padding 6px 9px
          cursor pointer
          &:hover
            color #fea350
          &.b1
            background #FFE4D3
          &.b2
            background #FFD0B3
            margin-left 10px
          &.b3
            background #FFE4D3
            margin-left 10px
      .textarea
        padding 5px 10px
        height 90px
        outline none
        overflow auto
      .bottom
        height 30px
        line-height 30px
        font-size 12px
        color #999
        letter-spacing 0.14px
        padding 0 20px
        text-align right
  .ed-img
    max-width 100px
    height auto
</style>
