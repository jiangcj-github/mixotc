<template>
  <div class="safe">
    <div class="pay pay-password">
      <div class="icon">
        <img src="/static/images/personal/pay_password.png" alt="">
      </div>
      <div class="content">
        <div class="title">
          <h4>支付密码</h4>
          <span>为资金加一道锁，更安全</span>
        </div>
        <div class="set">
          <button 
            v-if="$store.state.userInfo.is_new"
            @click="()=>{
              (type || !type && $store.state.userInfo.auth !== 1 ) && (showPass = true);
              !type && $store.state.userInfo.auth === 1 && (showGoogle = true);
            }"
          >
          设置
          </button>
          <span v-else @click="showPass = true">修改或找回</span>
        </div>
      </div>
    </div>
    <div class="pay pay-verify">
      <div class="icon">
        <img src="/static/images/personal/pay_verify.png" alt="">
      </div>
      <div class="content">
        <div class="title">
          <h4>支付验证</h4>
        </div>
        <div class="type clearfix">
          <p class="google">
            <img src="/static/images/selected.png" alt="" v-if="!type && !$store.state.userInfo.is_new">
            <img src="/static/images/unselect.png" alt="" v-else><span @click="$store.state.userInfo.auth === 1 && (showGoogle = true)">谷歌验证</span>
          </p>
          <p class="message">
            <img src="/static/images/selected.png" alt="" v-if="type && !$store.state.userInfo.is_new">
            <img src="/static/images/unselect.png" alt="" v-else><span>短信验证</span>
          </p>
        </div>
      </div>
    </div>
    <div class="device">
      <div class="title clearfix">
        <h4>当前已登录你账户的浏览器或设备</h4>
        <button @click="kickOff">一键登出所有设备</button>
      </div>
      <div class="content">
        <table>
          <tr>
            <th style="width: 188px">登录时间</th>
            <th style="width: 250px">设备</th>
            <th style="width: 140px">IP</th>
            <th style="width: 180px">地点</th>
            <th>是否当前</th>
          </tr>
          <tr v-for="(item, index) of deviceList" :key="index">
            <td>{{item.create.toDate2()}}</td>
            <td>{{item.device}}</td>
            <td>{{item.ip}}</td>
            <td>{{item.location}}</td>
            <td>{{item.is_self ? '是' : '否'}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="log">
      <h4>登录日志</h4>
      <div class="content">
        <table>
          <tr>
            <th style="width: 350px">登录设备</th>
            <th style="width: 180px">IP</th>
            <th style="width: 170px">地点</th>
            <th>时间</th>
          </tr>
          <tr v-for="(item, index) of loginRecord" :key="index">
            <td>{{item.device}}</td>
            <td>{{item.ip}}</td>
            <td>{{item.location}}</td>
            <td>{{item.create.toDate2()}}</td>
          </tr>
        </table>
         <Pagination class="pageBar" :total="total" :pageSize="20" :curPage="curPage" :onPageChange="emitValue1"></Pagination>
      </div>
    </div>
    <PayPassword :type="type" v-if="showPass" :emitValue="emitValue2" :isnew="$store.state.userInfo.is_new"></PayPassword>
    <GoogleVerify v-if="showGoogle" :emitValue="emitValue3"></GoogleVerify>
  </div>
</template>

<script>
import Pagination from '@/components/common/Pagination'
import PayPassword from '../components/safe/PayPassword'
import GoogleVerify from '../components/safe/GoogleVerify'
  export default {
    data() {
      return {
        seted: !this.$store.state.userInfo.is_new,
        total: 100,
        pageSize: 20,
        curPage: 1,
        deviceList:[],
        total:0,
        loginRecord:[],
        emitValue1: 'changePage',
        emitValue2: 'hidePass',
        emitValue3: 'hideGoogle',
        showPass: false,
        showGoogle: false,
        type: this.$store.state.userInfo.phone ? 1 : 0
      }
    },
    components: {
      Pagination,
      PayPassword,
      GoogleVerify
    },
    created() {
      this.getOnlineClients()
      this.fetchRecords(0);
    },
    mounted() {
      this.Bus.$on(this.emitValue1, (num)=>{
        this.fetchRecords(num - 1)
      })
      this.Bus.$on(this.emitValue2, ()=>{
        this.showPass = false;
      })
      this.Bus.$on(this.emitValue3, (data)=>{
       this.showGoogle = false;
       if(data) {
        this.showPass = true;
       }
      })
    },
    destroyed(){
      this.Bus.$off(this.emitValue1)
      this.Bus.$off(this.emitValue2)
      this.Bus.$off(this.emitValue3)
    },
    methods: {
      kickOff(){
        this.WsProxy.send('control', 'kick_off_client', {
          imei: this.$store.state.token
        }).then(data=>{
          this.getOnlineClients()
        })
      },
      getOnlineClients() {
        this.WsProxy.send('control', 'get_online_clients').then(data=>{
          if(!data.clients) return;
          this.deviceList = data.clients;
        })
      },
      fetchRecords(page){
        this.WsProxy.send('control', 'get_login_record',{
          page: page,
          count: 20
        }).then(data => {
          if(!data) return;
          this.total = data.count;
          this.loginRecord = data.records;
          this.curPage = page + 1;
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "../../../stylus/base"
.safe
  box-sizing()
  width 1000px
  padding 0 30px 0
  margin-bottom 42px
  background #FFF
  table
    text-align left
    font-size $fz13
    th
      height 23px
      line-height 23px
      color $col999
      font-weight normal
      letter-spacing 0.27px
    td
      height 33px
      line-height 33px
  .pay
    height 100px
    .icon
      float left
      margin 35px 24px 0 4px
      img
        width 32px
        height 32px
    .content
      float left
      width 850px
      height 100%
  .pay-password
    border-bottom 1px solid $col1E1
    .content
      .title
        float left
        width 486px
        height 100%
        h4
          margin 25px 0 6px 0
          font-size $fz16
          letter-spacing 0.33px
        span
          font-size 13px
          color $col999
          letter-spacing 0.27px
      .set
        float left
        height 100px
        line-height 100px
        button
          width 74px
          height 25px
          font-size $fz13
          color #FFF
          background $col422
          border-radius 2px
          cursor pointer
          &:hover
            background $col350
        span
          font-size $fz13
          color $col422;
          letter-spacing 0.27px
          cursor pointer
          &:hover
            color $col350
  .pay-verify
    position relative
    &::after
      position absolute
      left -30px
      bottom 0
      width 1000px
      height 1px
      content ''
      background $col1E1
    .content
      line-height 100px
      .title
        float left
        width 232px
        height 100%
        h4
          font-size $fz16
          letter-spacing 0.33px
      .type
        float left
        p
          float left
          margin-right 127px
          letter-spacing 0.33px
          &.google
            position relative
            font-size $fz16
            color $col100
            &::after
              position absolute
              right -30px
              bottom 50%
              content ''
              width 27px
              height 22px
              margin-bottom -11px
              background url('/static/images/personal/recommend.png') no-repeat center center
              background-size 27px 22px
            span
              cursor pointer
          img
            position relative
            top 3px
            margin-right 19px
  .device
    position relative
    padding-top 24px
    &::after
      position absolute
      left -30px
      bottom 0
      width 1000px
      height 1px
      content ''
      background $col1E1
    .title
      width 874px
      line-height 25px
      letter-spacing 0.29px
      h4
        float left
      button
        float right
        width 119px
        height 25px
        font-size $fz13
        color $col422
        letter-spacing 0.27px
        background #FFF
        border 1px solid $col422
        border-radius 2px
        cursor pointer
        &:hover
          color $col350
          border 1px solid $col350
    .content
      padding 20px 0 20px 62px
  .log
    h4
      height 74px
      line-height 74px
      letter-spacing 0.29px
    .content
      width 835px
      padding 0 0 30px 50px
</style>
