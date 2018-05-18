<template>
  <div class="withdraw">
    <Notify></Notify>
    <div class="inner">
      <div class="main">
        <!-- 左边栏菜单 -->
        <LeftBar :leftBar="3"></LeftBar>
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
              <div class="warn">
                <label><img src="/static/images/hint.png">注意：</label>
                <p>最小提现数量为:0.002 BTC</p>
                <p>请勿直接提现至众筹或ICO地址.我们不会处理未来代币的发放</p>
              </div>
              <div class="input1">
                <label>BTC提现地址：</label>
                <input type="input" placeholder="可自行填写"><img src="/static/images/cancel_icon.png"><i></i>
                <a href="#">保存地址</a>
                <ul class="drop" v-show="0">
                  <li>morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</li>
                  <li>morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</li>
                  <li>morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</li>
                </ul>
              </div>
              <div class="input2">
                <label>提币数量：</label>
                <p class="i2p1"><span class="s1">可用余额：0.00000000</span><span class="s2">24H提现额度：50ETH</span></p>
                <p class="i2p2 active">
                  <input type="text"><img src="/static/images/cancel_icon.png"><i>BTC</i>
                </p>
                <p class="i2p3">实际到账：0.00000000ETH</p>
                <p class="i2p4">矿工费0.1</p>
              </div>
              <div class="input3">
                <button class="btn green disabled">确认提交</button>
              </div>
            </div>
          </div>
          <!--充值动态-->
          <div class="list">
            <div class="title">
              <h3>提币动态</h3>
              <a href="#" class="btn white a1">去交易</a>
              <a href="#" class="a2">查看全部</a>
            </div>
            <div class="thead">
              <p class="time">提币时间</p>
              <p class="coin">币种</p>
              <p class="num">提币数量</p>
              <p class="actual">实际到账</p>
              <p class="addrName">地址名称</p>
              <p class="addr">提币地址</p>
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
              <div class="num">- 13.0949</div>
              <div class="actual">0.00200</div>
              <div class="addrName ecli">13693691162987654356</div>
              <div class="addr ecli">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
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
              <div class="num">- 13.0949</div>
              <div class="actual">0.00200</div>
              <div class="addrName ecli">13693691162987654356</div>
              <div class="addr ecli">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
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
              <div class="num">- 13.0949</div>
              <div class="actual">0.00200</div>
              <div class="addrName ecli">13693691162987654356</div>
              <div class="addr ecli">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
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
              <div class="num">- 13.0949</div>
              <div class="actual">0.00200</div>
              <div class="addrName ecli">13693691162987654356</div>
              <div class="addr ecli">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
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
              <div class="num">- 13.0949</div>
              <div class="actual">0.00200</div>
              <div class="addrName ecli">13693691162987654356</div>
              <div class="addr ecli">morXXEXFS3ZjP6qk8VD3bnJJm2go4HsFvS</div>
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
  @import "./stylus/withdraw"
</style>
