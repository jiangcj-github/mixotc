<template>
  <div class="apply">
    <div class="state">
      <ul class="clearfix">
        <li class="auth" :class="{over: authState === 2}">
           <div class="wait" v-if="authState === 0">
            <img src="/static/images/personal/going.png" alt="">
            <br>
            <span>
              去认证
              <b>请先进行实名认证</b>
            </span>
          </div>
          <div class="going" v-if="authState === 1">
            <img src="/static/images/personal/going.png" alt="">
            <br>
            <span>
              实名认证
              <b>认证中<i>...</i></b>
            </span>
          </div>
          <div class="pass" v-if="authState === 2">
            <img src="/static/images/personal/pass.png" alt="">
            <br>
            <span>
              实名认证
              <b>已认证</b>
            </span>
          </div>
          <div class="fail" v-if="[3, 4, 5].includes(authState)">
            <img src="/static/images/personal/going.png" alt="">
            <br>
            <span>
              实名认证
              <b>未通过,{{authFailReson}},请重新实名认证</b>
            </span>
          </div>
        </li>

        <li class="binding-card" :class="{over: btverifyState === 2}">
          <div class="wait" v-if="btverifyState === 0">
            <img src="/static/images/personal/wait.png" alt="">
            <br>
            <span>
              绑定银行卡
              <b>去绑定</b>
            </span>
          </div>
          <div class="going" v-if="btverifyState === 1">
            <img src="/static/images/personal/going.png" alt="">
            <br>
            <span>
              绑定银行卡
              <b>审核中<i>...</i></b>
            </span>
          </div>
          <div class="pass" v-if="btverifyState === 2">
            <img src="/static/images/personal/pass.png" alt="">
            <br>
            <span>
              绑定银行卡
              <b>已绑定</b>
            </span>
          </div>
          <div class="fail" v-if="btverifyState === 3">
            <img src="/static/images/personal/fail.png" alt="">
            <br>
            <span>
              绑定银行卡
              <b>绑定银行卡失败,{{btverifyFailReson}},请重新绑定</b>
            </span>
          </div>
        </li>
        <li class="complete">
          <img src="/static/images/personal/pass.png" alt="" v-if="btverifyState === 2">
          <img src="/static/images/personal/wait.png" alt="" v-else>
          <br>
          <span>完成</span>
        </li>
      </ul>
    </div>
    <div class="main clearfix">
      <div class="title">
        绑定银行卡
      </div>
      <div class="content">
        <div class="info">
          <p>持卡人:<span>*小蹦</span></p>
          <p>证件号:<span>123****9</span></p>
        </div>
        <ul class="form clearfix">
          <li>
            <p>卡号</p>
            <input type="text" placeholder="请输入银行卡号">
            <i><img src="/static/images/personal/addicon.png" alt=""></i>
          </li>
          <li>
            <p>开户行</p>
            <input type="text" placeholder="请输入开户行">
          </li>
        </ul>
        <div class="upload-photo">
          <h4>上传照片</h4>
          <ul class="clearfix input">
            <li v-for="item of 3" :key="item" class="upload">
              <img :src="`/static/images/personal/${defaultIdentity[item - 1]}`" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        authState: 2,
        btverifyState: 0,
        authFailReson: '',
        btverifyFailReson: '',
        defaultIdentity:['bank_card0.png','bank_card1.png','bank_card2.png']
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
  .apply
    box-sizing()
    padding 0 30px 0
    .state
      ul
        position relative
        height 100px
        padding 48px 0 0 65px
        &::after
          position absolute
          bottom 0
          left 0px
          content ''
          width 941px
          height 1px
          background-color $col1E1
        li
          float left
          position relative
          width 140px
          margin-right 70px
          text-align center
          letter-spacing 0
          &.auth::after, &.binding-card::after
            position absolute
            right -70px
            top 17px
            width 70px
            height 2px
            content ''
            background $col999
            border-radius 10px
          &.over::after
            background $col422
          img
            width 32px
            height 32px
            margin-bottom 10px
          span
            position relative
            b 
              position absolute
              top 20px
              left 0
              width 200px
              text-align left
              fz11()
              color $col94C
          .wait,.pass
            b
              color $col100
    .main
      padding-top 38px
      .title
        float left
        margin-right 36px
      .content
        float left
        width 800px
        .info
          p
            font-size $fz13
            margin-bottom 16px
            span
              padding-left 60px
        .form
          padding-top 8px
          margin-bottom 50px
          li
            position relative
            float left
            margin-right 64px
            p
              font-size $fz13
              margin-bottom 14px
            i
              position absolute
              bottom 12.5px
              right -25px
              img
                display block
                width 15px
                height 15px
            input 
              box-sizing()
              width 206px
              height 40px
              padding 0 20px 0 10px
              background $col6FA
              border 1px solid $col1E1
              border-radius 2px
              &:focus
                background #FFF
                border 1px solid $col422
                border-radius 2px
        .upload-photo 
          ul
          margin-left 60px
          li
            float left
            position relative
            width 190px
            margin-right 20px
            cursor pointer
            &.upload::before
              position absolute
              top 65px
              left 50%
              content ''
              width 6px
              height 44px
              margin -22px 0 0 -3px
              background rgba(255, 180, 34, 0.7)
              z-index 99
            &.upload::after
              position absolute
              top 65px
              left 50%
              content ''
              width 44px
              height 6px
              margin -3px 0 0 -22px
              background rgba(255, 180, 34, 0.7)
              z-index 99
            img
              width 100%
              height 100%
              &.up-img
                position absolute
                left 4px
                top 4px
                width 182px
                height 122px
            p
              text-align center
              padding-top 8px
              font-size $fz13
        // .guarantee
        //   margin-top 36px
        //   img
        //     margin-right 10px
        //     cursor pointer
        //   span
        //     display inline-block
        //     fz11()
        // button
        //   width 250px
        //   height 40px
        //   margin-top 28px
        //   color #FFF
        //   background $col422
        //   border-radius 2px
        //   cursor pointer
        //   &.disable
        //     background $col1E1
        //     color $col999
    

</style>
