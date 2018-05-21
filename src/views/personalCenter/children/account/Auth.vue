<template>
  <div class="auth">
    {{$route.params}}
    <div class="name clearfix">
      <div class="title">
        实名认证
      </div>
      <div class="content">
        <p class="tip">实名信息必须真实可靠，并与银行登记信息保持一致。实名信息一旦确认，不可修改</p>
        <ul class="clearfix">
          <li>
            <p>姓氏</p>
            <input type="text" placeholder="输入姓氏">
          </li>
          <li>
            <p>名字</p>
            <input type="text" placeholder="输入名字">
          </li>
        </ul>
      </div>
    </div>
    <div class="type clearfix">
      <div class="title">
        认证类型
      </div>
      <div class="content">
        <p>
          <span @click="data.type=1">
            <img src="/static/images/selected.png" alt="" v-if="data.type">
            <img src="/static/images/unselect.png" alt="" v-else><i>身份证</i>
          </span>
          <span @click="data.type=0">
            <img src="/static/images/selected.png" alt="" v-if="!data.type">
            <img src="/static/images/unselect.png" alt="" v-else><i>护照</i>
          </span>
        </p>
        <input type="text" placeholder="请填写身份证号码/护照号码">
      </div>
    </div>
    <div class="photo clearfix">
      <div class="title">
        上传证件照
      </div>
      <div class="content">
        <ul class="clearfix">
          <li v-for="item of 3" :key="item">
            <img :src="`/static/images/personal/${defaultIdentity[item - 1]}`" alt="" v-if="data.type">
            <img :src="`/static/images/personal/${defaultPassport[item - 1]}`" alt="" v-else>
            <p>{{copy[data.type][item - 1]}}</p>
          </li>
        </ul>
        <p class="guarantee">
          <img src="/static/images/rules_checked.png" alt="" v-if="guarantee" @click="guarantee=false">
          <img src="/static/images/rules_unchecked.png" alt="" v-else @click="guarantee=true"><span>我承认提交的证件信息属于本人所有，不存在冒用、盗用他人证件的行为，因冒用、盗用他人证件造成的一切后果由本人承担</span>
        </p>
        <button>确认提交</button>
        <dl>
          <dt>证件要求</dt>
          <dd>1. 身份证照片：请按示例上传身份证正面与反面，脸部及字体必须清晰可见</dd>
          <dd>2. 护照：请按示例上传带ID的护照页正面即可，脸部及字体必须清晰可见</dd>
          <dd>3. 手持证件照：照片中请勿遮挡任何有效信息，照片中必须体现“日期及仅MixCoins认证使用”的纸条</dd>
          <dd>4. 图片格式：小于10M, 图片格式可为jpg、jpeg、png</dd>
        </dl>
        <ul class="clearfix">
          <li v-for="item of 3" :key="item">
            <img :src="`/static/images/personal/${defaultIdentity[item - 1]}`" alt="" v-if="data.type">
            <img :src="`/static/images/personal/${defaultPassport[item - 1]}`" alt="" v-else>
            <p>{{copy[data.type][item - 1]}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        defaultIdentity:['identity_0.png','identity_1.png','identity_2.png'],
        defaultPassport:['passport_0.png','passport_1.png','passport_2.png'],
        copy:[
          ['护照正面照片', '护照反面照片', '手持护照照片'],
          ['身份证正面照片', '身份证反面照片', '手持身份证照片']
        ],
        guarantee: true,
        data: {
          surname: '',
          name: '',
          type: 1,
          iconArr: ['', '', '']
        }
      }
    },
    mounted() {
      if(this.$route.params.authData){
        this.data = this.$route.params.authData;
        return;
      }
      this.Bus.$emit('upLoadAuth', this.data)
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
.auth
  box-sizing()
  width 1000px
  padding 10px 30px 30px
  background-color #FFF
  input
    box-sizing()
    placeholder()
    font-size $fz14
    background $col6FA
    border 1px solid $col1E1
    border-radius: 2px
    &:focus
      background-color #FFF
      border-color $col422
  .name, .type, .photo
    margin-top 40px
  .title
    float left
    margin-right 50px
  .content
    float left
    width 800px
  .name
    padding-bottom 40px
    position relative
    border-bottom 1px solid $col1E1
    .content
      .tip
        fz11()
        color $col94C
        letter-spacing 0.23px
      ul
        li
          float left
          padding-top 50px
          p
            font-size $fz13
          input
            width 206px
            height 40px
            padding-left 10px
            margin 18px 40px 0 0
  .type
    padding-bottom 40px
    border-bottom 1px solid $col1E1
    .content
      p
        span
          cursor pointer
          i
            position relative
            top -3px
            font-size $fz13
            margin 0 36px 0 8.5px
            letter-spacing 0
      input
        width 453px
        height 40px
        padding-left 10px
        margin-top 17px
  .photo
    .content
      ul
        margin-left 60px
        li
          float left
          margin-right 20px
          img
            width 190px
            height 130px
          p
            text-align center
            padding-top 8px
            font-size $fz13
      .guarantee
        margin-top 36px
        img
          margin-right 10px
          cursor pointer
        span
          display inline-block
          fz11()
      button
        width 250px
        height 40px
        margin-top 28px
        color #FFF
        background $col422
        border-radius 2px
      dl
        margin 48px 0 40px 0
        dt
          margin-bottom 28px
        dd
          height 13px
          margin-bottom 15px
          font-size $fz13
          line-height 13px
</style>