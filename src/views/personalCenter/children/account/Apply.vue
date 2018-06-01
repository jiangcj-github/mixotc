<template>
  <div class="apply" :class="{'hide-form': !(authState !== 0 && btverifyState !== 1 &&  btverifyState !== 2)}">
    <div class="state">
      <ul class="clearfix">
        <li class="auth" :class="{over: authState !== 0}">
           <div class="wait" v-if="authState === 0">
            <img src="/static/images/personal/wait.png" alt="">
            <br>
            <span>
              实名认证
              <b>去认证, 请先进行实名认证</b>
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
            <img src="/static/images/personal/fail.png" alt="">
            <br>
            <span>
              实名认证
              <b>未通过,请重新认证</b>
            </span>
          </div>
        </li>
        <li class="binding-card" :class="{over: [3, 4, 5].includes(authState) || [3, 4, 5].includes(btverifyState) || authState === 2 && btverifyState === 2}">
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
          <div class="fail" v-if="[3, 4, 5].includes(btverifyState) ">
            <img src="/static/images/personal/fail.png" alt="">
            <br>
            <span>
              绑定银行卡
              <b v-if="btverifyState === 3">绑定银行卡失败,{{btverifyFailReson}} 请重新绑定</b>
              <b v-if="btverifyState === 4">恶意上传认证信息,{{btverifyFailReson}} {{isPass ? '' : `关闭大额申请功能3天`}}</b>
              <b v-if="btverifyState === 5">恶意上传认证信息3次,{{btverifyFailReson}} 本账号永久关闭大额交易申请功能</b>
            </span>
          </div>
        </li>
        <li class="complete">
          <img src="/static/images/personal/pass.png" alt="" v-if="authState === 2 && btverifyState === 2">
          <template v-else> 
            <img src="/static/images/personal/fail.png" alt="" v-if="[3, 4, 5].includes(authState) || [3, 4, 5].includes(btverifyState)">
            <img src="/static/images/personal/wait.png" alt="" v-else>
          </template>
          <br>
          <span>{{[3, 4, 5].includes(authState) || [3, 4, 5].includes(btverifyState) ? '认证失败' : '完成'}}</span>
        </li>
      </ul>
    </div>
    <div class="main clearfix" v-if="authState !== 0">
      <div class="title">
        {{[1, 2].includes(btverifyState) ? `银行卡信息` :`绑定银行卡`}}
      </div>
      <div class="content">
        <div class="info">
          <div v-if="[1, 2].includes(btverifyState) ">
            <p>卡号:&nbsp;&nbsp;<span>{{data.number.showBank()}}</span></p>
            <p>开户行<span>{{data.bank}}</span></p>
          </div>
          <div v-else>
            <p>持卡人:<span>{{authData.name.hideFirstName()}}</span></p>
            <p>证件号:<span>{{`${authData.number.slice(0,3)}****${authData.number.slice(-1)}`}}</span></p>
          </div>
        </div>
        <div v-if="isShowForm">
          <ul class="form clearfix">
            <li class="input">
              <p>卡号</p>
              <input 
                type="text" 
                v-model="data.number"
                @input="dealCard"
                placeholder="请输入银行卡号" 
                ref="number"
                maxlength="23"
                @blur="verifyCard"
              >
              <b class="hint" v-if="numberTip">请输入正确的银行卡号</b>
              <i 
                class="cancel" 
                v-if="data.number"
                @click="()=>{data.number = ''; $refs.number.focus()}"
              >
                <img src="/static/images/cancel_icon.png" alt="">
              </i>
              <i v-if="bankCards.length" class="add"><img src="/static/images/personal/addicon.png" @click="showCardPoup = true"></i>
            </li>
            <li class="input">
              <p>开户行</p>
              <input 
                type="text" 
                placeholder="请输入开户行" 
                maxlength="20" 
                ref="bank" 
                v-model="data.bank"
                @blur="data.bank.trim() === '' ? bankTip = true : bankTip = false"
                >
              <i 
                class="cancel" 
                v-if="data.bank"
                @click="()=>{data.bank = ''; $refs.bank.focus()}"
              >
                <img src="/static/images/cancel_icon.png" alt="">
              </i>
              <b class="hint" v-if="bankTip">开户行信息不能为空</b>
            </li>
          </ul>
          <div class="upload-photo">
            <h4>上传照片{{showArr}}<br> {{data.iconArr}}</h4>
            <ul class="clearfix input">
              <li v-for="item of 3" :key="item" class="upload" @click="()=>{curPhoto = item - 1; $refs.up_img.click();}">
                <img :src="`/static/images/personal/${defaultIdentity[item - 1]}`" alt="">
                <img :src="data.iconArr[item - 1] ? `${HostUrl.http}image/${data.iconArr[item - 1]}` : showArr[item - 1]" alt="" class="up-img" v-if="data.iconArr[item - 1] || showArr[item - 1]">
                <div class="loading" v-if="data.iconArr[item - 1] === '' && showArr[item - 1] !== ''">
                  <img src="/static/images/loading2.png" alt="" style="width:32px; height:32px">
                </div>
                <img src="/static/images/personal/add.png" alt="" class="add" v-else>
                <p>{{copy[item - 1]}}</p>
              </li>
              <li class="hint" v-if="photoTip || sizeTip">{{`${photoTip ? '银行卡照片信息缺失' : ''} ${sizeTip ? '图片大小需小于10M' : ''}`}}</li>
            </ul>
          </div>
          <p class="guarantee">
            <img src="/static/images/rules_checked.png" alt="" v-if="guarantee" @click="guarantee=false">
            <img src="/static/images/rules_unchecked.png" alt="" v-else @click="guarantee=true"><span>我承认提交的证件信息属于本人所有，不存在冒用、盗用他人证件的行为，因冒用、盗用他人证件造成的一切后果由本人承担</span>
          </p>
          <div style='display:none'>
            <input type='file' ref="up_img" accept="image/png, image/jpeg" @change="uploadImage">
          </div>
          <button :class="{disable:!guarantee}" :disabled="!guarantee" @click="submit">确认提交</button>
        </div>
      </div>
    </div>
    <BasePopup :show="showCardPoup" :top="46" :width="280" :height="233 + 66 * (bankCards.length - 1)">
      <slot>
        <div class="card-list" v-clickoutside="()=>{showCardPoup = false}">
          <img src="/static/images/close_btn_tr2.png" class="close" @click="showCardPoup = false">
          <h4>选择银行卡</h4>
          <ul>
            <li v-for="(item, index) of bankCards" :key="index">
              <span @click="selectedCard = index">
                <img src="/static/images/selected.png" alt="" v-if="index === selectedCard">
                <img src="/static/images/unselect.png" alt="" v-else>
              </span>
              <p>{{item.bank}}</p>
              <p>{{item.number.showBank()}}</p>
            </li>
          </ul>
          <p class="button"><button @click="select(bankCards[selectedCard])">确认</button></p>
        </div>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BasePopup from '@/components/common/BasePopup';
  export default {
    data() {
      return {
        showCardPoup: false,
        selectedCard: 0,
        authState: this.$store.state.userInfo.verify,
        btverifyState: this.$store.state.userInfo.btverify,
        authData:{
          name:'',
          number: ''
        },
        btverifyFailReson: '',
        failTime: '',
        guarantee: true,
        curPhoto: 0,
        photoTip: false,
        bankTip: false,
        sizeTip: false,
        numberTip: false,
        defaultIdentity:['bank_card0.png','bank_card1.png','bank_card2.png'],
        showArr:['', '', ''],
        copy:['银行卡正面照片', '银行卡反面照片', '手持银行卡照片'],
        data: {
          number: '',
          bank: '',
          iconArr: ['', '', ''],
        }
      }
    },
    components: {
      BasePopup
    },
    async created() {
      await this.$store.dispatch({ type: 'updateUserInfo', ws: this.WsProxy});
      this.authState = this.userInfo.verify;
      this.btverifyState = this.userInfo.btverify;
      if(this.authState !== 0 && !([1,2].includes(this.btverifyState))) {
        await this.WsProxy.send("control", "get_identity", {
          type: 1
        }).then(data=> {
          this.authData.name = data.name;
          this.authData.number = data.number.formatCard();
        }).catch(error=>{
          console.log(error)
        })
      }
      if(this.btverifyState !== 0 ){
        await this.WsProxy.send("control", "get_identity", {
          type: 2
        }).then(({info, bank_name, number, image1, image2, image3, update})=> {
          this.btverifyFailReson = info;
          this.failTime = update;
          this.data.number = number;
          this.data.bank = bank_name;
          this.data.iconArr = [image1, image2, image3];
        }).catch(error=>{
          console.log(error)
        })
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
      isPass(){
        return (new Date()- 0) - this.failTime*1000 > 259200000
      },
      isShowForm() {
        if(this.authState === 0) return false;
        if([1, 2, 5].includes(this.btverifyState)) return false;
        if(this.btverifyState === 4 && !this.isPass) return false;
        return true;
      },
      bankCards(){
        return this.$store.state.moneyAddress.filter(item=>{
          return item.type === 4
        })
      }
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
      select(card){
        this.data.number = card.number.formatCard();
        this.data.bank = card.bank;
        this.showCardPoup = false;
      },
      verifyCard(){
        !(/(^([1-9]{1})(\d{15}|\d{18})$)/.test(this.data.number.trim().replace(/\s/g,""))) ? this.numberTip = true : this.numberTip = false;
      },
      verify() {
        let { number, bank, iconArr} = this.data;
        bank.trim() === '' ?  this.bankTip = true : this.bankTip = false;
        !(/(^([1-9]{1})(\d{15}|\d{18})$)/.test(number.trim().replace(/\s/g,""))) ? this.numberTip = true : this.numberTip = false;
        iconArr.filter(item=>{return item === ''}).length === 0 ? this.photoTip = false :  this.photoTip = true;
        if(this.photoTip) this.sizeTip = false;
        return !(this.bankTip || this.numberTip || this.photoTip)
      },
      submit() {
        if(!this.verify()) return;
        let { number, bank, iconArr} = this.data;
        this.WsProxy.send('control', 'user_identity', {
          type: 2,
          name: this.authData.name,
          number: number.trim().replace(/\s/g,""),
          bank_name: bank.trim(),
          Image1: iconArr[0],
          Image2: iconArr[1],
          Image3: iconArr[2]
        }).then(data=>{
          this.btverifyState = 1;
          this.$store.dispatch({ type: 'updateUserInfo', ws: this.WsProxy})
        }).catch(error=>{
          console.log(error)
        })
      },
      dealCard() {
        this.data.number = this.data.number.trim().replace(/\s/g,"");
        if(this.data.number[0] == 0) {
          this.data.number = '';
          return;
        }
        if(!(/^[0-9]+$/.test(this.data.number))){
          this.data.number = this.data.number.replace(/[^0-9]/g,"");
        };
        this.data.number = this.data.number.formatCard();
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
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../../stylus/base";
  .apply
    padding 0 30px 44px
    &.hide-form
      height 561px
    .card-list
      position relative
      box-sizing()
      width 100%
      height 100%
      padding 25px 0 0 60px
      .close
        position absolute
        right 12px
        top 12px
        cursor pointer
      h4
        position relative
        padding-left 12px
        font-size $fz20
        font-weight bold
        letter-spacing 0.41px
        margin-bottom 41px
        &::before
          position absolute
          top 4px
          left 0
          content ''
          width 3px
          height 20px
          background-color $col422
      ul
        padding-bottom 10px
        li
          position relative
          padding-left 30px
          margin-bottom 25px
          letter-spacing 0.29px
          span
            position absolute
            left 0
            top 3px
            cursor pointer
          p
            width 145px
            margin-bottom 3px
            ellipsis()
      .button
        margin-bottom 20px
        button
          width 160px
          height 40px
          font-size $fz14
          letter-spacing 0.29px
          color #FFF
          background $col422
          border-radius 2px
          cursor pointer
          &:hover
            background $col350
    .input
      position relative
      .hint
        position absolute
        left 0px
        bottom -23px
        fz11()
        color $col94C
        letter-spacing 0.23px
        cursor auto !important
      .cancel
        position absolute
        bottom 14px
        right 10px
        cursor pointer
        img
          display block
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
            .add
              position absolute
              bottom 12.5px
              right -25px
              cursor pointer
              img
                display block
                width 15px
                height 15px
            input 
              box-sizing()
              width 206px
              height 40px
              padding 0 20px 0 10px
              font-size $fz13
              background $col6FA
              border 1px solid $col1E1
              border-radius 2px
              &:focus
                background #FFF
                border 1px solid $col422
                border-radius 2px
        .upload-photo 
          ul
            margin 42px 0 0 60px
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
    

</style>
