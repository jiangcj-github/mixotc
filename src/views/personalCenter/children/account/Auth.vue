<template>
  <div class="auth">
    <div class="name clearfix">
      <div class="title">
        实名认证
      </div>
      <div class="content">
        <p class="tip">实名信息必须真实可靠，并与银行登记信息保持一致。实名信息一旦确认，不可修改</p>
        <ul>
          <li>
            <p>姓氏</p>
            <input type="text">
          </li>
          <li>
            <p>名字</p>
            <input type="text">
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
          <span></span>
          <span></span>
        </p>
        <input type="text">
      </div>
    </div>
    <div class="photo clearfix">
      <div class="title">
        上传证件照
      </div>
      <div class="content">
        <ul>
          <li>
            <img src="" alt="">
            <p></p>
          </li>
          <li>
            <img src="" alt="">
            <p></p>
          </li>
          <li>
            <img src="" alt="">
            <p></p>
          </li>
        </ul>
        <p>
          <img src="" alt="">
          <img src="" alt="">
          <span>我承认提交的证件信息属于本人所有，不存在冒用、盗用他人证件的行为，因冒用、盗用他人证件造成的一切后果由本人承担</span>
        </p>
        <button>确认提交</button>
        <dl>
          <dt>证件要求</dt>
          <dd>1. 身份证照片：请按示例上传身份证正面与反面，脸部及字体必须清晰可见</dd>
          <dd>2. 护照：请按示例上传带ID的护照页正面即可，脸部及字体必须清晰可见</dd>
          <dd>3. 手持证件照：照片中请勿遮挡任何有效信息，照片中必须体现“日期及仅MixCoins认证使用”的纸条</dd>
          <dd>4. 图片格式：小于10M, 图片格式可为jpg、jpeg、png</dd>
        </dl>
        <ul>
          <li><img src="" alt=""></li>
          <li><img src="" alt=""></li>
          <li><img src="" alt=""></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {
          surname: '',
          name: '',
          type: 0,
          iconArr: ['', '', '']
        }
      }
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
  .name, .type, .photo
    margin-top 40px
  .title
    float left
    margin-right 50px
  .content
    float left
    width 800px
  .name
    .content
      .tip
        fz11()
        color $col94C
        letter-spacing 0.23px
</style>