<template>
<div>
  <div class="underway" v-if="authState === 1">
    <p>认证中…</p>
  </div>
  <div class="pass" v-if="authState === 2">
    <p>已通过认证</p>
  </div>
  <div class="fail" v-if="authState === 3 || authState === 4 && isPass">
    <dl>
      <dt>认证失败</dt>
      <dd v-if="authState === 3">{{faileReason}}</dd>
      <dd v-if="authState === 4">恶意上传实名认证信息 {{faileReason}}</dd>
    </dl>
  </div>
  <div class="close-three" v-if="authState === 4 && !isPass">
    <p>认证失败 {{faileReason}}</p>
    <p class="hint">恶意上传实名认证信息，关闭实名认证功能3天</p>
  </div>
  <div class="close-forever" v-if="authState === 5">
    <p>认证失败 {{faileReason}}</p>
    <p class="hint">恶意上传实名认证信息3次，本账号永久关闭实名认证功能</p>
  </div>
  <div class="auth" v-if="authState === 3 || authState === 0 || authState === 4 && isPass">
    <div class="name clearfix">
      <div class="title">
        实名认证
      </div>
      <div class="content">
        <p class="tip">实名信息必须真实可靠，并与银行登记信息保持一致。实名信息一旦确认，不可修改</p>
        <ul class="clearfix">
          <li class="input">
            <p>姓名</p>
            <input 
              type="text" 
              placeholder="输入姓名" 
              v-model="data.name" 
              maxlength="20" 
              ref='name'
              @blur="data.name.trim() === '' ? nameTip = true : nameTip = false;"
              >
            <i 
              v-if="data.name"
              @click="()=>{data.name = ''; $refs.name.focus()}"
            >
              <img src="/static/images/cancel_icon.png" alt="">
            </i>
            <b class="hint" v-if="nameTip">姓名不能为空</b>
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
            ref='number'
            placeholder="请填写身份证号码/护照号码" 
            v-model="data.number"
            @input="dealCertificate"
            style="ime-mode:disabled"
            maxlength="25"
            @blur="verifyNumber"
            >
            <i 
              v-if="data.number"
              @click="()=>{data.number = ''; $refs.number.focus()}"
            >
              <img src="/static/images/cancel_icon.png" alt="">
            </i>
          <b class="hint" v-if="numberTip">{{data.number.length === 0 ? '证件号不能为空' : '请输入正确的证件号'}}</b>
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
            <img :src="data.iconArr[item - 1] ? `${HostUrl.http}image/${data.iconArr[item - 1]}` : showArr[item - 1]" alt="" class="up-img" v-if="data.iconArr[item - 1] || showArr[item - 1]">
            <div class="loading" v-if="data.iconArr[item - 1] === '' && showArr[item - 1] !== ''">
              <img src="/static/images/loading2.png" alt="" style="width:32px; height:32px">
            </div>
            <img src="/static/images/personal/add.png" alt="" class="add" v-else>
            <p>{{copy[data.type][item - 1]}}</p>
          </li>
          <li class="hint" v-if="photoTip || sizeTip">{{`${photoTip ? '证件照片信息缺失' : ''} ${sizeTip ? '图片大小需小于10M' : ''}`}}</li>
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
        authState:this.$store.state.userInfo.verify,
        curPhoto:0,
        nameTip: false,
        numberTip: false,
        photoTip: false,
        sizeTip: false,
        faileReason: '证件照片不符',
        faileTime: 0,
        defaultIdentity:['identity_0.png','identity_1.png','identity_2.png'],
        defaultPassport:['passport_0.png','passport_2.png','passport_1.png'],
        showArr:['', '', ''],
        copy:[
          ['护照正面照片', '手持护照照片', '住址证明'],
          ['身份证正面照片', '身份证反面照片', '手持身份证照片']
        ],
        guarantee: true,
        data: {
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
      ]),
      isPass(){
        return (new Date()- 0) - this.faileTime*1000 > 259200000
      }
    },
    async created() {
      await this.$store.dispatch({ type: 'updateUserInfo', ws: this.WsProxy});
      if([3, 4, 5].includes(this.userInfo.verify)) {
        await this.WsProxy.send("control", "get_identity", {
          type: 1
        }).then(({info, name, type , number, image1, image2, image3, update})=> {
          this.faileReason = info;
          this.faileTime = update;
          this.data.name = name;
          this.data.type = type;
          this.data.number = number.formatCertificate();
          this.data.iconArr = [image1, image2, image3]
        }).catch(error=>{
          console.log(error)
        })
      }
      this.authState = this.userInfo.verify
    },
    methods: {
      getObjectURL (file) {  
        let url = null ;   
        if (window.createObjectURL!=undefined) { // basic  
          url = window.createObjectURL(file) ;  
        } else if (window.URL!=undefined) { // mozilla(firefox)  
          url = window.URL.createObjectURL(file) ;  
        } else if (window.webkitURL!=undefined) { // webkit or chrome  
          url = window.webkitURL.createObjectURL(file) ;  
        }  
        return url ;  
      },
      dealCertificate() {
        this.data.number = this.data.number.trim().replace(/\s/g,"");
        if(this.data.number[0] == 0) {
          this.data.number = '';
          return;
        }
        if(!(/^[0-9a-zA-Z]+$/.test(this.data.number))){
          this.data.number = this.data.number.replace(/[^a-zA-Z0-9]/g,"");
        };
        this.data.number = this.data.number.formatCertificate();
      },
      async uploadImage(){
        let index = this.curPhoto;
        this.data.iconArr[index] = '';
        let a = new FormData(),
            file = this.$refs.up_img.files[0];
          if(!file) return;
          if(file && file.size > 10485760) {
            this.sizeTip = true;
            this.photoTip = false;
            return;
          }
        this.showArr[index] = this.getObjectURL(file);
        this.showArr = this.showArr.concat([])
        this.sizeTip = false;
        a.append("uploadimage", file);
        this.$refs.up_img.value = ''
        await fetch(`${this.HostUrl.http}image/`, {
          method: 'Post',
          body: a
        }).then(res => res.text())
        .then(res =>{
          this.data.iconArr[index] = res;
          this.data.iconArr = this.data.iconArr.concat([])
        })
        .catch(error=>{
          console.log(error)
        })
      },
      verifyNumber(){
        let { number, type} = this.data;
        number.trim().replace(/\s/g,"") === '' ?  this.numberTip = true : this.numberTip = false;
        if(type === 1) {
          // 身份证正则
          /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(number.trim().replace(/\s/g,"")) ? this.numberTip = false : this.numberTip = true;
        }else{
          // 护照正则
          /^[a-zA-Z0-9]{3,21}$/.test(number.trim().replace(/\s/g,"")) ? this.numberTip = false : this.numberTip = true;
        }
      },
      verify(){
        let { number, name, type} = this.data;
        name.trim() === '' ?  this.nameTip = true : this.nameTip = false; 
        this.verifyNumber()
        this.data.iconArr.filter(item=>{return item === ''}).length === 0 ? this.photoTip = false :  this.photoTip = true;
        if(this.photoTip) this.sizeTip = false;
        return !(this.nameTip || this.numberTip || this.photoTip)
      },
      submit(){
        if(!this.verify()) return;
        let { number, name, iconArr} = this.data;
        this.WsProxy.send('control', 'user_identity', {
          type: 1,
          name: name.trim(),
          number: number.trim().replace(/\s/g,""),
          Image1: iconArr[0],
          Image2: iconArr[1],
          Image3: iconArr[2]
        }).then(data=>{
          this.authState = 1;
          this.$store.dispatch({ type: 'updateUserInfo', ws: this.WsProxy})
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
.underway, .pass, .close-three, .close-forever
  width 1000px
  height 307px
  padding-top 270px
  background url('/static/images/personal/verifying.png') no-repeat 430px 100px;
  background-size 140px 140px
  p
    text-align center
    letter-spacing 0.16px
    margin-bottom 20px
    &.hint
      color $col94C
.pass
  background url('/static/images/personal/verifypass.png') no-repeat 430px 100px;
  background-size 140px 140px
.close-three, .close-forever
  background url('/static/images/personal/verifyfail.png') no-repeat 430px 100px;
  background-size 140px 140px
.fail
  position relative
  width 1000px
  height 140px
  margin-bottom 10px
  background url('/static/images/personal/verifyfail.png') no-repeat 255px 0 $col6FA;
  background-size 140px 140px
  dl
    position absolute
    left 435px
    top 45px
    letter-spacing 0.16px
    dt
      margin-bottom 10px
    dd
      color $col94C
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
      fz11()
      color $col94C
      letter-spacing 0.23px
    i
      cursor pointer
  input
    box-sizing()
    placeholder()
    background $col6FA
    font-size $fz13
    padding-right 25px
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
          i
            position absolute
            right 50px
            bottom 8px
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
      .input
        width 453px
        i
          position absolute
          right 10px
          bottom 8px
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
          &.upload
            .loading
              position absolute
              top 0
              left 0
              width 190px
              height 130px
              background-color rgba(0,0,0,0.4)
              img
                position absolute
                left 50%
                top 50%
                margin -16px 0 0 -16px
                animation mymove 1.5s linear infinite;
                -webkit-animation mymove 1.5s linear infinite;
            .add
              position absolute
              top 0
              left 50%
              width 44px
              height 44px
              margin 43px 0 0 -22px
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