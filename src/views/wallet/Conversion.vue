<template>
  <div class="conversion">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="4"></LeftBar>
        <!--右边内容-->
        <div class="right">
          <!--账号信息-->
          <div class="form">
            <div class="p1">
              <label>币种：</label>
              <div class="select" tabindex="0">
                <p @click="isShowCoinUl=!isShowCoinUl" v-clickoutside="()=>isShowCoinUl=false">{{coins[coinSel]}}</p>
                <ul class="drop" v-show="isShowCoinUl">
                  <li v-for="(e,i) in coins" @click="coinSel=i">{{e}}</li>
                </ul>
              </div>
              <p>币币交易需要资产互转</p>
            </div>
            <div class="card">
              <div class="input">
                <label>从：</label>
                <p>法币账户余额为：0.00001235 ETH</p>
                <div class="select" tabindex="1">
                  <p>法币账户</p>
                  <ul class="drop">
                    <li>法币账户</li>
                    <li>币币账户</li>
                  </ul>
                </div>
              </div>
              <div class="input">
                <label>转至：</label>
                <p>币币账户余额为：0 ETH</p>
                <div class="select" tabindex="2">
                  <p>币币账户</p>
                  <ul class="drop">
                      <li>法币账户</li>
                      <li>币币账户</li>
                    </ul>
                </div>
              </div>
              <div class="input">
                <label>数量：</label>
                <p>可划转数量：0.001235 ETH</p>
                <div class="select" tabindex="2">
                  <input type="text">
                  <img src="/static/images/cancel_icon.png">
                  <a href="#">全部</a>
                </div>
              </div>
              <button class="btn green">确认提交</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Notify from "./layout/Notify";
  import LeftBar from "./layout/LeftBar";
  import Pagination from "../verify/component/Pagination";
  import BasePopup from "../../components/common/BasePopup";
  export default {
    components: {
      BasePopup,
      Pagination,
      Notify,
      LeftBar,
    },
    data() {
      return {
        coins:["BTC","LTC","ETH","NEO"],
        coinSel: 0,
        isShowCoinUl: false,

        isShowQrCode: false,
      }
    },
    methods:{
      loadFb(){

      },
      parseFb(){

      },
      loadBb(){

      },
      parseBb(){

      },
    },
    mounted(){
      this.Bus.$on("onFbPageChange",(p)=>{
        this.fbCurPage=p;
      });
      this.Bus.$on("onBbPageChange",(p)=>{
        this.bbCurPage=p;
      });
    },
    destroyed(){
      this.Bus.$off("onFbPageChange");
      this.Bus.$off("onBbPageChange");
    },
  }
</script>
<style scoped lang="stylus">
  @import "../../stylus/base";
  @import "./stylus/common"
  @import "./stylus/conversion"
</style>
