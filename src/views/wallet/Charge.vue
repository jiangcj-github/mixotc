<template>
  <div class="charge">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="2"></LeftBar>
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
            </div>
            <div class="p2">
              <span>总额：0.67899765 BTC</span>
              <span>可用余额：0.67899765 BTC</span>
              <span>认中：0.67899765 BTC</span>
            </div>
            <div class="card">
              <p class="warning">
                <img src="/static/images/hint.png">注意：禁止向BTC地址充值除BTC之外的资产，任何充入BTC地址的非BTC资产将不可找回。
              </p>
              <p class="addr">
                <label>BTC充值地址：</label>
                <span>0x046e59335aaffd964cfbb05c6c15a1238d7e3543</span>
              </p>
              <p class="link">
                <a href="javascript:void(0);" @click="isShowQrCode=true">展示二维码</a>
                <a href="javascript:void(0);">复制到剪贴板</a>
              </p>
            </div>
            <div class="tip">
              <h5>温馨提示</h5>
              <ul>
                <li>使用BTC地址充值需要12个网络确认才能到账</li>
                <li>充值完成后，你可以进入<a href="#">资产记录</a>页面跟踪进度</li>
              </ul>
            </div>
          </div>
          <!--充值动态-->
          <div class="list">
            <div class="title">
              <h3>充值动态</h3>
              <a href="#" class="btn white a1">去交易</a>
              <a href="#" class="a2">查看全部</a>
            </div>
            <div class="thead">
              <p class="time">时间</p>
              <p class="coin">币种</p>
              <p class="chargeNum">充值数量</p>
              <p class="sendAddr">发送地址</p>
              <p class="recvAddr">接收地址</p>
              <p class="confirm">确认数</p>
            </div>
            <div class="li">
            <div class="time">
              <p>2016/03/09</p>
              <p>13:43</p>
            </div>
            <div class="coin">
              <p>BTC</p>
              <p>Bitcoin</p>
            </div>
            <div class="chargeNum">+ 13.0949</div>
            <div class="sendAddr">13693691162</div>
            <div class="recvAddr">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
            <div class="confirm"><i>1</i>/5</div>
          </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="chargeNum">+ 13.0949</div>
              <div class="sendAddr">13693691162</div>
              <div class="recvAddr">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
              <div class="confirm"><i>1</i>/5</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="chargeNum">+ 13.0949</div>
              <div class="sendAddr">13693691162</div>
              <div class="recvAddr">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
              <div class="confirm"><i>1</i>/5</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="chargeNum">+ 13.0949</div>
              <div class="sendAddr">13693691162</div>
              <div class="recvAddr">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
              <div class="confirm"><i>1</i>/5</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="chargeNum">+ 13.0949</div>
              <div class="sendAddr">13693691162</div>
              <div class="recvAddr">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
              <div class="confirm"><i>1</i>/5</div>
            </div>
          </div>
        </div>
        <!--二维码弹框-->
        <BasePopup :show="isShowQrCode">
          <div class="qr-pop">
            <div class="close"><i @click="isShowQrCode=false">&times;</i></div>
            <h3>充值地址</h3>
            <img src="/static/images/down_load.png">
            <p>0x046e59335aaffd964cfbb05c6c15a1238d7e3543</p>
          </div>
        </BasePopup>
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
  @import "./stylus/charge"
</style>
