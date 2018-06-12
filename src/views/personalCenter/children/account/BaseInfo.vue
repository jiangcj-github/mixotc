<template>
  <div class="base">
    <div class="user-info clearfix">
      <div class="left">
        <span class="title">基本资料</span>
      </div>
      <div class="right  clearfix">
        <div class="avator">
          <Avator :icon="userInfo.icon ? `${HostUrl.http}image/${userInfo.icon}` : '/static/images/default_avator.png'" emitValue="avatorUrl"></Avator>
        </div>
        <div class="info">
          <p>
            <span>昵称</span>
            <i v-if="!isSetting">{{name}}</i>
            <i class="set" v-if="!isSetting" @click="()=>{name = userInfo.name;isSetting=true}">设置</i>
            <input type="text" placeholder="输入昵称" v-if="isSetting" v-model.trim="name" ref="name" maxlength="20"
                   @keydown.enter="updateName"
                   v-clickoutside="()=>{name = userInfo.name; isSetting = false}">
            <b
              v-if="name && isSetting"
              @click.stop="()=>{name = ''; $refs.name.focus()}"
            >
              <img src="/static/images/cancel_icon.png" alt="">
            </b>
            <i class="confirm" v-if="isSetting" @click.stop="updateName">确定</i>
          </p>
          <p>
            <span>{{userInfo.phone ? '手机号' : '邮箱'}}</span>
            <i>{{userInfo.phone ? userInfo.phone.showOther() : userInfo.email.showEmail()}}</i>
          </p>
        </div>
      </div>
    </div>
    <div class="beneficiary-address clearfix">
      <div class="left">
        <span>收款地址</span>
      </div>
      <div class="right">
        <ul class="bank-cark clearfix">
          <li class="exist" v-for="item of bankCard" :key="item.number">
            <i>{{item.bank}}</i>
            <b>{{item.number.showBank()}}</b>
            <img src="/static/images/personal/card.png" alt="">
            <em class="edit" v-if="!item.changeable" @click="alter(item)"></em>
            <em class="del" v-if="!item.changeable" @click="delAddress(item.id)"></em>
          </li>
          <li class="add" v-if="bankCard.length < 2" @click="newAddress(4)">
            <i></i>
            <b>添加银行卡</b>
          </li>
        </ul>
        <p class="zhifubao">
          <span class="add" v-if="!alipay" @click="newAddress(1)">
            <i></i>
            <b>添加支付宝</b>
          </span>
          <span class="exist" v-else>
            <i>{{alipay.name}}</i>
            <b>{{alipay.number.showOther()}}</b>
            <img src="/static/images/personal/zhifubao.png" alt="">
            <em class="edit" v-if="!alipay.changeable" @click="alter(alipay)"></em>
            <em class="del" v-if="!alipay.changeable" @click="delAddress(alipay.id)"></em>
          </span>
        </p>
        <p class="weixin">
          <span class="add" v-if="!weChat" @click="newAddress(2)">
            <i></i>
            <b>添加微信</b>
          </span>
          <span class="exist" v-else>
            <i>{{weChat.name}}</i>
            <b>{{weChat.number.showOther()}}</b>
            <img src="/static/images/personal/wechat.png" alt="">
            <em class="edit" v-if="!weChat.changeable" @click="alter(weChat)"></em>
            <em class="del" v-if="!weChat.changeable" @click="delAddress(weChat.id)"></em>
          </span>
        </p>
      </div>
    </div>

    <AddressInfo v-if="isShowInfo" :isNew="isNew" :accountInfo="accountInfo"></AddressInfo>
  <!-- 删除确认弹窗 -->
    <BasePopup :show="isShowConfirm" :top="40" :width="470" :height="194">
      <slot>
        <div class="main" v-clickoutside="()=>{isShowConfirm = false}">
          <img src="/static/images/close_btn_tr2.png" alt="" @click="isShowConfirm = false">
          <p class="tip">是否确定删除？</p>
          <p class="button">
            <button class="cancel" @click="isShowConfirm = false">取消</button>
            <button class="confirm" @click="confirm">确定</button>
          </p>
        </div>
      </slot>
    </BasePopup>
    <BasePopup :show="showTip" :top="40" class="nick-tip" @click.native="hidePopup">
      <slot>
        <p>昵称已被占用</p>
      </slot>
    </BasePopup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BasePopup from '@/components/common/BasePopup';
