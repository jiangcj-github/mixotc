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
              <div class="select-tip">币币交易需要资产互转</div>
              <div class="input-group" v-clickoutside="()=>isShowCoinUl=false">
                <input class="input" type="text" v-model="srchCoin">
                <img class="clear" src="/static/images/cancel_icon.png">
                <a class="drop-trangle" href="javascript:void(0);"></a>
                <ul class="drop" v-show="0">
                  <li v-for="(e,i) in [1,3,4]" @click="coinSel=i">{{e}}</li>
                </ul>
              </div>
            </div>
            <div class="card">
              <div class="warn">
                <label><img src="/static/images/hint.png">注意：</label>
                <p>最小提现数量为:0.002 BTC</p>
              </div>
              <div class="input1">
                <label>从：</label>
                <p>法币账户余额为：0.00001235 ETH</p>
                <div class="select">
                  <p></p>
                  <ul class="drop" v-show="0">
                    <li>法币账户</li>
                    <li>币币账户</li>
                  </ul>
                </div>
              </div>
              <div class="input">
                <label>转至：</label>
                <p>币币账户余额为：0.00001235 ETH</p>
                <div class="select">
                  <p></p>
                  <ul class="drop" v-show="0">
                    <li>币币账户</li>
                    <li>法币账户</li>
                  </ul>
                </div>
              </div>
              <div class="input">
                <label>数量：</label>
                <p>可划转数量：0.001235 ETH</p>
                <div class="inrlb">
                  <input type="text"><img src="/static/images/cancel_icon.png"><i>BTC</i>
                </div>
                <p class="i2p3">实际到账：0.00000000ETH</p>

              </div>
              <div class="input3">
                <button class="btn green disabled">确认提交</button>
              </div>
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
        srchCoin: "",
        tips:["BTC","LTC","ETH","NEO"],
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
