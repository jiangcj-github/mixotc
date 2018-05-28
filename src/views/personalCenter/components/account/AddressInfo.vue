<template>
  <div>
    <BasePopup :show="true" :top="50" :width="566" :height="info.type === 4 ? 494 : 411">
      <slot>
        <div class="main">
          <img class="close-btn" src="/static/images/close_btn_tr2.png" alt="" @click="Bus.$emit('hideAddressPoup')">
          <h3>{{title.h3}}</h3>
          <div class="mid" :style="{marginBottom: info.type === 4 ? '26px' : '36px'}">
            <div class="name">
              <h4>姓名</h4>
              <input 
                type="text" 
                :placeholder="info.type === 4 ? '例：李某' : '名称'" 
                v-model="info.name"
                maxlength="20"
                ref="infoname"
                @blur="info.name.trim() === '' ? nameTip = true : nameTip = false; "
                >
              <i class="cancel" v-if="info.name" @click="()=>{info.name = ''; $refs.infoname.focus()}">
                <img src="/static/images/cancel_icon.png" alt="">
              </i>
              <b class="hint" v-if="nameTip">姓名不能为空</b>
            </div>
            <div class="account">
              <h4>{{title.h4}}</h4>
              <input 
                v-if="info.type === 4"
                type="text"
                placeholder='例：1234 5678 9012 3456'
                :value="info.number.formatCard()"
                ref="account"
                @input="dealCard"
                @blur="!(/(^([1-9]{1})(\d{15}|\d{18})$)/.test(info.number)) ? accountTip = true : accountTip = false;"
              >
               <input 
                v-else
                type="text"
                placeholder='名称'
                v-model="info.number"
                ref="account"
                maxlength="20"
                @blur="info.number.trim() === '' ? accountTip = true : accountTip = false;"
                >
              <i v-if="info.type === 4 && info.number.length > 0" class="cancel" @click="()=>{info.number = ''; $refs.account.vaule = '', $refs.account.focus()}">
                <img src="/static/images/cancel_icon.png" alt="">
              </i>
              <i v-if="info.type !== 4 && info.number.length > 0" class="cancel" @click="()=>{info.number = ''; $refs.account.focus()}">
                <img src="/static/images/cancel_icon.png" alt="">
              </i>
              <b class="hint" v-if="accountTip">请输入正确的卡号</b>
              <div class="tip">*可查询的账号</div>
            </div>
          </div>
          <div class="bank" v-if="info.type === 4">
            <h4>开户行</h4>
            <input 
              type="text" 
              placeholder='例：北京银行中关村支行'
              maxlength="20" 
              v-model="info.bank"
              ref="bank"
              @blur="info.bank.trim() === '' ?  bankTip = true : bankTip = false;"
            >
            <i v-if="info.bank" class="cancel" @click="()=>{info.bank = ''; $refs.bank.focus()}">
              <img src="/static/images/cancel_icon.png" alt="">
            </i>
            <b class="hint" v-if="bankTip">开户行不能为空</b>
          </div>
          <div class="remark">
            <textarea maxlength="40" placeholder="请填写备注信息" v-model="info.remark">
            </textarea>
            <b>{{info.remark.length}}/40</b>
          </div>
          <div class="button" @click="confirm">
            <button>确定</button>
          </div>
        </div>
      </slot>
    </BasePopup>
    <BasePopup :show="samePopup" :top="42" @click.native="()=>{samePopup = false}">
      <slot>
        <p class="sameTip">与原信息相同</p>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
 import BasePopup from '@/components/common/BasePopup';
  export default {
    props: ['isNew', 'accountInfo'],
    data() {
      return {
        nameTip: false,
        accountTip: false,
        bankTip: false,
        samePopup: false,
        timer: null,
        info:{
          ...this.accountInfo,
        }
      }
    },
    components: {
      BasePopup
    },
    computed: {
      title() {
        let obj = {};
        obj.h3 = `${this.isNew ? '添加' : '修改'}${this.info.type === 1 ? '支付宝' : (this.info.type === 2 ? '微信' : '银行卡') }收款地址`;
        obj.h4 = `${this.info.type === 4 ? '卡号' : (this.info.type === 1 ? '支付宝账号' : '微信账号')}`;
        return obj;
      }
    },
    methods: {
      isSame(){
        let flag = true;
        for (const key in this.accountInfo) {
          if(key === 'id') continue;
          if(this.accountInfo[key] !== this.info[key]){
            flag = false;
            break;
          }
        }
        return flag;
      },
      dealCard() {
        let value = this.$refs.account.value.trim().replace(/\s/g,"");
        if(value[0] == 0) {
          value = '';
          this.$refs.account.value = '';
          this.info.number = '';
          return;
        }
        if(!(/(^[0-9]\d*$)/.test(value))){
          value = value.replace(/[^0-9]/g,"");
        };
        if(value.length > 19 ) {
          value = value.substring(0, value.length - 1)
        }
        this.$refs.account.value = value.formatCard();
        this.info.number = value;
      },
      verify() {
        let { number, name, bank, type} = this.info;
        name.trim() === '' ?  this.nameTip = true : this.nameTip = false; 
        if(type === 4) {
          !(/(^([1-9]{1})(\d{15}|\d{18})$)/.test(number)) ? this.accountTip = true : this.accountTip = false;
          bank.trim() === '' && type === 4 ?  this.bankTip = true :  this.bankTip = false;
        }
        if(type !== 4) {
          number.trim() === '' ? this.accountTip = true : this.accountTip = false;
        }
        return !(this.nameTip || this.accountTip || this.bankTip)
      },
      confirm() {
        if(!this.verify()) return;
        if(this.isSame()) {
          this.samePopup = true;
          return;
        }
        let {id, number, name, bank, remark, type} = this.info;
        this.WsProxy.send('wallet', this.isNew ? 'new_account' : 'update_account', {
          uid: this.$store.state.userInfo.uid,
          name: name.trim(),
          remark: remark.trim(),
          bank: bank.trim(),
          number: number.trim(),
          id,
          type,
        }).then(data => {
          this.$store.dispatch({ type: 'moneyAddress', ws: this.WsProxy})
        }).catch(error => {
          console.log(error)
        })
        this.Bus.$emit('hideAddressPoup');
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base";
  .sameTip
    text-align center
    height 94px
    line-height 94px
  .main
    position relative
    box-sizing()
    width 100%
    height 100%
    padding 24px 60px 0
    backgrouond #FFF
    .hint
      position absolute
      left 0px
      bottom -18px
      fz11()
      color $col94C
      letter-spacing 0.23px
    .cancel
      position absolute
      top 40px
      right 10px
      cursor pointer
    input
      padding-right 20px
    .close-btn
      position absolute
      right 10.4px
      top 10.4px
      cursor pointer
    h3
      position relative
      height 20px
      line-height 20px
      padding-left 12px
      // margin-top 24px
      font-size $fz20
      color $col333
      font-weight bold
      letter-spacing 0.41px
      &::before
        position absolute
        left 0
        top 0
        width 3px
        height 20px
        content ''
        background-color $col422
    .mid
      display flex
      align-content space-between
      margin-top 36px
      .name
        position relative
        margin-right 30px
      h4
        margin-bottom 10px
      input
        box-sizing()
        placeholder()
        width 208px
        height 40px
        padding-left 10px
        background $col6FA
        border-radius 2px
        &:focus
          background-color #FFF
          border 1px solid $col422
      .account
        position relative
        .tip
          position absolute
          right -6px
          bottom -24px
          fz11()
          color $col94C
          letter-spacing 0.23px
    .bank
      position relative
      margin-bottom 30px
      h4
        margin-bottom 8px
      input
        box-sizing()
        placeholder()
        width 100%
        height 40px
        padding-left 10px
        background $col6FA
        &:focus
          background-color #FFF
          border 1px solid $col422
    .remark
      position relative
      textarea
        box-sizing()
        width 100%
        height 120px
        padding 10px 
        margin-bottom 36px
        font-size $fz13
        color $col999
        border 1px solid $col1E1
        border-radius 2px
        resize none
        outline none
        placeholder()
      b
        position absolute
        bottom 46px
        right 10px
        font-size $fz13
        color $col999
        letter-spacing 0
    .button
      text-align center
      button
        width 160px
        height 40px
        background $col422
        font-size 17px
        color #FFF
        border-radius 2px
        letter-spacing 0.35px
        cursor pointer 
        &:hover
          background $col350
</style>