import Avator from "../../components/account/Avator";
import AddressInfo from "../../components/account/AddressInfo";
  export default {
    data() {
      return {
        isSetting: false,
        isNew: true,
        accountInfo: null,
        isShowInfo: false,
        isShowConfirm: false,
        delId: null,
        showTip:false,
        timer: null,
        name: this.$store.state.userInfo.name
      }
    },
    components: {
      Avator,
      BasePopup,
      AddressInfo
    },
    mounted() {
      this.name = this.userInfo.name
      this.fetchAddress();
      this.Bus.$on("hideAddressPoup", () => {
        this.isShowInfo = false;
      })
      this.Bus.$on("avatorUrl", (icon)=>{
        this.WsProxy.send('control', 'user_update', { icon }).then(res =>{
          this.$store.commit({type: 'updateUserInfo', data:{icon: icon}})
        })
      })
    },
    destroyed() {
      this.Bus.$off("hideAddressPoup");
      this.Bus.$off("avatorUrl");
      clearTimeout(this.timer)
    },
    computed: {
      ...mapState([
        'moneyAddress',
        'userInfo'
      ]),
      bankCard(){
        if(!this.moneyAddress) return [];
        return this.moneyAddress.filter(item => item.type === 4)
      },
      alipay(){
        if(!this.moneyAddress) return [];
        let arr = this.moneyAddress.filter(item => item.type === 1);
        if(arr.length) return arr[0];
        return false;
      },
      weChat(){
        if(!this.moneyAddress) return [];
        let arr = this.moneyAddress.filter(item => item.type === 2);
        if(arr.length) return arr[0];
        return false;
      }
    },
    methods: {
      hidePopup(){
        this.showTip = false;
        clearTimeout(this.timer);
      },
      showPopup(){
        this.showTip = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showTip = false;
          clearTimeout(this.timer)
        }, 3000);
      },
      fetchAddress() {
        this.$store.dispatch({ type: 'moneyAddress', ws: this.WsProxy})
      },
      updateName() {
        if(this.name === '' || this.userInfo.name === this.name) {
          this.name = this.userInfo.name;
          this.isSetting=false;
          return;
        };
        this.WsProxy.send('control', 'user_update', { name: this.name }).then(res =>{
          this.$store.commit({type: 'updateUserInfo', data:{name: this.name}})
          this.isSetting=false;
        }).catch(error => {
          if(error.ret === 93) {
            this.showPopup();
          }
          this.name = this.userInfo.name
        })
      },
      alter(obj){
        this.isNew = false;
        this.accountInfo = obj;
        this.isShowInfo = true;
      },
      newAddress(type){
        this.isNew = true;
        this.accountInfo = {
          type: type,
          name: '',
          number: '',
          bank: '',
          remark: ''
        }
        this.isShowInfo = true;
      },
      confirm(){
        this.WsProxy.send('wallet', 'del_account', {
          id: this.delId,
          uid: this.userInfo.uid
        }).then(data => {
          this.$store.dispatch({ type: 'moneyAddress', ws: this.WsProxy})
          this.isShowConfirm = false;
        })
      },
      delAddress(id) {
        this.isShowConfirm = true;
        this.delId = id
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base";
  .nick-tip
    p
      height 94px
      line-height 94px
      text-align center
  .base
    box-sizing()
    width 1000px
    padding 40px 30px 44px
    .main
      position relative
      width 100%
      height 100%
      letter-spacing 0.29px
      text-align center
      img
        position absolute
        right 10.4px
        top 10.4px
        cursor pointer
      p.tip
        padding-top 56px
      p.button
        padding-top 56px
        button
          width 160px
          height 40px
          font-size $fz14
          color #FFF
          letter-spacing 0.29px
          background $col422
          border-radius 2px
          cursor pointer
          &.confirm:hover
            background $col350
          &.cancel
            margin-right 25px
            color $col422
            border 1px solid $col422
            background #FFF
            border-radius: 2px
    .user-info
      position relative
      padding-bottom 20px
      &::before
        position absolute
        content ''
        bottom 0
        left 0
        width 941px
        height 1px
        background: #E1E1E1;
      .left
        float left
        margin-right 30px
        margin-top 10px
        .title
          font-size $fz14
          color $col333
          letter-spacing 0.29px
      .right
        float left
        .avator
          float left
          margin-right 30px
        .info
          float left
          width 500px
          margin-top 4px
          font-size $fz14
          color $col333
          letter-spacing 0.29px
          p
            position relative
            height 34px
            line-height 34px
            margin-bottom 10px
            letter-spacing 0.29px
            b
              position absolute
              right 195px
              bottom -1px
              cursor pointer
            i.set, i.confirm
              color $col422
              cursor pointer
            i.set
              position relative
              padding-left 20px
              &::before
                position absolute
                top 4px
                left 0
                content ''
                width 13px
                height 13px
                background url('/static/images/personal/edit.png') no-repeat center center;
                background-size 13px 13px
            i.confirm
              position relative
              left 10px
              bottom -10px
            span
              display inline-block
              width 103px
            input
              width 170px
              height 30px
              padding 0 20px 0 10px
              font-size $fz14
              background $col6FA
              border 1px solid $col1E1
              border-radius 2px
              &:focus
                border 1px solid $col422
                background #FFF
    .beneficiary-address
      padding-top 40px
      .left
        float left
        height 100%
        margin-right 30px
      .right
        float left
        .bank-cark
          width 835px
          li
            float left
            margin-bottom 50px
          .exist
            background-image: linear-gradient(245deg, $col94C 0%, $col422 100%);
            border-radius: 4px;
        .zhifubao
          .exist
            background-image: linear-gradient(245deg, #3F80F4 0%, #3CB7F9 100%);
            border-radius: 4px;
        .weixin
          margin-top 50px
          .exist
            background-image: linear-gradient(245deg, #18CB84 0%, #67BD05 100%);
            border-radius: 4px;
        .exist
          box-sizing()
          display block
          position relative
          width 280px
          height 110px
          padding 27px 0 0 30px
          margin-right 100px
          border-radius 4px
          color #FFF
          letter-spacing 0
          .edit, .del
            position absolute
            width 13px
            height 13px
            right -34px
            bottom 0
            background url('/static/images/personal/edit.png') no-repeat center center;
            background-size 13px 13px
            cursor pointer
          .del
            width 11px
            height 14px
            right -62px
            background url('/static/images/personal/del.png') no-repeat center center;
            background-size 11px 14px
          i
            display block
            font-size $fz16
            margin-bottom 15px
          img
            position absolute
            top 0
            right 0
            width 110px
            height 110px
        .add
          display block
          position relative
          width 280px
          height 110px
          background $col6FA
          border 1px solid #E1E1E1
          border-radius 4px
          cursor pointer
          b
            display block
            position relative
            top 68px
            text-align center
            font-size $fz13
            color $col999
            letter-spacing 0
          i
            position absolute
            left 50%
            top 29px
            margin-left -12px
            width 22px
            height 22px
            border 1px solid #909090
            border-radius 50%
            &::before
              position absolute
              left 3px
              top 10px
              width 16px
              height 2px
              background-color #909090
              content ''
            &::after
              position absolute
              left 10px
              top 3px
              width 2px
              height 16px
              background-color #909090
              content ''
</style>
