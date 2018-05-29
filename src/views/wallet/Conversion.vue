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
              <div class="input-group" v-clickoutside="()=>isShowCoinUl=false">
                <input class="input" type="text" v-model="srchCoin">
                <img class="clear" src="/static/images/cancel_icon.png">
                <a class="drop-trangle" href="javascript:void(0);"></a>
                <ul class="drop" v-show="0">
                  <li v-for="(e,i) in [1,3,4]" @click="coinSel=i">{{e}}</li>
                </ul>
              </div>
              <div class="tip">币币交易需要资产互转</div>
            </div>
            <div class="card">
              <div class="warn">
                <label><img src="/static/images/hint.png">温馨提示：</label>
                <p>请务必确认电脑及浏览器安全，防止信息被篡改或者泄漏。</p>
              </div>
              <div class="para">
                <label>从：</label>
                <p>法币账户余额为：0.00001235 ETH</p>
                <div class="input-group">
                  <p class="input"></p>
                  <a href="#" class="drop-trangle"></a>
                  <ul class="drop" v-show="0">
                    <li>法币账户</li>
                    <li>币币账户</li>
                  </ul>
                </div>
              </div>
              <div class="para">
                <label>转至：</label>
                <p>币币账户余额为：0.00001235 ETH</p>
                <div class="input-group">
                  <p class="input"></p>
                  <a href="#" class="drop-trangle"></a>
                  <ul class="drop" v-show="0">
                    <li>币币账户</li>
                    <li>法币账户</li>
                  </ul>
                </div>
              </div>
              <div class="para">
                <label>数量：</label>
                <p>可划转数量：0.001235 ETH</p>
                <div class="input-group">
                  <input type="text" class="input">
                  <img class="clear" src="/static/images/cancel_icon.png">
                  <a href="#" class="addin btn green">全部</a>
                </div>
              </div>
              <div class="submit">
                <button class="btn green disabled">确认提交</button>
              </div>
            </div>
          </div>
          <!--账户互转明细-->
          <div class="list">
            <div class="title">
              <h3>账户互转明细</h3>
              <a href="#" class="btn white a1">去交易</a>
              <a href="#" class="a2">查看全部</a>
            </div>
            <div class="thead">
              <p class="th time">时间</p>
              <p class="th type">类型</p>
              <p class="th coin">币种</p>
              <p class="th num">数量</p>
              <p class="th recvAddr">对方账户</p>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type out">转账转出</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num out">-12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
            </div>
            <div class="li">
              <div class="time">
                <p>2016/03/09</p>
                <p>13:43</p>
              </div>
              <div class="type in">转账转入</div>
              <div class="coin">
                <p>BTC</p>
                <p>Bitcoin</p>
              </div>
              <div class="num in">+12.23453234</div>
              <div class="recvAddr">币币账户</div>
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
  @import "../common/stylus/common"
  @import "./stylus/common"
  @import "./stylus/conversion"
</style>
