<template>
<div>
  <div class="underway" v-if="authState === 1">

  </div>
  <div class="auth" v-if="authState === 3">
    <div class="name clearfix">
      <div class="title">
        实名认证
      </div>
      <div class="content">
        <p class="tip">实名信息必须真实可靠，并与银行登记信息保持一致。实名信息一旦确认，不可修改</p>
        <ul class="clearfix">
          <li class="input">
            <p>姓氏</p>
            <input type="text" placeholder="输入姓氏" v-model="data.surname" maxlength="20">
            <b class="hint" v-if="surnameTip">姓氏不能为空</b>
          </li>
          <li class="input">
            <p>名字</p>
            <input type="text" placeholder="输入名字" v-model="data.name" maxlength="20">
            <b class="hint" v-if="nameTip">名字不能为空</b>
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
        <p class="input">
          <input 
            type="text" 
            placeholder="请填写身份证号码/护照号码" 
            v-model="data.number"
            @input="dealCertificate"
            style="ime-mode:disabled"
            maxlength="30"
            >
          <b class="hint" v-if="numberTip">证件号码不能为空</b>
        </p>
      </div>
    </div>
    <div class="photo clearfix">
      <div class="title">
        上传证件照
      </div>
      <div class="content">
        <ul class="clearfix input">
          <li v-for="item of 3" :key="item" class="upload"  @click="()=>{curPhoto = item - 1; $refs.up_img.click()}">
            <img :src="`/static/images/personal/${defaultIdentity[item - 1]}`" alt="" v-if="data.type">
            <img :src="`/static/images/personal/${defaultPassport[item - 1]}`" alt="" v-else>
            <img :src="`${HostUrl.http}image/${data.iconArr[item - 1]}`" alt="" class="up-img" v-if="data.iconArr[item - 1]">
            <p>{{copy[data.type][item - 1]}}</p>
          </li>
          <li class="hint" v-if="photoTip">照片信息缺失</li>
        </ul>
        <p class="guarantee">
          <img src="/static/images/rules_checked.png" alt="" v-if="guarantee" @click="guarantee=false">
          <img src="/static/images/rules_unchecked.png" alt="" v-else @click="guarantee=true"><span>我承认提交的证件信息属于本人所有，不存在冒用、盗用他人证件的行为，因冒用、盗用他人证件造成的一切后果由本人承担</span>
        </p>
        <button :class="{disable:!guarantee}" :disabled="!guarantee" @click="submit">确认提交</button>
        <dl>
          <dt>证件要求</dt>
          <dd>1. 身份证照片：请按示例上传身份证正面与反面，脸部及字体必须清晰可见</dd>
          <dd>2. 护照：请按示例上传带ID的护照页正面即可，脸部及字体必须清晰可见</dd>
          <dd>3. 手持证件照：照片中请勿遮挡任何有效信息，<i>照片中必须体现“日期及仅MixCoins认证使用”的纸条</i></dd>
          <dd>4. 图片格式：小于10M, 图片格式可为jpg、jpeg、png</dd>
        </dl>
        <ul class="clearfix">
          <li v-for="item of 3" :key="item">
            <img :src="`/static/images/personal/${defaultIdentity[item - 1]}`" alt="" v-if="data.type">
            <img :src="`/static/images/personal/${defaultPassport[item - 1]}`" alt="" v-else>
            <p>{{copy[data.type][item - 1]}}</p>
          </li>
        </ul>
        <div style='display:none'>
          <input type='file' ref="up_img" accept="image/png, image/jpeg" @change="uploadImage">
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
  export default {
    data() {
      return {
        authState:0,
        curPhoto:0,
        surnameTip: false,
        nameTip: false,
        numberTip: false,
        photoTip: false,
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
          number: '',
          iconArr: ['', '', '']
        }
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    async mounted() {
      await this.$store.dispatch({ type: 'updateUserInfo', ws: this.WsProxy});
      this.authState = this.userInfo.verify
      if(this.$route.params.authData){
        this.data = this.$route.params.authData;
        return;
      }
      this.Bus.$emit('upLoadAuth', this.data)
    },
    methods: {
      dealCertificate() {
        this.data.number = this.data.number.trim().replace(/\s/g,"");
        if(!(/^[0-9a-zA-Z]+$/.test(this.data.number))){
          this.data.number = this.data.number.replace(/[^a-zA-Z0-9]/g,"");
        };
        this.data.number = this.data.number.formatCertificate();
      },
      async uploadImage(){
        let a = new FormData(),
            file = this.$refs.up_img.files[0];
        a.append("uploadimage", file);
        this.$refs.up_img.value = ''
        await fetch(`${this.HostUrl.http}image/`, {
          method: 'Post',
          body: a
        }).then(res => res.text())
        .then(res =>{
          this.data.iconArr[this.curPhoto] = res;
          this.data.iconArr = this.data.iconArr.concat([])
        })
        .catch(error=>{
          console.log(error)
        })
      },
      verify(){
        let { number, name, surname} = this.data;
        name.trim() === '' ?  this.nameTip = true : this.nameTip = false; 
        number.trim().replace(/\s/g,"") === '' ?  this.numberTip = true : this.numberTip = false;;
        surname.trim() === '' ?  this.surnameTip = true :  this.surnameTip = false;
        console.log(this.data.iconArr.filter(item=>{return item === ''}))
        this.data.iconArr.filter(item=>{return item === ''}).length === 0 ? this.photoTip = false :  this.photoTip = true;

        return !(this.nameTip || this.surnameTip || this.numberTip || this.photoTip)
      },
      submit(){
        if(!this.verify()) return;
        let { number, name, surname, iconArr} = this.data;
        this.WsProxy.send('control', 'user_identity', {
          type: 1,
          name: surname.trim() + name.trim(),
          number: number.trim().replace(/\s/g,""),
          Image1: iconArr[0],
          Image2: iconArr[1],
          Image3: iconArr[2]
        }).then(data=>{
          this.authState = 1;
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
.underway
  width 1000px
  height 577px
.auth
  box-sizing()
  width 1000px
  padding 10px 30px 42px
  background-color #FFF
  .input
    position relative
    .hint
      position absolute
      left 0px
      bottom -23px
      padding-left 15px
      fz11()
      color $col94C
      letter-spacing 0.23px
      &::before
        position absolute
        left 0 
        top 2px
        content ''
        width 12px
        height 12px
        background url('/static/images/hint.png') no-repeat center center;
  input
    box-sizing()
    placeholder()
    font-size $fz14
    background $col6FA
    padding-right 10px
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
        -webkit-ime-mode disabled
        /*Mozilla Firefox*/
        -moz-ime-mode disabled
        /*Opera*/
        -o-ime-mode disabled
        /*Internet Explorer*/
        -ms-ime-mode disabled
        /*CSS3 Standard*/
        ime-mode disabled

  .photo
    .content
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
        cursor pointer
        &.disable
          background $col1E1
          color $col999
      dl
        margin 48px 0 40px 0
        dt
          margin-bottom 28px
        dd
          height 13px
          margin-bottom 15px
          font-size $fz13
          line-height 13px
          i
            color $col94C
</style>