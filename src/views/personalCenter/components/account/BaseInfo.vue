<template>
  <div class="base">
    <div class="user-info clearfix">
      <div class="left">
        <span class="title">基本资料</span>
      </div>
      <div class="right  clearfix">
        <div class="avator">
          <Avator icon="/static/images/default_avator.png" emitValue="avatorUrl"></Avator>
        </div>
        <div class="info">
          <p>
            <span>用户ID</span>
            <i>18998878899</i>
          </p>
          <p>
            <span>昵称</span>
            <i></i>
            <i class="set" v-if="!isSetting" @click="isSetting=true">设置</i>
            <input type="text" placeholder="输入昵称" v-if="isSetting">
            <i class="confirm" v-if="isSetting" @click="isSetting=false">确定</i>
          </p>
          <p>
            <span>手机号</span>
            <i>13890087654</i>
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
            <em class="edit"></em>
            <em class="del"></em>
          </li>
          <li class="add" v-if="bankCard.length < 2">
            <i></i>
            <b>添加银行卡</b>
          </li>
        </ul>
        <p class="zhifubao">
          <span class="add" v-if="!alipay">
            <i></i>
            <b>添加支付宝</b>
          </span>
          <span class="exist">
            <i>{{alipay.name}}</i>
            <b>{{alipay.number.showOther()}}</b>
            <img src="/static/images/personal/zhifubao.png" alt="">
            <em class="edit"></em>
            <em class="del"></em>
          </span>
        </p>
        <p class="weixin">
          <span class="add" v-if="!alipay">
            <i></i>
            <b>添加微信</b>
          </span>
          <span class="exist">
            <i>{{weChat.name}}</i>
            <b>{{weChat.number.showOther()}}</b>
            <img src="/static/images/personal/wechat.png" alt="">
            <em class="edit"></em>
            <em class="del"></em>
          </span>
        </p>
      </div>
    </div>
    <AddressInfo></AddressInfo>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Avator from "./Avator";
import AddressInfo from "./AddressInfo";
  export default {
    data() {
      return {
        isSetting: false
      }
    },
    components: {
      Avator,
      AddressInfo
    },
    mounted() {
      this.fetchAddress();
    },
    computed: {
      ...mapState([
        'moneyAddress'
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
      fetchAddress() {
        this.$store.dispatch({ type: 'moneyAddress', ws: this.WsProxy})
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../../../stylus/base";
  .base
    box-sizing()
    width 1000px
    padding 40px 30px 44px
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
          margin-top 4px
          font-size $fz14
          color $col333
          letter-spacing 0.29px
          p
            height 34px
            line-height 34px
            margin-bottom 10px
            letter-spacing 0.29px
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
              padding-left 10px
              font-size $fz14
              background $col6FA
              border 1px solid $col1E1
              border-radius 2px
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
          .exist
            background-image: linear-gradient(245deg, $col94C 0%, $col422 100%);
            border-radius: 4px;
        .zhifubao
          .exist
            background-image: linear-gradient(245deg, #3F80F4 0%, #3CB7F9 100%);
            border-radius: 4px;
        .weixin
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
        p
          margin-top 50px
</style>